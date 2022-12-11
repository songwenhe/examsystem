<template>
  <div id="backstagepage">
    <el-container style="height: 100%">
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">1</el-radio-button>
            <el-radio-button :label="true">1</el-radio-button>
          </el-radio-group> -->
        <el-menu
          background-color="#304156"
          :router="true"
          :collapse-transition="true"
          :collapse="isCollapse"
          :default-active="index"
          class="el-menu-vertical-demo nav"
          @select="slt"
        >
          <el-menu-item index="/_backstagepage/_contests" class="nav-item">
            <i class="el-icon-s-platform"></i>
            <span slot="title">考试管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_questions" class="nav-item">
            <i class="el-icon-s-claim"></i>
            <span slot="title">题目管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_subjects" class="nav-item">
            <i class="el-icon-s-order"></i>
            <span slot="title">科目管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_grades" class="nav-item">
            <i class="el-icon-s-data"></i>
            <span slot="title">成绩管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_user" class="nav-item">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_posts" class="nav-item">
            <i class="el-icon-info"></i>
            <span slot="title">帖子管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_comments" class="nav-item">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="left">
            <div class="toggle-menu" @click="toToggleMenu"><i class="el-icon-s-fold"></i></div>
            <div>在线考试平台控制台</div>
          </div>
          <!-- <li><img src="@/assets/logo.495bc594.png" alt="" /></li> -->
          <!-- <li>成都东软学院考试平台控制台</li> -->
          <div class="right">
            <el-button type="text" class="front" @click="toFront"><i class="el-icon-monitor"></i>访问前台</el-button>
            <img :src="userImg" alt="" class="img" />
            <el-dropdown @command="handleCommand" class="drop">
              <span class="el-dropdown-link">{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="center">个人中心</el-dropdown-item>
                <el-dropdown-item command="quit">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
const axios = require('axios')
export default {
  name: 'backstagepage',
  data() {
    return {
      userImg: '',
      userName: '',
      userId: 0,
      isCollapse: false,
      index: ''
    }
  },
  created() {
    this.userId = localStorage.getItem('userId')
    this.index = localStorage.getItem('index')
    this.getUser()
  },
  methods: {
    toToggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    slt(evt) {
      localStorage.setItem('index', evt)
      this.index = localStorage.getItem('index')
    },
    handleCommand(command) {
      if (command === 'quit') {
        this.$router.push('/_login')
      }
    },
    toFront() {
      this.$router.push('/_frontpage')
    },
    async getUser() {
      const response = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/account/getById',
        params: { id: this.userId }
      })
      this.userImg = 'http://localhost:8088/' + response.data.avatarImgUrl
      this.userName = response.data.name
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  display: flex;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  line-height: 60px;
  background-color: #409eff;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 60px;
  justify-content: space-between;
  .front {
    color: #fff;
    margin-right: 20px;
  }
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
  }
  .img {
    border-radius: 50%;
    margin-right: 10px;
    height: 90%;
  }
  .drop {
    margin-right: 20px;
  }
}
.toggle-menu {
  // width: 100%;
  color: #fff;
  text-align: center;
  padding: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: letter-spacing 0.5s;
}

.toggle-menu:hover {
  color: blue;
  letter-spacing: 0.5em;
}
.el-main {
  padding: 20px;
}

body > .el-container {
  margin-bottom: 40px;
}

#backstagepage {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: space-evenly;
  .nav-item {
    color: #bfcbd9;
    display: flex;
    // flex: 1;
    // height: 100px;
    justify-content: center;
    align-items: center;
  }
}
</style>
