import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

// 初始化云
wx.cloud.init({
  env: 'test-pmxem',
  traceUser: true
})
