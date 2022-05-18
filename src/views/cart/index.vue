<template>
    <div class="app-container" >
        <div class="app-container-body">
            <div class="chart-container">
                <el-checkbox-group v-model="cartItems" v-for="(cart, index) in cartData.list" :key="index">
                    <el-card class="chart-card">
                        <el-checkbox slot="header" :label="index" style="float:right"><br/></el-checkbox>
                        <div class="main">
                            <img class="image" :src="cart.imageUrl"/>
                            <div class="chart-info">
                                <div class="product-name">{{cart.productName}}</div>
                                <div class="info-row">
                                    <span class="departure">出发地：{{cart.departure}}</span>
                                    <span class="date">时间：{{cart.date}}</span>
                                </div>
                                <div class="info-row">
                                    <span class="price">￥{{cart.price}}</span>
                                    <span class="num">
                                    <span>数量：</span>
                                      <el-input-number
                                          v-model="cart.num"
                                          :min="1"
                                          :disabled="!editable"
                                          size="small"/>
                                </span>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </el-checkbox-group>
            </div>

            <el-pagination
                layout="prev, pager, next, total"
                :current-page.sync="page.current"
                :page-size = "page.pageSize"
                :total="cartData.total"
                hide-on-single-page
                background
                @current-change="fetchData"
            />

        </div>
        <div class="app-container-aside">

            <div class="check-out" >
                <el-button-group class="button-group">
                    <el-button class="edit-button" type="warning" v-if="!editable" @click="editable = !editable">
                        {{$t('common.edit')}}
                    </el-button>
                    <el-button class="save-button" type="primary" v-else @click="handleSave">
                        {{$t('common.save')}}
                    </el-button>
                    <el-button v-if="editable" type="danger" @click="handleDelete">
                        {{$t('common.delete')}}
                    </el-button>
                </el-button-group>
                <div v-if="!editable">
                    <div class="totalAmount">{{$t('common.totalAmount')}}：￥{{totalAmount}}</div>
                    <el-button type="danger" @click="handleCheckOut">{{$t('cart.checkOut')}}</el-button>
                </div>
            </div>

        </div>

        <el-dialog class="check-out-dialog"
                   :visible.sync ="checkOutDialogVisible"
                   @close="handleCheckOutDialogClose"
                   @closed="handleCheckOutDialogClosed">
            <el-steps :active="checkOutStep" finish-status="success" align-center>
                <el-step :title="$t('cart.checkOutDialog.confirmOrderInfo')"></el-step>
                <el-step :title="$t('cart.checkOutDialog.choosePaymentMethod')"></el-step>
                <el-step :title="$t('cart.checkOutDialog.paymentResult')"></el-step>
            </el-steps>
            <div v-if="checkOutStep === 0">
                <div class="check-out-card" v-for="(item, index) in checkOutForm" :key="index">
                    <img class="image" :src="item.imageUrl"/>
                    <div class="product-info">
                        <div class="product-name">{{item.productName}}</div>
                        <div class="info-row">
                            <span class="departure">出发地：{{item.departure}}</span>
                            <span class="date">时间：{{item.date}}</span>
                        </div>
                        <div class="info-row">
                            <span class="price">￥{{item.price}}</span>
                            <span class="num">x {{item.num}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="checkOutStep === 1">
                <el-radio-group class="payment-method" size="medium" v-model="paymentMethod">
                    <el-radio border :label="paymentMethods[0]">
                        {{paymentMethods[0]}}<span class="iconfont icon-weixinzhifu"/>
                    </el-radio>
                    <el-radio border :label="paymentMethods[1]">
                        {{paymentMethods[1]}}<span class="iconfont icon-alipay"/>
                    </el-radio>
                </el-radio-group>
                <div>
                    <img class="qr-code" v-show="paymentMethod === paymentMethods[0]" src="../../assets/wechatPayQrCode.jpg">
                    <img class="qr-code" v-show="paymentMethod === paymentMethods[1]" src="../../assets/aliPayQrCode.jpg">
                </div>
            </div>
            <div v-if="checkOutStep === 2">
                <el-result icon="success" title="支付成功">
                    <template slot="extra">
                        <el-button type="primary" @click="handleCheckOutDialogClose">
                            {{$t('common.finish')}}
                        </el-button>
                    </template>
                </el-result>
            </div>
            <div slot="footer">
                <div v-if="checkOutStep === 0">
                    <span class="totalAmount">{{$t('common.totalAmount')}}：￥{{totalAmount}}</span>
                    <el-button type="primary" @click="handleSubmitOrder">{{$t('cart.checkOutDialog.submitOrder')}}</el-button>
                </div>
                <el-button v-if="checkOutStep === 1" type="primary" @click="handleFinishPay">完成付款</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import '../../assets/iconfont/iconfont.css';
import Cart from "@/api/cart";
import {Message} from "element-ui";
import Order from "@/api/order";

export default {
  data(){
    return{
      //存放的是在chartData.list中的索引
      cartItems: [],
      cartData: {
        list: [],
        total: 0,
      },
      page: {
        current: 1,
        pageSize: 30,
      },
      departureOptions: [],
      checkOutForm: [],
      editable: false,
      checkOutDialogVisible: false,
      orderId: '',
      paymentMethods: ['微信支付', '支付宝'],
      paymentMethod: '微信支付',
      checkOutStep: 0,
    }
  },
  computed:{
    totalAmount(){
      let sum = 0;
      this.cartItems.forEach((item) =>{
        sum += this.cartData.list[item].price * this.cartData.list[item].num
      })
      return sum
    }
  },
  async created() {
    await this.fetchData()
  },
  methods:{
    async fetchData() {
      this.cartData = await Cart.listInfo(this.page)
    },
    async handleSave() {
      this.editable = false
      const res = await Cart.update(this.cartData.list)
      if (res) {
        Message.success('保存成功')
      } else {
        Message.error('保存失败！')
      }
    },
    async handleDelete() {
      const cartItems = this.cartItems
      if (cartItems.length > 0) {
        let productIds = []
        cartItems.forEach((item) => {
          productIds.push(this.cartData.list[item].productId)
        })
        const res = await Cart.delete(productIds)
        if (res) {
          Message.success('删除成功！')
          await this.fetchData()
        } else {
          Message.error('删除失败！')
        }
      } else {
        Message.warning('请至少选择一件商品')
      }
    },
    handleCheckOut() {
      if (this.cartItems.length > 0) {
        this.checkOutForm = []
        this.cartItems.forEach((item) => {
          this.checkOutForm.push(this.cartData.list[item])
        })
        this.checkOutDialogVisible = true
      } else {
        Message.warning('请至少选择一件商品')
      }
    },
    handleCheckOutDialogClose() {
      this.checkOutDialogVisible = false
    },
    handleCheckOutDialogClosed() {
      this.checkOutForm = []
      this.checkOutStep = 0;
      this.orderId = ''
    },
    async handleSubmitOrder() {
      this.orderId = await Order.add(this.checkOutForm)
      if (this.orderId) {
        //清空所有选中项
        this.cartItems = []
        this.checkOutStep++;
        //重新获取数据
        await this.fetchData()
      } else {
        this.$notify.error({
          title: '提示',
          message: '订单生成失败！',
        });
      }
    },
    async handleFinishPay() {
      const res = await Order.pay(this.orderId)
      if (res) {
        this.checkOutStep++;
      } else {
        this.$notify.success({
          title: '提示',
          message: '付款失败！',
        });
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin";

$footer-height: 50px;

.app-container{
  width: 100%;
  display: flex;
  flex-direction: row;

  .app-container-body {
    width: 70%;
    bottom: $footer-height;
    margin-bottom: $footer-height;
    display: block;
    text-align: left;

    .chart-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .chart-card {
        width: 900px;
        font-size: 16px;
        margin: 10px;
        @include first-color();
        @include first-background-color();

        .main {
          display: flex;
          flex-direction: row;
          justify-items: flex-start;
          justify-content: flex-start;

          .image {
            width: 250px;
            height: 150px;
            object-fit: cover;
          }

          .chart-info {
            margin-left: 30px;
            width: 600px;
            display: flex;
            flex-direction: column;
            justify-items: flex-start;
            justify-content: space-between;

            .product-name {
              font-size: 20px;
            }

            .info-row {
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-items: flex-start;
              justify-content: space-between;
            }

            .price {
              color: red;
            }

            .num {
              /deep/ .el-input-number__decrease {
                @include second-color();
                @include second-background-color();
                border: none;
              }

              /deep/ .el-input-number__increase {
                @include second-color();
                @include second-background-color();
                border: none;
              }

              /deep/ .el-input__inner {
                @include second-color();
                @include second-background-color();
                border: none;
              }
            }
          }
        }
      }
    }
  }
  .app-container-aside {
    width: 30%;
    position: relative;

    .check-out {
      position: fixed;
      top: 100px;
      text-align: right;
      right: 300px;
      height: $footer-height;
      line-height: $footer-height;
      z-index: 999;

      .totalAmount {
        color: red;
      }
    }
  }
  .check-out-dialog {
    width: 100%;

    .el-dialog__body {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-items: flex-start;
      overflow-y: auto;

      .check-out-card {
        width: 100%;
        font-size: 16px;
        border-radius: 12px;
        display: flex;
        flex-direction: row;
        justify-items: flex-start;
        justify-content: space-between;
        margin: 10px 10px 10px 0;

        .image {
          width: 35%;
          border-radius: 8px;
        }

        .product-info {
          width: 50%;
          height: 150px;
          display: flex;
          flex-direction: column;
          justify-items: flex-start;
          justify-content: space-between;

          .product-name {
            text-align: left;
            font-size: 24px;
          }

          .info-row {
            display: inline-flex;
            flex-direction: row;
            justify-items: flex-start;
            justify-content: space-between;
            font-size: 16px;

            .price {
              color: red
            }
          }
        }
      }
    }

    .totalAmount {
      color: red;
    }
  }
  .check-out-dialog {
    text-align: center !important;

    .el-dialog__body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      justify-items: center;
      align-items: center;

      .payment-method {
        margin: 20px auto 20px auto;
      }

      .qr-code {
        width: 250px;
        object-fit: fill;
      }
    }

  }
}
</style>
