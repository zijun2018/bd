
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */


import App from './App';
import Vue from 'vue';
import router from './router';
import store from './store'
import flexible from './assets/js/flexible'
import filter from './filter/index'
import MintUI from 'mint-ui'
import _ from 'lodash'
import GLComponets from '../src/components-global/components-global'
import VueLazyload from 'vue-lazyload'
import VueWechatTitle from 'vue-wechat-title'
import share from './assets/js/share'
import VueScroller from 'vue-scroller'

// 引入全局样式
import '@/styles/mintUI.scss'
import '@/styles/reset.scss'
import '@/styles/global.scss'
// 引入阿里图标库
import './assets/icons/iconfont.css';
import './assets/js/iconfont'
// 引入vConsole
// import VConsole from 'vconsole'
// 设置微信title
Vue.use(VueWechatTitle);
// new VConsole(); // 开启vConsole

window._ = _;
// 微信sdk对象
window.WechatPlugin = null;
Vue.use(share);
Vue.use(VueScroller);

flexible(window, document);
Vue.use(MintUI);
Vue.use(GLComponets); // 注册使用全局组件
Vue.use(VueLazyload, { // 注册使用图片懒加载，及配置
  preLoad: 1.3,
  error: '/static/images/logo.png',
  loading: '/static/images/logo.png',
  attempt: 1,
  listenEvents: [ 'scroll' ]
});


router.beforeEach((to, from, next) => {
  let title = to.meta.title;
  if (title) {
    document.title = title;
  }
  next()
});

window.vm = new Vue({
  el: '#app',
  router,
  filter,
  store,
  template: '<App/>',
  components: { App }
});
