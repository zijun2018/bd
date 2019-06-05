/**
 *   @Project:   html相关的过滤器
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/5 15:10
 *   @Note:
 */

import Vue from 'vue';
/**
 * 去除文档中超链接
 * @param html {string} 需要处理的html文档
 * @return {string} 去除超链接之后的html文档
 */
Vue.filter('removeAllHyperLink', html => {
  const reg = new RegExp(/<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/gi);
  return reg.test(html) ? html.replace(reg, '') : html
});


/**
 * 将所有的超链接转换为文本形式
 * @param html {string} 需要处理的html文档
 * @return {string} 超链接转换为文本之后的html文档
 */
Vue.filter('replaceAllHyperLinkToText', html => {
  const reg = new RegExp(
    /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/gi
  );
  const regAnchorStart = new RegExp(
    /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>/gi
  );
  const regAnchorEnd = new RegExp(/<\/a>/gi);
  return reg.test(html) ? html.replace(regAnchorStart, '').replace(regAnchorEnd, '') : html;
});

/**
 * 替换文本中所有换行(\n)为<br/>
 * @param str {string} 需要处理的字符串
 * @return {string} 替换\n之后的字符串
 */
Vue.filter('replaceAllLineBreakWithBr', str => {
  const reg = new RegExp(/\\+n/g);
  return reg.test(str) ? str.replace(reg, '<br/>') : str
});


/**
 * 去除字符中的 <br/> 标签
 * @param str {string} 需要处理的字符串
 * @return {string} 去除<br/>之后的字符串
 */
Vue.filter('removeBr', str => {
  const reg = new RegExp(/<br\s*\\?\/?>/gi);
  return reg.test(str) ? str.replace(reg, '') : str
});
