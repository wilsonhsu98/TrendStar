import { rootTypes } from '../root';
import { GET_URL, TEDDY, POST_URL } from "../../constants/index";
import utils from "../../libs/utils";

const types = {
    GET_WILSON_SHEETS: 'IMPORT/GET_WILSON_SHEETS',
    GET_TEDDY_SHEETS: 'IMPORT/GET_TEDDY_SHEETS',
    GET_TEDDY_SUMMARY: 'IMPORT/GET_TEDDY_SUMMARY',
    SET_TODO: 'IMPORT/SET_TODO',
}

const state = {
    wilson_sheets: [],
    teddy_sheets: [],
    teddy_summary: [],
    todo: []
}

const getters = {
    getSourceList: state => {
        return state.teddy_sheets.map((item) => ({
            game: item,
            disabled: state.wilson_sheets.indexOf(item) > -1,
            checked: state.wilson_sheets.indexOf(item) > -1 || state.todo.indexOf(item) > -1
        }));
    }
}

const actions = {
    fetchTwoOrigin({ commit }) {
        commit(rootTypes.LOADING, true);
        Promise.all(
            [
                GET_URL({ action: 'sheets' }),
                GET_URL({ fileId: TEDDY, action: 'sheets' }),
                GET_URL({ fileId: TEDDY, sheetname: '比賽結果' })
            ].map(url => fetch(url).then(res => {
                if (res.status >= 400) throw new Error("Bad response from server");
                return res.json();
            }))
        ).then(arr => {
            commit(types.GET_WILSON_SHEETS, arr[0]);
            commit(types.GET_TEDDY_SHEETS, arr[1]);
            commit(types.GET_TEDDY_SUMMARY, arr[2]);
            commit(types.SET_TODO);
            commit(rootTypes.LOADING, false);
        }).catch(err => {
            alert(err);
            commit(rootTypes.LOADING, false);
        });
    },
    toggleTodo({ commit }, item) {
        commit(types.SET_TODO, item);
    },
    importData({ commit }) {
        commit(rootTypes.LOADING, true);
        Promise.all(
            state.todo.map(table => {
                return fetch(GET_URL({ action: '2DArray', fileId: TEDDY, sheetname: table }))
                    .then(res => {
                        if (res.status >= 400) throw new Error("Bad response from server");
                        return res.json();
                    })
                    .then(json => {
                        return { result: json, table: table };
                    });
            })
        ).then(arr => {
            return Promise.all(arr.map(obj => {
                const newData = utils.parseGame(obj.result);
                let params = new FormData();
                params.append("sheetname", obj.table);
                params.append("data", JSON.stringify(newData));
                return fetch(POST_URL, {
                        method: 'POST',
                        body: params
                    })
                    .then(res => {
                        if (res.status >= 400) throw new Error("Bad response from server");
                        return res.json();
                    })
                    .then(json => {
                        return { result: json, table: obj.table };
                    });
            }));
        }).then(res => {
            const gameData = res.map(game => {
                const findGame = state.teddy_summary.find(item => item['場次'] === game.table);
                return {
                    game: game.table,
                    result: ['win', 'lose', 'tie'][
                        ['勝', '敗', '和'].indexOf(findGame['結果'])
                    ],
                    year: findGame['年度'],
                    season: findGame['季度']
                }
            });
            let params = new FormData();
            params.append("sheetname", 'game');
            params.append("data", JSON.stringify(gameData));
            return fetch(POST_URL, {
                    method: 'POST',
                    body: params
                })
                .then(res => {
                    if (res.status >= 400) throw new Error("Bad response from server");
                    return res.json();
                });
        }).then(() => {
            this.dispatch('fetchTwoOrigin');
        }).catch(err => {
            alert(err);
            commit(rootTypes.LOADING, false);
        });
    }
}

const mutations = {
    [types.GET_WILSON_SHEETS](state, data) {
        state.wilson_sheets = data.filter(item => item.match(/\d{8}-\d{1}/g));
    },
    [types.GET_TEDDY_SHEETS](state, data) {
        state.teddy_sheets = data
            .filter(item => item.match(/\d{8}-\d{1}/g))
            .sort((a, b) => {
                return parseInt(b.match(/\d/g).join(''), 10) - parseInt(a.match(/\d/g).join(''), 10)
            });
    },
    [types.GET_TEDDY_SUMMARY](state, data) {
        state.teddy_summary = data;
    },
    [types.SET_TODO](state, item) {
        if (item) {
            if (state.todo.indexOf(item) === -1) {
                state.todo.push(item);
            } else {
                state.todo.splice(state.todo.indexOf(item), 1);
            }
        } else {
            state.todo = [];
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}