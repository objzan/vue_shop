import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// 导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入datejs
import datajs from 'dayjs'

// 导入VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'

// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem('token')
  NProgress.start()
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.prototype.$dateFormat = date => {
  return datajs(date).format('YYYY-MM-DD HH:mm:ss')
}

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
