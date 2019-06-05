/**
 *   @Project:   时间相关的过滤器
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 14:23
 *   @Note:
 */

import Vue from 'vue';
import {dateFormatMonthDateTime, dateFormatYearMonthDate, dateFormatYearMonthDateTime} from '../utils/time-methods';

/**
 * 将秒转换为时分秒格式,有单位
 * @param value {String | Number} 单位为秒的数值
 * @return {String} 返回格式时间：3时20分12秒
 */
Vue.filter('secondUnitFormat', function (value = 0) {
  let theTime = parseInt(value); // 秒
  let theTime1 = 0; // 分
  let theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  let result = '' + parseInt(theTime) + '秒';
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result;
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '时' + result;
  }
  return result;
});

/**
 * 将秒转换为时分秒格式，没有单位
 * @param value {String | Number} 单位为秒的数值
 * @return {String} 返回格式时间：3:20:12
 */
Vue.filter('secondFormat', (time) => {
  // time 单位为秒
  // 取整
  time = parseInt(time);
  const m = parseInt(time / 60);
  const h = parseInt(time / 3600);
  // 取秒
  let second = parseInt(time % 60);
  second = second < 10 ? '0' + second : second;
  // 取分
  let min = parseInt(m % 60);
  min = min < 10 ? '0' + min : min;
  // 取小时
  const hour = h < 10 ? '0' + h : h;
  return (h > 0 ? (hour + ':') : '') + min + ':' + second
});

/**
 * 时间格式化,将给定时间转换为需要的时间格式
 * @param date {Object} 时间格式对象
 * @param fmt{String} 需要转化的时间格式，比如：‘YYYY-MM-dd HH:mm:ss’
 * @param {String} 需要的时间格式
 */
Vue.filter('dateFormat', (date, fmt) => {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 24 === 0 ? '00' : date.getHours() % 24,
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  const week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + '']);
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
});


/**
 * 友好式的时间格式化：几分钟前，几小时前，隔天显示 月 日 时 分，隔年显示 年 月 日
 * @param timestamp {String | Number} 时间戳
 */
Vue.filter('dateFormatFriendly', timestamp => {
  /*
  获取当前时间戳
  用当前时间和参数时间戳作对比
  如果当前时间与参数时间戳差值(毫秒)
  小于 1 个小时。显示 几分钟前
  小于 1 天，显示 几小时前
  否则，年是否等于当年
  是显示 月 日 时 分
  否则 年 月 日
  */
  const now = new Date().getTime();
  const nowYear = new Date().getFullYear();
  const timestampYear = new Date(Number(timestamp)).getFullYear();
  const diffTimestamp = now - timestamp;
  if (diffTimestamp < 60 * 1000) {
    return '刚刚'
  } else if (diffTimestamp < 60 * 60 * 1000) {
    return Math.floor(diffTimestamp / (60 * 1000)) + '分钟前'
  } else if (diffTimestamp < 24 * 60 * 60 * 1000) {
    return Math.floor(diffTimestamp / (60 * 60 * 1000)) + '小时前'
  } else if (nowYear === timestampYear) {
    return dateFormatMonthDateTime(timestamp)
  } else {
    return dateFormatYearMonthDate(timestamp)
  }
});

/**
 * 格式化时间，显示年月日，2019-05-05
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
Vue.filter('dateFormatYearMonthDate', date => {
  return dateFormatYearMonthDate(date);
});

/**
 * 格式化时间，显示月日时间，05-05 16:01
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
Vue.filter('dateFormatMonthDateTime', date => {
  return dateFormatMonthDateTime(date);
});

/**
 * 格式化时间，显示年月日时间 2019-05-05 16:01
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
Vue.filter('dateFormatYearMonthDateTime', date => {
  return dateFormatYearMonthDateTime(date);
});
