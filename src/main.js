import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';

import Bus from '@/utils/Bus'
import d3 from '@/utils/d3.min'
import $ from 'jquery'
Vue.prototype.$Bus = Bus

import echarts from "echarts";
Vue.prototype.$echarts = echarts

import ElementUI from 'element-ui';
Vue.use(ElementUI);

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
