const types = {
    LOADING: 'LOADING'
}

const state = {
    loading: false
}

const getters = {
    getLoading: state => state.loading
}

const actions = {
    toggleLoading({ commit }, isLoading) {
        commit(types.LOADING, isLoading);
    }
}

const mutations = {
    [types.LOADING](state, isLoading) {
        state.loading = isLoading;
    }
}

export {
    types,
    state,
    getters,
    actions,
    mutations,
};