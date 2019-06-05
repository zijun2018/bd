/**
 *   @Project:   代理人相关接口
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/30 10:11
 *   @Note:      接口地址：http://119.23.211.23:8083/project/74/interface/api/cat_289
 */

import request from '../assets/js/request'

const baseUrl = process.env.BASE_URL;

/**
 * 用户登录
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1613
 */
export function postAuthLogin (params = {}) {
  return request({
    url: baseUrl + '/api/auth/login',
    method: 'post',
    data: params
  })
}

/**
 * 获取图形验证码
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2517
 */
export function getCaptcha (params = {}) {
  return request({
    url: baseUrl + '/api/auth/captcha',
    method: 'get',
    data: params
  })
}

/**
 * 发送短信，获取验证码
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1605
 */
export function postAuthSendMsg (params = {}) {
  return request({
    url: baseUrl + '/api/auth/send_msg',
    method: 'post',
    data: params
  })
}

/**
 * 代理人信息
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1619
 */
export function getAgentUserInfo (params = {}) {
  return request({
    url: baseUrl + '/api/agent/user_info',
    method: 'get',
    params
  })
}

/**
 * 更新代理人信息
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1625
 */
export function postAgentUpdateInfo (params = {}) {
  return request({
    url: baseUrl + '/api/agent/update_info',
    method: 'post',
    data: params
  })
}

/**
 * 上传图片
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1631
 */
export function postAgentUploadPic (params = {}) {
  return request({
    url: baseUrl + '/api/agent/upload_pic',
    withoutQs: true,
    method: 'post',
    data: params
  })
}

/**
 * 意见反馈
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2363
 */
export function postAgentOpinionFeedback (params = {}) {
  return request({
    url: baseUrl + '/api/agent/opinion_feedback',
    method: 'post',
    data: params
  })
}

/**
 * 上传证据截图
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2512
 */
export function postComplaintImg (params = {}) {
  return request({
    url: baseUrl + '/api/complaint/upload_pic',
    withoutQs: true,
    method: 'post',
    data: params
  })
}

/**
 * 添加用户投诉
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2511
 */
export function postComplaintAdd (params = {}) {
  return request({
    url: baseUrl + '/api/complaint/add',
    method: 'post',
    data: params
  })
}

/**
 * 客户意向列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/2510
 */
export function getIntentList (params = {}) {
  return request({
    url: baseUrl + '/api/intent/list',
    method: 'get',
    params
  })
}

/**
 * 我的消息-列表
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1637
 */
export function getAgentUserNotices (params = {}) {
  return request({
    url: baseUrl + '/api/agent/user_notices',
    method: 'get',
    params
  })
}

/**
 * 我的消息-详情
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 * http://119.23.211.23:8083/project/74/interface/api/1643
 */
export function getAgentUserNotice (params = {}) {
  return request({
    url: baseUrl + '/api/agent/user_notice',
    method: 'get',
    params
  })
}

/**
 * 更新获客名片
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 */
export function postAgentUpdateGuestCard (params = {}) {
  return request({
    url: baseUrl + '/api/agent/update_guest_card',
    method: 'post',
    data: params
  })
}

/**
 * 添加获客名片至资讯库
 * @param params {Object} 接口参数对象
 * @returns {AxiosPromise}
 */
export function postAgentAddCardToNews (params = {}) {
  return request({
    url: baseUrl + '/api/agent/add_card_to_news',
    method: 'post',
    data: params
  })
}

