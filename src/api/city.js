import request from "@/utils/request";

const City ={
  async list(page, params){
   return await request({
     url: '/api/city',
     method: 'get',
     params: page,
     data:params
   })
  }
}

export default City
