/**
 *   @Project:   微信公众号相关文章编辑页面
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 18:58
 *   @Note:
 */

const PUBLIC_HOME = () => import(/* webpackChunkName: "article" */ '@/views/public/Home');
const PUBLIC_ARTICLE = () => import(/* webpackChunkName: "article" */ '@/views/public/Article');
const PUBLIC_EDIT = () => import(/* webpackChunkName: "article" */ '@/views/public/Edit');

export default [
  {
    path: '/public/home',
    name: 'public_home',
    component: PUBLIC_HOME,
    meta: {
      title: '文章编辑助手',
      keepAlive: false
    }
  },
  {
    path: '/public/article',
    name: 'public_article',
    component: PUBLIC_ARTICLE,
    meta: {
      title: '文章详情',
      keepAlive: false
    }
  },
  {
    path: '/public/edit',
    name: 'public_edit',
    component: PUBLIC_EDIT,
    meta: {
      title: '文章编辑',
      keepAlive: false
    }
  }
]
