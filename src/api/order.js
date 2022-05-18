import request from "@/utils/request";

const base = '/api/order'
const Order = {
  async list(state){
    return request({
      url: base + '/query',
      method: 'get',
      params: {
        state: state,
      }
    })
  },
  async add(orders){
    return request({
      url: base + `/add`,
      method:'put',
      data: orders
    })
  },
  async pay(orderId) {
    return request({
      url: base + `/pay/${orderId}`,
      method: 'post',
      data: orderId
    })
  },
  async refund(orderId) {
    return request({
      url: base + `/refund/${orderId}`,
      method: 'post',
      data: orderId,
    })
  },
  async delete(orderId) {
    return request({
      url: base + `/delete/${orderId}`,
      method: 'delete',
    })
  }
}
export default Order
