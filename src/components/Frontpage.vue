<template>
  <div class="frontpage-container">
    <el-container>
      <el-header class="f-header">
        <div class="title">在线考试系统</div>
        <el-menu text-color="#f1f2f6" background-color="#00162a" mode="horizontal" :router="true"
          active-text-color="#409eff" :collapse-transition="false" :default-active="index" @select="slt"
          class="el-menu-demo nav">
          <el-menu-item index="/_frontpage/index">首页</el-menu-item>
          <el-menu-item index="/_frontpage/contest">在线评测</el-menu-item>
          <el-menu-item index="/_frontpage/subject">科目学习</el-menu-item>
          <el-menu-item index="/_frontpage/shares">分享中心</el-menu-item>
        </el-menu>
        <div class="usermenu">
          <img :src="userImg" alt="" class="img" />
          <el-dropdown @command="handleCommand" size="medium" class="drop">
            <span class="el-dropdown-link">{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="center">个人中心</el-dropdown-item>
              <el-dropdown-item command="quit">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <el-footer class="footer" height="auto">
        <p><a href="javascript:;">关于我们</a>|<a href="javascript:;">联系我们</a></p>
        <p>© 2020 NSU All Rights Reserved</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

export default {
  data() {
    return {
      userName: '',
      index: '',
      userImg: ''
    }
  },
  created() {
    this.userId = localStorage.getItem('userId')
    this.index = localStorage.getItem('index')
    this.getUser()
  },
  methods: {
    slt(evt) {
      localStorage.setItem('index', evt)
      this.index = localStorage.getItem('index')
    },
    handleCommand(command) {
      if (command === 'quit') {
        this.$router.push('/_login')
      } else if (command === 'center') {
        this.index = ''
        this.$router.push('/_frontpage/users')
      }
    },
    async getUser() {
      const response = await this.$http({
        method: 'get',
        url: 'account/getById',
        params: { id: this.userId }
      })
      this.userImg = 'http://localhost:8088/' + response.data.avatarImgUrl
      this.userName = response.data.name
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}

.title {
  font-size: 20px;
  width: 300px;
  line-height: 60px;
  text-align: center;
}

.f-header {
  background-color: #00162a;
  justify-content: space-between;
  display: flex;
  color: #f1f2f6;
}

// .is-active {
//   background-color: #409eff;
// }
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

.main {
  padding: 0;
  margin: auto;
}

.nav {
  margin-left: auto;
  margin-right: 30px;
}

.footer {
  text-align: center;
}

.main-container {
  min-width: 1300px;
  background-color: #fff;
}

.usermenu {
  display: flex;
  align-items: center;
  height: 100%;

  .img {
    height: 90%;
    margin-right: 10px;
    border-radius: 50%;
  }

  .drop {
    color: #f1f2f6;
  }
}
</style>
