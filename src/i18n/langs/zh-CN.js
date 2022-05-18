import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'


const zhCN = {
  common: {
    edit: '编 辑',
    save: '保 存',
    delete: '删 除',
    totalAmount: '总 计',
    finish: '完 成',
  },
  navbar: {
    home: '首 页',
    theme: '主 题',
    themes: {
      light: '浅色主题',
      dark: '深色主题',
    },
    cart: '购物车',
    login: '登 录',
    signUp: '注 册',
    order: '我的订单',
    userInfo: '个人信息',
    logout: '退出登录',
    createAccount: '注 册'
  },
  home: {
    searchBar: {
      placeholder: '请输入关键字',
      options: {
        departure: '出发地',
        destination: '目的地',
        productName: '名称',
      }
    }
  },
  order: {
    tabPane: {
      all: '全部',
      toBePay: '待付款',
      paid: '已付款',
      refunding: '退款中',
    }
  },
  userInfo: {
    tabPane: {
      basicInfo: {
        name: '基本信息',
        username: '用户名',
        phone: '手机号'
      },
      consigneeInfo: {
        name: '收货信息',
        addConsigneeInfo: '添加收货信息'
      },
      changePassword: {
        name: '修改密码',
        nextStep: '下一步',
        oldPassword: '旧密码',
        newPassword: '新密码',
        confirmPassword: '确认密码',
      },
    }
  },
  product: {
    productInfo: {
      buyNow: '立即购买',
      addToCart: '加入购物车',
    },
    tabPane: {
      productDetail: {
        name: '产品详情'
      },
      comment: {
        name: '评论',
        submitComment: '发表评论'
      }
    },
    sideBar: {
      recommend: '为您推荐'
    }
  },
  cart: {
    checkOut: '结算',
    checkOutDialog: {
      confirmOrderInfo: '确定订单信息',
      choosePaymentMethod: '选择付款方式',
      paymentResult: '付款结果',
      submitOrder: '提交订单'
    }
  },
  ...zhCNLocale
}

export default zhCN
