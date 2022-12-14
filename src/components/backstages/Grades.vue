<template>
  <div class="test-container">
    <div style="height: 50px; text-align: center">
      <el-divider class="divider"><i class="el-icon-s-platform"></i>成绩列表</el-divider>
    </div>
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
        <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 60px">
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" style="width: 300px"
        @input="getContents()" />
      <el-button class="el-icon-search" size="medium" @click="getContents()"></el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="600px">
      <el-table-column align="center" label="考试名称" prop="title"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="startTime"></el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime"></el-table-column>
      <el-table-column align="center" label="考试科目" prop="subjectName"> </el-table-column>
      <el-table-column align="center" label="当前状态" prop="state">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-if="scope.row.state === 1">
            <el-tag>未开始</el-tag>
          </div>
          <div slot="reference" class="name-wrapper" v-else-if="scope.row.state === 2">
            <el-tag type="success">进行中</el-tag>
          </div>
          <div slot="reference" class="name-wrapper" v-else-if="scope.row.state === 3">
            <el-tag type="danger">已结束</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="success" icon="el-icon-search" @click="goGrade(scope.$index, scope.row)"
            circle></el-button>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="submitGrade(scope.$index, scope.row)"
            circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="pageChange" :page-size="query.size" :pager-count="11" layout="prev, pager, next"
      :total="total" style="margin-left: 0px" :current-page="query.page"></el-pagination>
  </div>
</template>

<script>

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
      tableData1: {},
      ruleForm: {
        data1: [],
        title: '',
        endTime: '',
        id: 1,
        startTime: '',
        state: 1,
        subjectId: 1,
        subjectName: 'string',
        title: 'string',
        totalScore: 0
      },
      ruleTable: {
        data1: [],
        endTime: '',
        startTime: '',
        subjectId: '',
        title: ''
      },
      // rules: {
      //   name: [
      //     { required: true, message: '考试名称', trigger: 'blur' },
      //     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      //   ],
      //   region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
      //   date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      //   date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
      //   type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
      //   resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
      //   desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      // },
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
    goGrade(index, row) {
      this.setContest(row)
      this.$router.push(`_grade/${row.id}/${row.title}`)
    },
    pageChange(res) {
      this.query.page = res
      this.getContents()
    },
    async putContest() {
      const startTime = new Date(this.ruleForm.data1[0]).getTime()
      const endTime = new Date(this.ruleForm.data1[1]).getTime()
      await this.$http({
        method: 'put',
        url: 'contest/api/updateContest',
        data: Object.assign(this.ruleForm, {
          startTime,
          endTime
        })
      })
      this.getContents()
      this.clearForm()
    },
    async addSubject() {
      const startTime = new Date(this.ruleTable.data1[0]).getTime()
      const endTime = new Date(this.ruleTable.data1[1]).getTime()
      await this.$http({
        method: 'post',
        url: 'contest/api/addContest',
        data: Object.assign(this.ruleTable, {
          startTime,
          endTime
        })
      })
      this.getContents()
      this.clearTable()
    },
    clearForm() {
      this.ruleForm.data1 = []
      this.dialogFormVisible = false
    },
    clearTable() {
      this.ruleTable.data1 = []
      this.ruleTable.title = ''
      this.ruleTable.id = 1
      this.dialogTableVisible = false
    },
    submitGrade(index, row) {
      this.$router.push(`_submitgrade/${row.id}/${row.title}`)
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
    subjectName(id) {
      // console.log(id)
      // console.log(this.pageSubjects)
      let subject = this.pageSubjects.find((item) => id === item.id)
      if (subject !== undefined) return subject.name
      else return '综合实训'
    },
    async getContents() {
      const response = await this.$http({
        method: 'get',
        url: 'contest/api/pageContest',
        params: this.query
      })
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
    },
    async getSubjects() {
      const response = await this.$http({
        method: 'get',
        url: 'subject/api/pageSubjects?size=999'
      })
      this.pageSubjects = response.data.list
      this.getContents()
    }
  }
}
</script>

<style lang="less" scoped>
.divider {
  .el-divider__text {
    font-size: 30px;
  }
}
</style>
