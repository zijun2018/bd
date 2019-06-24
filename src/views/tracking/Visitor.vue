/**
*   @Project:   用户追踪访客页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 18:00
*   @Note:
*/


<template>
  <div class="visitor-outer">
    <div class="visitor">
      <scroller :on-infinite="loadMore" :on-refresh="refresh" ref="my_scroller">
        <ul class="list">
          <li :key="index" class="l-member" v-for="(item, index) in dataList">
            <div class="avatar">
              <img :src="item.avatar_url" alt="" class="img f-db">
            </div>
            <div class="mes">
              <p class="name">{{item.user_name}}</p>
              <p class="desc">浏览了我的 《{{item.title}}》 文章</p>
              <p class="date-duration">
                <span class="date">{{item.created_at}}</span>
                <span class="duration">浏览时长：{{item.browsing_duration}}</span>
              </p>
            </div>
          </li>
        </ul>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {getTrackVisitorsList} from '../../api/news';
  import {mapMutations} from 'vuex';

  export default {
    data () {
      return {
        dataList: [],
        pageOpts: {
          currentPage: 1,
          pageSize: 10
        }
      }
    },

    methods: {
      /**
       * 加载更多
       */
      loadMore () {
        this['SET_LOADING']('open');
        getTrackVisitorsList({
          page: this.pageOpts.currentPage,
          page_size: this.pageOpts.pageSize
        }).then(res => {
          setTimeout(() => {
            this['SET_LOADING']('close');
            this.dataList = [...this.dataList, ...res.data];
            this.$refs.my_scroller.finishInfinite();
            if(this.pageOpts.currentPage == res.last_page) {
              this.$refs.my_scroller.finishInfinite(true);
            } else {
              this.pageOpts.currentPage++;
            }
          }, 200);
        })
      },
      refresh() {
        this.$refs.my_scroller.finishPullToRefresh(true);
      },
      ...mapMutations(['SET_LOADING'])
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .visitor-outer {
    width: 100%;
    height: 100%;

    .visitor {
      width: 100%;
      height: 100%;
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
