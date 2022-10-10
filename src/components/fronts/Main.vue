<template>
  <div class="contest-container">
    <el-header>
      <el-menu mode="horizontal" :router="true" :collapse-transition="false" :default-active="index" @select="slt" class="el-menu-demo">
        <el-menu-item index="_frontpage"><img src="@/assets/logo.495bc594.png" alt="" height="100%" /></el-menu-item>
        <el-menu-item index="_frontpage">首页</el-menu-item>
        <el-menu-item index="contest">在线评测</el-menu-item>
        <el-menu-item index="subject">科目学习</el-menu-item>
        <el-menu-item index="share">分享中心</el-menu-item>
        <el-menu-item class="usermenu">
          <img src="@/assets/th.jpg" alt="" height="100%" />
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="center">个人中心</el-dropdown-item>
              <el-dropdown-item command="quit">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      index: ''
    }
  },
  created() {
    this.userName = localStorage.getItem('userName')
    this.index = localStorage.getItem('index')
  },
  methods: {
    slt(evt) {
      localStorage.setItem('index', evt)
      this.index = localStorage.getItem('index')
    },
    handleCommand(command) {
      if (command === 'quit') {
        this.$router.push('/_login')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.usermenu {
  position: absolute;
  right: 10px;
}
</style>
