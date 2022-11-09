<template>
  <div class="test-container">
    <div style="height: 50px; text-align: center">
      <el-divider><i class="el-icon-s-platform"></i>评论列表</el-divider>
    </div>
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        <el-breadcrumb-item>评论列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table :data="tableData" style="width: 90%" max-height="500px">
      <el-table-column align="center" label="内容" prop="content"></el-table-column>
      <el-table-column align="center" label="回贴人" prop="name"></el-table-column>
      <el-table-column align="center" label="回帖时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="medium" type="danger" icon="el-icon-delete" @click="openDel(scope.$index, scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="pageChange"
      :page-size="query.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
      style="margin-left: 0px"
      :current-page="query.pageNum"
    ></el-pagination>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      scope: '考试名称',
      tableData: [],
      total: 0,
      tableData1: {},
      userList: [],
      query: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      this.ruleForm.imgUrl = file.name
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess2(res, file) {
      this.ruleTable.imgUrl = file.name
      this.ruleTable.imageUrl = URL.createObjectURL(file.raw)
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
            url: 'http://127.0.0.1:8088/comment/api/deleteComment/' + row.id
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
            this.getComments()
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
      this.query.pageNum = res
      this.getComments()
    },
    clearForm() {
      this.dialogFormVisible = false
    },
    clearTable() {
      this.dialogTableVisible = false
    },
    handleEdit(index, row) {
      this.tableData1 = row
      this.dialogFormVisible = true
      this.ruleForm.id = row.id
      this.ruleForm.name = row.name
      this.ruleForm.imageUrl = 'http://127.0.0.1:8088/' + row.imgUrl
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
    getComments() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/comment/api/pageComment',
        params: this.query
      }).then((response) => {
        console.log(response)
        this.total = response.data.totalPageSize
        this.tableData = response.data.comments.map((item) => {
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            name: this.getUsername(item.id)
          })
        })
      })
    },
    getUserList() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/account/list'
      }).then((response) => {
        this.userList = response.data
        this.getComments()
      })
    },
    getUsername(id) {
      let username = this.userList.find((item) => id === item.id)
      if (username !== undefined) return username.name
      else return '匿名用户'
    }
  }
}
</script>

<style lang="less" scoped>
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
  display: block;
}
</style>
