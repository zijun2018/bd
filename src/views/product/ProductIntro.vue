<template>
  <div class="product-intro-outer">
    <div class="product-intro">
      <img :src="imgUrl" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgUrl: this.$route.params.imgUrl
    }
  }
}
</script>
<style lang="scss" scoped>
  .product-intro-outer {
    width: 100%;
    height: 100vh;
    .product-intro {
      width: 100%;
      height: 100%;
      img {
        width: 100%
      }
    }
  }
</style>


