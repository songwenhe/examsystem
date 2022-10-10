<template>
  <div class="contest-container">
    <el-header>
      <el-menu mode="horizontal" :router="true" :collapse-transition="false" :default-active="index" @select="slt" class="el-menu-demo">
        <el-menu-item index="_frontpage">首页</el-menu-item>
        <el-menu-item index="contest">在线评测</el-menu-item>
        <el-menu-item index="subject">科目学习</el-menu-item>
        <el-menu-item index="share">分享中心</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>科目学习</el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    }
  }
}
</script>

<style></style>
