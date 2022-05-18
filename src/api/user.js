import request from "@/utils/request";

const base = '/api/user'

const User = {
  async getLocation(){
    return request({
      url: base +'/location',
      method:'get',
    })
  },
  async login(params){
    return await request({
      url: base + '/login',
      method:'post',
      data: params
    })
  },
  async logout() {
    return await request({
      url: base + `/logout`,
      method: 'get',
    })
  },
  async getInfo(){
    return await request({
      url: base + '/info',
      method:'get',
    })
  },
  async getBasicInfo(){
    return await request({
      url: base + `/basicinfo`,
      method:'get',
    })
  },
  async updateBasicInfo(basicInfo){
    return await request({
      url: base + `/basicinfo/update`,
      method:'post',
      data: basicInfo
    })
  },
  async updatePassword(newPassword){
    return await request({
      url: base + `/password/update`,
      method: 'post',
      data: newPassword
    })
  },
  async register(params){
    return await request({
      url: base +'/register',
      method:'post',
      data: params
    })
  },
  async checkPhone(phone){
    return await request({
      url: base + '/phone/validate',
      method: 'post',
      data: phone
    })
  },
  async validatePassword(password){
    return await request({
      url: base + `/password/validate`,
      method:'get',
      data: password,
    })
  }
}
export default User
