import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./getters";
import user from './modules/user'
import navbar from "@/store/modules/navbar";
Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    user,
    navbar,
  },
  getters
})

export default store
