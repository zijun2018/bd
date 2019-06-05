/**
*   @Project:   我的二维码
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 16:25
*   @Note:      代码已部分重构优化，去除注释代码
*/


<template>
  <div class="code-outer">
    <div class="code">
      <div class="image-wraper card f-pr">
        <div class="empty-code"></div>
        <p class="text">
          产品即将上线，敬请期待！
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="scss">
  @import '../../styles/mixin.scss';

  .code-outer {
    width: 100%;
    height: 100vh;

    .code {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      padding: .666667rem .373333rem;
      box-sizing: border-box;

      .image-wraper {
        width: 9.2rem;
        height: 9.2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .empty-code {
          width: 3.546667rem;
          height: 3.546667rem;
          @include bgImage('../../assets/images/emptyCode');
          background-size: 100% 100%;
        }

        .text {
          @include font(16);
          color: #444444;
          line-height: 1.6rem;
        }
      }
    }
  }
</style>

