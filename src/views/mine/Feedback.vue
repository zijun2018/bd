/**
*   @Project:   意见反馈页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 16:26
*   @Note:
*/


<template>
  <div class="suggest-wrap">
    <div class="suggest-top-desc">
      <div class="service-dialog">
        <i class="service-logo"></i>
        <span>感谢您使用量化云展业宝，您在使用过程中有任何意见及问题都可以通过添加我们的微信客服或在下方留言反馈给我们。</span>
      </div>
      <div class="code-wrap">
        <img alt="" src="../../assets/images/service_code.jpg">
      </div>
    </div>
    <div class="space-between"></div>
    <div class="suggest-bottom-wrap">
      <p class="title">意见反馈</p>
      <textarea cols="30" name="suggest" rows="10" v-model="content"></textarea>
      <input maxlength="11"
             placeholder="您的手机号"
             readonly
             type="tel"
             v-model="phone"
             v-show="false">
      <div @click="submitSuggest" class="sub-btn"><span>提交</span></div>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui';
  import {mapGetters, mapMutations} from 'vuex'
  import {postAgentOpinionFeedback} from '../../api/agent';

  export default {

    data () {
      return {
        content: ''
      }
    },

    computed: {
      phone () {
        return this.userInfo.agent.phone
      },
      ...mapGetters([
        'userInfo'
      ])
    },

    methods: {
      ...mapMutations([
        'SET_LOADING'
      ]),

      /**
       * 提交反馈内容
       */
      submitSuggest () {
        if (!this.content) {
          Toast('请输入您的反馈');
          return
        } else if (this.content.length > 200) {
          Toast('反馈内容不能超过200个汉字');
          return
        }
        let params = {
          content: this.content,
          phone: this.phone
        };
        this['SET_LOADING']('open');
        postAgentOpinionFeedback(params).then(res => {
          Toast('提交反馈成功');
          this['SET_LOADING']('close');
          this.$router.replace('/mine');
        }).catch(() => {
          this['SET_LOADING']('close');
        });
      }
    }

  }
</script>
<style lang="scss">
  @import '../../styles/mixin.scss';

  .suggest-wrap {
    .suggest-top-desc {
      padding: .72rem .613333rem .4rem;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);

      .service-dialog {
        display: flex;

        .service-logo {
          margin-right: .266667rem;
          width: 1.333333rem;
          height: 1.333333rem;
          border-radius: 50%;
          @include bgImage('../../assets/images/service_logo');
          background-size: 100% 100%;
        }

        span {
          position: relative;
          padding: .266667rem .386667rem;
          width: 6.133333rem;
          height: 2.533333rem;
          box-sizing: border-box;
          box-shadow: 0px 0px .266667rem 0px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-size: .373333rem;
          word-break: break-all;
          line-height: 1.3;
          color: #333;

          &:before {
            position: absolute;
            left: -6px;
            top: .533333rem;
            content: '';
            border-width: 6px 6px 6px 0;
            border-style: solid;
            border-color: transparent #fff transparent transparent;
          }
        }
      }

      .code-wrap {
        margin: .2rem 0 0 1.64rem;
        width: 6.133333rem;
        height: 6.133333rem;
        box-shadow: 0px 0px .266667rem 0px rgba(0, 0, 0, 0.1);

        img {
          display: block;
          margin: 0 auto;
          width: 100%;
        }
      }
    }

    .space-between {
      width: 100%;
      height: .266667rem;
      background: #eee;
    }

    .suggest-bottom-wrap {
      padding: .653333rem .373333rem .666667rem;

      .title {
        @include font(16);
        color: #333;
        font-weight: 500;
        line-height: 1;
      }

      textarea {
        display: block;
        margin-top: .533333rem;
        padding: .266667rem;
        box-sizing: border-box;
        width: 9.2rem;
        height: 2.4rem;
        -webkit-appearance: none;
        border: 1px solid rgba(237, 237, 237, 1);
        border-radius: 8px;
        @include font(14);
      }

      input {
        margin-top: .266667rem;
        outline: none;
        width: 9.2rem;
        height: 1.066667rem;
        text-indent: .4rem;
        -webkit-appearance: none;
        border: 1px solid #EDEDED;
        border-radius: 8px;
        @include font(14);
      }

      .sub-btn {
        margin-top: .266667rem;
      }
    }
  }
</style>

