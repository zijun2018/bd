/**
*   @Project:   首页资讯库内容，四个tab栏
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 16:23
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="information-outer">
    <div class="information">
      <div class="content">
          <ul class="tab">
            <li :class="{active: item.value === tabType}"
                :key="index" @click="tabType = item.value"
                class="f-pr tab-member"
                v-for="(item, index) in tabList">
              {{item.label}}
            </li>
          </ul>
        <div class="noData" v-if="!infomation.length && isFinishQuest">
          暂无数据
        </div>
        <ul class="info-list" v-else>
          <li :key="index" @click="toArticle(item)" class="i-member" v-for="(item, index) in infomation">
            <div class="wraper">
              <div class="mes">
                <p class="title over2line"
                   style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;">
                  {{item.title}}</p>
                <div class="tag-wraper">
                  <div class="tag">
                    {{tagGroup[item.tag]}}
                  </div>
                  <div class="tag" v-if="item.classification">
                    {{classGroup[item.classification]}}
                  </div>
                </div>
                <div class="date-readandrep">
                  <p class="date">{{item.released_time}}</p>
                  <div class="readandrep">
                    <p class="read">
                      <span>阅</span><span>{{item.stats.view_num}}</span>
                    </p>
                    <p class="rep">
                      <span>转</span><span>{{item.stats.share_num}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="image">
                <img :src="item.article_url" alt="">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {getNewsList} from '../../api/news';

  export default {
    data () {
      return {
        newList: {},
        cacheInfomation: {},
        tabList: [
          {label: '推荐', value: '0'},
          {label: '行情', value: '1'},
          {label: '热点', value: '2'},
          {label: '谈资', value: '3'}
        ],
        tabType: '0',
        tagGroup: {
          1: '已授权可转发',
          2: '已授权可转发',
          3: '原创'
        },
        classGroup: { // 文章类型
          1: '技术派',
          2: '价投派',
          3: '热点派',
          4: '综合派'
        },

        isFinishQuest: false // 是否请求完成
      }
    },

    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        banners: 'home/banners',
        infomation: 'home/infomation'
      })
    },

    mounted () {
      this.getNewsListData('0');
    },

    methods: {
      ...mapMutations([
        'SET_LOADING',
        'home/SET_INFOMATION',
        'home/SET_BANNERS'
      ]),

      /**
       * 获取资讯文章列表
       * @param sort {String} 排序类型
       */
      getNewsListData (sort) {
        this['SET_LOADING']('open');
        getNewsList({
          page: 1,
          pageSize: 1000,
          sort: sort
        }).then(res => {
          this.isFinishQuest = true;
          this['home/SET_INFOMATION'](res.data);
          this['SET_LOADING']('close');
        })
      },

      /**
       * 跳转到资讯文章详情页
       * @param item {Object} 传参对象
       */
      toArticle (item) {
        if (!this.userInfo.agent) {
          this.$router.push({
            path: '/login',
            query: {
              redirect: true
            }
          })
        } else {
          location.href = `${location.origin}/article?key=${item.key}&agentId=${this.userInfo.agent.agent_id}&from_type=0&from_id=${this.userInfo.agent.agent_id}`
        }
      }

    },

    watch: {
      infomation (newVal) {
        this.cacheInfomation[this.tabType] = newVal;
      },

      tabType (newVal) {
        if (newVal) {
          if (this.cacheInfomation[newVal] && this.cacheInfomation[newVal].length) {
            this['home/SET_INFOMATION'](this.cacheInfomation[newVal]);
          } else {
            this.getNewsListData(newVal);
          }
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .information-outer {
    width: 100%;

    .information {
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

        .tab {
          width: 100%;
          height: .933333rem;
          border-bottom: 1px solid #e2e2e2;
          display: flex;
          justify-content: space-between;
          position: fixed;
          z-index: 10;
          background-color: #ffffff;

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
                    &:not(:last-of-type) {
                      margin-right: 8px;
                    }
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
