const getDefaultState = () =>{
  return{
    loginDialogVisible: false,
    registerDialogVisible: false
  }
}

const state = getDefaultState()

const mutations = {
  SET_LOGINDIALOGVISIBLE: (state, loginDialogVisible) => {
    state.loginDialogVisible = loginDialogVisible
  },
  SET_REGISTERDIALOGVISIBLE: (state, registerDialogVisible) => {
    state.registerDialogVisible = registerDialogVisible
  },
}

const actions = {
  showLoginDialog({ commit }) {
    commit('SET_LOGINDIALOGVISIBLE', true)
  },
  hideLoginDialog({ commit }) {
    commit('SET_LOGINDIALOGVISIBLE', false)
  },
  showRegisterDialog({ commit }) {
    commit('SET_REGISTERDIALOGVISIBLE', true)
  },
  hideRegisterDialog({ commit }) {
    commit('SET_REGISTERDIALOGVISIBLE', false)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
