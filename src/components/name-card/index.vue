<template>
  <div class="namecard-outer">
    <div class="namecard">
      <div class="userinfo userinfo-notlogin card" v-if="!info.user_name" @click="toEdit">
        <img :src="info.avatar_url" class="avatar" alt="" v-if="info.avatar_url">
        <div class="avatar" v-else></div>
        <p class="text">点击编辑您的个人名片</p>
      </div>
      <div class="userinfo userinfo-allogin card" v-if="info.user_name" @click="toEdit">
        <div class="top-part f-pr">
          <div class="avatar">
            <img :src="info.avatar_url" alt="">
          </div>
          <div class="s-info">
            <p class="name over1line">{{info.user_name}}</p>
            <p class="phone">{{info.phone}}</p>
            <div class="tag-wrap">
              <span class="tag f-db f-fl">{{info.company}}</span>
            </div>
          </div>
          <span class="job f-db f-pa over1line">{{info.position}}</span>
        </div>
        <div class="bottom-part">
          <div class="wechat-qq">
            <p class="wechat over1line" v-if="info.wx_qrcode">微信：{{info.wx_qrcode}}</p>
            <p class="qq over1line" v-if="info.qq">QQ: {{info.qq}}</p>
          </div>
          <p class="email" v-if="info.email">
            邮箱：{{info.email}}
          </p>
        </div>
        <div class="wxcode" @click.prevent.stop="popupVisible = true;" v-if="info.wx_qrcode_url">
          <span class="icon f-db"></span>
          <p class="text">我的二维码</p>
        </div>
      </div>
      <!-- 二维码弹出框 -->
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade">
        <div class="wx-code-wraper">
          <img :src="info.wx_qrcode_url" alt="">
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    enableEdit: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      popupVisible: false
    }
  },
  methods: {
    toEdit () {
      if (!this.enableEdit) return;
      location.href = location.origin + '/userInfo'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../styles/mixin.scss';
  $base-white: #ffffff;
  .namecard-outer {
    width: 100%;
    height: 100%;
    .namecard {
      width: 100%;
      height: 100%;
      .userinfo {
        width: 9.2rem;
        margin: 0 auto;
        background: url("../../assets/images/card-bg.png") center 100% no-repeat;
        background-size: cover;
        box-shadow: 0 0 0.533rem 0 rgba(0, 0, 0, 0.1);
        border-radius: 0.267rem;
        &.userinfo-notlogin {
          height: 3.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          .avatar {
            width: 1.6rem;
            height: 1.6rem;
            @include bgImage('../../assets/images/avatar_default');
            background-size: 100% 100%;
            border-radius: 50%;
          }
          .text {
            color: $base-white;
            @include font(15);
            line-height: 1.6rem;
            margin-left: .266667rem;
          }
        }
        &.userinfo-allogin {
          padding-top: .733333rem;
          .top-part {
            height: 1.706667rem;
            display: flex;
            align-items: center;
            .avatar {
              width: 1.6rem;
              height: 1.6rem;
              @include bgImage('../../assets/images/avatar_default');
              background-size: 100% 100%;
              border-radius: 50%;
              margin-left: .466667rem;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .s-info {
              margin-left: .266667rem;
              .name {
                max-width: 3.2rem;
                color: $base-white;
                line-height: .533333rem;
                @include font(18);
              }
              .phone {
                color: $base-white;
                line-height: .693333rem;
                @include font(15);
              }
              .tag {
                width: auto;
                height: .48rem;
                line-height: .48rem;
                @include font(11);
                color: #ffffff;
                background: linear-gradient(to right, #94ACE7, #3C6AD4);
                border-top-left-radius: .24rem;
                border-bottom-right-radius: .24rem;
                padding: 0 .24rem;
                max-width: 5.333rem;
                word-break: break-all;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap
              }
            }
            .job {
              max-width: 2.933333rem;
              top: -0.04rem;
              right: 0;
              height: .746667rem;
              line-height: .746667rem;
              color: #ffffff;
              @include font(15);
              background: linear-gradient(to right, #D0B17B, #B1873C);
              border-top-left-radius: .373333rem;
              border-bottom-left-radius: .373333rem;
              padding: 0 .373333rem;
            }
          }
          .bottom-part {
            padding-bottom: .333333rem;
            margin: .506667rem 0 0 .466667rem;
            p {
              height: .586667rem;
              line-height: .586667rem;
              color: $base-white;
              @include font(14);
            }
            .wechat-qq {
              display: flex;
              .wechat {
                max-width: 4rem;
                margin-right: .666667rem;
              }
              .qq {
                max-width: 4rem;
              }
            }

            p.email {
              max-width: 8.533rem;
              word-break: break-all;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            }
          }
          .wxcode {
            padding-bottom: .333333rem;
            margin-left: .466667rem;
            display: flex;
            align-items: center;
            color: $base-white;
            .icon {
              width: .44rem;
              height: .453333rem;
              @include bgImage('../../assets/images/code');
              background-size: 100% 100%;
            }
            .text {
              @include font(15);
              margin-left: .533333rem;
            }
          }
        }
      }
      .mint-popup {
        border-radius: .266667rem;
        overflow: hidden;
      }
      .wx-code-wraper {
        width: 6.666667rem;
        height: 6.666667rem;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          margin: 0 auto;
          width: 5.333333rem;
          height: auto;
          max-height: 6.666667rem;
        }
      }
    }
  }
</style>


