import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Home',
    path: '/',
    meta:{
      title: '首页',
      requireAuth: false,
    },
    component: () => import('../views/home/index'),
  },
  {
    name: 'Product',
    path: '/product/:id',
    meta:{
      title: '商品详情',
      requireAuth: false,
    },
    component: () => import('../views/product/index')
  },
  {
    name:  'Cart',
    path: '/cart',
    meta:{
      title: '我的购物车',
      requireAuth: true,
    },
    component: () => import('../views/cart/index')
  },
  {
    name:  'Order',
    path: '/order',
    meta:{
      title: '我的订单',
      requireAuth: true,
    },
    component: () => import('../views/order/index')
  },
  {
    name:  'UserInfo',
    path: '/userinfo',
    meta:{
      title: '个人信息',
      requireAuth: true,
    },
    component: () => import('../views/userinfo/index')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
