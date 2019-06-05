/**
*   @Project:   用户追钟转发页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:52
*   @Note:
*/

<template>
  <div class="forward-outer">
    <div class="forward">
      <div class="sort-wraper">
        <ul class="sort">
          <li @click="sortChange('time')" class="s-member time">
            <div class="text">时间</div>
            <span :class="sort.time" class="f-db icon"></span>
          </li>
          <li @click="sortChange('check')" class="s-member check">
            <div class="text">查看次数</div>
            <span :class="sort.check" class="f-db icon"></span>
          </li>
        </ul>
      </div>
      <ul class="list">
        <li :key="index" class="l-member" v-for="(item, index) in dataList">
          <div class="avatar">
            <img :src="item.avatar_url" alt="" class="img f-db">
          </div>
          <div class="mes">
            <p class="name">{{item.user_name}}</p>
            <p class="desc">转发了我的 《{{item.title}}》 文章</p>
            <p class="date-duration">
              <span class="date">查看{{item.view_num}}</span>
              <span class="position">{{customerType[item.is_direct]}}</span>
              <span class="duration">{{item.created_at}}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {getTrackForwardList} from '../../api/news';
  import {deepClone} from '../../utils/base-methods';
  import {mapMutations} from 'vuex';

  export default {
    data () {
      return {
        dataList: [],
        cacheDataList: [],
        customerType: {
          1: '直接客户',
          0: '间接客户'
        },
        sort: {
          time: 'descending', // 时间  ascending | descending
          check: 'normal' // 查看次数 ascending | descending
        }
      }
    },
    created () {
      this.getForwardInfo();
    },
    methods: {
      getForwardInfo () {
        this['SET_LOADING']('open');
        getTrackForwardList().then(res => {
          this['SET_LOADING']('close');
          this.cacheDataList = deepClone(res);
          this.dataList = deepClone(res);
          // 默认按查看次数降序
          this.arrSort('timedescending', this.dataList);
        });
      },
      sortChange (type) {
        let sortType = '';
        if (this.sort[type] !== 'descending') {
          this.sort[type] = 'descending'
          sortType = `${type}descending`
        } else {
          this.sort[type] = 'ascending'
          sortType = `${type}ascending`
        }
        for (let i in this.sort) {
          i !== type && (this.sort[i] = 'normal');
        }
        // 读取缓存数据
        this.dataList = deepClone(this.cacheDataList);
        // 排序
        this.arrSort(sortType, this.dataList);
      },
      // 对比方法
      arrSort (type, arr) {
        function proCompare (property) {
          return function (a, b) {
            var value1 = a[property] - 0;
            var value2 = b[property] - 0;
            return (value1 - value2);
          };
        }

        switch (type) {
          case 'timedescending':
            arr.sort(proCompare('unix_created_at')).reverse();
            break;
          case 'timeascending':
            arr.sort(proCompare('unix_created_at'));
            break;
          case 'checkdescending':
            arr.sort(proCompare('view_num')).reverse();
            break;
          case 'checkascending':
            arr.sort(proCompare('view_num'));
            break;
          default:
            break;
        }
      },
      ...mapMutations(['SET_LOADING'])
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .forward-outer {
    width: 100%;
    height: 100%;

    .forward {
      width: 100%;
      height: 100%;

      .sort-wraper {
        width: 100%;

        .sort {
          width: 100%;
          border-bottom: 1px solid #E2E2E2;
          display: flex;
          justify-content: center;

          .s-member {
            display: flex;
            align-items: center;

            .text {
              line-height: .8rem;
              @include font(12);
              color: #666666;
            }

            .icon {
              width: .213333rem;
              height: .266667rem;
              background-size: 100% 100%;
              margin-left: .346667rem;

              &.normal {
                @include bgImage('../../assets/images/sort_arrow_nor');
              }

              &.ascending {
                @include bgImage('../../assets/images/sort_arrow_up');
              }

              &.descending {
                @include bgImage('../../assets/images/sort_arrow_down');
              }
            }
          }

          .s-member.check {
            margin-left: 2.16rem;
          }
        }
      }

      .list {
        width: 100%;
        height: 100%;

        .l-member {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #E2E2E2;

          .avatar {
            height: 100%;

            .img {
              width: 1.066667rem;
              height: 1.066667rem;
              border-radius: 50%;
              margin: 0 .4rem 0 .693333rem;
            }
          }

          .mes {
            width: 7.52rem;

            .name {
              line-height: .826667rem;
              @include font(16);
              color: #333333;
              font-weight: bold;
            }

            .desc {
              line-height: .48rem;
              color: #666666;
              @include font(14);
            }

            .date-duration {
              color: #787878;
              @include font(12);
              line-height: 1.066667rem;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
</style>

