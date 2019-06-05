/**
 *   @Project:   数字相关过滤器
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 15:16
 *   @Note:
 */

import Vue from 'vue';
/**
 * 求取一组数的平均数
 * @param arr {Array} 一组数
 * @param digit {Number} 保留小数位数，默认两位
 * @return {Number} 返回值
 */
Vue.filter('getAvg', (arr = [0], digit = 2) => {
  let sum = 0;
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    sum += Number(arr[i])
  }

  return (sum / len).toFixed(digit)
});

/**
 * 格式化商品价格，保留两位小数
 * @param p {Number} 价格，单位为分
 * @param symbol {String | Boolean} 需要展示的价格符号，如果不需要显示，给false
 */
Vue.filter('computedGoodsPrice', (p, symbol) => {
  return p ? (symbol === false ? '' : symbol || '¥') + (p / 100).toFixed(2) : '0.00'
});

/**
 * 四舍五入
 * @param number {Number} 需要处理的数字
 * @param digit {Number} 保留小数位数，默认两位
 * @return {Number} 返回值
 */
Vue.filter('getMathRound', (number = 0, digit = 2) => {
  const exponent = Math.pow(10, digit);
  return Math.round(number * exponent) / exponent;
});

/**
 * 格式化数字超过10000以万为单位
 * @param number {Number} 需要处理的数字
 * @param digit {Number} 保留小数位数，默认一位
 * @return {String} 返回格式化之后的字符
 */
Vue.filter('computedNumMoreThanTenThousand', (number = 0, digit = 1) => {
  return number >= Math.pow(10, 4) ? (number / Math.pow(10, 4)).toFixed(digit) + '万' : number;
});
