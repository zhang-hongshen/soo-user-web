import axios from "axios";
import {Message} from "element-ui";
import Auth from "@/utils/auth";

const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
})


service.interceptors.request.use(
  request => {
    request.headers['Access-Control-Allow-Origin'] = '*'
    request.headers['Content-Type'] = 'application/json;charset=utf-8'
    const token = Auth.getToken()
    if (token) {
      request.headers['Authorization'] = token
    }
    return request
  },
  error => {
    Message.error('错误信息：'+ error)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      Message.error('错误码：' + response.status)
    } else {
      const res = response.data
      if (res.success === true) {
        const token = response.headers['Authorization']
        if (token) {
          Auth.setToken(token)
        }
        return res.data
      }
    }
  },
  error => {
    Message.error('错误信息：' + error)
  }
)

export default service
