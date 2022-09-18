<template>
  <div class="test-container">
    <el-divider><i class="el-icon-s-platform"></i>考试列表111</el-divider>
    <div>
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" class="inputSearch" style="width: 300px" />
      <el-button class="el-icon-search" size="medium" @click="getUsers" style="position: absolute; top: 0px; right: 0px"></el-button>
      <el-button size="medium" type="success" @click="dialogTableVisible = true" class="addSubject">添加考试</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="头像" prop="avatarImgUrl">
        <template slot-scope="scope">
          <img :src="scope.row.avatarImgUrl" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="账号" prop="username"></el-table-column>
      <el-table-column label="QQ" prop="qq"></el-table-column>
      <el-table-column label="手机" prop="phone"> </el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="身份" prop="level">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper" v-if="scope.row.level === 0">
            <el-tag>学生</el-tag>
          </div>
          <div slot="reference" class="name-wrapper" v-else-if="scope.row.level === 1">
            <el-tag type="success">教师</el-tag>
          </div>
          <div slot="reference" class="name-wrapper" v-else-if="scope.row.level === 2">
            <el-tag type="danger">管理员</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            width="30"
            active-text="按月付费"
            inactive-text="按年付费"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作">
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
    this.getUsers()
  },
  data() {
    return {
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
        subjectId: 1,
        title: ''
      },
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
            this.getUsers()
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
      this.getUsers()
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
        this.getUsers()
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
        this.getUsers()
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
    getUsers() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/pageAccount',
        data: this.query
      }).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          return {
            ...item,
            avatarImgUrl: '127.0.0.1:8088/' + item.avatarImgUrl
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.addSubject {
  position: absolute;
  top: 147px;
  left: 530px;
}
</style>
