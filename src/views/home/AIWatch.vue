/**
*   @Project:   智能看盘，2个tab栏
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 16:23
*   @Note:
*/


<template>
  <div class="ai-watch-outer">
    <div class="ai-watch">
      <div class="area-title">
        智能看盘
      </div>
      <div class="content">
        <ul class="tab">
          <li :class="{active: item.value === tabType}"
              :key="index"
              @click="tabType = item.value"
              class="f-pr tab-member"
              v-for="(item, index) in tabList">
            {{item.label}}
          </li>
        </ul>
        <div class="noData" v-if="!preWatchData && isFinishQuest">
          暂无数据
        </div>

        <div class="watch-list" v-else>
          <!-- 盘前观测 -->
          <div class="ai-watch-item" v-if="Number(tabType) === 0">
            <!-- 正常显示 -->
            <div class="ai-watch-wrap"
                 @click="jumpToArticle(preWatchData.detail.key, 'preWatch')"
                 v-if="preWatchData && preWatchData.detail && String(preWatchData.trading_day) === '1'">
              <div class="ai-watch-content">
                <div class="content-part1">
                  <p class="tag">AI筛选</p>
                  <p class="gap"></p>
                  <p class="date" v-if="preWatchData.current_date">
                    {{preWatchData.current_date.today}}{{preWatchData.current_date.week}}</p>
                </div>
                <p class="content-part2" v-if="preWatchData.detail">{{preWatchData.detail.title}}</p>
                <p class="content-desc" v-if="preWatchData.detail">{{preWatchData.detail.description}}</p>
                <p class="content-part3" v-if="preWatchData.detail && preWatchData.detail.stats">
                  分享文章，今日已获客{{preWatchData.detail.stats.view_num}}人</p>
              </div>
            </div>

            <!-- 数据整理中 -->
            <div class="ai-watch-sort-out ai-watch-abnormal" v-if="preWatchData && !preWatchData.detail && String(preWatchData.trading_day) === '1'">
              <img src="../../assets/images/home/zyb-symbol.png" alt="">
              <p class="tips" v-if="preWatchData.current_date">
                数据整理中 {{preWatchData.current_date.year}}{{preWatchData.current_date.today}}</p>
            </div>

            <!-- 非交易日 -->
            <div class="ai-watch-no-deal ai-watch-abnormal" v-if="preWatchData && String(preWatchData.trading_day) !== '1'">
              <img src="../../assets/images/home/zyb-symbol.png" alt="">
              <p class="tips">当前为非交易日</p>
            </div>
          </div>

          <!-- 复盘总结 -->
          <div class="ai-watch-item" v-if="Number(tabType) === 1">
            <!-- 上一交易日提示 -->
            <p class="pos-watch-tip"
               v-if="String(posWatchData.is_trading_day) === '0' && posWatchData.detail">当前为上一交易日数据</p>
            <!-- 正常显示 -->
            <div class="ai-watch-wrap"
                 @click="jumpToArticle(posWatchData.detail.key, 'posWatch')"
                 v-if="posWatchData && posWatchData.detail">
              <div class="ai-watch-content">
                <div class="content-part1">
                  <p class="tag">AI复盘</p>
                  <p class="gap"></p>
                  <p class="date" v-if="posWatchData.current_date">
                    {{posWatchData.current_date.today}}{{posWatchData.current_date.week}}</p>
                </div>
                <p class="content-part2" v-if="posWatchData.detail">{{posWatchData.detail.title}}</p>
                <p class="content-desc" v-if="posWatchData.detail">{{posWatchData.detail.description}}</p>
                <p class="content-part3" v-if="posWatchData.detail && posWatchData.detail.stats">
                  分享观点，今日已获客{{posWatchData.detail.stats.view_num}}人</p>
              </div>
            </div>

            <!-- 这个交易日数据整理中 -->
            <div class="ai-watch-sort-out ai-watch-abnormal"
                 v-if="posWatchData && !posWatchData.detail && String(posWatchData.is_trading_day) === '1'">
              <img src="../../assets/images/home/zyb-symbol.png" alt="">
              <p class="tips" v-if="posWatchData.current_date">
                数据整理中 {{posWatchData.current_date.year}}{{posWatchData.current_date.today}}</p>
            </div>

            <!-- 上一个交易日数据缺失 -->
            <div class="ai-watch-sort-out ai-watch-abnormal"
                 v-if="posWatchData && !posWatchData.detail && String(posWatchData.is_trading_day) === '0'">
              <img src="../../assets/images/home/zyb-symbol.png" alt="">
              <p class="tips" v-if="posWatchData.current_date">
                数据缺失 {{posWatchData.current_date.year}}{{posWatchData.current_date.today}}</p>
            </div>

          </div>

        </div>


      </div>
    </div>
  </div>
</template>
<script>
  import {mapMutations, mapGetters} from 'vuex';
  import {getWatchCompoundDetail, getWatchMorningMarketDetail} from '../../api/ai-watch';
  import {isEmptyObj} from '../../utils/base-methods'

  export default {
    data () {
      return {
        preWatchData: {}, // 盘前数据

        posWatchData: {}, // 盘后数据

        tabList: [ // tab栏
          {label: '盘前精选', value: '0'},
          {label: '复盘总结', value: '1'}
        ],

        tabType: '0',

        tagGroup: {
          1: '已授权可转发',
          2: '已授权可转发',
          3: '原创'
        },

        isFinishQuest: false, // 是否请求完成

        isEmptyObj
      }
    },

    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },

    mounted () {
      // 首次获取盘前观测数据
      this.getWatchPreviewData();
    },

    methods: {
      ...mapMutations([
        'SET_LOADING'
      ]),

      /**
       * 获取盘前观测
       */
      getWatchPreviewData () {
        this['SET_LOADING']('open');
        getWatchMorningMarketDetail({}).then(res => {
          this.isFinishQuest = true;
          this['SET_LOADING']('close');
          // 先判断trading_day是否为1，是则当天是交易日，否则今天不是交易日,显示非交易日
          // 如果是交易日，但是detail为空，则显示正在整理数据，否则正常显示
          this.preWatchData = res;
        })
      },

      /**
       * 获取复盘总结
       */
      getWatchSumData () {
        this['SET_LOADING']('open');
        getWatchCompoundDetail({}).then(res => {
          this.isFinishQuest = true;
          this['SET_LOADING']('close');
          // 先判断is_trading_day是否为1，是，则代表今天是交易日并且有数据，否则代表显示的是上一个交易日的数据
          // 如果是交易日，detail为空，则数据处理中，否则正常显示
          // 如果是上一个交易日，detail为空，则数据缺失，否则正常显示
          this.posWatchData = res;
        })
      },

      /**
       * 跳转到资讯文章详情页
       * @param key {String} 文章key值
       * @param source {String} 文章来源
       */
      jumpToArticle (key, source) {
        location.href = `${location.origin}/article?key=${key}&agentId=${this.userInfo.agent.agent_id}&from_type=0&from_id=${this.userInfo.agent.agent_id}&source=${source}`
      }

    },

    watch: {
      tabType (newVal) {
        switch (Number(newVal)) {
          case 0:
            isEmptyObj(this.preWatchData) && this.getWatchPreviewData();
            break;
          case 1:
            isEmptyObj(this.posWatchData) && this.getWatchSumData();
            break;
          default:
            break;
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .ai-watch-outer {
    width: 100%;

    .ai-watch {
      width: 100%;

      .area-title {
        width: 100%;
        height: 1.013333rem;
        line-height: 1.013333rem;
        color: #262626;
        @include font(14);
        font-weight: bold;
        text-indent: .4rem;

        &::after {
          content: '';
          display: block;
          width: 100%;
          height: .08rem;
          background-color: #f3f3f3;
        }
      }

      .content {
        width: 100%;

        .noData {
          padding-top: .933333rem;
        }

        .watch-list {
          padding: 0.24rem 0.373rem;
          .pos-watch-tip {
            padding: 0.213rem 0 0.453rem;
            font-size: 0.4rem;
            color: #DA3237;
            text-align: center;
          }
          .ai-watch-wrap {
            /*height: 2.667rem;*/
            background-color: #EDF5FF;
            padding: 0.187rem;
            .ai-watch-content {
              display: flex;
              flex-flow: column;
              justify-content: space-evenly;
              padding: 0.373rem 0.373rem;
              height: 100%;
              border: 0.027rem solid rgba(28, 82, 187, .2);

              .content-part1 {
                display: flex;
                align-items: center;
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
                .date {
                  font-size: 0.373rem;
                  color: #666666;
                }
              }

              .content-part2 {
                margin-top: 0.347rem;
                font-size: 0.427rem;
                color: #282828;
                line-height: 0.48rem;
                font-weight: bold;
              }

              .content-desc {
                margin-top: 0.24rem;
                font-size: 0.373rem;
                color: #333333;
                line-height: 0.427rem;
              }

              .content-part3 {
                margin-top: 0.48rem;
                font-size: 0.32rem;
                color: #787878;
              }

            }
          }

          .ai-watch-abnormal {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 2.667rem;
            img {
              width: 1.333rem;
              height: 1.333rem;
            }
            p {
              padding-left: 9px;
              font-size: 16px;
              color: #666666;
            }

          }
        }

        .tab {
          width: 100%;
          height: .933333rem;
          border-bottom: 1px solid #e2e2e2;
          display: flex;
          justify-content: space-between;

          .tab-member {
            width: 50%;
            height: .933333rem;
            line-height: .933333rem;
            color: #666666;
            @include font(14);
            padding: 0 .4rem;
            text-align: center;

            &.active {
              color: #084ec2;

              &::after {
                content: '';
                display: block;
                width: .533333rem;
                height: .053333rem;
                position: absolute;
                background-color: #084ec2;
                border-radius: .04rem;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
              }
            }
          }
        }

        .info-list {
          width: 100%;
          background-color: #ffffff;
          padding-top: .933333rem;

          .i-member {
            width: 100%;
            height: 2.72rem;
            border-bottom: 1px solid #e2e2e2;
            box-sizing: border-box;
            padding: .333333rem .4rem;

            &:last-child {
              border: none;
            }

            .wraper {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .mes {
                width: 6.08rem;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                  width: 100%;
                  line-height: .586667rem;
                  @include font(16);
                  font-weight: bold;
                }

                .tag-wraper {
                  display: flex;

                  .tag {
                    @include font(10);
                    color: #084ec2;
                    padding: .026667rem .066667rem;
                    border: 1px solid #084ec2;
                  }
                }

                .date-readandrep {
                  color: #787878;
                  @include font(12);
                  line-height: .453333rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  .readandrep {
                    display: flex;

                    .read {
                      margin-right: .24rem;
                    }
                  }
                }
              }

              .image {
                width: 2.533333rem;
                height: 1.813333rem;
                border-radius: .066667rem;

                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
