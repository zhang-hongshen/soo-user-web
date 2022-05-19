<template>
    <div class="app-container">

        <el-skeleton v-if="$store.getters.userId" class="recommend-product-container" :loading="recommendProductDataLoading" animated>
            <template slot="template">
                <el-skeleton-item variant="image" class="image"/>
            </template>
            <template slot="default">
                <el-carousel  :interval="4000" type="card">
                    <el-carousel-item  v-for="(product,index) in recommendProducts" :key="index">
                        <img class="image" :src="product.imageUrl" @click="handleJumpToProduct(product)"/>
                    </el-carousel-item>
                </el-carousel>
            </template>
        </el-skeleton>

        <el-autocomplete class="search-bar" v-model="queryValue" hide-loading
                         :popper-append-to-body="false"
                         :placeholder="$t('home.searchBar.placeholder')"
                         :fetch-suggestions="handleQuerySearch"
                         @keyup.enter.native="fetchProductData">
            <el-select slot="prepend" style="width: 130px;" :popper-append-to-body="false"
                        v-model="queryField"  @change="handleQueryFieldChange">
                <el-option v-for="(item, index) in queryFields" :key="index" :value="item"/>
            </el-select>
            <span slot="append" class="el-icon-search" @click="fetchProductData"/>
        </el-autocomplete>

        <el-skeleton class="product-container" :loading="productDataLoading" animated>
            <template slot="template" >
                <el-skeleton-item style="width: 1500px; height: 300px;" variant="image"/>
            </template>
            <template slot="default">
                <span v-for="(productInfo, index) in productData.list" :key="index" class="product-card">
                    <div @click="handleJumpToProduct(productInfo)">
                        <div style="position: relative; width: 100%">
                           <img class="image" :src="productInfo.imageUrl"/>
                            <div style="position: absolute;
                            top:0;
                            left: 0;
                            background-color: #67c23a;
                            padding: 5px;
                            color: white">
                                {{productInfo.destination}}
                            </div>
                        </div>
                        <div class="product-name">{{productInfo.productName}}</div>
                    </div>
                    <div class="price">￥{{productInfo.price}}</div>
                </span>
            </template>
        </el-skeleton>

        <el-pagination
            layout="prev, pager, next, total"
            :current-page.sync="page.current"
            :page-size = "page.pageSize"
            :total="productData.total"
            hide-on-single-page
            background
            @current-change="fetchProductData"
        />
    </div>
</template>

<script>
import Product from "@/api/product";
import City from "@/api/city";

export default {

  data() {
    return {
      recommendProducts: [],
      recommendProductDataLoading: true,
      queryField: '',
      queryFieldIndex: 0,
      queryValue: '',
      page: {
        current: 1,
        pageSize: 30,
      },
      productData: {
        list: [],
        total: 0,
      },
      productDataLoading: true,
      // 远程搜索
      cities: [],
      cityOptions: [],
      optionLoading: false,
    }
  },
  watch: {
    queryFields(queryFields) {
      this.queryField = queryFields[this.queryFieldIndex]
    }
  },
  computed: {
    queryFields() {
      return [this.$t('home.searchBar.options.departure'),
        this.$t('home.searchBar.options.destination'),
        this.$t('home.searchBar.options.productName')]
    },
  },
  async created() {
    this.queryField = this.queryFields[0]
    await [this.fetchRecommendProductData(), this.fetchProductData()]
  },
  methods:{
    async fetchRecommendProductData() {
        this.recommendProductDataLoading = true
        this.recommendProducts = await Product.predict()
        this.recommendProductDataLoading = false
    },
    async fetchProductData() {
      this.productDataLoading = true
      let queryForm = {
        departure:'',
        destination:'',
        productName:'',
      }
      switch (this.queryFieldIndex) {
        case 0:
          queryForm.departure = this.queryValue
          break
        case 1:
          queryForm.destination = this.queryValue
          break
        case 2:
          queryForm.productName = this.queryValue
          break
      }
      this.productData = await Product.listInfo(Object.assign(this.page, queryForm))
      this.productDataLoading = false
    },
    async handleJumpToProduct(product) {
      const routeUrl = this.$router.resolve({
        path: `/product/${product.productId}`,
      });
      window.open(routeUrl.href, '_blank');
    },
    handleQueryFieldChange() {
      this.queryFields.forEach( (queryField, index) => {
        if (queryField === this.queryField) {
          this.queryFieldIndex = index
        }
      })
    },
    async handleQuerySearch(query, callback) {
      if (query !== '' && (this.queryFieldIndex === 0 || this.queryField === 1)) {
        this.optionLoading = true
        if (this.cities.length === 0) {
          this.cities = await City.list()
        }
        setTimeout(() => {
          const cityMap = []
          //检索
          this.cities.forEach((item) => {
            if (item.toLowerCase().indexOf(query.toLowerCase()) > -1){
              cityMap.push(item)
            }
          })
          cityMap.sort()//按拼音排序
          this.cityOptions = cityMap.map((item) => {//转换
            return { value: item, label: item }
          })
          callback(this.cityOptions)
          this.optionLoading = false
        }, 500)
      } else {
        this.cityOptions = []
        callback(this.cityOptions)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/home";
</style>
