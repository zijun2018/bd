/**
 *   @Project:   错误相关跳转的路由
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/11 15:29
 *   @Note:      暂时处理两种错误：
 *               1) 404页面
 *               2) 第三方文章审核未通过或者已删除
 */

const ERROR_404 = () => import(/* webpackChunkName: "error" */ '@/views/error/404');
const ERROR_ILLEGAL = () => import(/* webpackChunkName: "error" */ '@/views/error/Illegal');

export default [
  {
    path: '*',
    name: '404',
    component: ERROR_404,
    meta: {
      title: '404',
      keepAlive: false
    }
  },
  {
    path: '/error-illegal',
    name: 'error_illegal',
    component: ERROR_ILLEGAL,
    meta: {
      title: '',
      keepAlive: false
    }
  }
]
