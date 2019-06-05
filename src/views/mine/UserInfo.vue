/**
*   @Project:   个人中心编辑页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:10
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="userinfo-outer">
    <div class="userinfo">
      <div class="avatar-wraper card">
        <div class="cell">
          <div class="title">头像</div>
          <div :class="{default: !formData.avatar_url}" class="avatar f-pr">
            <!-- <div class="a-img f-pa" v-if="formData.avatar_url && formData.avatar_url !== ''">
                            <img :src="formData.avatar_url" alt="">
                        </div> -->
            <ImgInputer
              :img-src="formData.avatar_url"
              :max-size="10240"
              @onExceed="imageExceed"
              accept="image/*"
              ref="imgInputer"
              v-model="imgFile"
              v-show="!colding"
            >
            </ImgInputer>
          </div>
        </div>
      </div>
      <div class="info-wraper card">
        <div class="cell is-im is-border">
          <div class="title">姓名</div>
          <input class="input" placeholder="请输入您的姓名" type="text" v-model.trim="formData.user_name">
        </div>
        <div class="cell is-im is-border">
          <div class="title">公司/机构</div>
          <input class="input" placeholder="请输入您的公司/结构名称" type="text" v-model.trim="formData.company">
        </div>
        <div class="cell is-im">
          <div class="title">职位</div>
          <input class="input" placeholder="请输入您的职位" type="text" v-model.trim="formData.position">
        </div>
      </div>
      <div class="info-wraper card">
        <div class="cell is-im is-border">
          <div class="title">手机号码</div>
          <input class="input" disabled placeholder="请输入您的手机号码" type="text" v-model.trim="formData.phone">
        </div>
        <div class="cell is-border">
          <div class="title">邮箱</div>
          <input class="input" maxlength="40" placeholder="请输入您的邮箱" type="text" v-model.trim="formData.email">
        </div>
        <div class="cell is-border">
          <div class="title">QQ</div>
          <input class="input" maxlength="12" placeholder="请输入您的QQ" type="text" v-model.trim="formData.qq">
        </div>
        <div class="cell">
          <div class="title">微信号</div>
          <input class="input" maxlength="20" placeholder="请输入您的微信号" type="text" v-model.trim="formData.wx_qrcode">
        </div>
      </div>
      <div @click="redirect" class="wechat-wraper card">
        <mt-cell class="cell-default code" is-link title="我的微信二维码"></mt-cell>
      </div>
      <div class="btn-wraper card">
        <mt-button @click="hendleSubmit" class="sbtn" type="default">保存</mt-button>
      </div>
    </div>
    <div class="clip-wrap" v-if="needCrop">
      <vueCropper
        :autoCrop="option.autoCrop"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :canScale="option.canScale"
        :centerBox="option.centerBox"
        :fixed="option.fixed"
        :fixedBox="option.fixedBox"
        :fixedNumber="option.fixedNumber"
        :full="option.full"
        :img="option.img"
        :info="false"
        :original="option.original"
        :outputSize="option.size"
        :outputType="option.outputType"
        ref="cropper"
      >
      </vueCropper>
      <div class="clip-btn">
        <span @click="cancelClip">取消</span>
        <span @click="finish('blob')">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
  import ImgInputer from '../../assets/js/index'
  import Compressor from 'compressorjs'
  import {VueCropper} from 'vue-cropper'
  import {mapGetters, mapMutations} from 'vuex'
  import {getStrLength, deepClone} from '../../utils/base-methods'
  import {Toast} from 'mint-ui'
  import {postAgentUpdateInfo, postAgentUploadPic} from '../../api/agent'
  import eventBus from '../../eventBus'

  export default {
    name: 'userInfo',

    data () {
      return {
        imgFile: {},
        changedImgFile: {},
        formData: {
          avatar_url: ''
        },
        refresh: true,
        system: '',
        colding: false,
        needCrop: false,
        option: {
          img: '', // 裁切图片的地址
          outputSize: 0.6, // 裁剪生成图片的质量 0.1-1
          outputType: 'png', // 裁剪生成图片的格式
          full: false, // 是否输出原图比例的截图
          fixedBox: false, // 固定截图框大小 不允许改变
          original: false, // 上传图片按照原始比例渲染
          canMove: true, // 上传图片是否可以移动
          canMoveBox: false, // 截图框能否拖动
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          centerBox: true // 截图框是否被限制在图片里面
        }
      }
    },

    computed: {
      ...mapGetters([
        'userInfo',
        'mine/cacheCodeUrl'
      ])
    },

    beforeRouteEnter (to, from, next) {
      to.meta.refresh = from.name !== 'user_we_chat_ode' && to.name === 'userInfo';
      next();
    },

    created () {
      eventBus.$on('deleteCode', () => {
        this.formData.wx_qrcode_url = '';
      });
    },

    activated () {
      if (this.$route.meta.refresh) {
        this.formData = deepClone(this.userInfo.agent);
        this['mine/SET_CACHECODEURL']({});
      }
    },

    methods: {
      ...mapMutations([
        'SET_LOADING',
        'mine/SET_CACHECODEURL',
        'SET_USERINFO'
      ]),

      /**
       * 图片超出限制
       */
      imageExceed () {
        Toast('图片大小不能超过10M');
        this.colding = true;
        setTimeout(() => {
          this.colding = false;
        }, 200);
      },

      /**
       * 提交操作
       * @returns {Promise<void>}
       */
      async hendleSubmit () {
        // 如果要更新图片，需要判断图片的大小
        if (this.changedImgFile.type) {
          if (this.changedImgFile.size > 10240000) {
            Toast('图片大小不能超过10M');
            return;
          }
        }

        // 输入框验证
        if (!this.formData.user_name) {
          Toast('请输入正确的用户名');
          return;
        } else if (getStrLength(this.formData.user_name) > 20) {
          Toast('用户名长度不能大于10');
          return;
        } else if (!this.formData.company) {
          Toast('请输入正确的公司名');
          return;
        } else if (getStrLength(this.formData.company) > 20) {
          Toast('公司名长度不能大于10');
          return;
        } else if (!this.formData.position) {
          Toast('请输入正确的职位');
          return;
        } else if (getStrLength(this.formData.position) > 12) {
          Toast('职位名长度不能大于6');
          return;
        }

        // 开始上传所需的操作
        this['SET_LOADING']('open');

        this.formData.tel = this.formData.phone;

        // 如果要更新图片,需要先上传图片
        if (this.changedImgFile.type) {
          let compressImg = {};
          // 假如图片超过2M，则需要先进行压缩
          if (this.changedImgFile.size > 2056000) {
            compressImg = await this.compressImage(this.changedImgFile);
          } else {
            compressImg = this.changedImgFile;
          }
          let imgData = new FormData();
          imgData.append('fname', compressImg);
          imgData.append('type', 1);
          // 上传图片
          await this.upLoadImage(imgData);
        }
        // 是否是从二维码上传页跳转过来的？是的话需要加上二维码的链接
        if (typeof this['mine/cacheCodeUrl'] === 'string') {
          this.formData.wx_qrcode_url = this['mine/cacheCodeUrl']
        }

        // 上传数据
        postAgentUpdateInfo(this.formData).then(res => {
          Toast('保存成功!');
          this['SET_LOADING']('close');
          // 退出页面时也需要清除缓存的二维码图片并更新信息
          this['mine/SET_CACHECODEURL']({});
          this['SET_USERINFO'](res);
          this.formData = deepClone(this.userInfo.agent);
          this.$router.replace('/mine');
        }).catch(err => {
          this['SET_LOADING']('close');
          console.log(err)
        })
      },

      /**
       * 上传图片
       * @param imgData {String} 图片数据
       * @returns {Promise<any>}
       */
      upLoadImage (imgData) {
        return new Promise(resolve => {
          postAgentUploadPic(imgData).then(res => {
            this.formData.avatar_url = res.path;
            resolve();
          }).catch(() => {
            this['SET_LOADING']('close');
          })
        });
      },

      /**
       * 压缩图片
       * @param file {String} 图片文件
       * @param rate {Number} 压缩比例
       * @returns {Promise<any>}
       */
      compressImage (file, rate) {
        return new Promise(resolve => {
          new Compressor(file, {
            quality: 0.3,
            convertSize: 500000,
            success (result) {
              resolve(result);
            },
            error (err) {
              console.log(err.message);
            }
          });
        })
      },

      /**
       * 跳转到显示二维码
       */
      redirect () {
        this.$router.push({
          name: 'user_we_chat_ode',
          params: {
            codeUrl: this.formData.wx_qrcode_url
          }
        });
      },

      /**
       * 点击确定按钮，处理
       * @param type
       */
      finish (type) {
        if (type === 'blob') {
          // 裁切生成的blob数据
          this.$refs.cropper.getCropBlob(data => {
            this.changedImgFile = data;
            this.needCrop = false;
            this.formData.avatar_url = window.URL.createObjectURL(data);
          })
        } else {
          // 裁切生成的base64数据
          this.$refs.cropper.getCropData(data => {
            this.changedImgFile = data;
            this.needCrop = false;
            this.formData.avatar_url = data;
          })
        }
      },

      /**
       * 点击取消按钮，处理
       */
      cancelClip () { // 点击取消清除图片数据，重新上传
        this.needCrop = false;
        if (this.formData.avatar_url) { // 之前是否有图片
          if (this.changedImgFile.type) { // 刚上传的图片
            this.formData.avatar_url = window.URL.createObjectURL(this.changedImgFile)
          } else { // 有默认图片
            this.formData = deepClone(this.userInfo.agent);
            document.getElementsByClassName('img-inputer__preview-img')[0].src = this.formData.avatar_url;
          }
        } else {
          this.$refs.imgInputer.reset();
        }
        document.getElementsByTagName('input')[0].click();
      }

    },

    watch: {
      imgFile: {
        handler (newVal, oldVal) {
          if (!newVal.type) return
          window.URL.revokeObjectURL(oldVal);
          let src = window.URL.createObjectURL(newVal);
          this.needCrop = true;
          this.option.img = src;
        },
        deep: true
      }
    },

    components: {
      ImgInputer,
      VueCropper
    }
  }
</script>
<style lang="scss">
  @import '../../styles/mixin.scss';

  .userinfo-outer {
    width: 100%;

    .userinfo {
      width: 100%;
      background-color: #eeeeee;
      padding: .24rem .4rem .586667rem;
      box-sizing: border-box;

      .card {
        padding: 0 .466667rem;
        box-sizing: border-box;

        .cell {
          width: 100%;
          height: 1.466667rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;

          &.is-border {
            border-bottom: 1px solid #E2E2E2;
          }

          &.is-im::before {
            content: '*';
            color: #E31818;
            position: absolute;
            left: -0.466667rem;
            top: 50%;
            transform: translateY(-33%);
          }

          .title {
            width: 2.746667rem;
            height: 1.466667rem;
            line-height: 1.466667rem;
            color: #444444;
            @include font(15);
          }

          .avatar {
            width: 1.2rem;
            height: 1.2rem;
            background-size: 100% 100%;
            border-radius: 50%;
            overflow: hidden;

            &.default {
              @include bgImage('../../assets/images/avatar_default');
            }

            .a-img {
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              z-index: 2;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .input {
            width: 5.866667rem;
            height: .8rem;
            line-height: .8rem;
            color: #444444;
            background-color: #ffffff;
            @include font(13);
            text-align: right;
            border: none;
          }
        }

        .mint-cell-wrapper {
          border: none;
        }
      }

      .info-wraper, .wechat-wraper, .btn-wraper {
        margin-top: .266667rem;
      }

      .btn-wraper {
        width: 100%;
        padding: 0;

        .sbtn {
          width: 100%;
          height: 1.466667rem;
          line-height: 1.466667rem;
          @include font(15);
          text-align: center;
          background-color: #ffffff;
          border: none;
        }
      }
    }

    .clip-wrap {
      position: fixed;
      left: 50%;
      top: 0;
      z-index: 999;
      width: 100%;
      height: calc(100vh - 2.506666rem);
      transform: translate(-50%, 0);

      .vue-cropper {
        background: #fff;
      }

      .cropper-modal {
        background: none;
      }

      .clip-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 1.333333rem;
        background: linear-gradient(to right, #09226B, #1C52BB);
        padding: 0 .6rem;

        span {
          color: #fff;
          @include font(18);
        }
      }
    }
  }
</style>
