/**
*   @Project:   用户追踪分享页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:54
*   @Note:
*/

<template>
  <div class="share-info-outer">
    <div class="share-info">
      <ul class="list">
        <li :key="index" class="l-member" v-for="(item, index) in dataList">
          <div class="l-member-con">
            <p class="title">发布 文章转发</p>
            <p class="desc">{{item.title}}</p>
            <div class="rttd">
              <p class="rtt">
                <span class="read">阅{{item.view_num}}</span>
                <span class="tran">转{{item.share_forward_num}}</span>
                <span class="time">时长 {{item.browsing_duration_sum}}</span>
              </p>
              <p class="date">{{item.share_time}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {getTrackShareList} from '../../api/news';
  import {mapMutations} from 'vuex';

  export default {
    data () {
      return {
        dataList: []
      }
    },
    created () {
      this.getShareInfo();
    },
    methods: {

      getShareInfo () {
        this['SET_LOADING']('open');
        getTrackShareList({
          page: 1,
          page_size: 999999
        }).then(res => {
          this['SET_LOADING']('close');
          this.dataList = res.data;
        }).catch(err => {
          this['SET_LOADING']('close');
          console.log(err);
        })
      },
      ...mapMutations(['SET_LOADING'])
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .share-info-outer {
    width: 100%;
    height: 100%;

    .share-info {
      width: 100%;
      height: 100%;

      .list {
        width: 100%;

        .l-member {
          width: 100%;
          padding: 0 .4rem 0 .586667rem;
          box-sizing: border-box;
          border-bottom: 1px solid #E2E2E2;

          .l-member-con {
            width: 100%;

            .title {
              line-height: .8rem;
              color: #333333;
              @include font(16);
            }

            .desc {
              color: #666666;
              @include font(14);
            }

            .rttd {
              width: 100%;
              display: flex;
              justify-content: space-between;

              .rtt {
                line-height: 1.066667rem;
                color: #1C52BB;
                @include font(12);

                .tran {
                  margin-left: .213333rem;
                }

                .time {
                  margin-left: .213333rem;
                }
              }

              .date {
                line-height: 1.066667rem;
                color: #787878;
                @include font(12);
              }
            }
          }
        }
      }
    }
  }
</style>
