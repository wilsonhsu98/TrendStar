import Vue from 'vue';
import Vuex from 'vuex';

// root
import { state, actions, mutations, getters } from './root';
// modules
import importGame from './modules/import';
import record from './modules/record';

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules: {
        'import': importGame,
        record
    },
    strict: true
});