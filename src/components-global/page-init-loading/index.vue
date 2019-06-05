/**
*   @Project:   进入页面的加载数据的加载过渡效果
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/7 14:34
*   @Note:      新增淡出效果
*/


<template>
  <transition name="page-init">
  <div class="c-gl-page-init-loading">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  </transition>
</template>

<script>
  export default {
    name: 'gl-page-init-loading'
  }
</script>

<style lang="scss" scoped>
  .c-gl-page-init-loading {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.5s all;
    opacity: 1;
    background-color: rgba(255, 255, 255, 1);
    /*&.page-init-enter-active, &.page-init-leave-active {*/
    /*  transition: ease .5s;*/
    /*}*/
    &.page-init-enter, &.page-init-leave-to {
      transition: ease .4s;
      opacity: 0;
      background-color: rgba(255, 255, 255, 0);
    }

    .loading {
      width: 4rem;
      height: .4rem;
      display: flex;
      justify-content: center;
    }

    .loading span {
      display: inline-block;
      width: .2rem;
      height: .2rem;
      margin-right: .133333rem;
      border-radius: 50%;
      background: #084ec2;
      -webkit-animation: load 1.04s ease infinite;
    }

    .loading span:last-child {
      margin-right: 0;
    }

    @-webkit-keyframes load {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .loading span:nth-child(1) {
      -webkit-animation-delay: 0.13s;
    }

    .loading span:nth-child(2) {
      -webkit-animation-delay: 0.26s;
    }

    .loading span:nth-child(3) {
      -webkit-animation-delay: 0.39s;
    }

    .loading span:nth-child(4) {
      -webkit-animation-delay: 0.52s;
    }

    .loading span:nth-child(5) {
      -webkit-animation-delay: 0.65s;
    }

  }
</style>
