<template>
  <div class="product-outer">
    <div :class="'content-'+item" v-for="item in 6" :key="item"></div>
  </div>
</template>
<script>

export default {

}
</script>
<style lang="scss">
  .product-outer {
    .content-1{
      height: 8.906667rem;
      background: url('../../assets/images/product/product_desc1.png') no-repeat;
      background-size: cover;
    }
    .content-2{
      height: 4.64rem;
      background: url('../../assets/images/product/product_desc2.png') no-repeat;
      background-size: cover;
    }
    .content-3{
      height: 10.026667rem;
      background: url('../../assets/images/product/product_desc3.png') no-repeat;
      background-size: cover;
    }
    .content-4{
      height: 9.866667rem;
      background: url('../../assets/images/product/product_desc4.png') no-repeat;
      background-size: cover;
    }
    .content-5{
      height: 12.56rem;
      background: url('../../assets/images/product/product_desc5.png') no-repeat;
      background-size: cover;
    }
    .content-6{
      height: 4.026667rem;
      background: url('../../assets/images/product/product_desc6.png') no-repeat;
      background-size: cover;
    }
  }
</style>
