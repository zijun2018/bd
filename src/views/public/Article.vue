/**
*   @Project:   微信公众号文章展示页
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/17 13:44
*   @Note:      1.实现纯渲染展示，与编辑页面分离
*               2.此处文章来源有两种：1）用户粘贴链接；2）保存之后后台返回的文章地址
*/


<template>
  <div class="public-article">

    <!-- Part1: 用户名片 -->
    <div class="user-card"
         v-if="isShowCard">
      <NameCard :info="userInfo && userInfo.agent"></NameCard>
    </div>

    <!-- Part2-1: 文章详情 -->
    <div class="article-content"
         v-html="renderData"
         v-if="renderData">
    </div>

    <!-- Part2-2: 微信分享提示 -->
    <wx-share-tip v-if="renderData"></wx-share-tip>

    <!-- Part2-3: 投诉按钮 3.2.x add -->
    <div class="complaint-btn-area"
         v-if="renderData"
         @click="jumpToComplaint">
      <p>投诉</p>
    </div>


    <!-- Part3: 底部按钮 -->
    <div class="article-btn">
      <p @click="handleEdit" class="btn-left">{{btnTxtLeft}}</p>
      <p @click="handleShowOrCard" class="btn-left btn-show-card">{{isShowCard ? '隐藏' : '显示'}}名片</p>
      <p @click="handleForward" class="btn-right">{{btnTxtRight}}</p>
    </div>

    <!-- Part4: 蒙层展示 -->
    <div @click="hiddenShadow"
         class="public-shadow"
         v-show="isShowShadow"></div>

  </div>
</template>

<script>
  import NameCard from '../../components/name-card';
  import WxShareTip from '../../components/wx-share-tip';
  import {mapGetters, mapMutations} from 'vuex';
  import {
    getHelperGetNewsDetail,
    getHelperGetWeChatArticle,
    postHelperAddWeChatArticle} from '../../api/helper'
  import {isEmptyObj, removeHtmlTag, handleAuth, randomInt} from '../../utils/base-methods';
  import {getNews, postNewsShareStats} from '../../api/news'
  import {DEFAULT_SHARE_IMAGES} from '../../utils/const';
  import {Toast} from 'mint-ui'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'public_article',

    data () {
      return {

        linkData: this.$route.query.queryLink ? decodeURIComponent(this.$route.query.queryLink) : null, // 微信公众号地址

        articleKey: this.$route.query.key || null, // 微信文章id

        renderData: null, // 渲染文章内容的DOM,此变量用于渲染

        btnTxtLeft: '编辑', // 底部左边按钮文字

        btnTxtRight: '转发获客', // 底部右边按钮文字

        isShowShadow: false, // 是否展示转发蒙层

        weChatUrl: this.$route.query.weChatUrl ? decodeURIComponent(this.$route.query.weChatUrl) : null, // 公众号链接地址，同articleKey

        userInfoData: {}, // 本地保存的用户登录信息

        shareDesc: '量化云展业宝 微信号：gh_12d6fc402473', // 分享描述，默认

        agentInfo: {}, // 代理人信息

        wxConfig: {}, // 微信分享配置

        isLogin: false, // 是否已登录

        randid: '', // 更新阅读时间传递的id

        shareUserId: '', // 分享人的用户id

        agentId: '', // 代理人id

        shareTitle: '', // 分享标题

        shareUrl: '', // 分享地址

        shareImg: '', // 分享图片

        isSaveFromWx: this.$route.query.weChatUrl || this.$route.query.queryLink ? 1 : 0,

        isGetNewsFinish: false, // 是否完成了getNews请求，配置微信分享，只有完成微信配置，才可以进行页面跳转

        isShowCard: this.$route.query.showCard ? String(this.$route.query.showCard) === '1' : true // 是否显示名片，默认展示

      }
    },

    computed: {
      ...mapGetters(['userInfo'])
    },

    created () {
      // 实现页面用户登录健全
      if (isEmptyObj(this.userInfo)) {
        // 未登录，跳转登录
        handleAuth({
          appid: process.env.WX_APPID,
          redirectUrl: `${process.env.BASE_URL}/api/third/wechat/login`,
          url: encodeURIComponent(window.location.href)
        })
      } else {
        // 已登录，页面保存登录信息
        this.userInfoData = this.userInfo;

        // 开启加载动画
        this['SET_LOADING']('open');

        // 如果有微信key，就获取微信key值文章数据，否则获取微信文章url的DOM
        this.articleKey
          ? this.getArticleData(() => {
            // 由于路由采用push模式，其实这里的微信分享是无效的！也就是预览页面->编辑页面->预览页面，始终用的是第一次getPublicDom的分享配置
            // 无效为何不删？ 那是因为，如果页面跳转采用location模式，这里便可生效
            getNews({
              key: this.articleKey,
              from_type: '0',
              from_id: this.userInfoData.agent.agent_id || '0',
              agent_id: this.userInfoData.agent.agent_id || '0',
              is_edited: this.$route.query.isEdited || '0',
              url: location.href.split('#')[0]
            }).then(response => {
              // 是否完成了getNews接口请求, 这里需要注意的是：
              this.isGetNewsFinish = true;
              // 关闭加载动画
              this['SET_LOADING']('close');

              this.shareUrl = `${location.protocol}//${location.host}/article?key=${this.articleKey}&from_type=1&from_id=${this.userInfoData.agent.agent_id}&agentId=${this.userInfoData.agent.agent_id}&isSaveFromWx=${this.isSaveFromWx}&showCard=${this.isShowCard ? '1' : '0'}`;

              // 配置微信分享
              this.agentInfo = response.agent; // 保存代理人信息
              this.isLogin = Boolean(response.user_info.is_login); // 保存是否登录状态
              this.shareTitle = response.news.title; // 分享标题
              this.shareImg = response.news.article_url; // 分享图片
              this.agentId = response.agent.agent_id; // 代理人id
              this.shareUserId = response.user_info.user_id; // 用户id
              this.wxConfig = response.wx_config; // 微信配置
              this.randid = response.user_info.rand_id; // 更新阅读时间传递的id

              const shareSuccess = () => {
                this.isShowShadow = false; // 关闭转发提示蒙层
                postNewsShareStats({
                  from_type: '1',
                  from_id: this.userInfoData.agent.agent_id || '0',
                  key: this.articleKey,
                  agent_id: response.agent.agent_id,
                  user_id: response.user_info.user_id
                })
              };
              this.shareList(response.news.title, response.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)], this.shareDesc, this.shareUrl, shareSuccess);

              // 设置投诉内容到localStorage
              const articleInfo = {
                articleTitle: response.news.title,
                articleKey: this.articleKey,
                articleUrl: response.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)],
                userId: response.user_info.user_id,
                agentId: response.agent.agent_id,
                jumpLink: encodeURIComponent(location.href)
              };
              sessionStorage.removeItem('articleInfo');
              sessionStorage.setItem('articleInfo', JSON.stringify(articleInfo));
            })
          })
          : this.getPublicDom(() => {
            // 这里要先保存微信公众号数据，再getNews获取微信配置信息
            // 保存公众号数据获取文章key
            postHelperAddWeChatArticle({
              content: this.renderData,
              wechat_url: this.weChatUrl || this.linkData
            }).then(res => {
              this.articleKey = res.key; // 拿到key值，再去获取wx_config

              this.shareUrl = `${location.protocol}//${location.host}/article?key=${res.key}&from_type=1&from_id=${this.userInfoData.agent.agent_id}&agentId=${this.userInfoData.agent.agent_id}&isSaveFromWx=${this.isSaveFromWx}&showCard=${this.isShowCard ? '1' : '0'}`;

              getNews({
                key: res.key,
                from_type: '0',
                from_id: this.userInfoData.agent.agent_id || '0',
                agent_id: this.userInfoData.agent.agent_id || '0',
                is_edited: this.$route.query.isEdited || '0',
                url: location.href.split('#')[0]
              }).then(response => {
                  // 是否完成了getNews接口请求
                  this.isGetNewsFinish = true;
                // 关闭加载动画
                this['SET_LOADING']('close');

                  // 配置微信分享
                  this.shareTitle = response.news.title;
                  this.agentInfo = response.agent; // 保存代理人信息
                  this.isLogin = Boolean(response.user_info.is_login); // 保存是否登录状态
                  this.shareUserId = response.user_info.user_id; // 用户id
                  this.agentId = response.agent.agent_id; // 代理人id
                  this.wxConfig = response.wx_config; // 微信配置
                  this.randid = response.user_info.rand_id; // 更新阅读时间传递的id
                  this.shareImg = response.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)];

                const shareSuccess = () => {
                  this.isShowShadow = false; // 关闭转发提示蒙层
                  postNewsShareStats({
                    from_type: '1',
                    from_id: this.userInfoData.agent.agent_id || '0',
                    key: this.articleKey,
                    agent_id: response.agent.agent_id,
                    user_id: response.user_info.user_id
                  })
                };
                this.shareList(this.shareTitle, this.shareImg, this.shareDesc, this.shareUrl, shareSuccess);

                // 设置投诉内容到localStorage
                const articleInfo = {
                  articleTitle: response.news.title,
                  articleKey: this.articleKey,
                  articleUrl: response.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)],
                  userId: response.user_info.user_id,
                  agentId: response.agent.agent_id,
                  jumpLink: encodeURIComponent(location.href)
                };
                sessionStorage.removeItem('articleInfo');
                sessionStorage.setItem('articleInfo', JSON.stringify(articleInfo));
                }
              )
            })
          });
      }
    },

    methods: {
      ...mapMutations([
        'SET_LOADING'
      ]),

      /**
       * 获取微信文章公众号的DOM
       */
      getPublicDom (configWXShare) {
        getHelperGetWeChatArticle({
          url: this.linkData
        }).then(res => {
          this.renderData = res.content; // 本地变量赋值
          this.weChatUrl = res.url;

          // 保证获取微信公众号文章不为空
          if (res.content) {
            // 此处进行回调处理，配置微信分享
            configWXShare && configWXShare();
          } else {
            this['SET_LOADING']('close');
            // 弹出提示
            Toast({
              message: '返回内容为空,请刷新页面',
              duration: 2000
            })
          }
        })
      },

      /**
       * 点击左侧（编辑按钮），跳转到编辑页面
       */
      handleEdit () {
        if (this.isGetNewsFinish) {
          this.articleKey
            ? this.$router.push({
              name: 'public_edit',
              query: {key: this.articleKey, isSaveFromWx: '1', showCard: (this.isShowCard ? '1' : '0'), weChatUrl: encodeURIComponent(this.weChatUrl)}
            })
            : this.$router.push({
              name: 'public_edit',
              query: {queryLink: encodeURIComponent(this.linkData), showCard: (this.isShowCard ? '1' : '0'), weChatUrl: encodeURIComponent(this.weChatUrl)}
            });
        }
      },

      /**
       * 处理是否显示/隐藏名片
       */
      handleShowOrCard () {
        this.isShowCard = !this.isShowCard;
        // 处理是否显示名片
        if (this.shareUrl.indexOf('showCard') > -1) {
          this.shareUrl = this.shareUrl.replace(/&showCard=[0|1]/, `&showCard=${this.isShowCard ? '1' : '0'}`);
        } else {
          this.shareUrl += `&showCard=${this.isShowCard ? '1' : '0'}`
        }
        // 配置微信分享
        const shareSuccess = () => {
          this.isShowShadow = false; // 关闭转发提示蒙层
          postNewsShareStats({
            from_type: '1',
            from_id: this.userInfoData.agent.agent_id || '0',
            key: this.articleKey,
            agent_id: this.agentId,
            user_id: this.shareUserId
          })
        };
        this.shareList(this.shareTitle, this.shareImg, this.shareDesc, this.shareUrl, shareSuccess);
      },

      /**
       * 点击右侧（转发获客）
       */
      handleForward () {
        this.isShowShadow = true;
      },

      /**
       * 上传修改之后的DOM数据
       */
      postPublicDom () {
        postHelperAddWeChatArticle({
          content: this.renderData,
          wechat_url: this.weChatUrl || this.linkData
        }).then(res => {
          this.articleKey = res.key; // 保存key值
        })
      },

      /**
       * 根据微信key值获取文章内容
       */
      getArticleData (configWXShare) {
        getHelperGetNewsDetail({
          key: this.articleKey
        }).then(res => {
          this.renderData = res.content;
          configWXShare && configWXShare();
        });
      },

      /**
       * 隐藏转发获客蒙层
       */
      hiddenShadow () {
        this.isShowShadow = false;
      },

      /**
       * 监听点击图片方法
       */
      listenClickImg () {
        const handleContent = document.querySelector('.article-content');
        handleContent.addEventListener('click', (event) => {
          if (event.target.nodeName !== 'IMG') {
            return;
          }
          let imgArr = [];
          imgArr.push(event.target.src);
          wx.previewImage({
            current: event.target.src,
            urls: imgArr
          })
        })
      },

      /**
       * 跳转到投诉管理
       */
      jumpToComplaint () {
        location.href = `${location.protocol}//${location.host}/complaintReasonList`
      }
    },

    components: {
      NameCard,
      WxShareTip
    },

    watch: {
      // 初始化渲染完成之后的DOMs
      renderData (v) {
        v && this.$nextTick(() => {
          this.listenClickImg();

          // 获取分享内容文本
          // 获取第一段P标签，拿取里面的纯文本，如果为空，赋值为产品给的默认分享描述
          let desc = '';
          if (document.querySelector('.rich_media_content')) {
            const descDom = document.querySelector('.rich_media_content').querySelector('p');
            desc = removeHtmlTag(descDom.innerHTML);
          } else {
            desc = '';
          }
          this.shareDesc = desc || '量化云展业宝 微信号：gh_12d6fc402473';
        })
      }
    }

  }
</script>

<style lang="scss" scoped>
  $bgColor: #EEEEEE;
  $white: #ffffff;
  $blue: #1C52BB;
  $colorB3: #333333;
  $colorB9: #999999;


  .public-article {
    height: 100%;
    padding: 0.267rem 0.427rem 1.28rem;
    background-color: $bgColor;
    /* IOS 11支持,此处兼容处理 */
    @supports (bottom: constant(safe-area-inset-bottom)){
      padding-bottom: calc(1.467rem + constant(safe-area-inset-bottom));
    }
    /*IOS 11.2+版本版本支持 */
    @supports (bottom: env(safe-area-inset-bottom)){
      padding-bottom: calc(1.467rem + env(safe-area-inset-bottom));
    }

    .article-content {
      margin-top: 0.293rem;
      width: 100%;
      overflow: hidden;
      background-color: $white;
    }

    .complaint-btn-area {
      width: 1.067rem;
      height: 1.067rem;
      font-size: 0.347rem;
      line-height: 1.067rem;
      color: #1C52BB;
      padding-left: 0.267rem;
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

      p.btn-show-card {
        background-color: #E4F0FF;
        color: #1C52BB;
      }

      p.btn-right {
        flex: auto;
        color: $white;
        background-color: $blue;
      }
    }

    .public-shadow {
      width: 100vw;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: url('../../assets/images/notice_shadow.png');
      background-size: 100% 100%;
      z-index: 10;
    }

  }


</style>
