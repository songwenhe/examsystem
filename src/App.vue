<template>
  <div id="app">
    <el-container>
      <el-header>
        <ul>
          <li><img src="@/assets/logo.495bc594.png" alt="" /></li>
          <li>成都东软学院考试平台控制台</li>
          <li>
            <img src="@/assets/th.jpg" alt="" style="margin-left: 480px" />
            <span>admin</span>
            <el-dropdown>
              <i class="el-icon-caret-bottom" style="margin-left: 10px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出系统</el-dropdown-item>
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
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="1"> <i class="el-icon-menu"></i><span>导航一</span> </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-location"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-location"></i>
              <span>导航五</span>
            </el-menu-item>
            <el-menu-item index="6">
              <i class="el-icon-location"></i>
              <span>导航六</span>
            </el-menu-item>
            <el-menu-item index="7">
              <i class="el-icon-location"></i>
              <span>导航七</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
