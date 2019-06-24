/**
*   @Project:   资讯文章页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 14:49
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="bd-article-outer"
       :class="{'no-card-area': !isShowCard}">

    <!-- Part1: 预加载页 -->
    <gl-page-init-loading v-if="loadingVisible"></gl-page-init-loading>

    <!-- Part2: 内容 -->
    <div :class="{
      'hide': !isLogin && $route.query.from_type !== '0',
      'padding-bottom': $route.query.from_type !== '0'}"
         class="bd-article">

      <!-- Part2-1: 个人名片信息 -->
      <div class="mp"
           v-if="($route.query.from_type === '0' && isShowCard)
           || ($route.query.from_type === '1' && agentInfo.user_name && isShowCard)
           || ($route.query.from_type === '2' && agentInfo.user_name && isShowCard)">
        <NameCard :enableEdit="$route.query.from_type === '0'" :info="agentInfo"></NameCard>
      </div>

      <!-- Part2-1-add: AI Tips -->
      <div class="ai-tips"
           :class="{'hidden-card': !isShowCard}"
           v-if="source && $route.query.from_type === '0'">
        <p class="tag">{{tipTag}}</p>
        <p class="gap"></p>
        <p class="text">{{tipText}}</p>
      </div>

      <!-- Part2-2-1: 文章内容（微信公众号文章） -->
      <div class="article-content-main"
           v-html="news.content"
           v-if="isSaveFromWx">
      </div>

      <!-- Part2-2-2: 文章内容（资讯库文章） -->
      <div class="article-content-wraper" v-else>
        <h2 class="article-title">{{news.title}}</h2>
        <div class="author-wraper">
          <p class="source">
            原文由“<span class="name">{{news.sources}}</span>”发布
          </p>
          <p class="author">
            作者 | <span class="name">{{news.author}}</span>
          </p>
        </div>
        <div class="article-content" ref="articleContent" v-html="news.content">
          文章
        </div>
      </div>

      <!-- Part2-3: 文章广告列表 -->
      <ul class="product-list">
        <a :href="news.ad_one_goal_url || 'javascript:;'"
           class="p-member-o f-db"
           v-if="news.ad_one_url">
          <li class="p-member">
            <img :src="news.ad_one_url">
          </li>
        </a>
        <a :href="news.ad_two_goal_url || 'javascript:;'"
           class="p-member-o f-db"
           v-if="news.ad_two_url">
          <li class="p-member">
            <img :src="news.ad_two_url">
          </li>
        </a>
      </ul>

      <!-- Part2-4: 微信分享提示 -->
      <div class="wx-share-tip-area"
           v-if="$route.query.from_type === '0'">
        <wx-share-tip></wx-share-tip>
      </div>

      <!-- Part2-5: 投诉按钮 3.2.x add -->
      <div class="complaint-btn-area"
           @click="jumpToComplaint">
        <p>投诉</p>
      </div>
    </div>

    <!-- Part3-1: 底部按钮，代理商 -->
    <div class="btn"
         v-if="$route.query.from_type === '0'">
      <p @click="handleLeft" class="btn-left">编辑</p>
      <p @click="handleShowOrCard" class="btn-left btn-show-card">{{isShowCard ? '隐藏' : '显示'}}名片</p>
      <p @click="shadowVisible = true" class="btn-right">转发获客</p>
    </div>
    <!-- Part3-2: 底部按钮，非代理商 -->
    <div class="btn-2"
         v-else
         :class="{'hide': !isLogin && $route.query.from_type !== '0'}">
      <div class="btn-2-left">
        <div class="avatar">
          <img :src="agentInfo.avatar_url" alt="">
        </div>
        <div class="info">
          <div class="name">
            <p>{{agentInfo.user_name}}</p>
            <p>{{infoTxt1}}</p>
          </div>
          <span class="position"><span>{{agentInfo.position}}</span></span>
        </div>
      </div>
      <div class="btn-2-right">
        <div class="phone" @click="onCallPhone">
          <svg :class="icon-shouji" aria-hidden="true">
            <use xlink:href="#icon-shouji"></use>
          </svg>
          <p>{{infoTxt2}}</p>
        </div>
        <div class="gap" v-if="agentInfo.wx_qrcode_url"></div>
        <div class="we-chat"
             v-if="agentInfo.wx_qrcode_url"
             @click.prevent.stop="popupVisible = true">
          <svg :class="icon-weixin" aria-hidden="true">
            <use xlink:href="#icon-weixin"></use>
          </svg>
          <p>{{infoTxt3}}</p>
        </div>
      </div>
    </div>

    <!-- Part4: 提示遮罩层 -->
    <div @click="shadowVisible = false"
         class="notice-shadow"
         v-if="shadowVisible">
    </div>

    <!-- Part5: 二维码弹出框 -->
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
      <div class="wx-code-wraper">
        <img :src="agentInfo.wx_qrcode_url" alt="">
      </div>
    </mt-popup>

  </div>
</template>
<script>
  import wx from 'weixin-js-sdk';
  import {mapMutations} from 'vuex';
  import {getNews, postAddNewsTime, postNewsShareStats} from '../../api/news'
  import {handleAuth, randomInt, removeHtmlTag} from '../../utils/base-methods';
  import NameCard from '../../components/name-card';
  import WxShareTip from '../../components/wx-share-tip';
  import {DEFAULT_SHARE_IMAGES, DEFAULT_SHARE_COMPOUND_URL} from '../../utils/const';

  export default {
    data () {
      return {
        news: {},
        agentInfo: {},
        wxConfig: {},
        isLogin: false,
        randid: '', // 更新阅读时间传递的id
        shareUserId: '',
        timer: 0, // 轮询，记录阅读时间
        shadowVisible: false,
        loadingVisible: true,

        isSaveFromWx: String(this.$route.query.isSaveFromWx) === '1', // 是否来源于微信公众号文章
        isEdited: String(this.$route.query.isEdited) === '1',
        source: this.$route.query.source, // 来源，preWatch盘前观测；posWatch复盘总结
        tipText: '', // AI 智能看盘提示
        tipTag: '', // AI 智能看盘提示标签

        isShowCard: this.$route.query.showCard ? String(this.$route.query.showCard) === '1' : true, // 是否显示名片，默认展示
        shareDesc: '', // 分享描述

        /*************************************/
        /*       底部分享之后非代理商显示信息      */
        /*************************************/
        infoTxt1: '为您推荐',
        infoTxt2: '联系我',
        infoTxt3: '加我微信',
        popupVisible: false // 微信二维码弹窗
      }
    },

    created () {
      // 赋值ai tips 内容
      switch (this.source) {
        case 'preWatch':
          this.tipTag = 'AI筛选';
          this.tipText = '分享早报，追踪客户访问记录';
          break;
        case 'posWatch':
          this.tipTag = 'AI复盘';
          this.tipText = '分享资讯，追踪客户访问记录';
          break;
        default:
          break;
      }

      this.getNewsData(() => {
        // 是否已经登录过了？没有登录过的话需要先跳转
        if (!this.isLogin && this.$route.query.from_type !== '0') {
          handleAuth({
            appid: process.env.WX_APPID,
            redirectUrl: `${process.env.BASE_URL}/api/third/wechat/login`,
            url: encodeURIComponent(window.location.href)
          });
        }
        // 获取文章的描述
        this.$nextTick(() => {
          let desc = '';
          if (!this.isSaveFromWx) {
            desc = this.$refs.articleContent.getElementsByTagName('p')[0]
              ? this.$refs.articleContent.getElementsByTagName('p')[0].innerText
              : '量化云展业宝 微信号：gh_12d6fc402473';
          } else {
            const descDom = document.querySelector('.article-content-main').querySelector('p');
            let descTxt = removeHtmlTag(descDom.innerHTML);
            desc = descTxt || '量化云展业宝 微信号：gh_12d6fc402473';
          }
          this.shareDesc = desc;
          this.getNewsShareInfo(desc);
          setTimeout(() => {
            this.loadingVisible = false;
          }, 1000);
        });
        if (this.$route.query.from_type !== '0' && this.randid > 0) {
          // 计算阅读的时间
          this.timer = setInterval(() => {
            this.addReadNewsTime();
          }, 5000);
        }
      });
    },

    methods: {
      ...mapMutations([
        'SET_LOADING' // 设置加载动画
      ]),

      /**
       * 获取文章详情信息
       * @param callback {Function} 回调方法
       */
      getNewsData (callback) {
        getNews({
          key: this.$route.query.key ? this.$route.query.key : null,
          from_type: this.$route.query.from_type ? this.$route.query.from_type : null,
          from_id: this.$route.query.from_id ? this.$route.query.from_id : null,
          promote_id: this.$route.query.promoteId ? this.$route.query.promoteId : null,
          agent_id: this.$route.query.agentId ? this.$route.query.agentId : null,
          is_edited: this.isSaveFromWx ? '0' : (this.isEdited ? '1' : '0'),
          url: location.href.split('#')[0]
        }).then(res => {
          this.news = res.news;
          this.agentInfo = res.agent;
          this.wxConfig = res.wx_config;
          this.isLogin = Boolean(res.user_info.is_login);
          this.randid = res.user_info.rand_id;
          this.shareUserId = res.user_info.user_id;
          callback && callback();
          this.listenClickImg(); // 监听图片点击放大

          // 设置投诉内容到localStorage
          const articleInfo = {
            articleTitle: res.news.title,
            articleKey: this.news.key,
            articleUrl: this.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)],
            agentId: this.agentInfo.agent_id,
            userId: res.user_info.user_id,
            jumpLink: encodeURIComponent(location.href)
          };
          sessionStorage.removeItem('articleInfo');
          sessionStorage.setItem('articleInfo', JSON.stringify(articleInfo));
        }).catch(() => {
          location.href = '/error-illegal'
        });
      },


      /**
       * 统计观看时长
       */
      addReadNewsTime () {
        postAddNewsTime({rand_id: this.randid});
      },


      /**
       * 获取文章分享相关微信配置
       * @param desc {String} 分享描述内容
       */
      getNewsShareInfo (desc) {
        /* 转发的经纪商和读者之间的逻辑关系 */
        // `from_type` 用户来源类型，1：代理商；2：非代理商。（用户）；0：代理商自己阅读
        // `from_id` 用户id，如果是代理商就是agentid，如果是非代理商（用户），就是user_id
        // 用户转发url：http://bdtest.1quant.me/article?key=c00b9b6ecb074f9ac429ad04729af266&agentId=7&from_type=2&from_id=6002
        let [url, preFromId, preFromType, fromType] = ['', this.$route.query.from_id, this.$route.query.from_type, ''];
        if (preFromType === '0') {
          url = location.href.replace('from_type=0', 'from_type=1');
          fromType = '1';
        } else if (preFromType === '1') {
          url = location.href.replace('from_type=1', 'from_type=2').replace(`from_id=${preFromId}`, `from_id=${this.shareUserId}`);
          fromType = '2';
        } else {
          url = location.href.replace(`from_id=${preFromId}`, `from_id=${this.shareUserId}`);
          fromType = preFromType;
        }
        url = url.replace('&source=preWatch', ''); // 分享去除ai提示
        url = url.replace('&source=posWatch', ''); // 分享去除ai提示

        // 处理是否显示名片
        if (url.indexOf('showCard') > -1) {
          url = url.replace(/&showCard=[0|1]/, `&showCard=${this.isShowCard ? '1' : '0'}`);
        } else {
          url += `&showCard=${this.isShowCard ? '1' : '0'}`
        }

        // 分享成功后的统计回调
        const shareSuccess = () => {
          postNewsShareStats({
            from_type: fromType,
            from_id: this.$route.query.from_id,
            key: this.news.key,
            agent_id: this.$route.query.agentId,
            user_id: this.shareUserId
          })
        };
        // 复盘文章固定分享图片
        const shareUrl = this.source === 'posWatch'
          ? (this.news.article_url || DEFAULT_SHARE_COMPOUND_URL)
          : (this.news.article_url || DEFAULT_SHARE_IMAGES[randomInt(1, 7)]);
        // 配置微信分享
        this.shareList(this.news.title, shareUrl, desc, url, shareSuccess);
      },


      /**
       * 处理编辑
       */
      handleLeft () {
        const queryObj = {
          key: this.$route.query.key,
          agentId: this.$route.query.agentId,
          from_type: this.$route.query.from_type,
          from_id: this.$route.query.from_id,
          isEdited: this.$route.query.isEdited ? String(this.$route.query.isEdited) : '0',
          showCard: this.isShowCard ? '1' : '0'
        };
        this.source && (queryObj.source = this.source); // 如果有ai智能看盘，才传此值
        this.$router.push({
          name: 'public_edit',
          query: queryObj
        })
      },

      /**
       * 处理是否显示/隐藏名片
       */
      handleShowOrCard () {
        this.isShowCard = !this.isShowCard;
        // 配置微信分享
        this.getNewsShareInfo(this.shareDesc);
      },

      /**
       * 调用拨号功能
       */
      onCallPhone () {
        window.location.href = `tel://${this.agentInfo.phone}`
      },

      /**
       * 监听点击图片方法
       */
      listenClickImg () {
        const handleContent = document.querySelector('.article-content') || document.querySelector('.article-content-main');
        if (handleContent) {
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
          });
        }
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

    beforeDestroy () {
      clearInterval(this.timer);
    }
  }
</script>

<style lang="scss">
  @import '../../styles/mixin.scss';

  $bgColor: #EEEEEE;
  $white: #ffffff;
  $blue: #1C52BB;
  $colorB3: #333333;

  .bd-article-outer {
    width: 100%;
    height: 100%;
    background-color: #eeeeee;

    &.no-card-area {
      padding-top: .373rem;
    }

    & > .bd-article {
      width: 100%;
      padding-bottom: 1.467rem;
      background-color: #EEEEEE;
      overflow-x: hidden;

      &.padding-bottom {
        padding-bottom: 1.44rem;
      }
      &.hide {
        opacity: 0;
      }

      .mp {
        width: 100%;
        padding: .266667rem .4rem .853333rem;
        box-sizing: border-box;
      }

      & > .article-content-wraper {
        padding: .266667rem .4rem 0;
        margin: 0 0.373rem;
        box-sizing: border-box;
        border-top-left-radius: 0.133rem;
        border-top-right-radius: 0.133rem;
        background-color: #ffffff;

        .article-title {
          line-height: .72rem;
          color: #282828;
          @include font(22);
        }

        .author-wraper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 2.08rem;
          @include font(12);

          p {
            line-height: .426667rem;
          }

          .name {
            color: #084ec2;
          }
        }

        & > .article-content {
          width: 100%;
          padding-bottom: .853333rem;
          border-bottom: 1px solid #E2E2E2;

          img {
            max-width: 100%;
            height: auto !important;
          }

          p, div {
            @include font(14);
            line-height: 1.5;
            word-wrap: break-word;
          }
        }
      }

      & > .ai-tips {
        display: flex;
        align-items: center;
        height: 0.48rem;
        margin: -0.267rem 0.373rem 0.533rem;

        &.hidden-card {
          margin-top: 0.16rem;
        }

        .tag {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.2rem;
          height: 0.427rem;
          font-size: 0.32rem;
          color: #F5871B;
          font-weight: bold;
          border: 0.027rem solid #F5871B;
        }

        .gap {
          width: 0.027rem;
          height: 0.373rem;
          margin: 0 0.187rem;
          background-color: #666666;
        }

        .text {
          font-size: 0.373rem;
          color: #666666;
        }

      }

      & > .article-content-main {
        padding: .266667rem .4rem 0;
        box-sizing: border-box;
      }

      & > .product-list {
        margin: 0 0.373rem;
        background-color: #ffffff;
        padding: .72rem .4rem;
        box-sizing: border-box;

        .p-member-o {
          width: 100%;
          border-radius: .133333rem;
          margin-bottom: .426667rem;
          overflow: hidden;

          .p-member {
            width: 100%;

            img {
              width: 100%;
            }
          }

          &:last-child {
            margin: 0;
          }
        }
      }

      & > .wx-share-tip-area {
        margin: 0 0.373rem;
      }

      & > .complaint-btn-area {
        width: 1.067rem;
        height: 1.067rem;
        font-size: 0.347rem;
        line-height: 1.067rem;
        color: #1C52BB;
        padding-left: 0.64rem;
      }

      & > .code-wraper {
        width: 100%;
        background-color: #eeeeee;
        padding: .586667rem 0;

        .code {
          width: 5.866667rem;
          background-color: #ffffff;
          padding: .533333rem 0;
          margin: 0 auto;

          .image {
            width: 3.386667rem;
            height: 3.386667rem;
            margin: 0 auto;
          }

          .notice {
            margin-top: .213333rem;

            .para {
              @include font(15);
              color: #444444;
              text-align: center;
            }
          }
        }
      }
    }
  }

  .btn {
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 1;
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

  .btn-2 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 1.44rem;
    background-color: #ffffff;
    border-top: 0.027rem solid #EEEEEE;
    /* IOS 11.2+ 版本版本支持 */
    @supports (bottom: env(safe-area-inset-bottom)){
      padding-bottom: env(safe-area-inset-bottom);
    }
    /* IOS 11支持,此处做兼容 */
    @supports (bottom: constant(safe-area-inset-bottom)) {
      padding-bottom: constant(safe-area-inset-bottom);
    }
    &.hide {
      opacity: 0;
    }
    .btn-2-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 0.427rem;
      .avatar {
        display: flex;
        width: 1.067rem;
        height: 1.067rem;
        border-radius: 50%;
        background-image: url("../../assets/images/avatar_default.png");
        background-size: contain;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        margin-left: 0.48rem;
        .name {
          display: flex;
          flex-direction: row;
          margin-top: 0.293rem;
          font-size: 0.347rem;
          line-height: 0.453rem;
          color: #333333;
          & > p:nth-of-type(1) {
            display: block;
            max-width: 1.733rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .position {
          display: flex;
          margin-bottom: 0.16rem;
          span {
            padding: 0.08rem 0.16rem;
            max-width: 2.667rem;
            font-size: 0.32rem;
            line-height: 0.373rem;
            color: #999999;
            border: 1px solid #F0F0F0;
            border-radius: 0.107rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

    }
    .btn-2-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-right: 0.373rem;
      .phone, .we-chat {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        svg {
          width: 0.64rem;
          height: 0.64rem;
        }
        p {
          padding-top: 0.08rem;
          font-size: 0.32rem;
          color: #999999;
          line-height: 0.373rem;
        }
      }
      .gap {
        margin: 0 0.427rem 0 0.613rem;
        width: 0.027rem;
        height: 0.667rem;
        background-color: #F0F0F0;
      }

    }
  }

  .notice-shadow {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    @include bgImage('../../assets/images/notice_shadow');
    background-size: 100% 100%;
    z-index: 999999;
  }

  .mint-popup {
    border-radius: .266667rem;
    overflow: hidden;
  }
  .wx-code-wraper {
    width: 6.666667rem;
    height: 6.666667rem;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 5.333333rem;
      max-height: 100%;
    }
  }
</style>


