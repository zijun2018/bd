/**
*   @Project:   首页框架页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 16:22
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="layout-outer needAda">
    <div class="layout">
      <div class="content-wraper">
        <keep-alive include="home,userInfo">
          <router-view></router-view>
        </keep-alive>
      </div>
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="home" class="home">
          <span slot="icon" class="cicon f-pa home"></span>
          首页
        </mt-tab-item>
        <mt-tab-item id="news" class="news">
          <span slot="icon" class="cicon f-pa news"></span>
          展业资讯库
        </mt-tab-item>
        <mt-tab-item id="mine" class="mine">
          <span slot="icon" class="cicon f-pa mine"></span>
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'layout',

    data () {
      return {
        selected: ''
      }
    },

    created () {
      this.selected = this.$route.meta.tab;
    },

    watch: {
      selected (newVal, oldVal) {
        if (oldVal === '') return;
        this.$router.push({
          path: newVal
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/mixin";
  .layout-outer {
    width: 100%;
    height: 100%;
    background-color: #eeeeee;
    .layout {
      width: 100%;
      height: 100%;
      .content-wraper {
        width: 100%;
        padding-bottom: 1.173333rem;
        overflow-y: scroll;
      }
      .mint-tabbar {
        height: 1.173333rem;
        background-color: #ffffff;
        background-image: none;
        box-shadow: 0 0 1px 1px #eeeeee;
        overflow: hidden;
        padding-top: .026667rem;
      }
      .mint-tab-item {
        padding: 0;
        .mint-tab-item-label {
          @include font(10);
          color: #888888;
        }
        &.is-selected {
          background-color: #ffffff;
          .mint-tab-item-label {
            color: #1C52BB;
          }
        }
        .mint-tab-item-icon {
          width: .746667rem;
          height: .746667rem;
          position: relative;
          margin-bottom: 0;
          .cicon {
            width: .533333rem;
            height: .533333rem;
            background-size: 100% 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &.home {
          .cicon {
            @include bgImage('../../assets/images/home');
          }
          &.is-selected {
            .cicon {
              @include bgImage('../../assets/images/home_selected');
            }
          }
        }
        &.product {
          .cicon {
            @include bgImage('../../assets/images/product');
          }
          &.is-selected {
            .cicon {
              @include bgImage('../../assets/images/product_selected');
            }
          }
        }
        &.news {
          .cicon {
            @include bgImage('../../assets/images/news');
          }
          &.is-selected {
            .cicon {
              @include bgImage('../../assets/images/news_selected');
            }
          }
        }
        &.mine {
          .cicon {
            @include bgImage('../../assets/images/mine');
          }
          &.is-selected {
            .cicon {
              @include bgImage('../../assets/images/mine_selected');
            }
          }
        }
      }
    }
  }

/* iphone刘海适配 */
.needAda {
  .mint-tabbar.is-fixed {
    /* IOS 11支持,此处兼容处理 */
    @supports (bottom: env(safe-area-inset-bottom)){
      height: calc(1.173333rem + env(safe-area-inset-bottom));
    }
    /*IOS 11.2+版本版本支持 */
    @supports (bottom: constant(safe-area-inset-bottom)){
      height: calc(1.173333rem + constant(safe-area-inset-bottom));
    }
  }
  .content-wraper {
    height: 100%;
  }
}
</style>
