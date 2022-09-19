<template>
  <div class="test-container">
    <el-divider><i class="el-icon-s-platform"></i>考试列表111</el-divider>
    <div>
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" class="inputSearch" style="width: 300px" />
      <el-button class="el-icon-search" size="medium" @click="getUsers" style="position: absolute; top: 0px; right: 0px"></el-button>
      <el-button size="medium" type="success" @click="dialogTableVisible = true" class="addUser">添加考试</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="头像" prop="ImgUrl">
        <template slot-scope="scope">
          <img :src="scope.row.ImgUrl" style="width: 60px; height: 60px" />
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
            @change="(res) => stateChange(res, scope.row.id)"
            style="display: block"
            v-model="scope.row.state"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            width="40"
            active-text="开"
            inactive-text="关"
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

    <el-dialog :visible.sync="dialogFormVisible" @close="clearForm" width="30%">
      <el-form :model="ruleForm" label-width="100px">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:8088/uploadfile"
          name="files"
          :show-file-list="false"
          :on-success="handleAvatarSuccess1"
        >
          <img v-if="ruleForm.ImgUrl" :src="ruleForm.ImgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form>

      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="ruleForm.name" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="ruleForm.username" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="qq">
          <el-input v-model="ruleForm.qq" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="手机">
          <el-input v-model="ruleForm.phone" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="邮箱">
          <el-input v-model="ruleForm.email" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="身份">
          <el-select v-model="ruleForm.level" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" @click="putContest">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTableVisible" @close="clearTable" width="30%">
      <el-form :model="ruleTable" label-width="100px">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:8088/uploadfile"
          name="files"
          :show-file-list="false"
          :on-success="handleAvatarSuccess2"
        >
          <img v-if="ruleTable.ImgUrl" :src="ruleTable.ImgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form>

      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="ruleTable.name" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="ruleTable.username" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="密码">
          <el-input type="password" autocomplete="off" v-model="ruleTable.password" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="qq">
          <el-input v-model="ruleTable.qq" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="手机">
          <el-input v-model="ruleTable.phone" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="邮箱">
          <el-input v-model="ruleTable.email" size="medium" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="身份">
          <el-select v-model="ruleTable.level" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="clearTable">取 消</el-button>
        <el-button type="primary" @click="addUser">添加</el-button>
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
      ruleForm: {},
      ruleTable: {
        id: 0,
        password: '',
        ImgUrl: '',
        name: '',
        username: '',
        qq: '',
        phone: '',
        email: '',
        level: '',
        avatarImgUrl: ''
      },
      query: {
        size: 10,
        page: 1,
        keyword: ''
      },
      options: [
        {
          value: 0,
          label: '学生'
        },
        {
          value: 1,
          label: '教师'
        },
        {
          value: 2,
          label: '管理员'
        }
      ]
    }
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      this.ruleForm.avatarImgUrl = file.name
      this.ruleForm.ImgUrl = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess2(res, file) {
      this.ruleTable.avatarImgUrl = file.name
      this.ruleTable.ImgUrl = URL.createObjectURL(file.raw)
    },
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
    stateChange(res, id) {
      this.ruleForm.state = res
      this.ruleForm.id = id
      this.putContest()
    },

    putContest() {
      axios({
        method: 'put',
        url: 'http://127.0.0.1:8088/account/updateIgnoreNull',
        data: this.ruleForm
      }).then((response) => {
        this.getUsers()
        this.clearForm()
      })
    },
    addUser() {
      console.log(this.ruleTable)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/insert',
        data: Object.assign(this.ruleTable, {
          id: Math.round(Math.random() * 100)
        })
      }).then((response) => {
        this.getUsers()
        this.clearTable()
      })
    },
    clearForm() {
      this.dialogFormVisible = false
    },
    clearTable() {
      this.ruleTable.id = 1
      this.dialogTableVisible = false
    },
    handleEdit(index, row) {
      // console.log(index, row)
      this.tableData1 = row
      this.dialogFormVisible = true
      this.ruleForm = row
      // this.ruleForm.title = row.title;
      // this.ruleForm.subjectName = row.subjectName;
      // this.ruleForm.id = row.id;
      // this.ruleForm.state = row.state;
      // this.ruleForm.totalScore = row.totalScore;
      // this.ruleForm.subjectId = row.subjectId;
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
            ImgUrl: 'http://localhost:8088/' + item.avatarImgUrl
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: inline-block;
  vertical-align: middle;
}
</style>
