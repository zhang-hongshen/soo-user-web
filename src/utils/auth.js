import Cookies from "js-cookie";

const TOKEN_KEY = 'soo:user:token'
const Auth = {
  getToken(){
    return Cookies.get(TOKEN_KEY)
  },
  setToken(token){
    return Cookies.set(TOKEN_KEY, token)
  },
  removeToken(){
    return Cookies.remove(TOKEN_KEY)
  },
}

export default Auth
