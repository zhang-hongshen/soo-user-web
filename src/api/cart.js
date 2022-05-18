import request from "@/utils/request";

const base = '/api/cart'
const Cart = {
  async listInfo(page){
    return request({
      url: base + '/query',
      method: 'get',
      params: page
    })
  },
  async add(form){
    return request({
      url: base + `/add`,
      method: 'post',
      data: form
    })
  },
  async delete(productIds){
    return request({
      url: base + `/delete`,
      method: 'delete',
      data: productIds
    })
  },
  async update(params){
    return request({
      url: base + `/update`,
      method: 'put',
      data: params
    })
  },
}

export default Cart
