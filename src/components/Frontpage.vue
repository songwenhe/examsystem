<template>
  <div class="frontpage-container">
    <el-container>
      <el-main class="frontpage">
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
  min-width: 1300px;
  display: flex;
  justify-content: center;
  flex-flow: column;
  min-height: 100%;
  background-color: #fcfdff;
  .frontpage {
    display: flex;
    justify-content: center;
  }
}
.footer {
  text-align: center;
}
</style>
