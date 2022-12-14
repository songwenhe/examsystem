<template>
  <div class="exam-container">
    <el-card class="box-card" shadow>
      <el-divider content-position="left"><i class="el-icon-document" style="font-size: 20px">考试记录</i></el-divider>
      <el-table :data="tableData" border>
        <el-table-column align="center" label="考试名称" prop="contestName"></el-table-column>
        <el-table-column align="center" label="考试开始时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="考试结束时间" prop="finishTime"></el-table-column>
        <el-table-column align="center" label="成绩" prop="result"></el-table-column>
      </el-table>
      <el-pagination @current-change="pageChange" :page-size="query.pageSize" :pager-count="11"
        layout="prev, pager, next" :total="total" style="margin-left: 0px"
        :current-page="query.pageNum"></el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableData: {},
      pageContest: {},
      total: 0,
      query: {
        pageSize: 10,
        pageNum: 1,
        studentId: ''
      },
      query1: {
        size: 999,
        page: 1,
        keyword: ''
      }
    }
  },
  created() {
    this.query.studentId = parseInt(localStorage.getItem('userId'))
    this.getContents()
  },
  methods: {
    pageChange(res) {
      this.query.pageNum = res
      this.getGrade()
    },
    getGrade() {
      this.$http({
        method: 'get',
        url: 'grade/api/pageGradeByStudentId',
        params: this.query
      }).then((response) => {
        this.total = response.data.totalPageNum
        this.tableData = response.data.grades.map((item) => {
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            finishTime: this.handleTime(item.finishTime),
            contestName: this.getcontestName(item.contestId)
          })
        })
      })
    },
    getContents() {
      this.$http({
        method: 'get',
        url: 'contest/api/pageContest',
        params: this.query1
      }).then((response) => {
        this.pageContest = response.data.list
        this.getGrade()
      })
    },
    handleTime(now) {
      const time = new Date(now)
      let res = ''
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      month = month > 9 ? month : '0' + month
      let day = time.getDate()
      day = day > 9 ? day : '0' + day
      let hour = time.getHours()
      hour = hour > 9 ? hour : '0' + hour
      let minutes = time.getMinutes()
      minutes = minutes > 9 ? minutes : '0' + minutes
      let seconds = time.getSeconds()
      seconds = seconds > 9 ? seconds : '0' + seconds
      res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
      return res
    },
    getcontestName(id) {
      let contest = this.pageContest.find((item) => id === item.id)
      if (contest !== undefined) return contest.title
      else return '综合实训'
    }
  }
}
</script>

<style>

</style>
