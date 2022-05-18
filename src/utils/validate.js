import User from "@/api/user";
import store from "@/store/index";

const Validate = {
  username(rule, username, callback){
    if (username === '') {
      callback(new Error('用户名不能空'));
    } else if (username.length < 4) {
      callback(new Error('用户名至少为4个字符'));
    } else {
      callback();
    }
  },
  async phone(rule, phone, callback) {
    if (phone === '') {
      callback(new Error('手机号不能为空'))
    } else if (phone.length !== 11) {
      callback(new Error('请输入11位手机号'))
    } else {
      const res = await User.checkPhone(phone)
      if (res){
        callback(new Error('手机号已注册'))
      }else{
        callback()
      }
    }
  },
  async oldPassword(rule, oldPassword, callback) {
    if (oldPassword === '') {
      callback(new Error('请输入密码'));
    } else {
      const res = await User.validatePassword(store.getters.userId, oldPassword)
      if (res) {
        callback()
      } else {
        callback(new Error('密码错误'))
      }
    }
  },
  newPassword(rule, value, callback){
    if (value === '') {
      callback(new Error('请输入密码'));
    } else if(value.length < 4) {
      callback(new Error('密码必须大于6个字符'));
    } else {
      callback();
    }
  }
}

export default Validate
