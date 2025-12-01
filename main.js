import Vue from 'vue'
import App from './App.vue'
import i18n from '@/utils/i18n/index.js'

import uView from '@/uview-ui'
Vue.use(uView)

import request from '@/common/request/index.js'
Vue.prototype.$request = request
import sayHello from '@/utils/postins.js';
Vue.use(sayHello) // 使用全局模块

import utils from '@/common/utils/index.js'
Vue.prototype.$utils = utils

import store from '@/common/store/index.js'
Vue.prototype.$store = store


import statusBar from '@/components/statusBar/index.vue'
Vue.component('statusBar', statusBar)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()