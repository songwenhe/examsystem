<template>
  <div class="frontpage-container container">
    <el-container>
      <el-header></el-header>
      <el-main>
        <h1 class="h1">成都东软学院在线考试教学辅助系统</h1>
        <div class="frontpageBtn">
          <router-link class="box" to="/contest"><i class="el-icon-s-platform iconfont"></i>
            <h4>考试</h4>
            <p>即使是正规的教学考试，也能轻松应对，准确评判</p>
          </router-link>
          <router-link class="box" to="/contest"><i class="el-icon-s-order iconfont"></i>
            <h4>题库</h4>
            <p>适合教学使用的题目，合理的题目分类</p>
          </router-link>
          <router-link class="box" to="/contest"><i class="el-icon-chat-line-round iconfont"></i>
            <h4>社区</h4>
            <p>在这里同学可以分享自己的学习体验，解答疑惑</p>
          </router-link>
        </div>
      </el-main>
      <el-footer class="footer">
        <p><a href="">关于我们</a>|<a href="">联系我们</a></p>
        <p>© 2020 NSU All Rights Reserved</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}

.container {
  background-image: linear-gradient(to top right, #12cbc4, #0652dd);
}

.frontpage-container {
  display: flex;
  flex-flow: column;
  min-height: 100%;
  background-color: #fcfdff;
  color: #fff;
}

.h1 {
  font-size: 30px;
  font-weight: normal;
  text-align: center;
  margin-bottom: 200px;
}

.footer {
  text-align: center;
}

.frontpageBtn {
  text-align: center;

  .box {
    text-decoration: none;
    display: inline-block;
    width: 200px;
    height: 200px;
    padding: 14px;
    margin-right: 10px;
    border-radius: 10px;
    color: #dcdde1;
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
  }
}

.iconfont {
  font-size: 4em;
  display: block;
}
</style>>
