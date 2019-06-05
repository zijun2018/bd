/**
*   @Project:   文章详细和文章编辑页中微信分享提示
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/7 14:08
*   @Note:      此组件只有代理商可见,外层div注意条件判断
*/


<template>
  <div class="c-wx-share-tip">
    <div class="share-tip-wrap">
      <p class="share-tip-txt">{{weChatShareTipTxt}}</p>
      <p><img alt="article_we_chat-share" src="../../assets/images/article_we_chat-share.png"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'wx-share-tip-index',

    data () {
      return {
        weChatShareTipTxt: '以下内容分享时用户不可见' // 文章底部分享文字
      }
    }
  }
</script>

<style lang="scss" scoped>
  .c-wx-share-tip {
    height: 6.027rem;
    background-color: #EEEEEE;

    .share-tip-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 5.6rem;
      padding: 0 0.373rem;
      background-color: #ffffff;
      box-shadow: 0 2px 10px 2px rgba(55, 55, 55, .15);
    }

    p.share-tip-txt {
      margin-top: 0.427rem;
      margin-bottom: 0.56rem;
      font-size: 0.32rem;
      color: #999999;
      line-height: 0.427rem;

    }

    p > img {
      width: 100%;
    }
  }
</style>
