/**
*   @Project:   用户追踪统计列表
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:49
*   @Note:
*/


<template>
  <div class="count-list-outer">
    <div class="count-list">
      <div class="sort-wraper">
        <ul class="sort">
          <li class="s-member"></li>
          <li @click="sortChange('check')" class="s-member check">
            <div class="text">查看次数</div>
            <span :class="sort.check" class="f-db icon"></span>
          </li>
          <li @click="sortChange('time')" class="s-member time">
            <div class="text">累计时长</div>
            <span :class="sort.time" class="f-db icon"></span>
          </li>
          <li @click="sortChange('tranNum')" class="s-member tran">
            <div class="text">转发次数</div>
            <span :class="sort.tranNum" class="f-db icon"></span>
          </li>
        </ul>
      </div>
      <ul class="list">
        <li :key="index" class="l-member" v-for="(item, index) in dataList">
          <div class="avatar lm-m">
            <img :src="item.avatar_url" alt="">
          </div>
          <div class="checknum lm-m">{{item.r_count}}</div>
          <div class="time lm-m">{{item.r_time | secondUnitFormat}}</div>
          <div class="trannum lm-m">{{item.r_forward}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {deepClone} from '../../utils/base-methods';

  export default {
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        dataList: [],
        sort: {
          time: 'normal', // 时间  ascending | descending
          check: 'descending', // 查看次数 ascending | descending
          tranNum: 'normal' // 转发次数
        }
      }
    },
    methods: {

      sortChange (type) {
        let sortType = '';
        if (this.sort[type] !== 'descending') {
          this.sort[type] = 'descending';
          sortType = `${type}descending`
        } else {
          this.sort[type] = 'ascending';
          sortType = `${type}ascending`
        }
        for (let i in this.sort) {
          i !== type && (this.sort[i] = 'normal');
        }
        // 读取缓存数据
        this.dataList = deepClone(this.list);
        // 排序
        this.arrSort(sortType, this.dataList);
      },

      // 对比方法
      arrSort (type, arr) {
        function proCompare (property) {
          return function (a, b) {
            let value1 = a[property] - 0;
            let value2 = b[property] - 0;
            return (value1 - value2);
          };
        }

        switch (type) {
          case 'timedescending':
            arr.sort(proCompare('r_time')).reverse();
            break;
          case 'timeascending':
            arr.sort(proCompare('r_time'));
            break;
          case 'checkdescending':
            arr.sort(proCompare('r_count')).reverse();
            break;
          case 'checkascending':
            arr.sort(proCompare('r_count'));
            break;
          case 'tranNumdescending':
            arr.sort(proCompare('r_forward')).reverse();
            break;
          case 'tranNumascending':
            arr.sort(proCompare('r_forward'));
            break;
          default:
            break;
        }
      }
    },

    watch: {
      list (newVal, oldVal) {
        this.dataList = deepClone(newVal);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .count-list-outer {
    width: 100%;
    height: 100%;

    .count-list {
      width: 100%;

      .sort-wraper {
        width: 100%;

        .sort {
          width: 100%;
          border-bottom: 1px solid #E2E2E2;
          display: flex;
          justify-content: center;

          .s-member {
            flex: 1;
            display: flex;
            align-items: center;

            &:nth-child(3) {
              flex: 1.2;
            }

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
        }
      }

      .list {
        width: 100%;
        height: calc(100vh - .8rem - 2.026667rem - .96rem - .053333rem);
        overflow-y: scroll;

        .l-member {
          display: flex;
          border-bottom: 1px solid #E2E2E2;

          .lm-m {
            flex: 1;
            color: #333333;
            @include font(14);
            height: 1.973333rem;
            line-height: 1.973333rem;

            &:nth-child(3) {
              flex: 1.2;
            }

            &.avatar {
              display: flex;
              justify-content: flex-end;
              align-items: center;

              img {
                width: 1.066667rem;
                height: 1.066667rem;
                border-radius: 50%;
                margin-right: .666667rem;
              }
            }

            &.checknum {
              text-indent: .266667rem;
            }

            &.trannum {
              text-indent: .266667rem;
            }
          }
        }
      }
    }
  }
</style>

