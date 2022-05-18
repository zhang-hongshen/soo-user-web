import enLocale from 'element-ui/lib/locale/lang/en'

const en = {
  common: {
    edit: 'Edit',
    save: 'Save',
    delete: 'Delete',
    totalAmount: 'Total Amount',
    finish: 'Finish',
  },
  navbar: {
    home: 'Home',
    theme: 'Theme',
    themes: {
      light: 'Light',
      dark: 'Dark',
    },
    cart: 'Cart',
    login: 'Log in',
    signUp: 'Sign up',
    order: 'My Order',
    userInfo: 'Information',
    logout: 'Log out',
    createAccount: 'Create account'
  },
  home: {
    searchBar: {
      placeholder: 'Please input the keyword',
      options: {
        departure: 'Departure',
        destination: 'Destination',
        productName: 'Name',
      }
    }
  },
  order: {
    tabPane: {
      all: 'All',
      toBePay: 'To Be Pay',
      paid: 'Paid',
      refunding: 'Refunding',
    }
  },
  userInfo: {
    tabPane: {
      basicInfo: {
        name: 'Basic Information',
        username: 'User Name',
        phone: 'Phone'
      },
      consigneeInfo: {
        name: 'Consignee Information',
        addConsigneeInfo: 'Add Consignee Information',
      },
      changePassword: {
        name: 'Change Password',
        nextStep: 'Next Step',
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
      }
    }
  },
  product: {
    productInfo: {
      buyNow: 'Buy Now',
      addToCart: 'Add to Cart',
    },
    tabPane: {
      productDetail: {
        name: 'Product Detail'
      },
      comment: {
        name: 'Comment',
        submitComment: 'Submit Comment'
      }
    },
    sideBar: {
      recommend: 'Recommend'
    }
  },
  cart: {
    checkOut: 'Check Out',
    checkOutDialog: {
      confirmOrderInfo: 'Confirm Order Information',
      choosePaymentMethod: 'Choose Payment Method',
      paymentResult: 'Payment Result',
      submitOrder: 'Submit Order'
    }
  },
  ...enLocale
}

export default en
