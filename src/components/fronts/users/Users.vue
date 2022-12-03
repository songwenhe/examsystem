<template>
  <div class="users-container">
    <el-container>
      <el-aside width="280px">
        <el-card class="box-card">
          <img src="@/assets/logo.495bc594.png" alt="" />
        </el-card>
        <el-card class="box-card">
          <h4>宋文禾</h4>
          <span><i class="el-icon-s-promotion">songwenhe1997@qq.com</i></span>
          <p>暂时没有任何信息</p>
        </el-card>
        <el-card class="box-card">
          <el-menu class="el-menu-vertical-demo" :router="true" :default-active="index">
            <el-menu-item index="person">
              <i class="el-icon-user"></i>
              <span slot="title">个人信息</span>
            </el-menu-item>
            <el-menu-item index="password">
              <i class="el-icon-edit"></i>
              <span slot="title">更改密码</span>
            </el-menu-item>
            <el-menu-item index="exam">
              <i class="el-icon-document"></i>
              <span slot="title">考试记录</span>
            </el-menu-item>
            <el-menu-item index="mypost">
              <i class="el-icon-chat-dot-square"></i>
              <span slot="title">我的发帖</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: ''
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin: 20px;
}
.users-container {
  width: 1300px;
}
</style>
