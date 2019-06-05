/**
*   @Project:   获客名片主页
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/24 10:32
*   @Note:      此页面只做展示，编辑页在CardEdit页面
*/

<template>
  <div class="mine-card" v-wechat-title="this.title">
    <!-- Part-0: 页面预加载 -->
    <gl-page-init-loading
      v-if="isShowInitLoading"></gl-page-init-loading>

    <!-- Part1: 名片 -->
    <div class="name-card-wrap">
      <name-card :info="agentInfo"
                 :enableEdit="!this.$route.query.key"></name-card>
    </div>

    <!-- Part2: 按钮 -->
    <div class="card-btn-wrap">
      <div class="card-btn-1 card-btn"
           v-if="!this.$route.query.key"
           @click="jumpToCardEdit">
        <p>编辑名片</p>
      </div>
      <div class="card-btn-2 card-btn"
           v-if="!this.$route.query.key"
           @click="showShadow">
        <p>分享名片获客</p>
      </div>
    </div>

    <!-- Part3: 名片内容 -->
    <div class="card-content-wrap">
      <!-- Part3-1: 个人简介 -->
      <div class="card-content-part card-content-part1">
        <p class="head-title">个人简介</p>
        <p class="part-content"
           :class="{'part-content-info': userInfo && userInfo.agent && userInfo.agent.person_info}">{{userBrief}}</p>
      </div>
      <!-- Part3-2: 公司简介 -->
      <div class="card-content-part card-content-part2">
        <p class="head-title">公司简介</p>
        <p class="part-content"
           :class="{'part-content-info':userInfo && userInfo.agent && userInfo.agent.company_info}">{{companyBrief}}</p>
      </div>
      <!-- Part3-3: 专业证书 -->
      <div class="card-content-part card-content-part3">
        <p class="head-title">专业证书</p>
        <div class="part-content"
             :class="professionImg ? 'upload-img' : 'upload-default'">
          <p v-if="!professionImg">{{professionBrief}}</p>
          <img :src="professionImg" alt="">
        </div>
      </div>
    </div>

    <!-- Part4: 获客蒙层 -->
    <div @click="hiddenShadow"
         class="get-custom-shadow"
         v-show="isShowShadow">
    </div>
  </div>
</template>

<script>
  import NameCard from '../../components/name-card';
  import {getAgentUserInfo, postAgentAddCardToNews, postAddNewsTime} from '../../api/agent';
  import {getNews, postNewsShareStats} from '../../api/news'
  import {mapGetters, mapMutations} from 'vuex';
  import {handleAuth} from '../../utils/base-methods';


  export default {
    name: 'MineCard',

    components: {NameCard},

    data () {
      return {
        /****************************************************/
        /*                  页面渲染数据相关                   */
        /****************************************************/

        agentInfo: {}, // 代理人信息

        title: '', // 初始进入页面显示获客名片，分享出去之后显示xxx的获客名片

        userBrief: '请输入您的个人简介', // 个人简介默认信息

        companyBrief: '请输入您的公司简介', // 公司简介默认信息

        professionBrief: '暂未上传图片 点击编辑名片上传哦~', // 专业证书暂未上传默认提示

        professionImg: '', // 专业证图片

        isShowShadow: false, // 是否展示获客蒙层

        isShowInitLoading: true, // 是否展示页面加载动画

        timer: '', // 计算阅读时长的定时器

        /****************************************************/
        /*                  微信相关配置变量                   */
        /****************************************************/

        shareTitle: '', // 分享标题，格式：xxx的电子名片，望惠存

        shareImg: '', // 分享图片，名片头像

        shareDesc: '', // 分享描述，现版本给空

        shareUrl: '', // 分享地址

        /****************************************************/
        /*                      路由相关变量                   */
        /****************************************************/

        key: this.$route.query.key || null, // 名片key值，类同与文章key

        fromType: this.$route.query.from_type || '0', // 用户来源类型1：代理商；2：非代理商。（用户）',0：为代理商从公众号分享的，不要上报日志

        fromId: this.$route.query.from_id || null, // 用户id,如果是代理商就是agent_id,如果是非代理商（用户）,就是user_id

        agentId: this.$route.query.agent_id || null, // 代理人id

        userId: this.$route.query.agent_id || null, // 用户id

        randId: '', // 统计观看时长传递的id

        url: location.href.split('#')[0] // 要分享的链接,即当前url

      }
    },

    computed: {
      ...mapGetters(['userInfo'])
    },

    mounted () {
      this.initPage();
    },

    methods: {
      ...mapMutations([
        'SET_USERINFO'
      ]),

      /**
       * 初始化页面
       */
      async initPage () {
        // 如果有key值就根据key值获取里面的名片信息，如果没有key值就展示用户自己的名片信息
        if (this.key) {
          // 他人名片分享信息获取
          this.isShowInitLoading = true;
          await this.getNewsInfo();
        } else {
          // 调用获取用户信息的接口跳转登录
          await this.getUserInfoData();
          this.isShowInitLoading = false;
        }

        // 分享名片信息赋值
        this.shareTitle = `${this.agentInfo.user_name}的电子名片，望惠存`; // 个人姓名
        this.shareImg = this.agentInfo.avatar_url; // 个人头像
        // 配置微信分享
        this.setWXShareConfig();
      },

      /**
       * 获取用户信息,这个接口也可以判断用户是否登录
       * 如果没有登录，会跳转到登录页面，然后再回来,添加名片到资讯库
       */
      async getUserInfoData () {
        let res = await getAgentUserInfo(); // 获取代理人信息
        let addRes = await postAgentAddCardToNews(); // 将名片添加至资讯库，用于统计

        // 动态设置微信title
        this.title = `获客名片`;

        res.agent.person_info && (this.userBrief = res.agent.person_info); // 个人简介赋值
        res.agent.company_info && (this.companyBrief = res.agent.company_info); // 公司简介赋值
        res.agent.certificate && (this.professionImg = res.agent.certificate); // 证书信息赋值

        this.key = addRes.key; // 名片key值
        this.fromType = '1'; // 代理商
        this.agentId = res.agent.agent_id; // 代理人id
        this.fromId = res.agent.agent_id; // 用户id,代理商等同与agentId
        this.userId = '0'; // 用户id
        this.agentInfo = res.agent; // 名片信息
      },

      /**
       * 设置微信分享配置
       */
      setWXShareConfig () {
          /* 转发的经纪商和读者之间的逻辑关系 */
          // `from_type` 用户来源类型，1：代理商；2：非代理商。（用户）；0：为代理商从公众号分享的，不要上报日志
          // `from_id` 用户id，如果是代理商就是agentid，如果是非代理商（用户），就是user_id
          // 用户转发url：http://bdtest.1quant.me/article?key=c00b9b6ecb074f9ac429ad04729af266&agentId=7&from_type=2&from_id=6002
        let url = '';
        let fromType = '';
        if (this.$route.query.key) {
          let [preFromId, preFromType] = [this.fromId, this.fromType];
          if (preFromType === '0') {
            url = location.href.replace('from_type=0', 'from_type=1');
            fromType = '1';
          } else if (preFromType === '1') {
            url = location.href.replace('from_type=1', 'from_type=2').replace(`from_id=${preFromId}`, `from_id=${this.userId}`);
            fromType = '2';
          } else {
            url = location.href.replace(`from_id=${preFromId}`, `from_id=${this.userId}`);
            fromType = preFromType;
          }
        } else {
          url = `${location.href}/?key=${this.key}&from_type=${this.fromType}&from_id=${this.fromId}&agent_id=${this.agentId}`;
          fromType = '1';
        }

          const shareSuccess = () => {
            postNewsShareStats({
              key: this.key,
              from_type: fromType,
              from_id: this.fromId || this.userId,
              agent_id: this.agentInfo.agent_id,
              user_id: this.userId
            })
          };
          this.shareList(this.shareTitle, this.shareImg, '量化云展业宝 微信号：gh_12d6fc402473', url, shareSuccess);
      },

      /**
       * 显示获客蒙层
       */
      showShadow () {
        this.isShowShadow = true;
      },

      /**
       * 隐藏获客蒙层
       */
      hiddenShadow () {
        this.isShowShadow = false;
      },

      /**
       * 跳转到获客名片编辑
       */
      jumpToCardEdit () {
        location.href = '/card-edit';
      },

      /**
       * 获取代理人名片信息
       */
      async getNewsInfo () {
        // 根据key值，获取文章（名片）信息
        let res = await getNews({
          key: this.key,
          agent_id: this.agentId,
          from_type: this.fromType,
          from_id: this.fromId,
          url: this.url
        });
        // 动态设置微信title
        this.title = `${res.agent && res.agent.user_name}的名片`;

        this.isShowInitLoading = false; // 关闭加载动画
        this.agentInfo = res.agent; // 代理人信息赋值
        this.userId = res.user_info.user_id; // 用户id
        this.randId = res.user_info.rand_id; // 阅读传递的id
        this.userBrief = res.agent.person_info; // 个人简介赋值
        this.companyBrief = res.agent.company_info; // 公司简介赋值
        this.professionImg = res.agent.certificate; // 证书信息赋值

        // 计算阅读的时间
        this.timer = setInterval(() => {
          this.addReadNewsTime();
        }, 5000);

        res &&
        res.user_info &&
        !Number(res.user_info.is_login) &&
        String(this.fromType) !== '0' &&
        this.checkUserWXAuth(); // 如果未授权需要先授权，条件为，用户并且未授权
      },

      /**
       * 检测是否是微信转发，如果不是微信转发（包括代理商和非代理商），则需要用户微信授权
       */
      async checkUserWXAuth () {
        handleAuth({
          appid: process.env.WX_APPID,
          redirectUrl: `${process.env.BASE_URL}/api/third/wechat/login`,
          url: encodeURIComponent(window.location.href)
        });
      },

      /**
       * 统计观看时长
       */
      addReadNewsTime () {
        postAddNewsTime({rand_id: this.randId});
      }

    },

    beforeDestroy () {
      clearInterval(this.timer); // 清除定时器
    }
  }
</script>

<style scoped lang="scss">
  $base-color: #1C52BB;
  .mine-card {

    .name-card-wrap {
      padding-top: 0.267rem;
    }

    .card-btn-wrap {
      display: flex;
      justify-content: center;
      margin: 0.693rem 0;
      .card-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.16rem;
        width: 4rem;
        height: 0.88rem;
        p {
          font-size: 0.373rem;
        }
        border-radius: 0.48rem;
      }
      .card-btn-1 {
        p {
          color: $base-color;
        }
        border: 1px solid $base-color;
      }
      .card-btn-2 {
        p {
          color: #ffffff;
        }
        border: 1px solid $base-color;
        background-color: $base-color;
      }
    }

    .card-content-wrap {
      padding: 0 0.373rem;
      .card-content-part {
        &:not(:last-of-type) {
          margin-bottom: 1.2rem;
        }
        margin-bottom: 0.88rem;
        .head-title {
          font-size: 0.427rem;
          line-height: 0.693rem;
          color: #333333;
          border-bottom: 1px solid #E2E2E2;
        }
        .part-content {
          margin-top: 0.267rem;
          font-size: 0.347rem;
          color: #999999;
          line-height: 0.453rem;

          &.part-content-info {
            font-size: 0.373rem;
            color: #666666;
            line-height: 0.56rem;
          }
          img {
            height: 100%;
            max-width: 100%;
          }
        }
        .upload-default {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0.373rem auto 0.88rem;
          width: 8.053rem;
          height: 4.8rem;
          background: url("../../assets/images/card_upload_bg.png");
          background-size: cover;
        }
        .upload-img {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0.373rem auto 0.88rem;
          width: 8.053rem;
          height: 4.8rem;
          background: #F3F3F3;
          background-size: cover;
        }
      }
    }

    .get-custom-shadow {
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
