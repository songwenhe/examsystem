<template>
  <div class="frontpage-container">
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer class="footer" height="auto">
        <p><a href="">关于我们</a>|<a href="">联系我们</a></p>
        <p>© 2020 NSU All Rights Reserved</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
.frontpage-container {
  display: flex;
  flex-flow: column;
  min-height: 100%;
  background-color: #fcfdff;
  background-image: linear-gradient(to top right, #12cbc4, #0652dd);
}
.footer {
  text-align: center;
}
</style>
