import axios from 'axios';
import {
    types as rootTypes,
    getters as rootGetters,
    state as rootState,
} from '../root';
import { GET_URL } from "../../constants/index";
import utils from "../../libs/utils";
import { db } from "../../firebase";

const types = {
    INIT_FROM_LS: 'RECORD/INIT_FROM_LS',
    GET_PERIOD: 'RECORD/GET_PERIOD',
    GET_PLAYERS: 'RECORD/GET_PLAYERS',
    GET_RECORDS: 'RECORD/GET_RECORDS',
    SET_PERIOD: 'RECORD/SET_PERIOD',
    SET_TOP: 'RECORD/SET_TOP',
    SET_SORTBY: 'RECORD/SET_SORTBY',
    SET_CHECKALL: 'RECORD/SET_CHECKALL',
    SET_COLS: 'RECORD/SET_COLS',
    DEL_PLAYER: 'RECORD/DEL_PLAYER',
    REFRESH_PLAYER: 'RECORD/REFRESH_PLAYER',
};

const state = {
    players: [],
    records: [],
    period: [{ period: 'All time', select: true }],

    top: 10,
    hiddenPlayer: [],
    sortBy: 'OPS',

    cols: [
        { name: 'Rank', visible: true },
        { name: 'name', visible: true },
        { name: 'PA', visible: true },
        { name: 'AB', visible: true },
        { name: 'H', visible: true },
        { name: 'TB', visible: true },
        { name: 'TOB', visible: true },
        { name: 'R', visible: true },
        { name: 'RBI', visible: true },
        { name: '1H', visible: true },
        { name: '2H', visible: true },
        { name: '3H', visible: true },
        { name: 'HR', visible: true },
        { name: 'K', visible: true },
        { name: 'DP', visible: true },
        { name: 'BB', visible: true },
        { name: 'SF', visible: true },
        { name: 'AVG', visible: true },
        { name: 'OBP', visible: true },
        { name: 'SLG', visible: true },
        { name: 'OPS', visible: true }
    ],
};

const getters = {
    period: state => state.period,
    periodSelect: state => {
        return state.period.find(item => item.select).period;
    },
    top: state => state.top,
    sortBy: state => state.sortBy,
    checkAll: state => {
        return state.cols.filter(item => item.name !== 'Rank' && item.name !== 'name' && item.visible).length ===
            state.cols.filter(item => item.name !== 'Rank' && item.name !== 'name').length;
    },
    conditionCols: state => {
        return state.cols
            .filter(item => item.name !== 'Rank' && item.name !== 'name')
            .map(item => ({
                name: item.name,
                visible: item.visible,
                disabled: item.name === state.sortBy
            }));
    },
    genStatistics: state => {
        return utils.genStatistics(state.players, state.records, state.top, state.period.find(item => item.select).games)
            .filter(item => item.PA !== '-' && item.PA >= state.top * 2 / 3 && state.hiddenPlayer.indexOf(item.name) === -1)
            .sort((a, b) => b[state.sortBy] - a[state.sortBy]);
    },
    displayedCols: state => {
        return state.cols.filter(item => item.visible);
    },
};

const actions = {
    initFromLS({ commit }) {
        commit(types.INIT_FROM_LS);
    },
    fetchTable({ commit }, tableName) {
        commit(rootTypes.LOADING, true);
        Promise.all([
                db.collection('players').get().then(snapshot => snapshot.docs.map(doc => doc.id)),
                db.collection('games').get().then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
            ])
            .then(res => {
                const records = res[1].map(item => {
                    item.data.orders.forEach(sub => {
                        sub._table = item.id;
                    });
                    return item.data.orders;
                }).reduce((a, b) => a.concat(b), []);
                commit(types.GET_PLAYERS, res[0]);
                commit(types.GET_PERIOD, res[1].map(item => Object.assign({}, item.data, { game: item.id })));
                commit(types.GET_RECORDS, records);
                commit(rootTypes.LOADING, false);
            })
            .catch(err => {
                alert(err);
                commit(rootTypes.LOADING, false);
            });

        db.collection('games')
            .onSnapshot(snapshot => {
                const changedData = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                const records = changedData.map(item => {
                    item.data.orders.forEach(sub => {
                        sub._table = item.id;
                    });
                    return item.data.orders;
                }).reduce((a, b) => a.concat(b), []);
                commit(types.GET_PERIOD, changedData.map(item => Object.assign({}, item.data, { game: item.id })));
                commit(types.GET_RECORDS, records);
            })
    },
    setPeriod({ commit }, value) {
        commit(types.SET_PERIOD, value);
    },
    setTop({ commit }, value) {
        commit(types.SET_TOP, value);
    },
    setSortBy({ commit }, value) {
        commit(types.SET_SORTBY, value);
        commit(types.SET_COLS, { col: value, visible: true });
    },
    setCheckAll({ commit }, isCheckAll) {
        commit(types.SET_CHECKALL, isCheckAll);
    },
    toggleColumn({ commit }, col) {
        commit(types.SET_COLS, { col });
    },
    deletePlayer({ commit }, player) {
        commit(types.DEL_PLAYER, player);
    },
    refreshPlayer({ commit }) {
        commit(types.REFRESH_PLAYER);
    },
};

const mutations = {
    [types.INIT_FROM_LS](state) {
        state.top = parseInt(window.localStorage.getItem("pref_top"), 10) || state.top;
        state.sortBy = window.localStorage.getItem("pref_sortby") || state.sortBy;

        const pref_period = window.localStorage.getItem("pref_period");
        if (pref_period) state.period = JSON.parse(pref_period);
        const pref_cols = window.localStorage.getItem("pref_cols");
        if (pref_cols) state.cols = JSON.parse(pref_cols);
        const pref_hiddenplayer = window.localStorage.getItem("pref_hiddenplayer");
        if (pref_hiddenplayer) state.hiddenPlayer = JSON.parse(pref_hiddenplayer);
    },
    [types.GET_PERIOD](state, data) {
        state.period.find(item => item.period === 'All time').games = data.map(item => item.game);
        state.period = state.period.concat(
            data.map(item => item.year + item.season)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(item => ({period: item, games: data.filter(sub => (sub.year + sub.season) === item ).map(sub => sub.game)}))
                .sort((a, b)=> a.period < b.period)
        );
    },
    [types.GET_PLAYERS](state, data) {
        state.players = data;
    },
    [types.GET_RECORDS](state, data) {
        state.records = data;
    },
    [types.SET_PERIOD](state, data) {
        state.period.forEach(item => {
            item.select = false;
            if (item.period === data) {
                item.select = true;
            }
        });
        const temp = JSON.stringify(state.period);
        state.period = JSON.parse(temp);
        window.localStorage.setItem("pref_period", temp);
    },
    [types.SET_TOP](state, value) {
        state.top = value;
        window.localStorage.setItem("pref_top", state.top);
    },
    [types.SET_SORTBY](state, value) {
        state.sortBy = value;
        window.localStorage.setItem("pref_sortby", state.sortBy);
    },
    [types.SET_CHECKALL](state, isCheckAll) {
        state.cols
            .filter(col => col.name !== 'Rank' && col.name !== 'name' && col.name !== state.sortBy)
            .forEach(col => {
                col.visible = isCheckAll;
            });
        window.localStorage.setItem("pref_cols", JSON.stringify(state.cols));
    },
    [types.SET_COLS](state, { col, visible }) {
        const item = state.cols.find(i => i.name === col);
        item.visible = visible || !item.visible;
        window.localStorage.setItem("pref_cols", JSON.stringify(state.cols));
    },
    [types.DEL_PLAYER](state, player) {
        state.hiddenPlayer.push(player);
        window.localStorage.setItem("pref_hiddenplayer", JSON.stringify(state.hiddenPlayer));
    },
    [types.REFRESH_PLAYER](state) {
        state.hiddenPlayer = [];
        window.localStorage.setItem("pref_hiddenplayer", JSON.stringify(state.hiddenPlayer));
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};