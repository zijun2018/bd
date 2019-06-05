/**
 *   @Project:   注册全局组件，并导出
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/7 14:43
 *   @Note:
 */

import PageInitLoading from './page-init-loading'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Vue.component('glPageInitLoading', PageInitLoading);
}

export default plugin
