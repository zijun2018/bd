/**
 *   @Project:   文章编辑助手相关接口
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/30 11:36
 *   @Note:      接口地址: http://119.23.211.23:8083/project/74/interface/api/cat_402
 */

import request from '../assets/js/request'

const baseUrl = process.env.BASE_URL;

/**
 * 获取微信文章内容(公众号文章)
 * @param params {Object} 参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2339
 */
export const getHelperGetWeChatArticle = (params = {}) => {
  return request({
    url: baseUrl + '/api/helper/get_wechat_article',
    method: 'get',
    params
  })
};

/**
 * 根据文章key值获取文章内容
 * @param params {Object} 参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2365
 */
export const getHelperGetNewsDetail = (params = {}) => {
  return request({
    url: baseUrl + '/api/helper/get_news_detail',
    method: 'get',
    params: params
  })
};

/**
 * 公众号文章添加入库
 * @param params {Object} 参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2364
 */
export const postHelperAddWeChatArticle = (params = {}) => {
  return request({
    url: baseUrl + '/api/helper/add_wechat_article',
    method: 'post',
    data: params
  })
};

/**
 * 添加编辑后资讯文章
 * @param params {Object} 参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2366
 */
export const postHelperAddEditedNews = (params = {}) => {
  return request({
    url: baseUrl + '/api/helper/add_edited_news',
    method: 'post',
    data: params
  })
};
