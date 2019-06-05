/**
*   @Project:   微信文章编辑助手首页
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/15 17:28
*   @Note:      1.实现手动输入或粘贴文章地址
*               2.实现编辑说明展示
*/

<template>
  <div class="public-home">

    <!-- Part1:文章编辑输入框 -->
    <div class="edit-area">
      <label class="text-link" for="edit-input-text">
        <span class="iconfont">&#xe6c8;</span>
      </label>
      <input :placeholder="editPlaceholder" id="edit-input-text" type="text" v-model="linkData"/>
    </div>

    <!-- Part2:文章编辑确定按钮 -->
    <div @click="jumpToPublicArticle(linkData)"
         class="edit-btn">
      <p>{{editBtnText}}</p>
    </div>

    <!-- Part3:使用说明介绍 -->
    <div class="edit-description">
      <p class="desc-title">{{descriptionTitle}}</p>
      <div class="desc-1 desc-part" v-html="descTitle1"></div>
      <div class="desc-img"><img src="../../assets/images/edit-desc1.png" alt=""></div>
      <div class="desc-2 desc-part" v-html="descTitle2"></div>
      <div class="desc-img"><img src="../../assets/images/edit-desc2.png" alt=""></div>
      <div class="desc-3 desc-part" v-html="descTitle3"></div>
      <div class="desc-4" v-html="descTxt4"></div>
    </div>

    <!-- 全局弹窗组件 -->
    <dia-log v-if="isShowDialog">
      <div slot="dialog-content" class="dialog-content">
        <p class="dialog-text">{{dialogTxt}}</p>
        <p @click="handleConfirm" class="dialog-btn">{{confirmTxt}}</p>
      </div>

    </dia-log>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import diaLog from '../../components/dialog/index';

export default {
  name: 'public_home',

  components: {diaLog},

  data () {
    return {
      /***********************************/
      /*         输入框和按钮相关           */
      /***********************************/

      editPlaceholder: '在此处粘贴微信文章链接', // input输入框placeholder

      editBtnText: '编辑文章', // 按钮文字

      linkData: '', // 链接地址

      /***********************************/
      /*             使用说明             */
      /***********************************/

      descriptionTitle: '使用说明：', // 使用说明标题

      descTitle1: '<p>第一步:<br/>打开准备转发的文章之后，点击屏幕右上角“三个点”的按钮</p>',

      descTitle2: '<p>第二步:<br>在弹出的菜单点选“复制链接”按钮</p>',

      descTitle3: '<p>第三步:粘贴复制好地址即可，打开量化云展业宝，在文章编辑栏粘贴复制的链接进行文章编辑转发</p>',

      descTxt4: '<p>*本次说明以iphone作为示例，所有手机用户同理此操作</p><p>*仅支持微信公众号文章</p><p>*编辑第三方文章请注意版权问题</p>',

      /***********************************/
      /*             提示弹窗             */
      /***********************************/

      dialogTxt: '请输入需要编辑的链接地址', // 提示文字

      confirmTxt: '确定' // 按钮文字
    }
  },

  computed: {
    ...mapGetters(['isShowDialog'])
  },

  methods: {
    ...mapActions(['setShowDialog']),

    /**
       * 跳转到文章编辑页面
       * @param link {string} 链接地址
       */
    jumpToPublicArticle (link) {
      // 验证链接地址有效，如果不是微信公众号文章，则给出提示
      const reg = /^(https:\/\/mp.weixin.qq.com\/).*/;
      if (link) {
        if (link.match(reg)) {
          // 获取微信公众号链接最后文章key值
          location.href = `${location.origin}/public/article?queryLink=${encodeURIComponent(this.linkData)}`
        } else {
          this.dialogTxt = '仅支持微信文章链接地址';
          this.setShowDialog(true)
        }
      } else {
        this.setShowDialog(true)
      }
    },

    /**
       * 取消弹出框
       */
    handleConfirm () {
      this.linkData = ''; // 清空输入框
      this.setShowDialog(false)
    }

  }
}
</script>

<style lang="scss" scoped>
  $bgPageColor: #EEEEEE;
  $bgContentColor: #ffffff;
  $colorB3: #333;
  $colorB9: #999;
  $editAreaBg: #f4f4f4;

  .public-home {
    padding: 0.267rem 0.4rem 0.347rem;
    background-color: $bgPageColor;
    min-height: 100vh;
    user-select: none;

    .edit-area {
      display: flex;
      align-items: center;
      height: 1.6rem;
      color:$colorB9;
      border-radius: 0.107rem;
      background-color: $bgContentColor;

      label {;
        line-height: 0.587rem;
        margin-bottom: 0.16rem;
        padding: 0 0.293rem 0 0.373rem;
        .iconfont {
          font-size: 0.293rem;
        }
      }

      input {
        width: 100%;
        padding-right: 0.373rem;
        font-size: 0.373rem;
        line-height: 0.587rem;
        border: none;
        background-color: transparent;
        user-select: text;
      }
    }

    .edit-btn {
      margin-top: 0.533rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.067rem;
      font-size: 0.373rem;
      color: $bgContentColor;
      border-radius: 0.107rem;
      background: -webkit-linear-gradient(left, #09226B, #1C52BB);
    }

    .edit-description {
      margin-top: 0.8rem;
      padding: 0.533rem 0.4rem 1.173rem;
      border-radius: 0.133rem;
      font-size: 0.373rem;
      line-height: 0.48rem;
      color: $colorB3;
      background-color: $bgContentColor;

      .desc-title {
        margin-bottom: 0.24rem;
        font-size: 0.427rem;
        font-weight: bold;
        line-height: 0.533rem;
        color: $colorB3;
      }

      .desc-part {
        position: relative;
        &:before {
          content: ' ';
          width: 0.16rem;
          height: 0.16rem;
          border-radius: 50%;
          background-color: #D02B29;
          position: absolute;
          left: -0.267rem;
          top: 0.133rem;
        }
      }

      .desc-img {
        img {
          width: 100%;
        }
      }

      .desc-4 {
        margin-top: 0.96rem;
        color: $colorB9;
      }
    }

    .dialog-content {
      position: fixed;
      z-index: 101;
      width: 80%;
      max-width: 8rem;
      top: 50%;
      left: 50%;
      padding: 0.8rem 0;
      transform: translate(-50%, -50%);
      background-color: $bgContentColor;
      text-align: center;
      border-radius: 0.107rem;
      overflow: hidden;

      .dialog-text {
        font-size: 0.48rem;
        line-height: 0.533rem;
        color: $colorB3;
      }

      .dialog-btn {
        margin: .8rem auto 0;
        width: 4.267rem;
        height: 1.067rem;
        font-size: 0.373rem;
        line-height: 1.067rem;
        color: $bgContentColor;
        border-radius: 0.107rem;
        background: -webkit-linear-gradient(left, #09226B, #1C52BB);;
      }
    }
  }

</style>
