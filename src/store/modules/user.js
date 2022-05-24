import Auth from "@/utils/auth";
import User from "@/api/user";

const getDefaultState = () =>{
  return{
    username: '',
    avatar: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) =>{
    Object.assign(state, getDefaultState())
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
}

const actions = {
  async login({commit}, loginParam) {
    const {username, password} = loginParam
    const token = await User.login({
      username: username.trim(),
      password: password
    })
    if (token) {
      Auth.setToken(token)
      return true
    }
    return false
  },

  async getUserInfo({ commit }) {
    const {username, avatar, userId} = await User.getInfo()
    commit('SET_USERNAME', username)
    commit('SET_AVATAR', avatar)
  },

  async register({ commit }, registerForm){
    const token = await User.register(registerForm)
    if (token) {
      Auth.setToken(token)
      return true;
    }
    return false;
  },

  async logout({ commit }){
    const res = await User.logout()
    if (res) {
      Auth.removeToken()
      commit('RESET_STATE')
    }
    return res
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
