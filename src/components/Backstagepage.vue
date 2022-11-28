<template>
  <div id="backstagepage">
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '260px'">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">1</el-radio-button>
            <el-radio-button :label="true">1</el-radio-button>
          </el-radio-group> -->
        <el-menu
          :router="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          :default-active="index"
          class="el-menu-vertical-demo"
          @select="slt"
        >
          <el-menu-item index="/_backstagepage/_contests">
            <i class="el-icon-s-platform"></i>
            <span slot="title">考试管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_questions">
            <i class="el-icon-s-claim"></i>
            <span slot="title">题目管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_subjects">
            <i class="el-icon-s-order"></i>
            <span slot="title">科目管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_grades">
            <i class="el-icon-s-data"></i>
            <span slot="title">成绩管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_user">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_posts">
            <i class="el-icon-info"></i>
            <span slot="title">帖子管理</span>
          </el-menu-item>
          <el-menu-item index="/_backstagepage/_comments">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="left">
            <div class="toggle-menu" @click="toToggleMenu"><i class="el-icon-s-fold"></i></div>
            <div>成都东软学院考试平台控制台</div>
          </div>
          <!-- <li><img src="@/assets/logo.495bc594.png" alt="" /></li> -->
          <!-- <li>成都东软学院考试平台控制台</li> -->
          <div class="right">
            <img src="@/assets/th.jpg" alt="" class="img" />
            <el-dropdown @command="handleCommand">
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
export default {
  name: 'backstagepage',
  data() {
    return {
      userName: 'string',
      isCollapse: false,
      index: ''
    }
  },
  created() {
    this.userName = localStorage.getItem('userName')
    this.index = localStorage.getItem('index')
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
    }
  }
}
</script>
<style lang="less">
.header {
  display: flex;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  line-height: 60px;
  /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
  box-shadow: 0px 3px 2px 2px rgba(0, 0, 0, 0.3);
  list-style: none;
  padding: 0;
  margin: 0;
  height: 60px;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
  }
  .img {
    margin-right: 10px;
    height: 90%;
  }
}
.toggle-menu {
  // width: 100%;
  color: #6c5ce7;
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
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
