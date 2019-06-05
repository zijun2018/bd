/**
 *   @Project:   时间相关的方法
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 15:48
 *   @Note:
 */

/**
 * 时间格式化,将给定时间转换为需要的时间格式
 * @param date {Object} 时间格式对象
 * @param fmt{String} 需要转化的时间格式，比如：‘YYYY-MM-dd HH:mm:ss’
 * @return {*} 需要的时间格式
 */
export const dateFormat = (date, fmt) => {
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
};

/**
 * 格式化时间，显示年月日，2019-05-05
 * @param {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
export const dateFormatYearMonthDate = date => {
  return dateFormat(new Date(Number(date)), 'yyyy-MM-dd');
};

/**
 * 格式化时间，显示月日时间，05-05 16:01
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
export const dateFormatMonthDateTime = date => {
  return dateFormat(new Date(Number(date)), 'MM-dd HH:mm');
};

/**
 * 格式化时间，显示年月日时间 2019-05-05 16:01
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
export const dateFormatYearMonthDateTime = date => {
  return dateFormat(new Date(Number(date)), 'yyyy-MM-dd HH:mm');
};

/**
 * 格式化时间，显示时间 05月05日
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
export const dateFormatMonthDate = date => {
  return dateFormat(new Date(Number(date)), 'MM月dd日');
};

/**
 * 格式化时间，显示时间 16:01
 * @param date {String | Number} 时间戳
 * @return {String} 格式化之后的时间
 */
export const dateFormatTime = date => {
  return dateFormat(new Date(Number(date)), 'HH:mm');
};


/**
 * 倒计时计算年，天，时，分，秒
 * @param targetTime {Number/String} 目标时间（将来的设定时间）
 * @param startTime {Number/String} 开始时间（一般为现在时间）
 * @return {{years: *, days: *, hours: *, minutes: *, seconds: *}} 返回对象
 */
export const returnLeftTime = (targetTime, startTime) => {
  // 不足2位数补0方法
  function checkTime (i) {
    if (i < 10) {
      i = '0' + i;
    }
    return String(i);
  }

  let currTime = startTime || new Date().getTime();
  let leftTime = Number(targetTime) - Number(currTime);
  if (leftTime >= 0) {
    let years = parseInt(leftTime / 1000 / 60 / 60 / 24 / 365, 10); /// /计算剩余的年
    let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); // 计算剩余的天数
    let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); // 计算剩余的小时
    let minutes = parseInt(leftTime / 1000 / 60 % 60, 10); // 计算剩余的分钟
    let seconds = parseInt(leftTime / 1000 % 60, 10); // 计算剩余的秒数

    return {
      years: checkTime(years),
      days: checkTime(days),
      hours: checkTime(hours),
      minutes: checkTime(minutes),
      seconds: checkTime(seconds)
    };
  }
};


/**
 * 获取当前日期的N个月前后的日期
 * @param months {number} N月，+N 表示N月之后; -N 表示N月之前
 * @param days {number} N日， +N 表示N天之后; -N 表示N天之前
 * @param isZero {boolean} 是否需要补零 true(默认) 需要;
 * @param joinSign {string} 日期连接符号 ‘-’(默认)
 * @return {string} 输出需求格式
 */
export const getFewMonthAgoOrAfterDate = (months = 0, days = 0, isZero = true, joinSign = '-') => {
  let dt = new Date();
  dt.setMonth(dt.getMonth() + months, dt.getDate() + days);
  let Year = dt.getFullYear();
  let Month = dt.getMonth() + 1;
  let Day = dt.getDate();

  // 是否补零
  if (isZero) {
    Month = Month < 10 ? ('0' + Month) : Month;
    Day = Day < 10 ? ('0' + Day) : Day;
  }
  // 日期连接符号
  return `${Year}${joinSign}${Month}${joinSign}${Day}`;
};
