/**
*   @Project:   404页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/11 15:20
*   @Note:
*/


<template>
  <div class="error-illegal">
    <div>
      <svg :class="icon-icon-test" aria-hidden="true">
        <use xlink:href="#icon-icon-test"></use>
      </svg>
    </div>
    <p>很抱歉，您要访问的页面不存在！</p>
  </div>
</template>

<script>
  export default {
    name: 'Illegal'
  }
</script>

<style lang="scss" scoped>
  .error-illegal {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-top: -1.067rem;
    svg {
      width: 2.133rem;
      height: 2.133rem;
    }
    p {
      margin-top: 0.4rem;
      font-size: 0.373rem;
      color: #999999;
      line-height: 0.427rem;
    }
  }
</style>
