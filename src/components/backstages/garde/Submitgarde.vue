<template>
  <div class="submitgarde-container">
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
      <el-table-column align="center" label="试卷状态" prop="state"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="success" icon="el-icon-edit" @click="showAnswerCard(scope.$index, scope.row)" circle></el-button>
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

    <el-dialog :visible.sync="isDialogCorrect" width="40%" @close="clearDialog">
      <el-form :model="answerCard" :rules="correctRules" ref="correctForm">
        <el-form-item
          v-for="(item, index) in answerCard.miniProblem"
          :key="item.id"
          class="correctArea"
          :prop="'miniProblem.' + index + '.value'"
          :rules="[{ required: true, message: '分数不能为空', trigger: 'blur' }]"
        >
          <div>
            <label for="">题号</label>
            <el-input v-model="item.id" disabled></el-input>
            <label for="">考生答案</label>
            <el-input type="textarea" v-model="item.sAnswer" resize="none" :autosize="{ minRows: 2, maxRows: 6 }" disabled></el-input>
            <label for="">参考答案</label>
            <el-input type="textarea" v-model="item.answer" resize="none" :autosize="{ minRows: 2, maxRows: 6 }" disabled></el-input>
            <label for="">分值</label>
            <el-input v-model="item.score" disabled></el-input>
            <label for="">打分</label>
            <el-input v-model="item.value"></el-input>
          </div>
        </el-form-item>
        <h4 class="sumScore">总分：{{ totalScore }}</h4>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogCorrect = false">取 消</el-button>
        <el-button type="primary" @click="submitCorrect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const axios = require('axios')
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      isDialogCorrect: false,
      correctRules: {},
      pageUsers: [],
      contestData: {},
      tableData: [],
      correctForm: {},
      total: 0,
      problem: [],
      answerCard: {
        miniProblem: []
      },
      query: {
        size: 10,
        page: 1,
        keyword: ''
      },
      query1: {
        size: 999,
        page: 1,
        keyword: ''
      }
    }
  },
  computed: mapState({
    contest: (state) => state.contest,
    cMiniProblem() {
      return this.problem.filter((item) => item.questionType > 1)
    },
    totalScore() {
      let sum = 0
      this.answerCard.miniProblem.forEach((item) => {
        sum += Number(item.value) || 0
      })
      return sum
    }
  }),
  created() {
    this.contestData = this.contest
    this.query.keyword = this.$route.params.id
    this.getUsers()
    this.getProblemById()
  },
  methods: {
    clearDialog() {
      this.$refs.correctForm.resetFields()
    },
    showAnswerCard(index, row) {
      const arr = row.answerJson.split('_~_')
      this.problem.forEach((item, index) => {
        if (item.questionType > 1) {
          item.sAnswer = arr[index]
        }
      })
      this.currentCard = row
      this.isDialogCorrect = true
    },
    pageChange(res) {
      this.query.page = res
      this.pageGrade()
    },
    submitCorrect() {
      // this.$refs.correctForm.validate(async (valid) => {
      //   if (!valid) return
      //   const { status, data } = await this.$http.post('/grade/api/finishGrade', {
      //     manulResult: this.totalScore,
      //     contestId: this.id,
      //     autoResult: this.currentCard.autoResult,
      //     id: this.currentCard.id
      //   })
      //   if (status === 200) {
      //     if (data.success) {
      //       this.$message.success('批改成功')
      //       this.isDialogCorrect = false
      //       this.currentCard = {}
      //       this.getUsersByContestId()
      //     } else {
      //       this.$message.error('批改失败')
      //     }
      //   } else {
      //     this.$message.warning('请求失败')
      //   }
      // })
    },
    pageGrade() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/grade/api/pageGradeByContestId',
        params: this.query
      }).then((response) => {
        this.tableData = response.data.list.map((item) => {
          return {
            ...item,
            name: this.userName(item.studentId)
          }
        })
      })
    },
    getProblemById() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/question/api/getQuestionsByContestId',
        params: { contestId: this.$route.params.id }
      }).then((response) => {
        console.log(response)
        this.problem = response.data
        this.answerCard.miniProblem = this.cMiniProblem
      })
    },
    getUsers() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/pageAccount',
        data: this.query1
      }).then((response) => {
        this.pageUsers = response.data.list
        this.pageGrade()
      })
    },
    userName(id) {
      let user = this.pageUsers.find((item) => id === item.id)
      if (user !== undefined) return user.name
      else return '已注销'
    }
  }
}
</script>

<style lang="less" scoped>
.finish-correct {
  float: right;
  margin-right: 60px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.correctArea {
  border: 1px solid #000;
  padding: 30px;
  border-radius: 10px;
}

.sumScore {
  text-align: center;
  font-size: 30px;
}
</style>
