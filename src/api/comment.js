import request from "@/utils/request";

const Comment = {
  async query(page, productId){
    const params = Object.assign(page, {
      productId:productId
    })
    return await request({
      url:"/api/comment/query",
      method:"get",
      params: params
    })
  },
  async add(params){
    return await request({
      url:"/api/comment/add",
      method:"post",
      data: params,
    })
  }
}

export default Comment