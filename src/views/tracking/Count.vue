/**
*   @Project:   用户追踪统计区域
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:48
*   @Note:
*/


<template>
  <div class="count-outer">
    <div class="count">
      <div class="sac-wraper">
        <ul class="sac">
          <li class="s-member">
            <p>本周查看</p>
            <p>{{countInfo.current_week_count}}</p>
          </li>
          <li class="s-member">
            <p>较上周</p>
            <div class="chg">
              <span :class="{up: parseInt(countInfo.current_week_count - countInfo.last_week_count) >= 0, down: parseInt(countInfo.current_week_count - countInfo.last_week_count) < 0}"
                    class="icon f-db">
              </span>
              <span class="val">{{parseInt(countInfo.current_week_count - countInfo.last_week_count)}}</span>
            </div>
          </li>
          <li class="s-member">
            <p>累计用户 {{countInfo.user_count}}</p>
            <p>累计分享 {{countInfo.forward_count}}</p>
          </li>
        </ul>
      </div>
      <CountList :list="countList"></CountList>
    </div>
  </div>
</template>
<script>
  import {getTrackUserStatistics, getTrackUserStatisticsList} from '../../api/news';
  import {mapMutations} from 'vuex';
  import CountList from './CountList';

  export default {
    data () {
      return {
        countInfo: {},
        countList: []
      }
    },

    created () {
      this['SET_LOADING']('open');
      Promise.all([
        new Promise(resolve => {
          this.getCountInfo(() => {
            resolve();
          })
        }),
        new Promise(resolve => {
          this.getCountList(() => {
            resolve();
          })
        })
      ]).then(() => {
        this['SET_LOADING']('close');
      });
    },

    methods: {
      ...mapMutations(['SET_LOADING']),

      /**
       * 用户追踪的统计数据
       * @param callback {Function} 回调函数
       */
      getCountInfo (callback) {
        getTrackUserStatistics().then(res => {
          this.countInfo = res;
          callback && callback();
        });
      },

      /**
       * 用户追踪的统计数据列表
       * @param callback {Function} 回调函数
       */
      getCountList (callback) {
        getTrackUserStatisticsList().then(res => {
          this.countList = res;
          callback && callback();
        });
      }

    },

    components: {
      CountList
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .count-outer {
    width: 100%;

    .count {
      width: 100%;

      .sac-wraper {
        width: 100%;
        padding: .24rem 0 .106667rem;
        border-bottom: 1px solid #E2E2E2;

        .sac {
          width: 100%;
          display: flex;

          .s-member {
            flex: 1;

            p, .chg {
              width: 100%;
              line-height: .826667rem;
              text-align: center;
              @include font(16);
              color: #333333;
            }

            .chg {
              display: flex;
              align-items: center;
              justify-content: center;
              height: .826667rem;

              .icon {
                width: .293333rem;
                height: .4rem;
                background-size: 100% 100%;
                margin-right: .133333rem;
                margin-bottom: .066667rem;

                &.up {
                  @include bgImage('../../assets/images/arrow_up');
                }

                &.down {
                  @include bgImage('../../assets/images/arrow_down');
                }
              }
            }

            &:last-child {
              flex: 1.5;

              p {
                text-align: left;
                text-indent: .666667rem;
              }
            }
          }
        }
      }
    }
  }
</style>
