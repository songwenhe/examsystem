<template>
  <div id="backstagepage">
    <el-container>
      <el-header>
        <ul>
          <li><img src="@/assets/logo.495bc594.png" alt="" /></li>
          <li>成都东软学院考试平台控制台</li>
          <li>
            <img src="@/assets/th.jpg" alt="" style="margin-left: 480px" />
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">admin<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="center">个人中心</el-dropdown-item>
                <el-dropdown-item command="quit">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group>
          <el-menu
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapse"
            :default-active="index"
            class="el-menu-vertical-demo"
            @select="slt"
          >
            <el-menu-item index="_contests"> <i class="el-icon-menu"></i><span slot="title">考试管理</span> </el-menu-item>
            <el-menu-item index="_questions">
              <i class="el-icon-location"></i>
              <span slot="title">题目管理</span>
            </el-menu-item>
            <el-menu-item index="_subjects">
              <i class="el-icon-document"></i>
              <span slot="title">科目管理</span>
            </el-menu-item>
            <el-menu-item index="_grades">
              <i class="el-icon-setting"></i>
              <span slot="title">成绩管理</span>
            </el-menu-item>
            <el-menu-item index="_user">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="_posts">
              <i class="el-icon-location"></i>
              <span>帖子管理</span>
            </el-menu-item>
            <el-menu-item index="_comments">
              <i class="el-icon-location"></i>
              <span>评论管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main width="100%">
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
      isCollapse: false,
      index: ''
    }
  },
  created() {
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
<style lang="less">
.el-header {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  line-height: 60px;
  /* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
  box-shadow: 0px 3px 2px 2px rgba(0, 0, 0, 0.3);
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    height: 60px;
    li {
      flex: 1;
      img {
        height: 90%;
        float: left;
      }
    }
  }
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
