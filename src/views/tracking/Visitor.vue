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
      <ul class="list"
          infinite-scroll-disabled="noMore"
          infinite-scroll-distance="20"
          infinite-scroll-immediate-check="false"
          v-infinite-scroll="loadMore">
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
    </div>
  </div>
</template>
<script>
  import {getTrackVisitorsList} from '../../api/news';
  import {mapMutations} from 'vuex';

  export default {
    data () {
      return {
        noMore: false,
        colding: false,
        dataList: [],
        pageOpts: {
          currentPage: 1,
          pageSize: 10
        }
      }
    },

    created () {
      this.loadMore();
    },

    methods: {
      /**
       * 加载更多
       */
      loadMore () {
        if (this.colding) return;
        this.colding = true;
        this['SET_LOADING']('open');
        getTrackVisitorsList({
          page: this.pageOpts.currentPage,
          page_size: this.pageOpts.pageSize
        }).then(res => {
          setTimeout(() => {
            this.colding = false;
            this['SET_LOADING']('close');
            res.data.length <= 0 && (this.noMore = true);
            this.pageOpts.currentPage++;
            this.dataList = [...this.dataList, ...res.data];
          }, 1000);
        });
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
