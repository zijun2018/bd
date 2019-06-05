import html2canvas from 'html2canvas';
import Canvas2Image from '../assets/js/canvas-2-image';

/**
 *   @Project:   整理常用的js工具方法
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/18 9:25
 *   @Note:      具体详情有细分（根据类型），列表可在utils>~README.md中查看或者在底部导出查看
 */

/************************************/
/*              判断相关              */
/************************************/

/**
 * 判断对象是否为空
 * @param obj {Object} 判断对象参数
 * @returns {boolean}
 */
const isEmptyObj = (obj) => {
  return JSON.stringify(obj) === '{}';
};

/**
 * 判断数组是否为空
 * @param arr {Array} 判断数组参数
 * @return {boolean}
 */
const isEmptyArray = arr => !arr.length;

/**
 * 检测空格、回车、换行、空白
 * @param str {String} 处理的字符串
 * @return {boolean}
 */
const isBlank = str => {
  const reg = /^\s*$/;
  return reg.test(str)
};


/************************************/
/*              设备相关              */
/************************************/

/**
 * 获取设备机型
 * @return {{kernel: string, version: string}}
 */
const getBrowser = () => {
  let s = '';
  let kernel = '';
  let version = '';
  let ua = navigator.userAgent.toLowerCase();

  // 探测浏览器
  (s = ua.match(/msie ([\d.]+)/))
    ? _set('ie', _toFixedVersion(s[1]))
    : (s = ua.match(/firefox\/([\d.]+)/))
    ? _set('firefox', _toFixedVersion(s[1]))
    : (s = ua.match(/chrome\/([\d.]+)/))
      ? _set('chrome', _toFixedVersion(s[1]))
      : (s = ua.match(/opera.([\d.]+)/))
        ? _set('opera', _toFixedVersion(s[1]))
        : (s = ua.match(/version\/([\d.]+).*safari/))
          ? _set('safari', _toFixedVersion(s[1]))
          : 0;

  function _toFixedVersion (ver, floatLength) {
    ver = ('' + ver).replace(/_/g, '.');
    floatLength = floatLength || 1;
    ver = String(ver).split('.');
    ver = ver[0] + '.' + (ver[1] || '0');
    ver = Number(ver).toFixed(floatLength);
    return ver;
  }

  function _set (k, v) {
    kernel = k;
    version = v;
  }

  return {
    kernel,
    version
  };
};

/**
 * 是否在微信中
 * @type {boolean}
 */
const isWx = /micromessenger/.test(window.navigator.userAgent.toLowerCase());

/**
 * 是否在Ios中
 * @type {boolean}
 */
const isIos = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent.toLowerCase());

/**
 * 是否在iphoneX中
 * @type {boolean}
 */
const isIphoneX = isIos && ((window.screen.height === 812 && window.screen.width === 375) ||
  (window.screen.height === 896 && window.screen.width === 414));

/**
 * 是否在Safari中
 * @type {boolean}
 */
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

/**
 * 是否在微信小程序中
 * @type {boolean}
 */
const isWxMiniProgram = /miniprogram/.test((window.__wxjs_environment || navigator.userAgent).toLowerCase());


/************************************/
/*             字符串相关             */
/************************************/

/**
 * 字符串去除所有html标签
 * @param str {string} 需要处理的字符串
 */
const removeHtmlTag = (str) => {
  let reg = /<\/?.+?\/?>/g;
  return str.replace(reg, '');
};

/**
 * 清除字符前后空格
 * @param str {String} 需要处理的字符串
 * @return {*}
 */
const clearSpace = str => str.replace(/(^\s*)|(\s*)$/g, '');

/**
 * 移除所有空格
 * @param v {String} 需要处理的字符串
 * @return {*} 返回正确的字符串
 */
const removeAllSpace = v => v.replace(/\s+/g, '');

/**
 * 移除所有超链接
 * @param html {String} html字符串
 * @return {*} 返回移除超链接之后的字符串
 */
const removeAllHyperLink = html => {
  const reg = new RegExp(
    /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/gi
  );
  return reg.test(html) ? html.replace(reg, '') : html;
};


/**
 * 替换文本中所有换行(\n)为<br/>
 * @param str {String} 需要处理的字符串
 * @return {*} 替换之后的字符串
 */
const replaceAllLineBreakWithBr = str => {
  const reg = new RegExp(/\\+n/g);
  return reg.test(str) ? str.replace(reg, '<br/>') : str;
};


/**
 * 清除内容中 \n | \\n
 * @param str {String} 需要处理的字符串
 * @return {*} 清除之后的字符串
 */
const removeAllLineBreak = str => {
  const reg = new RegExp(/\\+n/g);
  return reg.test(str) ? str.replace(reg, '') : str;
};

/**
 * 去除字符串中 <br/>
 * @param str {String} 需要处理的字符串
 * @return {*} 去除之后的字符串
 */
const removeBr = str => {
  const reg = new RegExp(/<br\s*\\?\/?>/gi);
  return reg.test(str) ? str.replace(reg, '') : str;
};

/**
 * 将所有超链接转换为不被浏览器解析的文本
 * @param html {String} html字符串
 * @return {*} 返回替换所有超链接为文本之后的字符串
 */
const replaceAllHyperLinkToText = html => {
  const reg = new RegExp(
    /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/gi
  );
  const regAnchoStart = new RegExp(
    /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>/gi
  );
  const regAnchoEnd = new RegExp(/<\/a>/gi);
  return reg.test(html) ? html.replace(regAnchoStart, '').replace(regAnchoEnd, '') : html;
};

/**
 * 验证手机号
 * @param phone {Number} 一串数字
 * @return {boolean}
 */
const checkPhone = phone => /^1[34578]\d{9}$/.test(phone) || /^8\d+$/.test(phone);

/**
 * 验证是否是URL地址
 * @param url {String} 字符串
 * @return {boolean}
 */
const checkUrl = url => {
  let re = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
  return re.test(url);
};

/**
 * 获取字符串长度
 * @param str {String} 字符串
 * @return {number} 字符串长度值
 */
const getStrLength = (str) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

/**
 * 解析url参数，转换为参数对象模式
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b}
 */
const urlParse = (pathUrl) => {
  let index = pathUrl.indexOf('?');
  let url = pathUrl.substring(index);
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substr(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val
    })
  }
  return obj
};

/**
 * 解析url参数，转换为参数对象模式
 * @param url {String} url地址 default: window.location.href
 * @example ?id=12345&a=b
 * @return {Object} 转换之后的对象 {id:12345, a:b}
 */
const parseQueryString = (url) => {
  url = !url ? window.location.href : url;
  if (url.indexOf('?') === -1) {
    return {};
  }
  let search = url[0] === '?' ? url.substr(1) : url.substring(url.lastIndexOf('?') + 1);
  if (search === '') {
    return {};
  }
  search = search.split('&');
  let query = {};
  for (let i = 0; i < search.length; i++) {
    let pair = search[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

/************************************/
/*           数组、对象相关            */
/************************************/

/**
 * 两个数组合并一个对象
 * @param arr1 {Array} 被合并数组，在对象中以 键 存在
 * @param arr2 {Array} 被合并数组，在对象中以 值 存在
 * @return {Object} 返回键值对的对象
 */
const arrContactObject = (arr1, arr2) => {
  let obj = {};
  for (let i = 0; i < arr1.length; i++) {
    obj[arr1[i]] = arr2[i];
  }
  return obj;
};

/**
 * 深拷贝，支持常见类型（复制之前）
 * @param values
 * @return {{}|Array|Date|*}
 */
const deepClone = (values) => {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (values === null || typeof values !== 'object') return values;

  // Handle Date
  if (values instanceof Date) {
    copy = new Date();
    copy.setTime(values.getTime());
    return copy;
  }

  // Handle Array
  if (values instanceof Array) {
    copy = [];
    for (let i = 0, len = values.length; i < len; i++) {
      copy[i] = deepClone(values[i]);
    }
    return copy;
  }

  // Handle Object
  if (values instanceof Object) {
    copy = {};
    for (let attr in values) {
      if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy values! Its type isn't supported.");
};


/************************************/
/*              数值相关              */
/************************************/

/**
 * 四舍五入
 * @param number {Number} 处理的数字
 * @param digit {Number} 需要保留的小数位数
 * @return {number} 12.34
 */
const getMathRound = (number = 0, digit = 2) => {
  const exponent = Math.pow(10, digit);
  return Math.round(number * exponent) / exponent;
};

/**
 * 取两个数之间的随机数
 * @param min {Number} 范围最小值(包此值)
 * @param max {Number} 范围最大值(含此值)
 * @return {number} 随机数
 * @example (1,7) => 1/2/3/4/5/6/7
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

/**
 * 格式化手机号为 3-4-4结构
 * @param v
 * @return {string|*}
 */
const formatPhoneNum = v => {
  /* 去除所有空格 */
  const _v = removeAllSpace(v);

  /* 如果是非数字，直接返回 */
  if (isNaN(_v)) {
    return _v
  } else {
    /* 满足 3-7位 */
    if (_v.length >= 3 && _v.length <= 7) {
      /* 前三位 */
      const FIRST_PART = _v.substr(0, 3);
      /* 后面几位 */
      const SECOND_PART = _v.substr(3);
      v = FIRST_PART + ' ' + SECOND_PART
    } else if (_v.length > 7) {
      /* 前三位 */
      const FIRST_PART = _v.substr(0, 3);
      /* 中间4位 */
      const SECOND_PART = _v.substr(3, 4);
      /* 剩下所有 */
      const THIRD_PART = _v.substr(7);

      v = FIRST_PART + ' ' + SECOND_PART + ' ' + THIRD_PART
    }
    return v
  }
};

/**
 * 判断是否为手机号
 * @param str {String} 处理的字符串
 * @return {boolean}
 */
const isPhoneNum = (str) => {
  return /^(\+?0?86\-?)?1[3456789]\d{9}$/.test(str)
};

/**
 * 强制保留n位小数
 * @param value {String | Number} 需要处理的数
 * @param n {Number} 需要保留的小数位数
 * @return {number}
 */
const returnFloat = (value, n) => {
  let v = Math.round(parseFloat(value) * 100) / 100;
  let xsd = v.toString().split('.');
  if (xsd.length === 1) {
    v = v.toString() + '.' + '0'.repeat(n);
    return v;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < n) {
      v = v.toString() + '0';
    }
    return v;
  }
};

/************************************/
/*              微信相关              */
/************************************/

/**
 * 微信跳转登录权限地址，及验证回调
 * @param config {Object} 微信配置对象
 */
const handleAuth = (config = {appid: '', redirectUrl: '', url: ''}) => {
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${(config.redirectUrl)}&response_type=code&scope=snsapi_userinfo&state=${config.url}#wechat_redirect`
};

/**
 * 关闭微信中的分享，包括分享给好友，分享到朋友圈，
 * 建议在页面created或者mounted钩子中使用
 */
const closeShare = () => {
  function onBridgeReady () {
    WeixinJSBridge.call('hideOptionMenu');
  }

  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
};

/**
 * 打开微信中的分享，包括分享给好友，分享到朋友圈（与上面closeShare配合使用）
 * 建议在页面beforeDestroy钩子中使用
 */
const openShare = () => {
  function onBridgeReady () {
    WeixinJSBridge.call('showOptionMenu');
  }

  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
};

/**
 * 微信分享SDK配置
 * @param config {Object} 配置参数对象
 * @param callback {Function} 验证通过的微信分享回调
 */
/*
const setWxConfig = (config = {}, callback) => {
  try {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: config.appId, // 必填，公众号的唯一标识
      timestamp: config.timestamp, // 必填，生成签名的时间戳
      nonceStr: config.nonceStr, // 必填，生成签名的随机串
      signature: config.signature, // 必填，签名
      jsApiList: config.jsApiList // 必填，需要使用的JS接口列表
    });
    wx.ready(() => {
      // 通过ready接口处理成功验证
      callback && callback(wx);
    });
    wx.error(() => {
      // 通过error接口处理失败验证
    })
  } catch (error) {
    console.error('weixin', error)
  }
};
*/


/************************************/
/*              图片相关              */
/************************************/

/**
 * 将html转化为图片
 * @param element {Object} 需要转化的dom
 * @param scale {Number} 放大倍数，默认2倍，原因为保持转化后图片的清晰度
 * @param isSaveImg {Boolean} 是否保存图片
 * @param callback {Function} 转化后的成功回调，参数为图片的DOM,用于图片操作
 */
const generateCanvasImage = (element, scale = 2, isSaveImg = false, callback) => {
  let width = element.offsetwidth; // dom宽度
  let height = element.offsetheight; // dom高度
  let canvas = document.createElement('canvas'); // 创建一个canvas节点
  const SCALE = scale; // 放大倍数，支持小数，默认为2倍
  canvas.width = width * SCALE; // 定义canvas宽度*缩放
  canvas.height = height * SCALE; // 定义canvas高度*缩放
  canvas.getContext('2d').scale(scale, scale); // 获取context，设置scale
  const opts = {
    scale, // 添加的放大scale参数
    canvas, // 自定义canvas
    width, // dom原始宽度
    height, // dom原始高度
    useCORS: true // 开启跨域配置
  };
  html2canvas(element, opts).then(canvasObj => {
    let context = canvasObj.getContext('2d');
    // 关闭抗锯齿
    context.webkitImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    // 将格式转化为png格式
    isSaveImg && Canvas2Image.saveAsPNG(canvasObj, canvasObj.width, canvasObj.height);
    const IMGDOM = Canvas2Image.convertToPNG(canvasObj, canvasObj.width, canvasObj.height);
    callback && callback(IMGDOM);
    return IMGDOM;
  })
};

export {
  isEmptyObj, // 判断对象是否为空
  isEmptyArray, // 判数组是否为空
  isBlank, // 检测空格、回车、换行、空白
  getBrowser, // 获取设备内核
  isWx, // 是否在微信中
  isIos, // 是否在苹果设备中
  isIphoneX, // 是否在iphoneX中
  isSafari, // 是否在Safari中
  isWxMiniProgram, // 是否在微信小程序中
  removeHtmlTag, // 字符串去除所有html标签
  clearSpace, // 清除字符前后空格
  removeAllSpace, // 移除所有空格
  removeAllHyperLink, // 移除所有超链接
  replaceAllLineBreakWithBr, // 替换文本中所有换行(\n)为<br/>
  removeAllLineBreak, // 清除内容中 \n | \\n
  removeBr, // 去除字符串中 <br/>
  replaceAllHyperLinkToText, // 将所有超链接转换为不被浏览器解析的文本
  checkPhone, // 验证手机号
  isPhoneNum, // 判断是否为手机号
  checkUrl, // 验证是否是URL地址
  getStrLength, // 获取字符串长度
  parseQueryString, // 解析url参数，转换为参数对象模式
  arrContactObject, // 两个数组合并一个对象
  deepClone, // 深拷贝，支持常见类型
  getMathRound, // 五舍五入取值
  randomInt, // 取两个数之间的随机数
  formatPhoneNum, // 格式化手机号为 3-4-4结构
  returnFloat, // 强制保留n位小数
  handleAuth, // 微信跳转登录权限地址，及验证回调
  closeShare, // 关闭微信中的分享
  openShare, // 打开微信中的分享
  // setWxConfig, // 微信分享SDK配置
  generateCanvasImage // 将html转化为图片
}
