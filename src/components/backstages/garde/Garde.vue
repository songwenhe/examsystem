<template>
  <div class="garde-container">
    <div style="height: 50px; text-align: center" class="split-line">
      <el-divider><i class="el-icon-s-platform"></i>{{ contestData.title }}</el-divider>
    </div>
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/_backstagepage/_grades' }">成绩管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ contestData.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table :data="tableData" style="width: 90%" max-height="500px">
      <el-table-column align="center" label="学号" prop="studentId"></el-table-column>
      <el-table-column align="center" label="姓名" prop="name"></el-table-column>
      <el-table-column align="center" label="选择题分数" prop="autoResult"></el-table-column>
      <el-table-column align="center" label="主观题分数" prop="manulResult"></el-table-column>
      <el-table-column align="center" label="总分" prop="result"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      pageUsers: [],
      contestData: {},
      tableData: [],
      query: {
        size: 999,
        page: 1,
        keyword: ''
      }
    }
  },
  computed: mapState({
    contest: (state) => state.contest
  }),
  created() {
    this.contestData = this.contest
    this.getUsers()
  },
  methods: {
    async getGrade() {
      const response = await this.$http({
        method: 'get',
        url: 'grade/api/pageGradeByContestId',
        params: { keyword: this.$route.params.id }
      })
      console.log(response)
      this.tableData = response.data.list.map((item) => {
        return {
          ...item,
          name: this.userName(item.studentId)
        }
      })
    },
    async getUsers() {
      const response = await this.$http({
        method: 'post',
        url: 'account/pageAccount',
        data: this.query
      })
      this.pageUsers = response.data.list
      this.getGrade()
    },
    userName(id) {
      let user = this.pageUsers.find((item) => id === item.id)
      if (user !== undefined) return user.name
      else return '未获取到名字'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
