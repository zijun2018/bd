/**
*   @Project:   名片编辑页面
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/5/24 15:54
*   @Note:
*/


<template>
  <div class="mine-card-edit" v-wechat-title="this.title">
    <!-- Part-1: 页面预加载 -->
    <gl-page-init-loading
      v-if="isShowInitLoading"></gl-page-init-loading>

    <!-- Part2: 名片 -->
    <div class="name-card-wrap">
      <name-card :info="userInfo.agent"></name-card>
    </div>

    <!-- Part3: 名片内容 -->
    <div class="card-content-wrap">
      <!-- Part3-1: 个人简介 -->
      <div :class="{'content-part': isEditContentPart1}"
           class="card-content-part card-content-part1">
        <div class="head">
          <p class="head-title">个人简介</p>
          <p @click="onEditContentPart1"
             class="head-edit"
             v-if="!isEditContentPart1">编辑</p>
        </div>
        <textarea :placeholder="userBrief"
                  cols="5"
                  maxlength="255"
                  v-if="isEditContentPart1"
                  v-model="personInfo"></textarea>
        <p :class="{'part-content-info': userInfo.agent.person_info}"
           class="part-content"
           v-if="!isEditContentPart1">{{userBrief}}</p>
      </div>
      <!-- Part3-2: 公司简介 -->
      <div :class="{'content-part': isEditContentPart2}"
           class="card-content-part card-content-part2">
        <div class="head">
          <p class="head-title">公司简介</p>
          <p @click="onEditContentPart2"
             class="head-edit"
             v-if="!isEditContentPart2">编辑</p>
        </div>
        <textarea :placeholder="companyBrief"
                  cols="5"
                  maxlength="255"
                  v-if="isEditContentPart2"
                  v-model="companyInfo"></textarea>
        <p :class="{'part-content-info': userInfo.agent.person_info}"
           class="part-content"
           v-if="!isEditContentPart2">{{companyBrief}}</p>
      </div>
      <!-- Part3-3: 专业证书 -->
      <div class="card-content-part card-content-part3">
        <div class="head">
          <p class="head-title">专业证书</p>
        </div>
        <div class="part-content upload-default"
             v-if="isEmptyObj(professionImg)">
          <div class="upload-btn" v-if="!certificate">
            <p class="plus">+</p>
            <p>添加专业证书</p>
          </div>
        </div>
        <ImgInputer
          :class="{'input-bg': certificate}"
          :imgSrc="certificate"
          :max-size="10240"
          :on-change="imageChange"
          accept="image/*"
          ref="imgInputer"
          v-model="professionImg">
        </ImgInputer>
      </div>

      <!-- Part3-4: 保存按钮 -->
      <div @click="handleSave" class="card-btn-wrap">
        <p>保存</p>
      </div>
    </div>

  </div>
</template>

<script>
  import NameCard from '../../components/name-card';
  import {getAgentUserInfo, postAgentUpdateGuestCard, postAgentUploadPic} from '../../api/agent';
  import {mapGetters, mapMutations} from 'vuex';
  import {closeShare, deepClone, isEmptyObj, openShare} from '../../utils/base-methods';
  import ImgInputer from '../../assets/js/index';
  import Compressor from 'compressorjs';
  import {Toast} from 'mint-ui'


  export default {
    name: 'CardEdit',

    components: {NameCard, ImgInputer},

    data () {
      return {
        title: '获客名片', // 初始进入页面显示获客名片，分享出去之后显示xxx的获客名片

        userBrief: '请输入您的个人简介', // 个人简介默认信息, placeholder

        personInfo: '', // 个人简介

        isEditContentPart1: false, // 是否可以编辑个人简介

        companyBrief: '请输入您的公司简介', // 公司简介默认信息，placeholder

        companyInfo: '', // 公司简介

        isEditContentPart2: false, // 是否可以编辑公司简介

        professionBrief: '暂未上传图片 点击编辑名片上传哦~', // 专业证书暂未上传默认提示

        certificate: '', // 专业证图片服务端地址

        professionImg: {}, // 专业证图片

        isShowInitLoading: true, // 是否展示页面加载动画

        isEmptyObj // 判断对象是否为空
      }
    },

    computed: {
      ...mapGetters(['userInfo'])
    },

    created () {
      closeShare(); // 隐藏分享

      // 获取个人信息
      this.getUserInfoData();

      // 动态设置微信title
      // this.title = `${this.userInfo && this.userInfo.agent && this.userInfo.agent.user_name}的名片`;
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
        this.isShowInitLoading = true;
        getAgentUserInfo().then(res => {
          this.isShowInitLoading = false;
          let userInfo = deepClone(this.userInfo);
          userInfo.advice = res.advice;
          userInfo.agent = res.agent;

          // 动态设置微信title
          this.title = `${res.agent && res.agent.user_name}的名片`;

          res.agent && res.agent.person_info && (this.userBrief = res.agent.person_info); // 个人简介赋值
          this.personInfo = this.userBrief === '请输入您的个人简介' ? '' : this.userBrief;
          res.agent && res.agent.company_info && (this.companyBrief = res.agent.company_info); // 公司简介赋值
          this.companyInfo = this.companyBrief === '请输入您的公司简介' ? '' : this.companyBrief;
          res.agent && res.agent.certificate && (this.certificate = res.agent.certificate); // 证书信息赋值
          // res.agent && res.agent.certificate && (this.certificate = ''); // 证书信息赋值
          this['SET_USERINFO'](userInfo);
        }).catch(() => {
          this.isShowInitLoading = false;
        })
      },

      /**
       * 显示获客蒙层
       */
      showShadow () {
        this.isShowShadow = true;
      },

      /**
       * 隐藏获客蒙层
       */
      hiddenShadow () {
        this.isShowShadow = false;
      },

      /**
       * 跳转到获客名片编辑
       */
      jumpToCardEdit () {
        location.href = '/card-edit';
      },

      /**
       * 点击编辑个人简介
       */
      onEditContentPart1 () {
        this.isEditContentPart1 = true;
        console.log(this.personInfo)
      },

      /**
       * 点击编辑个人简介
       */
      onEditContentPart2 () {
        this.isEditContentPart2 = true;
      },

      /**
       * 点击保存
       */
      handleSave () {
        console.log(this.personInfo);
        console.log(this.companyInfo);
        console.log(this.professionImg);

        postAgentUpdateGuestCard({
          person_info: this.personInfo,
          company_info: this.companyInfo,
          certificate: this.certificate
        }).then(() => {
          // this.$router.go(-1);
          location.href = '/card'
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
       * 上传图片钩子
       * @param file
       */
      async uploadPic (file) {
        // 需要判断图片的大小
        if (this.professionImg.type) {
          if (this.professionImg.size > 10240000) {
            Toast('图片大小不能超过10M');
            return false;
          }
        }

        // 开始上传所需的操作
        this['SET_LOADING']('open');

        // 需要先对图片进行压缩，并且上传
        let compressImg = {};

        // 假如图片超过2M，则需要先进行压缩
        if (this.professionImg.size > 2056000) {
          compressImg = await this.compressImage(this.professionImg);
        } else {
          compressImg = this.professionImg;
        }

        let imgData = new FormData();
        imgData.append('fname', compressImg);
        imgData.append('type', 2);

        postAgentUploadPic(imgData)
          .then(res => {
            Toast('上传成功，保存信息后将会生效');
            this['SET_LOADING']('close');
            this.certificate = res.url;
          })
      },

      /**
       * 监听到图片改变，自动提交操作
       */
      imageChange () {
        this.uploadPic();
      }

    },

    watch: {
      personInfo (v) {
        !v && (this.userBrief = '请输入您的个人简介');
      },
      companyInfo (v) {
        !v && (this.companyBrief = '请输入您的公司简介');
      }
    },

    beforeDestroy () {
      openShare();
    }
  }
</script>


<style lang="scss" scoped>
  $base-color: #1C52BB;
  .mine-card-edit {

    .name-card-wrap {
      padding-top: 0.267rem;
    }

    .card-content-wrap {
      padding: 0.693rem 0.373rem 0;

      .card-content-part {
        &:not(:last-of-type) {
          margin-bottom: 1.2rem;
        }

        &.content-part {
          margin-bottom: 0;
        }
        &.card-content-part3 {
          margin-bottom: 0;
        }

        margin-bottom: 0.88rem;

        .part-content {
          margin-top: 0.267rem;
          font-size: 0.373rem;
          color: #999999;
          line-height: 0.453rem;

          &.part-content-info {
            font-size: 0.373rem;
            color: #666666;
            line-height: 0.56rem;
          }

          img {
            height: 100%;
            max-width: 100%;
          }
        }

        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E2E2E2;

          .head-title {
            font-size: 0.427rem;
            line-height: 0.693rem;
            color: #333333;
          }

          .head-edit {
            padding: 6px 0 6px 10px;
            font-size: 0.32rem;
            color: $base-color;
          }
        }

        textarea {
          display: block;
          width: 100%;
          height: 2.24rem;
          margin-top: 0.267rem;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-appearance: none;
          border: none;
          font-size: 0.373rem;
          color: #666666;
          line-height: 0.56rem;
        }

        .upload-default {
          position: absolute;
          left: 0;
          padding-left: 0.987rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0.373rem auto 0.44rem;
          width: 8.053rem;
          height: 4.8rem;

          .upload-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 4rem;
            height: 0.933rem;
            background-color: #EEEEEE;
            border-radius: 0.48rem;

            .plus {
              margin-right: 0.16rem;
              font-size: 0.693rem;
              color: $base-color;
            }
          }
        }

      }
    }

    .card-btn-wrap {
      /*position: fixed;*/
      /*z-index: 100;*/
      /*bottom: 0;*/
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: -0.373rem;
      width: 100vw;
      height: 1.173rem;
      background-color: $base-color;

      p {
        font-size: 0.373rem;
        color: #ffffff;
        line-height: 21px;
      }
    }

    .img-inputer {
      position: relative;
      z-index: 10;
      margin: 0.373rem auto 0.44rem;
      width: 8.053rem;
      height: 4.8rem;
      text-align: center;
      /*background-color: #F3F3F3;*/
      img {
        height: 200px;
      }
    }

    .input-bg {
      max-width: 100%;
      background-color: #F3F3F3;
    }

  }

</style>
