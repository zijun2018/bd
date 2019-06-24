/**
*   @Project:   进入文件
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:24
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/

<template>
  <div class="main-index">
    <transition :name="transitionName" mode="out-in">
      <keep-alive include="layout,wechatCode">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-left'
      }
    },

    watch: {
      '$route' (to, from) {
        let routersArr = (sessionStorage.getItem('routers') && sessionStorage.getItem('routers').split(',')) || [];
        if (routersArr.length === 0) {
          routersArr.push(from.path);
          routersArr.push(to.path);
        } else {
          if (routersArr.indexOf(to.path) !== -1) {
            this.transitionName = 'slide-right';
            routersArr.splice(routersArr.indexOf(to.path) + 1, 100);
          } else {
            this.transitionName = 'slide-left';
            routersArr.push(to.path);
          }
        }
        sessionStorage.setItem('routers', routersArr.join(','));
      }
    }
  }
</script>

<style lang="scss">
  .main-index > div {
    min-height: 100vh;
      /* IOS 11.2+ 版本版本支持 */
      @supports (bottom: env(safe-area-inset-bottom)){
        padding-bottom: env(safe-area-inset-bottom);
      }
      /* IOS 11支持,此处做兼容 */
      @supports (bottom: constant(safe-area-inset-bottom)) {
        padding-bottom: constant(safe-area-inset-bottom);
      }
    }
</style>
