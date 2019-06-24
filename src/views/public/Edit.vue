/**
*   @Project:   公众号文章编辑页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/17 12:53
*   @Note:      1.只处理微信公众号文章，DOM删除操作
*               2.保存回退到文章详情页面
*/


<template>
  <div class="public-edit"
       :class="{'have-padding-top': !(linkData || isSaveFromWx)}">

    <!-- Part1: 页面预加载 -->
    <gl-page-init-loading v-if="isShowInitLoading"></gl-page-init-loading>

    <!-- Part2: 编辑提示 -->
    <div class="edit-tips"
         v-if="linkData || isSaveFromWx">
      <p>{{editTips}}</p>
    </div>

    <!-- Part3: 文章详情 -->
    <!-- Part3-1: 公众号文章展示 -->
    <div class="article-edit-content"
         v-html="renderData"
         v-if="renderData && (linkData || isSaveFromWx)">
    </div>
    <!-- Part3-2: 资讯文章展示 -->
    <div class="article-edit-wrap"
         :class="{'no-padding-top': !(linkData || isSaveFromWx)}"
         v-if="renderData && articleKey && !isSaveFromWx">
      <!-- Part3-2-1: 标题、来源、作者 -->
      <div class="article-edit-wrap-top"
           v-if="articleData">
        <h2 class="article-title">{{articleData.title}}</h2>
        <p class="source">原文由“<span>{{articleData.sources}}</span>”发布</p>
        <p class="author">作者 | <span>{{articleData.author}}</span></p>
      </div>
      <!-- Part3-2-2: 内容渲染 -->
      <div class="article-edit-wrap-content">
        <div class="article-content" v-html="renderData"></div>
      </div>
      <!-- Part3-2-3: 微信分享tip -->
      <wx-share-tip></wx-share-tip>
    </div>

    <!-- Part4: 底部按钮 -->
    <div class="article-btn">
      <p @click="handleEdit" class="btn-left">{{btnTxtLeft}}</p>
      <p @click="handleForward" class="btn-right">{{btnTxtRight}}</p>
    </div>
  </div>
</template>

<script>
  import {
    getHelperGetNewsDetail,
    getHelperGetWeChatArticle,
    postHelperAddEditedNews,
    postHelperAddWeChatArticle} from '../../api/helper'
  import {getNews} from '../../api/news';
  import {closeShare, openShare} from '../../utils/base-methods';
  import WxShareTip from '../../components/wx-share-tip';

  export default {
    name: 'public_edit',

    data () {
      return {

        linkData: this.$route.query.queryLink ? decodeURIComponent(this.$route.query.queryLink) : null, // 微信公众号地址

        articleKey: this.$route.query.key || null, // 微信文章id

        renderData: null, // 渲染文章内容的DOM,此变量用于渲染

        btnTxtLeft: '重置', // 底部左边按钮文字

        btnTxtRight: '保存并预览', // 底部右边按钮文字

        saveDom: '', // 编辑后的DOM数据

        editTips: '注：您当前正处于第三方文章编辑状态，请注意版权。', // 文章编辑提示

        isSaveFromWx: Number(this.$route.query.isSaveFromWx) === 1, // 是否来源于微信公众号

        isShowCard: this.$route.query.showCard ? String(this.$route.query.showCard) === '1' : true, // 是否显示名片，默认展示

        articleData: null, // 本地资讯文章数据

        isEdited: this.$route.query.isEdited ? String(this.$route.query.isEdited) : '0', // 是否有被编辑过

        weChatUrl: this.$route.query.weChatUrl ? decodeURIComponent(this.$route.query.weChatUrl) : null,

        isShowInitLoading: true // 是否展示渲染页面

      }
    },

    mounted () {
      // 关闭微信的分享功能，但是会保留微信的基础按钮
      closeShare();

      // 如果有微信key，就获取微信key值文章数据，否则获取微信文章url的DOM
      this.articleKey
        ? (this.isSaveFromWx
          ? this.getArticleData()
          : this.getNews())
        : this.getPublicDom();
    },

    methods: {

      /**
       * 获取微信文章公众号的DOM
       */
      getPublicDom () {
        getHelperGetWeChatArticle({
            url: this.linkData
          }).then(res => {
            this.renderData = res.content; // 本地变量赋值
          });
      },

      /**
       * 获取资讯文章数据
       */
      getNews () {
        getNews({
          key: this.$route.query.key || null,
          from_type: this.$route.query.from_type || null,
          from_id: this.$route.query.from_id || null,
          promote_id: this.$route.query.promoteId || null,
          agent_id: this.$route.query.agentId || null,
          is_weChat: Boolean(this.$route.query.is_weChat) || 0,
          is_edited: String(this.$route.query.isEdited) || '0'
          }).then(res => {
            this.renderData = res.news && res.news.content; // 本地变量赋值
            this.articleData = {};
            this.articleData.title = res.news && res.news.title; // 标题名称
            this.articleData.sources = res.news && res.news.sources; // 标题来源
            this.articleData.author = res.news && res.news.author; // 标题作者
          });
      },

      /**
       * 根据key值获取资讯文章内容
       */
      getArticleData () {
        getHelperGetNewsDetail({
          key: this.articleKey
        }).then(res => {
          this.renderData = res.content;
        });
      },

      /**
       * 上传修改之后的DOM数据
       */
      postPublicDom () {
        postHelperAddWeChatArticle({
          content: this.saveDom,
          wechat_url: this.weChatUrl || this.linkData
        }).then(res => {
          this.isShowInitLoading = false;
          this.articleKey = res.key;
          location.href = `${location.protocol}//${location.host}/public/article?key=${this.articleKey}&weChatUrl=${encodeURIComponent(this.weChatUrl)}&isSaveFromWx=${this.isSaveFromWx ? 1 : 0}&isEdited=1&showCard=${this.isShowCard ? '1' : '0'}`
        })
      },

      /**
       * 添加编辑后资讯文章
       */
      postEditedNews () {
        postHelperAddEditedNews({
          content: this.saveDom,
          key: this.articleKey
        }).then(() => {
          this.isShowInitLoading = false;
          // location.href = `${location.protocol}//${location.host}/article?key=${this.articleKey}&agentId=${this.$route.query.agentId}&from_type=${this.$route.query.from_type}&from_id=${this.$route.query.from_id}&isSaveFromWx=${this.isSaveFromWx ? 1 : 0}&isEdited=1`;

          let hrefUrl = `${location.protocol}//${location.host}/article?key=${this.articleKey}&agentId=${this.$route.query.agentId}&from_type=${this.$route.query.from_type}&from_id=${this.$route.query.from_id}&isSaveFromWx=${this.isSaveFromWx ? 1 : 0}&isEdited=1&showCard=${this.isShowCard ? '1' : '0'}`;

          this.$route.query.source && (hrefUrl += `&source=${this.$route.query.source}`);

          location.href = hrefUrl;
        })
      },

      /**
       * 点击左侧（编辑按钮），重置原始DOM
       */
      handleEdit () {
        this.renderData = null;
        this.articleKey
          ? (this.isSaveFromWx
            ? this.getArticleData()
            : this.getNews())
          : this.getPublicDom()
      },

      /**
       * 点击右侧（保存并预览）
       */
      handleForward () {
        this.isShowInitLoading = true;
        // 处理删除后的DOM,并保存变量，传参数据到服务端,
        // 注意处理场景：点击段落，但是未删除
        // 所以保存前需要删除所有的边框删除样式
        const selectedTarget = document.querySelectorAll('.select-target');
        const selectedBtn = document.querySelectorAll('.select-btn');
        if (selectedTarget.length) {
          for (let i = 0; i < selectedTarget.length; i++) {
            selectedTarget[i].style.border = 'none';
          }
        }
        if (selectedBtn.length) {
          for (let i = 0; i < selectedBtn.length; i++) {
            selectedBtn[i].remove();
          }
        }
        if (this.articleKey && !this.isSaveFromWx) {
          let res = document.querySelector('.article-content').innerHTML;
          this.saveDom = res;
          this.postEditedNews();
        } else {
          let res = document.querySelector('.article-edit-content').innerHTML;
          this.saveDom = `<!DOCTYPE html>\n<html>${res}</html>`;
          this.postPublicDom();
        }
      },

      /**
       * DOM的处理操作
       */
      initDOM () {
        // 初始化，开启事件监听
        let handleContent = '';
        if (this.articleKey && !this.isSaveFromWx) {
          handleContent = document.querySelector('.article-content');
          handleContent.style.fontSize = '0.373rem';
          handleContent.style.lineHeight = '1.5';
          //
          const images = handleContent.querySelectorAll('img');
          for (let i = 0; i < images.length; i++) {
            images[i].style.maxWidth = '100%';
            images[i].style.height = 'auto';
          }
        } else {
          handleContent = document.querySelector('.rich_media_content')
        }

        // 只对微信公账号的文章内容进行DOM操作监听
        handleContent.addEventListener('click', (event) => {
          // 点击事件之前先清除所有选择项(边框和删除按钮)
          const selectedTarget = document.querySelectorAll('.select-target');
          const selectedBtn = document.querySelectorAll('.select-btn');
          if (selectedTarget.length) {
            for (let i = 0; i < selectedTarget.length; i++) {
              selectedTarget[i].style.border = 'none';
            }
          }
          if (selectedBtn.length) {
            for (let i = 0; i < selectedBtn.length; i++) {
              selectedBtn[i].remove();
            }
          }

          // 清除文档流边框，为了显示点击按钮
          if (this.articleKey && !this.isSaveFromWx) {
            if (this.isEdited !== '1') {
              document.querySelector('.article-content').style.overflow = 'visible';
            }
          } else {
            document.querySelector('.rich_media_content').style.overflow = 'visible';
          }

          // 目标元素、父级元素、按钮元素
          const targetDom = event.target;
          const btnDom = document.createElement('div');

          // 处理段落DOM删除
          findClosePDom(targetDom);

          /**
           * 递归获取目标元素的最近的父级p元素,并设置删除dom展示
           * @param dom {string} 需要处理的DOM元素
           */
          function findClosePDom (dom) {
            if (dom.nodeName !== 'P' &&
              dom.nodeName !== 'DIV' &&
              dom.nodeName !== 'SECTION' &&
              dom.nodeName !== 'BLOCKQUOTE' &&
              dom.nodeName !== 'H1' &&
              dom.nodeName !== 'H2' &&
              dom.nodeName !== 'H3' &&
              dom.nodeName !== 'H4' &&
              dom.nodeName !== 'H5' &&
              dom.nodeName !== 'H6' &&
              dom.nodeName !== 'UL' &&
              dom.nodeName !== 'OL' &&
              dom.nodeName !== 'DL') {
              if (dom.parentElement.nodeName === 'P') {
                doDeleteShow(dom.parentElement);
                return dom.parentElement
              } else {
                findClosePDom(dom.parentElement);
              }
            } else {
              if (dom.className.indexOf('rich_media_content') < 0) {
                doDeleteShow(dom);
                return dom;
              }
            }
          }


          /**
           * 显示删除段落样式的Dom操作
           * @param dom {string} 需要处理的DOM元素
           */
          function doDeleteShow (dom) {
            // 设置目标样式，边框，为防止样式覆盖，以此方式书写
            dom.style.border = '1px solid red';
            dom.style.position = 'relative';
            dom.style.boxSizing = 'border-box';
            dom.classList.add('select-target');

            // 插入按钮元素
            dom.insertBefore(btnDom, dom.self);
            btnDom.classList.add('select-btn');


            // 设置按钮样式，边框，为防止样式覆盖，以此方式书写
            btnDom.style.position = 'absolute';
            btnDom.style.top = '-10px';
            btnDom.style.right = '-10px';
            btnDom.style.width = '20px';
            btnDom.style.height = '20px';
            btnDom.style.borderRadius = '50%';
            btnDom.style.background = 'url("/static/images/public_delete.png")';
            btnDom.style.backgroundSize = 'cover';
            btnDom.style.zIndex = '1';

            // 监听到点击按钮，删除目标Dom
            btnDom.addEventListener('click', () => {
              dom.parentElement.removeChild(dom);
            })
          }
        })
      }

    },

    components: {WxShareTip},

    watch: {
      // 初始化渲染完成之后的DOM
      renderData (v) {
        this.isShowInitLoading = false;

        v && this.$nextTick(() => {
          this.initDOM();
        })
      }
    },

    beforeDestroy () {
      // 打开微信的分享功能
      openShare();
    }

  }
</script>

<style lang="scss" scoped>
  $bgColor: #EEEEEE;
  $white: #ffffff;
  $blue: #1C52BB;
  $colorB3: #333333;
  $colorB9: #999999;

  .public-edit {
    min-height: 100vh;
    padding: 0 0.427rem 1.28rem;
    background-color: $bgColor;
    font-size: 0.373rem;

    /* IOS 11支持,此处兼容处理 */
    @supports (bottom: constant(safe-area-inset-bottom)){
      padding-bottom: calc(1.467rem + constant(safe-area-inset-bottom));
    }
    /*IOS 11.2+版本版本支持 */
    @supports (bottom: env(safe-area-inset-bottom)){
      padding-bottom: calc(1.467rem + env(safe-area-inset-bottom));
    }

    &.have-padding-top {
      padding-top: 0.427rem;
    }

    .edit-tips {
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      display: flex;
      justify-content: left;
      align-items: center;
      width: 100vw;
      height: 0.96rem;
      background-color: $bgColor;
      p {
        font-size: 0.373rem;
        letter-spacing: 1px;
        line-height: 0.48rem;
        color: $colorB9;
        padding-left: 0.4rem;
      }

    }

    .article-edit-content {
      margin-top: 0.96rem;
      width: 100%;
      overflow: hidden;
      background-color: $white;
    }

    .article-edit-wrap {
      margin-top: 0.96rem;
      width: 100%;
      overflow: hidden;
      background-color: $white;

      &.no-padding-top {
        margin-top: 0;
      }

      .article-edit-wrap-top {
        padding: 0.4rem;
        .article-title {
          line-height: .72rem;
          color: #282828;
          font-size: 0.587rem;
        }
        .source {
          margin-top: 0.613rem;
          font-size: 0.32rem;
          span {
            color: #084ec2;
          }
        }
        .author {
          margin-bottom: 0.613rem;
          font-size: 0.32rem;
          span {
            color: #084ec2;
          }
        }
      }

      .article-edit-wrap-content {
        padding: 0 0.4rem;
        img {
          max-width: 100%;
          height: auto;
        }
      }

    }


    .article-btn {
      display: flex;
      flex-direction: row;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1.173rem;
      background-color: #ffffff;
      /* IOS 11.2+ 版本版本支持 */
      @supports (bottom: env(safe-area-inset-bottom)){
        padding-bottom: env(safe-area-inset-bottom);
      }
      /* IOS 11支持,此处做兼容 */
      @supports (bottom: constant(safe-area-inset-bottom)) {
        padding-bottom: constant(safe-area-inset-bottom);
      }

      p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.373rem;
      }

      p.btn-left {
        width: 2.4rem;
        color: $colorB3;
        border-top: 0.027rem solid #EEEEEE;
        background-color: $white;
      }

      p.btn-right {
        flex: auto;
        color: $white;
        background-color: $blue;
      }
    }

  }
</style>
