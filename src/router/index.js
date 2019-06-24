/**
 *   @Project:   项目路由
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 14:19
 *   @Note:      已重构
 */
import Vue from 'vue'
import Router from 'vue-router'
import publicWeChat from './public'; // 微信公众号相关文章编辑页面
import error from './error'; // 错误相关的页面处理

Vue.use(Router);


// 首页 （主入口 + 布局页 + 首页 + 登录）
const Index = () =>
  import(/* webpackChunkName: "index" */ '@/views/Index');
const Layout = () =>
  import(/* webpackChunkName: "index" */ '@/views/layout/Layout');
const HOME = () =>
  import(/* webpackChunkName: "index" */ '@/views/home/Home');
const LOGIN = () =>
  import(/* webpackChunkName: "index" */ '@/views/auth/Login');

// 产品介绍
const PRODUCT = () =>
  import(/* webpackChunkName: "product" */ '@/views/product/Product');
const PRODUCT_INTRO = () =>
  import(/* webpackChunkName: "product" */ '@/views/product/ProductIntro');

// 资讯库
const NEWS = () =>
  import(/* webpackChunkName: "news" */ '@/views/news/Home');

// 我的
const MINE = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/Mine');
const CARD = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/Card');
const CARDEIT = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/CardEdit');
const USER_INFO = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/UserInfo');
const WE_CHAT_CODE = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/WechatCode');
const CODE = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/Code');
const FEEDBACK = () =>
  import(/* webpackChunkName: "mine" */ '@/views/mine/Feedback');

// 文章
const ARTICLE = () =>
  import(/* webpackChunkName: "article" */ '@/views/home/Article');

// 用户统计
const TRACKING = () =>
  import(/* webpackChunkName: "article" */ '@/views/tracking/Tracking');

// 文章投诉
const COMPLAINT_REASON_LIST = () =>
  import(/* webpackChunkName: "complaint" */ '@/views/complaint/Complaint-reason-list');
const COMPLAINT = () =>
  import(/* webpackChunkName: "complaint" */ '@/views/complaint/Complaint');
const MORE_DETAIL_LIST = () =>
  import(/* webpackChunkName: "complaint" */ '@/views/complaint/More-detail-list');

// 首页相关信息页
const CUSTOMER_INTENT = () =>
  import(/* webpackChunkName: "information" */ '@/views/home-menu/CustomerIntent');

// 测试页面
const Test = () =>
  import(/* webpackChunkName: "test" */ '@/views/test/zi-test');


const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/index',
    component: Index,
    children: [
      {
        path: '/layout',
        component: Layout,
        children: [
          {
            name: 'home',
            path: '/home',
            component: HOME,
            meta: {
              title: '首页',
              tab: 'home',
              keepAlive: true
            }
          },
          {
            path: '/product',
            component: PRODUCT,
            meta: {
              title: '产品介绍',
              tab: 'product',
              keepAlive: false
            }
          },
          {
            path: '/news',
            component: NEWS,
            meta: {
              title: '展业资讯库',
              tab: 'news',
              keepAlive: false
            }
          },
          {
            path: '/mine',
            component: MINE,
            meta: {
              title: '个人中心',
              tab: 'mine',
              keepAlive: false
            }
          },
          {
            name: 'userInfo',
            path: '/userInfo',
            component: USER_INFO,
            meta: {
              title: '个人中心',
              tab: 'mine',
              keepAlive: false
            }
          }
        ]
      },
      {
        path: '/login',
        component: LOGIN,
        meta: {
          title: '登录',
          keepAlive: false
        }
      },
      {
        path: '/article',
        name: 'article',
        component: ARTICLE,
        meta: {
          title: '文章详情',
          keepAlive: false
        }
      },
      {
        path: '/productIntro/:imgUrl',
        name: 'productIntro',
        component: PRODUCT_INTRO,
        meta: {
          title: '产品介绍',
          keepAlive: false
        }
      },
      {
        path: '/wechatCode',
        name: 'user_we_chat_ode',
        component: WE_CHAT_CODE,
        meta: {
          title: '微信二维码',
          keepAlive: false,
          refresh: true
        }
      },
      {
        path: '/code',
        name: 'user_code',
        component: CODE,
        meta: {
          title: '我的邀请码',
          keepAlive: false
        }
      },
      {
        path: '/card',
        name: 'user_card',
        component: CARD,
        meta: {
          title: '获客名片',
          keepAlive: false
        }
      },
      {
        path: '/card-edit',
        name: 'user_card_edit',
        component: CARDEIT,
        meta: {
          title: '获客名片',
          keepAlive: false
        }
      },
      {
        path: '/feedback',
        name: 'user_feedback',
        component: FEEDBACK,
        meta: {
          title: '意见反馈',
          keepAlive: false
        }
      },
      {
        path: '/tracking',
        component: TRACKING,
        name: 'tracking',
        meta: {
          title: '用户追踪',
          keepAlive: false
        }
      },
      {
        path: '/complaintReasonList',
        component: COMPLAINT_REASON_LIST,
        name: 'complaint_reason_list',
        meta: {
          title: '投诉',
          keepAlive: false
        }
      },
      {
        path: '/moreDetailList',
        component: MORE_DETAIL_LIST,
        name: 'more_detail_list',
        meta: {
          title: '投诉',
          keepAlive: false
        }
      },
      {
        path: '/complaint',
        component: COMPLAINT,
        name: 'complaint',
        meta: {
          title: '投诉',
          keepAlive: false
        }
      },
      {
        path: '/customerIntent',
        component: CUSTOMER_INTENT,
        name: 'customer_intent',
        meta: {
          title: '推荐文章追踪',
          keepAlive: false
        }
      },
      ...publicWeChat,
      {
        path: '/test',
        component: Test,
        meta: {
          title: '子俊测试',
          keepAlive: false
        }
      }
    ]},
  ...error
];


const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
});

router.beforeEach((to, from, next) => {
  Vue.prototype.shareList();
  if (to.meta.title) {
    window.document.title = to.meta.title
  }
  next();
});
export default router;
