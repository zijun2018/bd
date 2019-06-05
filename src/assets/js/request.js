import axios from 'axios'
import qs from 'qs';
import { Toast, Indicator } from 'mint-ui';

axios.defaults.withCredentials = true;

// 创建axios实例
const service = axios.create({
  timeout: 120000 // 请求超时时间
});


// request拦截器
// 后续需要更改这部分代码
service.interceptors.request.use(
  config => {
    let userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {};
    // 请求头
    config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    // 取消options请求
    // config.headers['Content-Type'] = 'application/x-www-from-urlencoded';
    // config.headers['X-Requested-With'] = 'XMLHttpRequest';
    // 序列化
    config.method === 'post' && !config.withoutQs
      ? config.data = qs.stringify(config.data)
      : null;
    return config
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error)
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非1是抛错 可结合自己业务进行修改
     */
    if (response.status === 200) {
      const data = response.data;
      if (data && data.code === 0) {
        return data.data;
      } else {
        Toast(data.msg);
        return Promise.reject();
      }
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 没有身份权限
      if (location.pathname === '/home') {
        location.href = `${location.origin}/login?redirect=true&fromHomePage=true`;
      } else {
        location.href = `${location.origin}/login?redirect=true&pathName=${location.pathname}`;
      }
      Indicator.close();
      return Promise.reject();
    } else {
      console.log('err' + error); // for debug
      // Toast('连接失败')
      return Promise.reject(error)
    }
  }
);

export default service
