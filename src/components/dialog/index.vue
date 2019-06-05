/**
*   @Project:   量化云全局弹出组件
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/16 9:35
*   @Note:      1、实现延迟消失的功能，默认显示2秒
*               2、实现确定按钮的功能
*               3、实现带有确定按钮和取消按钮的功能
*   @备注：      由于当前原因只做确定框，
*/


<template>
  <div class="lhy-dialog">

    <!-- Part1: 背景蒙层 -->
    <div class="dialog-mask"></div>

    <!-- Part2: 弹窗内容 -->
    <div class="dialog-content">

      <!-- Part2-1: 标题 -->
      <div class="dialog-title"
           v-if="title">
        <p>{{title}}</p>
      </div>

      <!-- Part2-2: 具体内容 -->
<!--
      <div class="dialog-content">
        <slot name="content"></slot>
      </div>
-->
      <slot name="dialog-content"></slot>

    </div>

  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'lhy-dialog',

    props: {
      // 标题
      title: {
        type: String,
        default: ''
      }

    },

    data () {
      return {

        confirmTxt: '确定', // 确定按钮文字

        cancelTxt: '取消' // 取消按钮文字
      }
    },

    mounted () {
      // 禁止背景滚动
      this.biddenBgScroll(true);
    },

    methods: {
      ...mapActions(['setShowDialog']),
      /**
       * 禁止
       * @param isFixed
       */
      biddenBgScroll (isFixed) {
        let bodyEl = document.body;
        if (isFixed) {
          bodyEl.style.overflow = 'hidden';
          bodyEl.style.width = '100%';
          bodyEl.style.position = 'fixed';
        } else {
          bodyEl.style.overflow = 'auto';
          bodyEl.style.position = '';
          window.scrollTo(0, 0);
        }
      }


    },

    beforeDestroy () {
      this.biddenBgScroll(false);
    }

  }
</script>

<style lang="scss" scoped>
  $bgMaskColor: rgba(0, 0, 0, .5);

  .lhy-dialog {

    .dialog-mask {
      position: fixed;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: $bgMaskColor;
    }

  }
</style>
