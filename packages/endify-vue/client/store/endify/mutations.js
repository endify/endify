const mutations = {
  SET_ROUTE_LOADING_STATUS: (state, payload) => {
    state.routeLoadingStatus = payload
  },
  SET_ERROR: (state, payload) => {
    state.error = payload
  },
  REMOVE_ERROR: (state) => {
    state.error = null
  }
}

export default mutations
