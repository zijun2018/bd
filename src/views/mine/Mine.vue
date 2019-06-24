/**
*   @Project:   个人中心首页
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:10
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="mine-outer">
    <div class="mine">
      <div class="viscard">
        <NameCard :info="userInfo.agent"></NameCard>
      </div>
      <div class="cell-wraper">
        <!--<mt-cell title="消息" is-link class="cell-default message">-->
        <!--<span>查看</span>-->
        <!--<span class="icon" slot="icon"></span>-->
        <!--</mt-cell>-->
        <!-- <mt-cell title="我的邀请码" is-link class="cell-default code" to="/code">
          <span>查看</span>
          <span class="icon" slot="icon"></span>
        </mt-cell> -->
        <a href="javascript:;" v-on:click.prevent="isShowService = !isShowService">
          <mt-cell class="cell-default service" is-link title="在线客服">
            <span class="icon" slot="icon"></span>
          </mt-cell>
        </a>
        <a href="tel:13510332526" v-show="isShowService">
          <mt-cell class="cell-default service-detail" title="客服热线">
            <span class="tel">13510332526</span>
          </mt-cell>
        </a>
        <a href="javascript:;" v-on:click.prevent="popupVisible = true" v-show="isShowService">
          <mt-cell class="cell-default wxcode service-detail" title="客服二维码">
            <span class="icon"></span>
          </mt-cell>
        </a>
        <mt-cell class="cell-default tip" is-link title="意见反馈" to="/feedback">
          <span class="icon" slot="icon"></span>
        </mt-cell>
      </div>
    </div>
    <!-- 客服二维码弹出框 -->
    <mt-popup
      popup-transition="popup-fade"
      v-model="popupVisible">
      <div class="wx-code-wraper">
        <img alt="" src="../../assets/images/service_code.jpg">
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import NameCard from '../../components/name-card';
  import {getAgentUserInfo} from '../../api/agent'
  import {mapGetters, mapMutations} from 'vuex';
  import {deepClone} from '../../utils/base-methods';

  export default {
    data () {
      return {
        isShowService: false,
        popupVisible: false
      }
    },

    computed: {
      ...mapGetters(['userInfo'])
    },

    created () {
      this.getUserInfoData();
    },

    methods: {
      ...mapMutations([
        'SET_LOADING',
        'SET_USERINFO'
      ]),

      /**
       * 获取用户信息
       */
      getUserInfoData () {
        this['SET_LOADING']('open');
        getAgentUserInfo().then(res => {
          this['SET_LOADING']('close');
          let userInfo = deepClone(this.userInfo);
          userInfo.advice = res.advice;
          userInfo.agent = res.agent;
          this['SET_USERINFO'](userInfo);
        }).catch(() => {
          this['SET_LOADING']('close');
        })
      }

    },

    components: {
      NameCard
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .mine-outer {
    width: 100%;
    min-height: 100%;

    .mine {
      width: 100%;
      min-height: 100%;
      background-color: #eeeeee;
      padding-top: .266667rem;
      padding-bottom: .266667rem;
      box-sizing: border-box;

      .viscard {
        width: 100%;
        margin-bottom: .266667rem;
      }

      .cell-wraper {
        width: 9.2rem;
        background-color: #ffffff;
        border-radius: .133333rem;
        padding: 0 .466667rem;
        box-sizing: border-box;
        margin: 0 auto;

        .mint-cell.code {
          .icon {
            @include bgImage('../../assets/images/code');
            background-size: .44rem .453333rem;
          }
        }

        .mint-cell.service {
          .icon {
            @include bgImage('../../assets/images/service');
            background-size: .44rem .453333rem;
          }
        }

        .mint-cell.message {
          .icon {
            @include bgImage('../../assets/images/message');
            background-size: .44rem .453333rem;
          }
        }

        .mint-cell.wxcode {
          .icon {
            display: block;
            width: .493333rem;
            height: 1.466667rem;
            background-repeat: no-repeat;
            background-position: left center;
            @include bgImage('../../assets/images/sm_code');
            background-size: .44rem .453333rem;
          }
        }

        .mint-cell.service-detail {
          padding-left: .986667rem;

          .mint-cell-wrapper {
            padding-right: .493333rem;
          }

          .tel {
            color: #1746A7;
          }
        }

        .mint-cell.tip {
          &.cell-default .mint-cell-wrapper {
            border-bottom: none;
          }

          .icon {
            @include bgImage('../../assets/images/suggest');
            background-size: .44rem .453333rem;
          }
        }
      }
    }

    .wx-code-wraper {
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 5.333333rem;
        height: 5.333333rem;
        display: block;
        box-sizing: border-box;
        overflow-wrap: break-word;
        visibility: visible;
      }
    }
  }
</style>

