/**
*   @Project:  用户追踪tab栏（首页）
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:59
*   @Note:
*/


<template>
  <div class="tracking-outer">
    <div class="tracking">
      <ul class="tab">
        <li :class="{active: item.value === tabType}"
            :key="index" @click="tabType = item.value"
            class="f-pr tab-member"
            v-for="(item, index) in tabList">
          {{item.label}}
        </li>
      </ul>
      <div class="con">
        <!-- 内容 -->
        <Visitor v-if="tabType === '0'"></Visitor>
        <ShareInfo v-if="tabType === '1'"></ShareInfo>
        <Forward v-if="tabType === '2'"></Forward>
        <Count v-if="tabType === '3'"></Count>
      </div>
    </div>
  </div>
</template>
<script>
  import Visitor from './Visitor';
  import ShareInfo from './ShareInfo';
  import Forward from './Forward';
  import Count from './Count';

  export default {
    data () {
      return {
        tabList: [
          {label: '访客', value: '0'},
          {label: '分享', value: '1'},
          {label: '转发', value: '2'},
          {label: '统计', value: '3'}
        ],
        tabType: '0'
      }
    },

    components: {
      Visitor,
      ShareInfo,
      Forward,
      Count
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .tracking-outer {
    width: 100%;

    .tracking {
      width: 100%;
      height: 100vh;

      .tab {
        width: 100%;
        height: .933333rem;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        justify-content: space-between;

        .tab-member {
          height: .933333rem;
          line-height: .933333rem;
          color: #666666;
          @include font(14);
          padding: 0 .4rem;

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

      .con {
        width: 100%;
        height: calc(100vh - 0.933333rem - 1px);
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
  }
</style>
