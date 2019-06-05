<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    created () {
      if (process.env.version) {
        console.log(`版本：${process.env.version}`);
      }
    }
  }
</script>

<style lang="scss"  scoped="scoped">
  #app {
    width: 100%;
    min-height: 100%;
  }
</style>
