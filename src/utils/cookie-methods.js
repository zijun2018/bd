/**
 *   @Project:   Cookie相关方法
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 20:04
 *   @Note:
 */

/**
 * 保存Cookie
 * @param key {String} 键
 * @param value {String} 值
 * @param expire {String/Number} 失效时间(单位小时)
 */
export const setCookie = (key, value, expire) => {
  let oDate = new Date();
  oDate.setHours(oDate.getHours() + expire);
  document.cookie = key + '=' + value + ((expire === null) ? '' : ';expires=' + oDate.toGMTString()) + ';path=/mobile';
};

/**
 * 移除Cookie
 * @param key {String} 键
 */
export const removeCookie = key => {
  // 这里只需要把Cookie保质期退回一天便可以删除
  const myDate = new Date();
  myDate.setTime(-1000); // 设置时间
  const cookiesArray = document.cookie.split(';');
  for (let i = 0; i < cookiesArray.length; i++) {
    const varName = cookiesArray[i].split('=');
    /* 清除cookie BUG， document.cookie 取到的结果大于两个字段时，会在字段前面加一个 空格，所以，在做匹配时，需要手动去除前面空格 */
    if (varName[0].trim() === key) {
      document.cookie = varName[0] + "='';expires=" + myDate.toGMTString() + ';path=/mobile';
    }
  }
};

/**
 * 获取Cookie
 * @param key {String} 键
 * @return {*}
 */
export const getCookie = key => {
  let cookieArr = document.cookie.split('; ');
  for (let i = 0; i < cookieArr.length; i++) {
    let arr = cookieArr[i].split('=');
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return false;
};
