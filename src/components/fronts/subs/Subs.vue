<template>
  <div class="subs-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/_frontpage/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>科目学习</el-breadcrumb-item>
        <el-breadcrumb-item>{{ subName.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table :data="tableData" style="width: 100%" empty-text>
      <el-table-column align="center" label="题号" prop="id"></el-table-column>
      <el-table-column align="center" label="题目" prop="title"></el-table-column>
      <el-table-column align="center" label="难度" prop="difficulty">
        <template slot-scope="scope"><el-rate v-model="scope.row.difficulty" disabled></el-rate></template>
      </el-table-column>
      <el-table-column align="center" label="题型" prop="questionTypeName"> </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="openDel(scope.$index, scope.row)" plain>详情</el-button>
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
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      tableData: [],
      pageSubjects: [],
      subName: {},
      total: 0,
      query: {
        size: 10,
        page: 1,
        keyword: '',
        subjectId: 0
      }
    }
  },
  created() {
    this.query.subjectId = parseInt(localStorage.getItem('subjectId'))
    this.getSubjects()
  },
  methods: {
    openDel(index, row) {
      this.$router.push('/_frontpage/problem/' + row.id)
      localStorage.setItem('questionId', row.id)
    },
    pageChange(res) {
      this.query.page = res
      this.getQuestions()
    },
    getQuestions() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/question/api/pageQuestion',
        params: this.query
      }).then((response) => {
        /* this.tableData = response.data.list
        this.tableData.forEach((item) => {
          item.startTime = this.handleTime(item.startTime)
          item.endTime = this.handleTime(item.endTime)
          item.subjectId = this.subjectName(item.subjectId)
          // console.log(Data.subjectName(item.subjectId))
        }) */
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          /*  return {
            ...item,
            startTime: this.handleTime(item.startTime),
            endTime: this.handleTime(item.endTime),
            subjectId: this.subjectName(item.subjectId)
          } */
          return Object.assign(item, {
            questionTypeName: this.getQuestionType(item.questionType)
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
        this.subName = this.pageSubjects.find((item) => this.query.subjectId === item.id)
        console.log(this.pageSubjects)
        console.log(this.query.subjectId)
        console.log(this.subName)
        this.getQuestions()
      })
    },
    getQuestionType(type) {
      if (type === 0) {
        return '单选题'
      } else if (type === 1) {
        return '多选题'
      } else if (type === 2) return '问答题'
      else if (type === 3) return '编程题'
      else return '未知题型'
    }
  }
}
</script>

<style lang="less" scoped>
.subs-container {
  padding: 20px;
  width: 1300px;
}
</style>
