<template>
    <div class="main-container">
        <div class="order-container">
          
            <el-tabs class="tabs" v-model="activeTabPaneName" tab-position="left" @tab-click="handleChangeTab" >
                <el-tab-pane class="tab-pane" v-for="(tabPaneName, tabIndex) in tabPaneNames" :key="tabIndex"
                             :label="tabPaneName" :name="tabPaneName" >
                    <el-card class="order-card" v-for="(order, index) in orders" :key="index">
                        <div v-if="tabIndex === 0" class="state" slot="header">{{order.state}}</div>
                        <div v-for="(orderDetail,index) in order.orderDetails" :key="index">
                            <el-collapse class="details">
                                <el-collapse-item class="detail" :name="index">
                                    <h3 class="title" slot="title">
                                        <span class="product-name">{{orderDetail.productName}}</span>
                                        <span class="departure">出发地:{{orderDetail.departure}}</span>
                                    </h3>
                                    <h3 class="header">
                                        <span class="num">数量</span>
                                        <span class="price">单价</span>
                                    </h3>
                                    <div class="content">
                                        <span class="num">x {{orderDetail.num}}</span>
                                        <span class="price">￥{{orderDetail.price}}</span>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                        <div class="orderId">订单编号：{{order.orderId}}</div>
                        <div class="createTime">创建时间：{{order.createTime}}</div>
                        <div v-if="order.state === '已付款'" class="paymentTime">付款时间：{{order.paymentTime}}</div>
                        <h2 class="totalAmount">合计：￥{{order.totalAmount}}</h2>
                        <el-button v-if="order.state === '待付款'" type="primary" @click="handleStartPay(order.orderId)">去付款</el-button>
                        <el-popconfirm
                            v-if="order.state === '已付款'"
                            confirm-button-text='确认'
                            cancel-button-text='取消'
                            title="确认申请退款吗？"
                            @confirm="handleRefund(order.orderId)"
                        >
                            <el-button slot="reference">申请退款</el-button>
                        </el-popconfirm>
                        <el-popconfirm
                            confirm-button-text='确认'
                            cancel-button-text='取消'
                            title="确认删除此订单吗？"
                            @confirm="handleDeleteOrder(order.orderId)"
                        >
                          <el-button slot="reference">删除订单</el-button>
                        </el-popconfirm>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog custom-class="check-out-dialog"
                   :visible.sync ="checkOutDialogVisible"
                   @close="handleCheckOutDialogClose"
                   @closed="handleCheckOutDialogClosed">
            <el-steps :active="checkOutStep" finish-status="success" align-center>
                <el-step title="选择付款方式"></el-step>
                <el-step title="付款结果"></el-step>
            </el-steps>
            <div v-if="checkOutStep === 0">
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
            <div v-if="checkOutStep === 1">
                <el-result icon="success" title="支付成功">
                    <template slot="extra">
                        <el-button type="primary" @click="handleCheckOutDialogClose">完成</el-button>
                    </template>
                </el-result>
            </div>
            <div slot="footer">
                <el-button v-if="checkOutStep === 0" type="primary" @click="handleFinishPay">完成付款</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import '../../assets/iconfont/iconfont.css';
import Order from "@/api/order";
import {Message} from "element-ui";

export default {
  data() {
    return {
      activeTabPaneIndex: 0,
      activeTabPaneName: '全部',
      orders: [],
      checkOutDialogVisible: false,
      orderId: '',
      paymentMethods: ['微信支付', '支付宝'],
      paymentMethod: '微信支付',
      checkOutStep: 0,
    }
  },
  computed: {
    tabPaneNames() {
      return [
        this.$t('order.tabPane.all'),
        this.$t('order.tabPane.toBePay'),
        this.$t('order.tabPane.paid'),
        this.$t('order.tabPane.refunding')
      ]
    }
  },
  watch: {
    tabPaneNames() {
      this.activeTabPaneName = this.tabPaneNames[this.activeTabPaneIndex]
    }
  },
  async created() {
    this.activeTabPaneName = this.tabPaneNames[this.activeTabPaneIndex]
    await this.fetchData();
  },
  methods:{
    async fetchData() {
      this.orders = await Order.list(this.activeTabPaneIndex)
    },
    async handleChangeTab() {
      this.tabPaneNames.forEach((tabPaneName, index) => {
        if (this.activeTabPaneName === tabPaneName) {
          this.activeTabPaneIndex = index
        }
      })
      await this.fetchData()
    },
    handleStartPay(orderId) {
      this.orderId = orderId
      this.checkOutDialogVisible = true
    },
    async handleFinishPay() {
      const res = await Order.pay(this.orderId)
      if (res) {
        this.checkOutStep++;
      } else {
        Message.error('付款失败！')
      }
    },
    handleCheckOutDialogClose() {
      this.checkOutDialogVisible = false
    },
    handleCheckOutDialogClosed() {
      this.checkOutStep = 0;
      this.orderId = ''
    },
    async handleRefund(orderId) {
      const res = await Order.refund(orderId)
      if (res) {
        Message.success('申请退款中！')
      } else {
        Message.error('申请退款失败！')
      }
    },
    async handleDeleteOrder(orderId) {
      const res = await Order.delete(orderId)
      if (res) {
        Message.success('删除订单成功！')
      } else {
        Message.error('删除订单失败！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin";

.main-container {

  .order-container {
    text-align: left;
    display: block;
    margin: 20px 0 auto 50px;

    .tabs {

      /deep/ .el-tabs__item {
        @include first-color();
      }

      /deep/ .el-tabs__item:hover {
        color: #1a73e8 !important;
      }

      .tab-pane {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0 auto 0 auto;
        @include first-color();

        /deep/ .el-collapse-item__header {
          border: none;
          @include second-color();
          @include second-background-color();
        }

        .order-card {
          width: 40%;
          display: flex;
          flex-direction: column;
          text-align: right;
          margin: 20px;
          @include second-color();
          @include second-background-color();

          .details {
            border: none;

            .detail {
              width: 100%;
              text-align: right;
              display: flex;
              
              flex-direction: column;
              justify-items: flex-start;

              .title {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-items: flex-start;
                justify-content: space-between;
                @include second-color();
                @include second-background-color();
              }

              /deep/ .el-collapse-item__wrap {
                border: none;
                @include second-color();
                @include second-background-color();
              }

              /deep/ .header {
                display: flex;
                flex-direction: row;
                justify-items: flex-start;
                justify-content: space-between;
                @include second-color();
                @include second-background-color();
              }

              /deep/ .content {
                display: flex;
                flex-direction: row;
                justify-items: flex-start;
                justify-content: space-between;
                @include second-color();
                @include second-background-color();
              }
            }
          }

          .totalAmount {
            color: red;
          }

          .el-button {
            @include second-color();
            @include second-background-color();
          }
        }
      }
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
      text-align: center !important;

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
