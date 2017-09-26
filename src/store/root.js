const rootTypes = {
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
        commit(rootTypes.LOADING, isLoading);
    }
}

const mutations = {
    [rootTypes.LOADING](state, isLoading) {
        state.loading = isLoading;
    }
}

export {
    rootTypes,
	state,
	getters,
	actions,
	mutations
}