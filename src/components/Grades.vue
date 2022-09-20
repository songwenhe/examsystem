<template>
  <div class="test-container">
    <div style="height: 50px; text-align: center">
      <el-divider><i class="el-icon-s-platform"></i>成绩列表</el-divider>
    </div>
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
        <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 60px">
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" style="width: 300px" @input="getContents()" />
      <el-button class="el-icon-search" size="medium" @click="getContents()"></el-button>
      <el-button size="medium" type="success" @click="dialogTableVisible = true">添加考试</el-button>
    </div>
    <el-table :data="tableData" style="width: 90%" height="500px">
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
          <el-button size="medium" type="success" icon="el-icon-search" circle></el-button>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" circle></el-button>
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
        <el-form-item label="考试名称">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="考试科目">
          <el-select v-model="ruleForm.subjectId" filterable placeholder="请选择科目">
            <el-option v-for="item in pageSubjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          {{ ruleForm.subjectId }}{{ ruleForm.id }}
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker type="datetimerange" v-model="ruleForm.data1" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="putContest">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTableVisible" @close="clearTable">
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="考试名称">
          <el-input v-model="ruleTable.title"></el-input>
        </el-form-item>
        <el-form-item label="考试科目">
          <el-select v-model="ruleTable.subjectId" filterable placeholder="请选择科目">
            <el-option v-for="item in pageSubjects" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
          {{ ruleTable.subjectId }}{{ ruleTable.id }}
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item>
              <el-date-picker type="datetimerange" v-model="ruleTable.data1" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearTable">取 消</el-button>
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
            url: 'http://127.0.0.1:8088/contest/api/deleteContest/' + row.id
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
            this.getContents()
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
      this.getContents()
    },
    putContest() {
      const startTime = new Date(this.ruleForm.data1[0]).getTime()
      const endTime = new Date(this.ruleForm.data1[1]).getTime()
      axios({
        method: 'put',
        url: 'http://127.0.0.1:8088/contest/api/updateContest',
        data: Object.assign(this.ruleForm, {
          startTime,
          endTime
        })
      }).then((response) => {
        this.getContents()
        this.clearForm()
      })
    },
    addSubject() {
      const startTime = new Date(this.ruleTable.data1[0]).getTime()
      const endTime = new Date(this.ruleTable.data1[1]).getTime()
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/contest/api/addContest',
        data: Object.assign(this.ruleTable, {
          startTime,
          endTime
        })
      }).then((response) => {
        this.getContents()
        this.clearTable()
      })
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
    handleEdit(index, row) {
      // console.log(index, row)
      this.tableData1 = row
      this.dialogFormVisible = true
      this.ruleForm.data1.push(row.startTime, row.endTime)
      this.ruleForm.title = row.title
      this.ruleForm.subjectName = row.subjectName
      this.ruleForm.id = row.id
      this.ruleForm.state = row.state
      this.ruleForm.totalScore = row.totalScore
      this.ruleForm.subjectId = row.subjectId
      // axios({
      //   method: 'put',
      //   url: 'http://127.0.0.1:8088/contest/api/updateContest',
      //   params: {}
      // })
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
    getContents() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/contest/api/pageContest',
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

<style lang="less" scoped></style>
