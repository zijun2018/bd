/**
 *   @Project:   字符串相关过滤器
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 14:46
 *   @Note:
 */

import Vue from 'vue';
/**
 * 反转字符串
 * @param str {string} 需要反转的字符串
 * @return {string} 反转之后的字符串
 */
Vue.filter('reverse', str => str.split('').reverse().join(''));


/**
 * 清除字符前后空格
 * @param str {string} 需要处理的字符串
 * @return {string} 去除前后空格之后的字符串
 */
Vue.filter('clearSpace', str => str.replace(/(^\s*)|(\s*)$/g, ''));
