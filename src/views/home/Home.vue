/**
*   @Project:   项目首页展示页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 15:12
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="home-outer">
    <div class="home">

      <!-- Part1:首页banner图 -->
      <div class="banner-wraper">
        <div class="banner f-pr">
          <div class="swiper-wrapper">
            <div :key="index" class="swiper-slide" v-for="(item, index) in banners">
              <img :src="item.banner_img" alt="">
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>

      <!-- Part2: 首页图标 -->
      <div class="home-guide">
        <div class="home-guide-line one-line">
          <div class="home-guide-line-item"
               v-for="(item, i) in iconLineGuides1"
               :key="i"
               @click="jumpToLink(item.iconLink)">
            <img :src="item.iconUrl" alt="">
            <p>{{item.iconDesc}}</p>
          </div>
        </div>
        <div class="home-guide-line two-line">
          <div class="home-guide-line-item" v-for="(item, i) in iconLineGuides2" :key="i">
            <img :src="item.iconUrl" alt="">
            <p>{{item.iconDesc}}</p>
          </div>
        </div>
      </div>

      <!-- Part3:用户追踪 -->
      <div class="tracking-wraper f-pr">
        <div @click="redirect('tracking')" class="touch-mask f-pa"></div>
        <div class="tracking">
          <span class="icon f-db"></span>
          <div class="box">
            <div class="swiper-wrapper">
              <div :key="index" class="swiper-slide" v-for="(item, index) in trackingList">
                <p class="text over1line">{{item.act}}</p>
              </div>
              <p class="emptytext over1line" v-if="!trackingList.length">当时暂无用户动态，快去转发文章获客吧~</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Part4:文章编辑助手  -->
      <div class="edit-assistant">
        <p class="edit-title">{{part3Text}}</p>
        <div @click="jumpToPublic" class="edit-input">
          <span class="iconfont">&#xe6c8;</span>
          <p>{{part3PlaceHolder}}</p>
        </div>
      </div>

      <!-- Part5:资讯库 -->
      <div class="info-box">
        <a-i-watch></a-i-watch>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import AIWatch from './AIWatch';
  import {getBanners, getRiding} from '../../api/news'
  import Swiper from '../../assets/js/swiper';
  import guideIcon1 from '../../assets/images/home/guide_card.png'
  import guideIcon2 from '../../assets/images/home/guide_customer.png'
  import guideIcon3 from '../../assets/images/home/guide_analysis.png'
  import guideIcon4 from '../../assets/images/home/guide_like_ban.png'
  import guideIcon5 from '../../assets/images/home/guide_manage_ban.png'
  import guideIcon6 from '../../assets/images/home/guide_pic_ban.png'
  import guideIcon7 from '../../assets/images/home/guide_knowledge_ban.png'
  import guideIcon8 from '../../assets/images/home/guide_broker_ban.png'

  export default {
    name: 'home',

    data () {
      return {
        trackingList: [],


        /***********************************/
        /*         Part2:首页图标相关        */
        /***********************************/

        iconLineGuides1: [ // 第一行图标
          {
            iconUrl: guideIcon1,
            iconDesc: '获客名片',
            iconLink: 'user_card'
          },
          {
            iconUrl: guideIcon2,
            iconDesc: '客户意向',
            iconLink: 'customer_intent'
          },
          {
            iconUrl: guideIcon3,
            iconDesc: '访客分析',
            iconLink: 'tracking'
          },
          {
            iconUrl: guideIcon4,
            iconDesc: '猜谁喜欢'
          }
        ],

        iconLineGuides2: [ // 第二行图标
          {
            iconUrl: guideIcon5,
            iconDesc: '客户管理'
          },
          {
            iconUrl: guideIcon6,
            iconDesc: '展业图库'
          },
          {
            iconUrl: guideIcon7,
            iconDesc: '券商知识库'
          },
          {
            iconUrl: guideIcon8,
            iconDesc: '券商那点事'
          }
        ],

        /***********************************/
        /*        Part3:文章编辑助手相关      */
        /***********************************/

        part3Text: '文章编辑助手', // 标题文字
        part3PlaceHolder: '在此处粘贴微信文章链接' // 输入框内文字
      }
    },

    computed: {
      ...mapGetters({
        banners: 'home/banners'
      })
    },

    activated () {
      !this.banners.length && this.init();
      this.getRidingData();
    },

    methods: {
      ...mapMutations([
        'SET_LOADING',
        'home/SET_INFOMATION',
        'home/SET_BANNERS'
      ]),

      /**
       * 初始化页面
       */
      init () {
        this['SET_LOADING']('open');
        Promise.all([
          new Promise((resolve) => {
            this.getBannersData(() => {
              resolve();
            })
          })
          /*
                    new Promise((resolve) => {
                      this.getNewsListData(() => {
                        resolve();
                      })
                    })
          */
        ]).then(() => {
          this['SET_LOADING']('close');
        })
      },

      /**
       * 获取广告列表
       * @param callback {Function} 回调函数
       */
      getBannersData (callback) {
        getBanners().then(res => {
          this['home/SET_BANNERS'](res);
          this.$nextTick(() => {
            new Swiper('.banner', {
              loop: true, // 循环模式选项
              pagination: {
                el: '.swiper-pagination'
              },
              autoplay: {
                delay: 3000
              }
            })
          });
          callback && callback(res);
        });
      },

      /**
       * 获取资讯文章列表
       * @param callback {Function} 回调函数
       */
      /*
            getNewsListData (callback) {
              getNewsList({
                page: 1,
                pageSize: 1000,
                sort: 0
              }).then(res => {
                this['home/SET_INFOMATION'](res.data);
                callback && callback(res);
              })
            },
      */

      /**
       * 获取首页跑马灯数据
       * @param callback {Function} 回调函数
       */
      getRidingData (callback) {
        getRiding().then(res => {
          if (res.length) {
            this.trackingList = res;
            this.$nextTick(() => {
              new Swiper('.tracking-wraper .box', {
                direction: 'vertical', // 垂直切换选项
                loop: true, // 循环模式选项
                slidesPerView: 2,
                autoplay: {
                  delay: 5000
                }
              })
            });
          }
          callback && callback(res);
        });
      },

      /**
       * 跳转到用户追踪（数据统计）页面
       * @param path {String} 跳转的路径
       */
      redirect (path) {
        this.$router.push({
          path: path
        });
      },

      /**
       * 跳转到文章编辑页面
       */
      jumpToPublic () {
        location.href = `${location.protocol}//${location.host}/public/home`
      },

      /**
       * icon跳转到对应页面
       * @param link {String} 路由name
       */
      jumpToLink (link) {
        if (link) {
          switch (link) {
            case 'user_card':
              location.href = '/card';
              break;
            case 'tracking':
              location.href = '/tracking';
              break;
            case 'customer_intent':
              location.href = '/customerIntent';
              break;
          }
        }
        // 不用此push方式的原因是，iphone手机的push机制不一样
        // link && this.$router.push({ name: link });
      }

    },

    components: {
      AIWatch
    }
  }
</script>
<style lang="scss">
  @import '../../styles/mixin.scss';
  @import '../../assets/css/swiper.css';

  .home-outer {
    width: 100%;
    min-height: 100vh;
    background-color: #ffffff;

    .home {
      width: 100%;
      min-height: 100vh;

      .banner-wraper {
        width: 100%;
        overflow: hidden;

        .banner {
          width: 100%;
          height: 5.066667rem;

          .swiper-wrapper {
            width: 100%;

            .swiper-slide {
              width: 100%;
              height: 100%;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .swiper-pagination {
            width: auto;
            opacity: 1;
            left: initial;
            right: .4rem;
            bottom: .266667rem;
            transform: translateX(0);

            .swiper-pagination-bullet {
              width: .133333rem;
              height: .133333rem;
              opacity: 1;
              background-color: #ffffff;
              border-radius: .066667rem;
              margin: 0;
              margin-left: .133333rem;
              transition: 0.2s;

              &.swiper-pagination-bullet-active {
                width: .32rem;
              }
            }
          }
        }
      }

      .home-guide {
        height: 3.413rem;
        border-bottom: 0.267rem solid #eeeeee;
        .home-guide-line {
          display: flex;
          height: 1.707rem;
          .home-guide-line-item {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            width: 25%;
            img {
              width: 0.72rem;
              height: 0.72rem;
            }
            p {
              margin-top: 0.16rem;
              font-size: 0.32rem;
              color: #333333;
            }

          }
        }
      }

      .tracking-wraper {
        width: 100%;
        padding: .106667rem 0;

        .touch-mask {
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 999999;
        }

        .tracking {
          width: 100%;
          display: flex;
          align-items: center;

          .icon {
            width: 1.65rem;
            height: 1.65rem;
            @include bgImage('../../assets/images/home_track');
            background-size: 100% 100%;
            margin-left: .293333rem;
            margin-right: .466667rem;
          }

          .box {
            width: 7.173333rem;
            height: 1.653333rem;
            overflow: hidden;

            .swiper-wrapper {
              height: 100%;

              .emptytext {
                line-height: 1.653333rem;
                @include font(14);
                color: #666666;
              }
            }

            .swiper-slide {
              width: 100%;
              height: .826667rem;
              display: flex;
              flex-direction: column;
              justify-content: center;

              .text {
                line-height: .826667rem;
                @include font(14);
                color: #666666;
              }
            }
          }
        }
      }

      .info-box {
        width: 100%;
      }

      /* Part3:文章编辑助手区域样式 */
      .edit-assistant {
        padding: 0 0.4rem;
        height: 2.667rem;
        background-color: #F6FAFF;
        border-top: 0.267rem solid #eeeeee;
        border-bottom: 0.267rem solid #eeeeee;

        .edit-title {
          display: flex;
          align-items: center;
          height: 1.333rem;
          font-weight: bold;
          font-size: 0.427rem;
          line-height: 0.587rem;
        }

        .edit-input {
          display: flex;
          flex-direction: row;
          padding-left: 0.373rem;
          align-items: center;
          height: 1.067rem;
          border: 1px solid #ECECEC;
          border-radius: 0.533rem;
          color: #999999;

          span {
            margin-right: 0.293rem;
            font-size: 0.293rem;
            font-weight: bold;
          }

          p {
            font-size: 0.373rem;
          }
        }
      }
    }
  }
</style>

