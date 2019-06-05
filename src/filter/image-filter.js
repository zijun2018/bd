/**
 *   @Project:   图片相关过滤器
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 14:57
 *   @Note:
 */

import Vue from 'vue';
/**
 * 自定义缩略图
 * @param str {string} 图片源地址
 * @param w {number} 缩略图宽
 * @param h {number} 缩略图高
 * @return {string} 添加缩略图后的图片地址
 */
Vue.filter('thumbnail', (str, w, h) => {
  if (str) return str + '!' + w + '_' + h
});
