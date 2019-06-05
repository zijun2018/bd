/**
*   @Project:   二维码编辑页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/30 17:11
*   @Note:      代码已部分重构优化，但是优化点还有，后续还可以优化
*/


<template>
  <div class="wechat-code-outer">
    <div class="wechat-code">
      <div class="image f-pr">
        <ImgInputer
          :img-src="cacheWholeCodeUrl? cacheWholeCodeUrl: $route.params.codeUrl"
          :max-size="10240"
          :on-change="imageChange"
          @onExceed="imageExceed"
          accept="image/*"
          v-if="!colding"
          v-model="imgFile">
        </ImgInputer>
        <div class="shade"></div>
      </div>
      <div class="btn-wraper">
        <div @click="selectImage" class="wbtn upload">上传二维码</div>
        <div @click="deleteImage" class="wbtn delete">删除二维码</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import ImgInputer from '../../assets/js/index'
  import Compressor from 'compressorjs';
  import {postAgentUploadPic} from '../../api/agent';
  import {Toast} from 'mint-ui';
  import eventBus from '../../eventBus';

  export default {
    name: 'wechatCode',

    data () {
      return {
        imgFile: {},
        colding: false
      }
    },

    computed: {
      ...mapGetters({
        cacheCodeUrl: 'mine/cacheCodeUrl',
        cacheWholeCodeUrl: 'mine/cacheWholeCodeUrl'
      })
    },

    methods: {
      ...mapMutations([
        'SET_LOADING',
        'mine/SET_CACHECODEURL'
      ]),

      /**
       * 监听到图片改变，自动提交操作
       */
      imageChange () {
        this.handleSubmit();
      },

      /**
       * 选择图片
       */
      selectImage () {
        document.getElementsByTagName('input')[0].click();
      },

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
      async handleSubmit () {
        // 需要判断图片的大小
        if (this.imgFile.type) {
          if (this.imgFile.size > 10240000) {
            Toast('图片大小不能超过10M');
            return;
          }
        }

        // 开始上传所需的操作
        this['SET_LOADING']('open');

        // 需要先对图片进行压缩，并且上传
        let compressImg = {};

        // 假如图片超过2M，则需要先进行压缩
        if (this.imgFile.size > 2056000) {
          compressImg = await this.compressImage(this.imgFile);
        } else {
          compressImg = this.imgFile;
        }
        let imgData = new FormData();
        imgData.append('fname', compressImg);
        imgData.append('type', 2);

        postAgentUploadPic(imgData).then(res => {
          Toast('上传成功，保存信息后将会生效');
          this['SET_LOADING']('close');
          this['mine/SET_CACHECODEURL'](res);
          this.$router.go(-1);
        }).catch(() => {
          this['SET_LOADING']('close');
        })
      },

      /**
       * 压缩图片操作
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
       * 删除图片
       */
      deleteImage () {
        // 需要清理缓存的url，并且需要通知用户页
        if (!this.cacheWholeCodeUrl && !this.$route.params.codeUrl) {
          Toast('请先上传微信二维码图片');
          return
        }
        this['mine/SET_CACHECODEURL']({});
        eventBus.$emit('deleteCode');
        Toast('删除成功，保存信息后将会生效');
        this.$router.go(-1);
      }

    },

    components: {
      ImgInputer
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .wechat-code-outer {
    width: 100%;
    height: 100vh;

    .wechat-code {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      padding: .666667rem .373333rem;
      box-sizing: border-box;

      .image {
        width: 9.2rem;
        height: 9.2rem;
        @include bgImage('../../assets/images/code_default');
        background-size: 100% 100%;
      }

      .shade {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 999;
        transform: translate(-50%, -50%);
        width: 240px;
        height: 240px;
      }

      .btn-wraper {
        width: 100%;
        margin-top: .666667rem;

        .wbtn {
          width: 7.733333rem;
          height: 1.146667rem;
          line-height: 1.146667rem;
          border-radius: .573333rem;
          color: #ffffff;
          @include font(15);
          text-align: center;
          margin: 0 auto;

          &.upload {
            background: linear-gradient(to right, #09226B, #1C52BB);
          }

          &.delete {
            background: linear-gradient(to right, #9CA3B2, #CCD1D7);
            margin-top: .4rem;
          }
        }
      }

      // img-inputer 样式覆盖
      /deep/ .img-inputer {
        width: 6.4rem;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .img-inputer__preview-box{
          display: flex;
          align-items: center;
          img{
            display: block;
            margin: 0 auto;
            width: 100%;
            height: auto;
            max-height: 8rem;
          }
        }
      }

      .img-inputer__err {
        display: none;
      }
    }
  }
</style>

