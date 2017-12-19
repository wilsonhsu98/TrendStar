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
    SET_UNLIMITED_PA: 'RECORD/SET_UNLIMITED_PA',
    SET_SORTBY: 'RECORD/SET_SORTBY',
    SET_CHECKALL: 'RECORD/SET_CHECKALL',
    SET_COLS: 'RECORD/SET_COLS',
    DEL_PLAYER: 'RECORD/DEL_PLAYER',
    REFRESH_PLAYER: 'RECORD/REFRESH_PLAYER',
    SET_LASTUPDATE: 'RECORD/SET_LASTUPDATE',
    SET_GAME: 'RECORD/SET_GAME',
};

const state = {
    players: [],
    records: [],
    period: [{ period: 'All time', select: true }],
    top: 10,
    unlimitedPA: false,
    hiddenPlayer: [],
    sortBy: 'OPS',
    lastUpdate: '',
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
    game: '',
};

const getters = {
    period: state => state.period,
    periodSelect: state => {
        return state.period.find(item => item.select).period;
    },
    top: state => state.top,
    unlimitedPA: state => state.unlimitedPA,
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
        return utils.genStatistics(state.players, state.records, state.unlimitedPA ? undefined : state.top, state.period.find(item => item.select).games)
            .filter(item => item.PA !== '-' && (state.unlimitedPA || item.PA === state.top) && state.hiddenPlayer.indexOf(item.name) === -1)
            .sort((a, b) => b[state.sortBy] - a[state.sortBy]);
    },
    displayedCols: state => {
        return state.cols.filter(item => item.visible);
    },
    lastUpdate: state => state.lastUpdate,
    box: state => {
        return utils.displayGame(state.records.filter(item => item._table === state.game));
    },
    games: state => {
        return state.period.find(item => item.period === 'All time').games;
    },
};

const actions = {
    initFromLS({ commit }) {
        commit(types.INIT_FROM_LS);
    },
    fetchTable({ commit }) {
        const operateGames = (changedData) => {
            const dates = changedData.filter(item => item.data.timestamp).map(item => new Date(item.data.timestamp));
            if (dates.length) {
                const lastDate = new Date(Math.max.apply(null, dates));
                commit(types.SET_LASTUPDATE, lastDate);
                window.localStorage.setItem('lastUpdate', lastDate);
            }
            const records = changedData.map(item => {
                item.data.orders.forEach(sub => {
                    sub._table = item.id;
                });
                return item.data.orders;
            }).reduce((a, b) => a.concat(b), []);
            const period = changedData.map(item => Object.assign({}, item.data, { game: item.id }));
            commit(types.GET_PERIOD, period);
            commit(types.GET_RECORDS, records);
            window.localStorage.setItem('period', JSON.stringify(period));
            window.localStorage.setItem('records', JSON.stringify(records));
        };
        const operatePlayers = (players) => {
            commit(types.GET_PLAYERS, players);
            window.localStorage.setItem('players', JSON.stringify(players));
        };

        if (window.localStorage.getItem('players') && window.localStorage.getItem('period') && window.localStorage.getItem('records')) {
            commit(types.GET_PLAYERS, JSON.parse(window.localStorage.getItem('players')));
            commit(types.GET_PERIOD, JSON.parse(window.localStorage.getItem('period')));
            commit(types.GET_RECORDS, JSON.parse(window.localStorage.getItem('records')));
            if (window.localStorage.getItem('lastUpdate')) {
                commit(types.SET_LASTUPDATE, window.localStorage.getItem('lastUpdate'));
            }
        }
        commit(rootTypes.LOADING, true);
        let queryCount = 0;
        const realtimeCount = 2;
        db.collection('games')
            .onSnapshot(snapshot => {
                queryCount += 1;
                if (queryCount > realtimeCount) {
                    // realtime
                    commit(rootTypes.LOADING, { text: 'New data is coming' });
                    setTimeout(() => {
                        operateGames(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                        commit(rootTypes.LOADING, false);
                    }, 1000);
                } else {
                    // first time
                    operateGames(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                    if (queryCount === realtimeCount) {
                        commit(rootTypes.LOADING, false);
                    }
                }
            });
        db.collection('players')
            .onSnapshot(snapshot => {
                queryCount += 1;
                if (queryCount > realtimeCount) {
                    // realtime
                    commit(rootTypes.LOADING, { text: 'New data is coming' });
                    setTimeout(() => {
                        operatePlayers(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                        commit(rootTypes.LOADING, false);
                    }, 1000);
                } else {
                    // first time
                    operatePlayers(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
                    if (queryCount === realtimeCount) {
                        commit(rootTypes.LOADING, false);
                    }
                }

            });
    },
    setPeriod({ commit }, value) {
        commit(types.SET_PERIOD, value);
    },
    setTop({ commit }, value) {
        commit(types.SET_TOP, value);
    },
    setUnlimitedPA({ commit }, value) {
        commit(types.SET_UNLIMITED_PA, value);
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
    setGame({ commit }, gemeDate) {
        commit(types.SET_GAME, gemeDate);
    },
};

const mutations = {
    [types.INIT_FROM_LS](state) {
        state.top = parseInt(window.localStorage.getItem("pref_top"), 10) || state.top;
        state.unlimitedPA = window.localStorage.getItem("pref_unlimited_pa") || state.unlimitedPA;
        state.sortBy = window.localStorage.getItem("pref_sortby") || state.sortBy;

        const pref_period = window.localStorage.getItem("pref_period");
        if (pref_period) state.period = JSON.parse(pref_period);
        const pref_cols = window.localStorage.getItem("pref_cols");
        if (pref_cols) state.cols = JSON.parse(pref_cols);
        const pref_hiddenplayer = window.localStorage.getItem("pref_hiddenplayer");
        if (pref_hiddenplayer) state.hiddenPlayer = JSON.parse(pref_hiddenplayer);
    },
    [types.GET_PERIOD](state, data) {
        state.period.find(item => item.period === 'All time').games = data.map(item => item.game).sort((a, b) => {
            return parseInt(b.match(/\d/g).join(''), 10) - parseInt(a.match(/\d/g).join(''), 10)
        });

        state.period = state.period.filter((value, index, self) => self.map(item => item.period).indexOf(value.period) === index);

        data.map(item => item.year + item.season)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(item => ({period: item, games: data.filter(sub => (sub.year + sub.season) === item ).map(sub => sub.game)}))
            .sort((a, b)=> a.period < b.period)
            .forEach(item => {
                const find = state.period.find(sub => sub.period === item.period);
                if (!find) {
                    state.period.push(item);
                }
            });
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
    [types.SET_UNLIMITED_PA](state, value) {
        state.unlimitedPA = value;
        window.localStorage.setItem("pref_unlimited_pa", state.unlimitedPA);
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
    [types.SET_LASTUPDATE](state, date) {
        state.lastUpdate = date;
    },
    [types.SET_GAME](state, data) {
        state.game = data;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};