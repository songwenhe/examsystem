<template>
  <div class="index-container">
    <h1 class="h1">成都东软学院在线考试教学辅助系统</h1>
    <div class="frontpageBtn">
      <router-link class="box" to="/contest"
        ><i class="el-icon-s-platform iconfont"></i>
        <h4>考试</h4>
        <p>即使是正规的教学考试，也能轻松应对，准确评判</p>
      </router-link>
      <router-link class="box" to="/contest"
        ><i class="el-icon-s-order iconfont"></i>
        <h4>题库</h4>
        <p>适合教学使用的题目，合理的题目分类</p>
      </router-link>
      <router-link class="box" to="/contest"
        ><i class="el-icon-chat-line-round iconfont"></i>
        <h4>社区</h4>
        <p>在这里同学可以分享自己的学习体验，解答疑惑</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.h1 {
  font-size: 30px;
  font-weight: normal;
  text-align: center;
  margin-bottom: 200px;
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
</style>
