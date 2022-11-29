<template>
  <div class="test-container">
    <div style="height: 50px; text-align: center">
      <el-divider class="divider"><i class="el-icon-s-platform"></i>题目列表</el-divider>
    </div>
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>题目管理</el-breadcrumb-item>
        <el-breadcrumb-item>题目列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 60px">
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" class="inputSearch" style="width: 300px" />
      <el-button class="el-icon-search" size="medium" @click="getQuestions()"></el-button>
      <el-button size="medium" type="success" @click="dialogTableVisible = true">添加题目</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="600px">
      <el-table-column align="center" label="题号" prop="id"></el-table-column>
      <el-table-column align="center" label="题目" prop="title"></el-table-column>
      <el-table-column align="center" label="课程" prop="subjectName"></el-table-column>
      <el-table-column align="center" label="题型" prop="questionTypeName"> </el-table-column>
      <el-table-column align="center" label="难度" prop="difficulty">
        <template slot-scope="scope"><el-rate v-model="scope.row.difficulty" disabled></el-rate></template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" circle></el-button>
          <el-button size="medium" type="danger" icon="el-icon-delete" @click="openDel(scope.$index, scope.row)" circle></el-button>
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

    <el-dialog :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="题目分类">
          <el-select v-model="ruleForm.subjectId" filterable placeholder="请选择科目">
            <el-option v-for="item in pageSubjects" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目标题">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="题目类型">
          <el-select v-model="ruleForm.questionType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目答案" v-if="ruleForm.questionType === 0 || ruleForm.questionType === 1">
          <el-input type="textarea" v-model="ruleForm.optionA" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleForm.optionB" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleForm.optionC" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleForm.optionD" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="题目答案">
          <el-input type="textarea" v-model="ruleForm.answer"></el-input>
        </el-form-item>
        <el-form-item label="题目解析">
          <el-input type="textarea" v-model="ruleForm.parse"></el-input>
        </el-form-item>
        <el-form-item label="题目难度">
          <el-radio-group v-model="ruleForm.difficulty">
            <el-radio-button label="1"></el-radio-button>
            <el-radio-button label="2"></el-radio-button>
            <el-radio-button label="3"></el-radio-button>
            <el-radio-button label="4"></el-radio-button>
            <el-radio-button label="5"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目分数">
          <el-input v-model="ruleForm.score" size="mini" style="width: 100px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="putContest">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTableVisible" @close="clearTable">
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="题目分类">
          <el-select v-model="ruleTable.subjectId" filterable placeholder="请选择科目">
            <el-option v-for="item in pageSubjects" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目标题">
          <el-input v-model="ruleTable.title"></el-input>
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input type="textarea" v-model="ruleTable.content"></el-input>
        </el-form-item>
        <el-form-item label="题目类型">
          <el-select v-model="ruleTable.questionType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目答案" v-if="ruleTable.questionType === 0 || ruleTable.questionType === 1">
          <el-input type="textarea" v-model="ruleTable.optionA" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleTable.optionB" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleTable.optionC" size="mini"></el-input>
          <el-input type="textarea" v-model="ruleTable.optionD" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="题目答案">
          <el-input type="textarea" v-model="ruleTable.answer"></el-input>
        </el-form-item>
        <el-form-item label="题目解析">
          <el-input type="textarea" v-model="ruleTable.parse"></el-input>
        </el-form-item>
        <el-form-item label="题目难度">
          <el-radio-group v-model="ruleTable.difficulty">
            <el-radio-button label="1"></el-radio-button>
            <el-radio-button label="2"></el-radio-button>
            <el-radio-button label="3"></el-radio-button>
            <el-radio-button label="4"></el-radio-button>
            <el-radio-button label="5"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目分数">
          <el-input v-model="ruleTable.score" size="mini" style="width: 100px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearTable">取消</el-button>
        <el-button type="primary" @click="addSubject">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const axios = require('axios')

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
        answerSwitch: true,
        id: 1,
        state: 1,
        subjectId: 1,
        subjectName: 'string',
        title: '',
        totalScore: 0,
        content: '',
        questionType: 0,
        answer: 'A',
        parse: 'String',
        questionTypeName: '',
        difficulty: 1,
        score: 2,
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: ''
      },
      ruleTable: {
        answerSwitch: true,
        id: 1,
        state: 1,
        subjectId: '',
        subjectName: '',
        title: '',
        totalScore: 0,
        content: '',
        questionType: '',
        answer: '',
        parse: '',
        questionTypeName: '',
        difficulty: 1,
        score: 2,
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: ''
      },
      options: [
        {
          value: 0,
          label: '单选题'
        },
        {
          value: 1,
          label: '多选题'
        },
        {
          value: 2,
          label: '问答题'
        },
        {
          value: 3,
          label: '编程题'
        }
      ],
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
  methods: {
    openDel(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios({
            method: 'delete',
            url: 'http://127.0.0.1:8088/question/api/deleteQuestion/' + row.id
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              })
            }
            this.getQuestions()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    pageChange(res) {
      this.query.page = res
      this.getQuestions()
    },
    putContest() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/question/api/updateQuestion',
        data: this.ruleForm
      }).then((response) => {
        this.getQuestions()
        this.clearForm()
      })
    },
    addSubject() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/question/api/addQuestion',
        data: this.ruleTable
      }).then((response) => {
        this.getQuestions()
        this.clearTable()
      })
    },
    clearForm() {
      this.dialogFormVisible = false
    },
    clearTable() {
      Object.keys(this.ruleTable).forEach((key) => (this.ruleTable[key] = ''))
      this.dialogTableVisible = false
    },
    handleEdit(index, row) {
      // console.log(index, row)
      this.tableData1 = row
      this.dialogFormVisible = true
      this.ruleForm = row
      // this.ruleForm.title = row.title
      // this.ruleForm.subjectName = row.subjectName
      // this.ruleForm.id = row.id
      // this.ruleForm.state = row.state
      // this.ruleForm.totalScore = row.totalScore
      // this.ruleForm.subjectId = row.subjectId
      // this.ruleForm.content = row.content
      // this.ruleForm.questionType = row.questionType
      // this.ruleForm.answer = row.answer
      // this.ruleForm.parse = row.parse
      // this.ruleForm.difficulty = row.difficulty
      // this.ruleForm.score = row.score
      // this.ruleForm.optionA = row.optionA
      // this.ruleForm.optionB = row.optionB
      // this.ruleForm.optionC = row.optionC
      // this.ruleForm.optionD = row.optionD
    },
    subjectName(id) {
      // console.log(id)
      // console.log(this.pageSubjects)
      let subject = this.pageSubjects.find((item) => id === item.id)
      if (subject !== undefined) return subject.name
      else return '综合实训'
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
            subjectName: this.subjectName(item.subjectId),
            questionTypeName: this.getQuestionType(item.questionType)
          })
        })
        // console.log(this.tableData)
      })
    },
    getSubjects() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/subject/api/pageSubjects?size=999'
      }).then((response) => {
        this.pageSubjects = response.data.list
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
.divider {
  .el-divider__text {
    font-size: 30px;
  }
}
</style>
