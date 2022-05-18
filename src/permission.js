import router from "@/router";
import store from './store'
import {Message} from "element-ui";
import Auth from "@/utils/auth";

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
  const token = Auth.getToken()
  //有Token
  if (token) {
    const userId = store.getters.userId
    if (userId) {//有用户ID，说明已经获取过信息
      next()
    } else {//去后台获取信息
      try {
        //获取用户信息
        await store.dispatch('user/getUserInfo')
        next()
      } catch (error) {
        Auth.removeToken()
        Message.error(error)
        await store.dispatch('navbar/showLoginDialog')
      }
    }
  } else {
    if (to.meta.requireAuth) {//如果没有token且该页面需要登录才能访问
      await store.dispatch('navbar/showLoginDialog')
    } else {
      next()
    }
  }
})
