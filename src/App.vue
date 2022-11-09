<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="less" scoped>
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #eee;
  min-width: 1300px;
}
</style>
<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #eee;
  min-width: 1300px;
}
.split-line {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 30px;
  text-align: center;
  font-weight: 600;
}
</style>
