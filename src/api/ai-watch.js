/**
 *   @Project:   智能看盘接口
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/22 14:53
 *   @Note:      接口地址：http://119.23.211.23:8083/project/74/interface/api/cat_470
 */


import request from '../assets/js/request'

const baseUrl = process.env.BASE_URL;

/**
 * 盘前观测
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1649
 */
export function getWatchMorningMarketDetail (params = {}) {
  return request({
    url: baseUrl + '/api/watch/morning_market_detail',
    method: 'get',
    params
  })
}

/**
 * 盘后总结
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1655
 */
export function getWatchCompoundDetail (params = {}) {
  return request({
    url: baseUrl + '/api/watch/compound_detail',
    method: 'get',
    params: params
  })
}


