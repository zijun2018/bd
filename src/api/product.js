/**
 *   @Project:   产品相关接口
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/30 11:28
 *   @Note:      接口地址: http://119.23.211.23:8083/project/74/interface/api/cat_301
 */


import request from '../assets/js/request'

const baseUrl = process.env.BASE_URL;

/**
 * 产品列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1667
 */
export function getProducts (params = {}) {
  return request({
    url: baseUrl + '/api/products',
    method: 'get',
    params
  })
}

/**
 * 产品详情
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1673
 */
export function getProduct (params = {}) {
  return request({
    url: baseUrl + '/api/product',
    method: 'get',
    params
  })
}
