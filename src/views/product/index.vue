<template>
  <div class="app-container">
      <div v-if = "!dataLoading" class="product-container">
          <div class="product-image-box">
              <el-carousel :interval="4000" indicator-position="outside" ref="carousel">
                  <el-carousel-item v-for="(item, index) of productForm.imageUrls" :key="index">
                      <img id = "product-image" class="image" :src="item" @mouseenter="handleMouseEnter"
                                @mousemove="handleImageZoomIn"
                                @mouseleave="handleMouseLeave"/>
                  </el-carousel-item>
                  <div id="product-image-mask" class="mask"/>
              </el-carousel>
              <div class="thumbnail">
                  <img v-for="(item, index) of productForm.imageUrls" :key="index" :src="item"
                       @mouseenter="handleChangeThumbnail(index)"/>
              </div>
          </div>
          <div class="product-info">
              <img id="product-image-detail" class="product-image-detail" />
              <div class="title-container">
                  <span class="product-name">{{productForm.productName}}</span>
                  <el-tag class="tag" size="medium" type="success" effect="dark">跟团游</el-tag>
              </div>
              <ul class="subtitle">
                  <li>【轻奢游】35人头等舱，超大空间+USB充电+可调节皮座椅，可选2-8人小团</li>
                  <li>【更省心】小团上门接，不早起，覆盖主城90%区域，大团多区定点接</li>
                  <li>【超贴心】大团金牌导游讲解+小团本地老司机带队嗨玩+真纯玩无购物</li>
              </ul>
              <el-form label-position="left" label-width="75px" :model="productForm">
                  <el-form-item label="价格">
                      <div class="price">￥{{productForm.price}}</div>
                  </el-form-item>
                  <el-form-item class="destination" label="目的地">{{productForm.destination}}</el-form-item>
                  <el-form-item label="出发地">
                      <el-radio-group v-model="productForm.departure">
                          <el-radio v-for="(departure, index) in productForm.departures"
                                           :label="departure" :key="index"
                                    size="medium" border>{{departure}}</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="出游日期">
                      <el-date-picker
                          v-model="productForm.date"
                          type="date"
                          :clearable="false"
                          format="yyyy 年 M 月 d 日"
                          placeholder="选择日期">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="数量">
                      <el-input-number
                          v-model="productForm.num"
                          size="medium"
                          :min="1" :max="5"
                          step-strictly/>
                  </el-form-item>
                  <el-form-item>
                      <el-button  @click="handleCheckOut">{{$t('product.productInfo.buyNow')}}</el-button>
                      <el-button  type="primary" @click="handleAddToShoppingCart">{{$t('product.productInfo.addToCart')}}</el-button>
                  </el-form-item>
              </el-form>
          </div>
          <el-tabs class="tab" v-model="activeTabPaneName" @tab-click="handleChangeTab">
              <el-tab-pane class="product-detail" :label="tabPaneNames[0]" :name="tabPaneNames[0]">
                  <el-descriptions :column="3" size="mini" border>
                      <el-descriptions-item>
                          <template slot="label">
                              产品名称
                          </template>
                          {{productForm.productName}}
                      </el-descriptions-item>
                      <el-descriptions-item>
                          <template slot="label">
                              <i class="el-icon-location-outline"></i>
                              出发地
                          </template>
                          <el-tag v-for="departure in productForm.departures" :key="departure">{{departure}}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item>
                          <template slot="label">
                              <i class="el-icon-location-outline"></i>
                              目的地
                          </template>
                          <el-tag type="success">{{productForm.destination}}</el-tag>
                      </el-descriptions-item>
                  </el-descriptions>
                  <h4>景点图片</h4>
                  <img v-for="(imageUrl,index) in productForm.imageUrls" :key="index" :src="imageUrl"
                            style="object-fill:fill;width:600px;height:400px;display:block;margin:0 auto 0 auto"/>
              </el-tab-pane>
              <el-tab-pane class="product-comment" :label="tabPaneNames[1]" :name="tabPaneNames[1]">
                  <div v-if="$store.getters.userId" style="text-align: left;">
                      <el-input class="comment-form" v-model="commentForm.content" type="textarea"/>
                      <el-button type="primary" @click="handleSubmitComment">
                          {{$t('product.tabPane.comment.submitComment')}}
                      </el-button>
                      <span class="iconfont icon-emoji" @click = "emojiPickerVisible = !emojiPickerVisible"/>
                      <br/>
                      <VEmojiPicker class="emoji-picker" v-if="emojiPickerVisible" 
                        :i18n="$i18n.locale" @select="handleSelectEmoji"/>
                  </div>
                  <div v-else>请登录后发表评论</div>
                  <div v-if="comment.list.length > 0">
                      <el-divider/>
                      <div class="comment-card" v-for="(item, index) in comment.list" :key="index">
                          <span class="username">{{item.username}}</span>
                          <span class="create-time">{{item.createTime}}</span>
                          <div class="content">{{item.content}}</div>
                      </div>
                      <el-pagination
                          layout="total, prev, pager, next"
                          hide-on-single-page
                          :current-page.sync="page.current"
                          :page-size="page.pageSize"
                          :total="comment.total">
                      </el-pagination>
                  </div>

              </el-tab-pane>
          </el-tabs>
      </div>
      <div v-if="!recommendProductDataLoading" class="recommend-product-container">
          <h4 class="title">{{$t('product.sideBar.recommend')}}</h4>
          <el-carousel class="recommend-product" v-if="recommendProducts.length > 0" direction="vertical" :interval="4000">
              <el-carousel-item v-for="(product,index) in recommendProducts" :key="index">
                  <img class="image" :src="product.imageUrl" @click="handleJumpToProduct(product)"/>
                  <div class="price">￥{{product.price}}</div>
              </el-carousel-item>
          </el-carousel>
      </div>
      <el-dialog class="check-out-dialog"
                 :visible.sync ="checkOutDialogVisible"
                 @close="handleCheckOutDialogClose"
                 @closed="handleCheckOutDialogClosed">
          <el-steps :active="checkOutStep" finish-status="success" align-center>
              <el-step title="确认订单信息"></el-step>
              <el-step title="选择付款方式"></el-step>
              <el-step title="付款结果"></el-step>
          </el-steps>
          <div v-if="checkOutStep === 0">
              <div class="check-out-card" v-for="(item, index) in checkOutForm" :key="index">
                  <img class="image" :src="item.imageUrls[0]"/>
                  <div class="product-info">
                      <div class="product-name">{{item.productName}}</div>
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
                      {{paymentMethods[0]}}<span class="iconfont icon-wechat-pay"/>
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
                  <el-button type="primary" @click="handleSubmitOrder">
                      {{$t('cart.checkOutDialog.submitOrder')}}
                  </el-button>
              </div>
              <el-button v-if="checkOutStep === 1" type="primary" @click="handleFinishPay">完成付款</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import '../../assets/iconfont/iconfont.css';
import Product from "@/api/product";
import Comment from "@/api/comment";
import Cart from "@/api/cart";
import {Message} from "element-ui";
import Order from "@/api/order";
import { VEmojiPicker } from 'v-emoji-picker';

export default {
  components: {
    VEmojiPicker
  },
  data() {
    return {
      recommendProductDataLoading: true,
      recommendProducts: [],
      productForm: {},
      dataLoading: true,
      activeTabPaneIndex: 0,
      activeTabPaneName: '产品详情',
      commentForm: {
        score: 0,
        content: '',
      },
      emojiPickerVisible: false,
      page: {
        current: 1,
        pageSize: 10,
      },
      comment: {
        list:[],
        total: 0,
      },
      checkOutForm: [],
      checkOutDialogVisible: false,
      orderId: '',
      paymentMethods: ['微信支付', '支付宝'],
      paymentMethod: '微信支付',
      checkOutStep: 0,
    }
  },
  watch: {
    tabPaneNames() {
      this.activeTabPaneName = this.tabPaneNames[this.activeTabPaneIndex]
    }
  },
  computed:{
    totalAmount() {
      return this.productForm.price * this.productForm.num
    },
    tabPaneNames() {
      return [
        this.$t('product.tabPane.productDetail.name'),
        this.$t('product.tabPane.comment.name')
      ]
    }
  },
  async created() {
    await [this.fetchRecommendProductData(), this.fetchData()]
  },
  methods:{
    async fetchRecommendProductData() {
        this.recommendProductDataLoading = true
        this.recommendProducts = await Product.predict()
        this.recommendProductDataLoading = false
    },
    async fetchData() {
      this.dataLoading = true;
      const res = await Product.getDetail(this.$route.params.id)
      this.productForm = Object.assign(res,{
        departure: res.departures[0],
        num: 1,
        date: new Date(),
      })
      this.dataLoading = false;
    },
    handleMouseEnter(event) {
      this.handleImageZoomIn(event)
      document.getElementById("product-image-mask").style.display = "block"
      document.getElementById("product-image-detail").style.display = "block"
    },
    handleImageZoomIn(event) {
      let image = event.target
      let imageMask = document.getElementById("product-image-mask")
      let imageDetail = document.getElementById("product-image-detail")

      let imageMaskTop = event.offsetY - (imageMask.clientHeight >> 1)
      let imageMaskLeft = event.offsetX - (imageMask.clientWidth >> 1)
      const imageMaskTopMax = image.clientHeight  - imageMask.clientHeight
      const imageMaskLeftMax = image.clientWidth - imageMask.clientWidth
      imageMaskTop = (imageMaskTop < 0 ? 0 : ( imageMaskTop > imageMaskTopMax ? imageMaskTopMax : imageMaskTop ))
      imageMaskLeft = (imageMaskLeft < 0 ? 0 : ( imageMaskLeft > imageMaskLeftMax ? imageMaskLeftMax : imageMaskLeft ))
      imageMask.style.top =  imageMaskTop + 'px'
      imageMask.style.left = imageMaskLeft + 'px'

      imageDetail.src = image.src
      imageDetail.style.width =  image.clientWidth  * 100 / imageMask.clientWidth  + "%"
      imageDetail.style.height =  image.clientHeight * 100 / imageMask.clientHeight  + "%"
      const imageDetailTop = imageMaskTop * imageDetail.clientHeight / image.clientHeight
      const imageDetailLeft = imageMaskLeft * imageDetail.clientWidth / image.clientWidth
      imageDetail.style.top =  -imageDetailTop + "px"
      imageDetail.style.left = -imageDetailLeft + "px"

    },
    handleMouseLeave(event) {
      document.getElementById("product-image-mask").style.display = "none"
      document.getElementById("product-image-detail").style.display = "none"
    },
    handleChangeThumbnail(index) {
      this.$refs.carousel.setActiveItem(index)
    },
    async handleAddToShoppingCart() {
      if(this.$store.getters.userId){//用户信息获取到了
        const res = await Cart.add(this.productForm)
        if (res) {
          Message.success("添加到购物车成功")
        } else {
          Message.error("添加到购物车失败！")
        }
      } else {
        await this.$store.dispatch('navbar/showLoginDialog')
      }
    },
    async handleChangeTab() {
      this.tabPaneNames.forEach((tabPaneName, index) => {
        if (this.activeTabPaneName === tabPaneName) {
          this.activeTabPaneIndex = index
        }
      })
      if (this.activeTabPaneIndex === 1) {
        this.comment = await Comment.query(this.page, this.productForm.productId)
      }
    },
    handleSelectEmoji(emoji) {
      this.commentForm.content += emoji.data
    },
    async handleSubmitComment() {
      const res = await Comment.add({
        content: this.commentForm.content,
        userId: this.$store.getters.userId,
        productId: this.productForm.productId
      })
      if (res) {
        Message.success('评论发布成功！')
      } else {
        Message.error('评论发布失败')
      }
      this.commentForm.content = ''
      this.emojiPickerVisible = false
      await this.handleChangeTab()
    },
    async handleJumpToProduct(product) {
      const routeUrl = this.$router.resolve({
        path: `/product/${product.productId}`,
      });
      window.open(routeUrl.href, '_blank');
    },
    handleCheckOut() {
      if (this.$store.getters.userId) {
        //用户信息获取到了
        this.checkOutForm.push(this.productForm)
        this.checkOutDialogVisible = true
      } else {
        //用户信息未获取到
        this.$store.dispatch('navbar/showLoginDialog')
      }
    },
    handleCheckOutDialogClose() {
      this.checkOutDialogVisible = false
    },
    handleCheckOutDialogClosed() {
      this.checkOutForm = []
      this.checkOutStep = 0
      this.orderId = ''
    },
    async handleSubmitOrder() {
      this.orderId = await Order.add(this.checkOutForm)
      if (this.orderId) {
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
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin";

.app-container {
  width: 100%;
  display: inline-flex;
  flex-direction: row;

  .product-container {
    width: 70%;
    margin: 20px 20px 0 50px;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    min-width: 500px;
    @include first-color();
    @include first-background-color();

    .product-image-box {
      width: 40%;
      position: relative;
      min-width: 250px;
      display: inline-flex;
      flex-direction: column;

      .image {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .mask {
        position: absolute;
        width: 40%;
        height: 40%;
        cursor: pointer;
        z-index: 199;
        background-image: url(https://images-na.ssl-images-amazon.com/images/G/01/apparel/rcxgs/tile._CB483369110_.gif);
        display: none;
        pointer-events: none//元素永远不会成为鼠标事件的target
      }

      .thumbnail {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;

        img {
          width: 30%;
          height: 100px;
          border: 1px white solid;
          object-fit: cover;
        }

        img:hover {
          cursor: pointer;
        }
      }
    }

    .product-info {
      width: 55%;
      display: inline-flex;
      flex-direction: column;
      position: relative;
      margin-left: 30px;
      text-align: left;
      overflow: hidden;
      font-size: 14px;
      min-width: 150px;

      .product-image-detail {
        position: absolute;
        z-index: 199;
        display: none;
        overflow: hidden;
      }

      .title-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-items: self-start;

        .product-name {
          font-size: 24px;
          line-height: 32px;
        }
        .tag {
          margin-left: 5px;
        }
      }

      .subtitle {
        box-sizing: border-box;
        li {
          margin-bottom: 8px
        }
      }
      .destination {
        border-bottom: 1px #D5D9D9 solid;
      }

      .price {
        font-size: 32px;
        color: red;
        height: 40px;
      }

      .el-form-item {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      /deep/ .el-picker-panel .el-date-picker {
        @include second-color();
        @include second-background-color();
      }

      /deep/ .el-form-item__label {
        @include first-color();
      }

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

    .tab {
      width: 100%;
      margin-top: 10px;
      text-align: center;

      /deep/ .el-tabs__item {
        @include first-color();
      }

      .product-detail {
        margin: 0  20px 0 50px;

        /deep/ .el-descriptions-item__label {
          @include second-color();
          @include second-background-color();
          border: none;
        }

        /deep/ .el-descriptions-item__content {
          @include second-color();
          @include second-background-color();
          border: none;
        }
      }

      .product-comment {
        margin: 20px 20px 0 50px;

        .comment-form {
          width: 70%;
          margin:0 auto 30px 10px;
          display: block;
        }

        .emoji-picker {
          @include second-color();
          @include second-background-color();
          @include second-border-color();
        }

        .comment-card {
          display: block;
          text-align: left;

          .username {
            font-size: 14px;
            font-weight: bold;
          }

          .create-time {
            margin-left: 10px;
            font-size: 13px;
          }

          .content {
            margin-top: 5px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  .check-out-dialog {
    width: 100%;
    text-align: center !important;

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

      .payment-method {
        margin: 20px auto 20px auto;
      }

      .qr-code {
        width: 250px;
        object-fit: fill;
      }
    }

    .totalAmount {
      color: red;
    }
  }

  .recommend-product-container {
    margin-top: 100px;
    width: 25%;
    min-width: 150px;
    height: 100%;
    @include first-color();
    @include first-background-color();

    .title {
      font-size: 24px;
    }

    .recommend-product {
      width: 100%;

      .image {
        width: 100%;
        height: 250px;
        object-fit: cover;
      }

      .price {
        color: red;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
