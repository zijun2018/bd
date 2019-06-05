<template>
  <div class="login-outer">
    <div class="login">

      <!-- Part1: 欢迎标题 -->
      <div class="welcome-text">
        <p class="para">欢迎登录</p>
        <p class="para">量化云展业宝</p>
      </div>

      <!-- Part2: 输入框 -->
      <div class="entryarea">
        <div class="input-wraper phone">
          <label class="label" for="phone-number">手机号码</label>
          <input class="input" id="phone-number" placeholder="请填入手机号码" type="number" max="11" v-model="loginData.phone">
        </div>
        <div class="input-wraper code f-pr">
          <label class="label" for="img-code">图形验证码</label>
          <input class="input" id="img-code" placeholder="请填写图形验证码" v-model="loginData.imgCode">
          <img :src="imgCodeUrl" class="img-code-url" @click="getCaptchaCode" alt="">
        </div>
        <div class="input-wraper code f-pr">
          <label class="label" for="phone-code">验证码</label>
          <input class="input" id="phone-code" placeholder="请填写短信验证码" ref="codeInputer" type="number"
                 v-model="loginData.code">
          <div :class="{'sended' : getCodeColding}" @click="getVerCode" class="m-btn f-pa">{{btnText}}</div>
        </div>
      </div>

      <!-- Part3: 登录按钮 -->
      <div :class="{colding: submitLock}" class="btn-wraper">
        <mt-button @click="onLogin" type="primary">登录</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {isPhoneNum, parseQueryString, handleAuth} from '../../utils/base-methods';
  import {postAuthLogin, postAuthSendMsg, getCaptcha} from '../../api/agent'
  import {mapMutations} from 'vuex';
  import {Toast} from 'mint-ui';

  export default {
    data () {
      return {
        btnText: '获取验证码',
        getCodeColding: false,
        submitLock: true,
        imgCodeUrl: '',
        loginData: {
          phone: '',
          imgCode: '',
          code: ''
        }
      }
    },
    mounted() {
      this.getCaptchaCode();
    },
    methods: {
      ...mapMutations([
        'SET_LOADING', // 设置加载动画
        'SET_USERINFO' // 设置用户信息到localStorage
      ]),

      /**
       * 获取图形验证码
       */
      getCaptchaCode() {
        getCaptcha().then(res => {
          this.imgCodeUrl = res.captcha;
        })
      },

      /**
       * 登录操作
       */
      onLogin () {
        this['SET_LOADING']('open');
        postAuthLogin({
          phone: this.loginData.phone,
          code: this.loginData.code
        }).then(res => {
          this['SET_LOADING']('close');
          Toast('登录成功');
          this['SET_USERINFO'](res);

          let url = '';
          if (parseQueryString().redirect && parseQueryString().fromHomePage) {
            url = `${location.origin}/home?t=${Math.random()}`;
          } else if (parseQueryString().redirect) {
            debugger
            url = `${location.origin}${this.$route.query.pathName}`;
          }
          //登录成功后去授权，url为最终返回的地址
          handleAuth({
            appid: process.env.WX_APPID,
            redirectUrl: `${process.env.BASE_URL}/api/third/wechat/agent_wx_authorize?token=${res.token}`,
            url: url
          });
        }).catch(err => {
          console.log(err);
          this.getCaptchaCode();
          this['SET_LOADING']('close');
        });
      },


      /**
       * 获取手机验证码
       * @returns {boolean}
       */
      getVerCode () {
        if (this.getCodeColding) {
          return false;
        } else if (!isPhoneNum(this.loginData.phone)) {
          Toast('请输入正确的手机号码');
          return false;
        } else if (this.loginData.imgCode == '') {
          Toast('请输入正确的图形验证码');
          return false;
        } else {
          this['SET_LOADING']('open');
          postAuthSendMsg({
            phone: this.loginData.phone,
            code: this.loginData.imgCode
          }).then(() => {
            this['SET_LOADING']('close');
            Toast('验证码发送成功！');
            this.countDown(60);
          }).catch(() => {
            this.getCaptchaCode();
            this['SET_LOADING']('close');
          })
        }
      },


      /**
       * 倒计时，避免多次点击请求发送短信
       * @param interval {Number | String} 间隔时长
       */
      countDown (interval) {
        this.getCodeColding = true;
        let seconds = interval;
        let timeInterval = setInterval(() => {
          if (seconds > 0) {
            seconds--;
            this.btnText = `剩余时间(${seconds})`;
          } else {
            this.getCodeColding = false;
            this.btnText = '获取验证码';
            clearInterval(timeInterval);
          }
        }, 1000);
      }

    },

    watch: {
      loginData: {
        handler (newVal) {
          this.submitLock = !(isPhoneNum(newVal.phone) && newVal.code !== '');
        },
        deep: true
      },
      'loginData.code' (newVal) {
        if (newVal.length === 6) return;
        this.loginData.code = newVal.slice(0, 6);
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/mixin";

  .login-outer {
    width: 100%;

    .login {
      width: 100%;
      box-sizing: border-box;
      padding: .96rem .666667rem 0;

      .welcome-text {
        .para {
          @include font(30);
          font-weight: bold;
          color: #282828;
          line-height: 1.04rem;
        }
      }

      .entryarea {
        width: 100%;
        margin-top: .773333rem;

        .input-wraper {
          width: 100%;
          height: 1.466667rem;
          border-bottom: 1px solid #E2E2E2;
          display: flex;
          align-items: center;

          .label, .input {
            @include font(16);
            color: #444444;
            height: 1.466667rem;
            line-height: 1.466667rem;
          }

          .label {
            width: 2.16rem;
          }

          .input {
            border: none;
            height: .8rem;
            line-height: .8rem;
            &::placeholder{
              font-size: .346667rem;
            }
          }
          
          .img-code-url{
            position: absolute;
            top: 50%;
            margin-top: -0.4rem;
            right: 0;
            width: 2.666667rem;
            height: .8rem;
          }

          .m-btn {
            outline: none;
            // height: .613333rem;
            line-height: .613333rem;
            color: #1C52BB;
            text-align: center;
            border: 1px solid #1C52BB;
            @include font(11);
            border-radius: .306667rem;
            padding: 0 .133333rem;

            &.sended {
              color: #a6a6a6;
              border: 1px solid #a6a6a6;
            }
          }

          &.phone {
            .input {
              width: 6.4rem;
            }
          }

          &.code {
            .input {
              width: 4rem;
            }

            .m-btn {
              top: 50%;
              right: 0;
              transform: translateY(-50%);
            }
          }
        }
      }

      .btn-wraper {
        width: 100%;
        margin-top: .96rem;
        display: flex;
        justify-content: center;

        .mint-button {
          width: 7.733333rem;
          height: 1.12rem;
          @include font(18);
          background: linear-gradient(to right, #09226B, #1C52BB);
          border-radius: .56rem;
          overflow: hidden;
        }

        &.colding {
          .mint-button {
            background: linear-gradient(to right, #CECECE, #CECECE);
          }
        }
      }
    }
  }
</style>
