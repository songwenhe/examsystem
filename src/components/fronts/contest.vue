<template>
  <div class="contest-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线评测</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%; height: 100%">
        <el-table-column align="center" label="考试名称" prop="title"></el-table-column>
        <el-table-column align="center" label="开始时间" prop="startTime"></el-table-column>
        <el-table-column align="center" label="结束时间" prop="endTime"></el-table-column>
        <el-table-column align="center" label="考试科目" prop="subjectName"> </el-table-column>
        <el-table-column align="center" label="操作" prop="state">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper" v-if="scope.row.state === 1">
              <el-button type="info" disabled>未开始</el-button>
            </div>
            <div slot="reference" class="name-wrapper" v-else-if="scope.row.state === 2">
              <el-button type="success" @click="doContest(scope.$index, scope.row)">进入考试</el-button>
            </div>
            <div slot="reference" class="name-wrapper" v-else-if="scope.row.state === 3">
              <el-button type="danger" disabled>已结束</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageChange"
        :page-size="query.size"
        :pager-count="11"
        layout="prev, pager, next"
        :total="total"
        style="margin-left: 0px"
        :current-page="query.page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
import { mapState, mapMutations } from 'vuex'
export default {
  created() {
    this.getSubjects()
  },
  data() {
    return {
      scope: '考试名称',
      tableData: [],
      pageSubjects: [],
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      query: {
        size: 10,
        page: 1,
        keyword: ''
      }
    }
  },
  computed: mapState({}),
  methods: {
    ...mapMutations({
      setContest: 'setContest' // 将 `this.setPostDetail()` 映射为 `this.$store.commit('setPostDetail')`
    }),
    pageChange(res) {
      this.query.page = res
      this.getContents()
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
    doContest(index, row) {
      this.setContest(row)
      this.$router.push('contests/' + row.id + '/' + row.title)
    },
    subjectName(id) {
      let subject = this.pageSubjects.find((item) => id === item.id)
      if (subject !== undefined) return subject.name
      else return '综合实训'
    },
    getContents() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/contest/api/pageContest',
        params: this.query
      }).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          const nowTime = new Date().getTime()
          if (nowTime < item.startTime) {
            item.state = 1
          } else if (nowTime > item.startTime && nowTime < item.endTime) {
            item.state = 2
          } else if (nowTime > item.endTime) {
            item.state = 3
          }
          return Object.assign(item, {
            startTime: this.handleTime(item.startTime),
            endTime: this.handleTime(item.endTime),
            subjectName: this.subjectName(item.subjectId)
          })
        })
      })
    },
    getSubjects() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/subject/api/pageSubjects?size=999'
      }).then((response) => {
        this.pageSubjects = response.data.list
        this.getContents()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contest-container {
  min-width: 1300px;
}
</style>
