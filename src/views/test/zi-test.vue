/**
*   @Project:   测试文件-子俊
*   @Author:    Zi_Jun
*   @Email:     zijun2030@gmail.com
*   @Date:      2019/4/13 14:51
*   @Note:
*/

<template>
  <div class="test-view">
    <div class="test-view-dom"
         ref="element"
         v-if="isShowDom && !saveImage">
      <!--         v-if="isShowDom && !saveImage">-->
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
      <p>我是子俊测试</p>
    </div>

    <div class="save-image" v-if="saveImage && saveImage">
      <img :src="saveImage.src" alt="" style="width: 100%; height: 100%">
    </div>

    <div @click="onSaveImage(saveImage.src, '11111')" class="btn">点击保存图片</div>
  </div>
</template>

<script>
  import {generateCanvasImage} from '../../utils/base-methods';

  export default {
    name: 'zi-test',
    data () {
      return {
        isShowDom: true,
        saveImage: ''
      }
    },

    mounted () {
      let targetDom = this.$refs.element;
      generateCanvasImage(targetDom, 2, false, (DOM) => {
        this.saveImage = DOM;
        console.log(DOM);
      });
    },

    methods: {
      onSaveImage () {
        alert('999999')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .test-view {
    .test-view-dom {
      background: url("../../assets/images/product/product_desc1.png");
      background-size: cover;
      color: #ffffff;
    }

    .btn {
      background-color: red;
      border: 1px solid orange;
    }
  }

</style>

