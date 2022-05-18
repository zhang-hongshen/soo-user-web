import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
import i18n from './i18n/i18n'
import './permission'

Vue.config.productionTip = false
Vue.use(ElementUI, { zhCNLocale })
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


