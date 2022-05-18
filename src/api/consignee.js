import request from "@/utils/request";

const Consignee = {
  async list(userId){
    return request({
      url:'/api/consignee/info',
      method:'get',
      params:{
        userId: userId
      }
    })
  },
  async save(userId, consignee){
    return request({
      url:'/api/consignee/save',
      method:'post',
      params: {
        userId: userId
      },
      data: consignee,
    })
  },
  async delete(id){
    return request({
      url:'/api/consignee/delete',
      method:'post',
      data: id,
    })
  },
}

export default Consignee
