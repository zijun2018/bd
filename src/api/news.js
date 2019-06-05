/**
 *   @Project:   资讯&广告接口
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/30 10:47
 *   @Note:      接口地址: http://119.23.211.23:8083/project/74/interface/api/cat_297
 */

import request from '../assets/js/request'

const baseUrl = process.env.BASE_URL;

/**
 * 广告列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1649
 */
export function getBanners (params = {}) {
  return request({
    url: baseUrl + '/api/banners',
    method: 'get',
    params
  })
}

/**
 * 资讯文章列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1655
 */
export function getNewsList (params = {}) {
  return request({
    url: baseUrl + '/api/news_list',
    method: 'get',
    params: params
  })
}

/**
 * 资讯文章详情
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1661
 */
export function getNews (params = {}) {
  return request({
    url: baseUrl + '/api/news',
    method: 'get',
    params
  })
}

/**
 * 资讯文章生成转发
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1679
 */
export function postNewsShare (params = {}) {
  return request({
    url: baseUrl + '/api/news_share',
    method: 'post',
    data: params
  })
}

/**
 * 首页跑马灯
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2231
 */
export function getRiding (params = {}) {
  return request({
    url: baseUrl + '/api/riding',
    method: 'get',
    params
  })
}

/**
 * 用户追踪用户查看资讯文章的阅读时长统计
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2237
 */
export function postAddNewsTime (params = {}) {
  return request({
    url: baseUrl + '/api/add_news_time',
    method: 'post',
    data: params
  })
}

/**
 * 用户追踪的访客列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2243
 */
export function getTrackVisitorsList (params = {}) {
  return request({
    url: baseUrl + '/api/track/visitors_list',
    method: 'get',
    params
  })
}

/**
 * 用户追踪的分享列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2255
 */
export function getTrackShareList (params = {}) {
  return request({
    url: baseUrl + '/api/track/share_list',
    method: 'get',
    params
  })
}

/**
 * 用户追踪的转发列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2261
 */
export function getTrackForwardList (params = {}) {
  return request({
    url: baseUrl + '/api/track/forward_list',
    method: 'get',
    params
  })
}

/**
 * 用户追踪的统计数据
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2267
 */
export function getTrackUserStatistics (params = {}) {
  return request({
    url: baseUrl + '/api/track/user_statistics',
    method: 'get',
    params
  })
}

/**
 * 用户追踪的统计数据列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2273
 */
export function getTrackUserStatisticsList (params = {}) {
  return request({
    url: baseUrl + '/api/track/user_statistics_list',
    method: 'get',
    params
  })
}

/**
 * 获取微信分享SDK配置
 * @param params
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1691
 */
export function getWxJsSDK (params = {}) {
  return request({
    url: baseUrl + '/api/wx_jssdk',
    method: 'get',
    params
  })
}

/**
 * 转发回调，统计分享数
 * @param params
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2249
 */
export function postNewsShareStats (params = {}) {
  return request({
    url: baseUrl + '/api/news_share_stats',
    method: 'post',
    data: params
  })
}
