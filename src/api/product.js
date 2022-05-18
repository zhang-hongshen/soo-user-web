import store from "@/store";
import request from "@/utils/request";

const base = '/api/product'

const Product = {
  async predict(){
    return await request({
      url: base + `/predict`,
      method:'get',
    })
  },
  async listInfo(queryParams){
    return await request({
      url: base + '/info',
      method: 'get',
      params: queryParams
    })
  },
  async getDetail(productId){
    return await request({
      url: base + `/detail/${productId}`,
      method:'get',
    })
  }
}


export default Product
