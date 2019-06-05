/**
 *   @Project:   定义并输出全局变量
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/4/22 13:40
 *   @Note:
 */


const isTest = /http:\/\/(bdtest\.1quant\.me)/i.test(location.href.toLowerCase()); // 测试环境
const isBuild = /https:\/\/(bd\.9quant\.cn)/i.test(location.href.toLowerCase()); // 生产环境
const DEFAULT_SHARE_BASE_URL = isBuild
  ? 'https://bd.9quant.cn/bdstatic/share/share-default-img'
  : 'http://bdstatic.test.9quant.cn/share/share-default-img';

/**
 * 复盘文章固定的分享图片，固定死
 */
export const DEFAULT_SHARE_COMPOUND_URL = isBuild
  ? 'https://bd.9quant.cn/bdstatic/share/share-compound-default-img.jpg'
  : 'http://bdstatic.test.9quant.cn/share/share-compound-default-img.jpg';

/**
 * 默认分享的默认图片，数组，随机取
 */
export const DEFAULT_SHARE_IMAGES = [
  `${DEFAULT_SHARE_BASE_URL}1.jpg`,
  `${DEFAULT_SHARE_BASE_URL}2.jpg`,
  `${DEFAULT_SHARE_BASE_URL}3.jpg`,
  `${DEFAULT_SHARE_BASE_URL}4.jpg`,
  `${DEFAULT_SHARE_BASE_URL}5.jpg`,
  `${DEFAULT_SHARE_BASE_URL}6.jpg`,
  `${DEFAULT_SHARE_BASE_URL}7.jpg`
  ];

