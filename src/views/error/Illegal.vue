/**
*   @Project:   文章违规页面展示
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/11 15:23
*   @Note:      目前针对第三方文章的审核状态
*               1): 审核通过 -> 不展示此页面
*               2): 审核不通过 -> 展示此页面
*               3): 文章删除 -> 展示此页面
*/


<template>
  <div class="error-illegal">
    <div>
      <svg :class="icon-gantanhao" aria-hidden="true">
        <use xlink:href="#icon-gantanhao"></use>
      </svg>
    </div>
    <p>此内容因违规无法查看</p>
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
      width: 1.067rem;
      height: 1.067rem;
    }
    p {
      margin-top: 0.4rem;
      font-size: 0.373rem;
      color: #999999;
      line-height: 0.427rem;
    }
  }
</style>
