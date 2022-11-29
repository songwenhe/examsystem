<template>
  <div class="test-container">
    <div style="height: 50px; text-align: center">
      <el-divider class="divider"><i class="el-icon-s-platform"></i>帖子列表</el-divider>
    </div>
    <div style="height: 60px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>帖子管理</el-breadcrumb-item>
        <el-breadcrumb-item>帖子列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 60px">
      <el-select v-model="value" placeholder="请选择" size="medium" style="width: 100px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-input v-model="query.keyword" size="medium" placeholder="输入关键字搜索" class="inputSearch" style="width: 300px" />
      <el-button class="el-icon-search" size="medium" @click="searchType(value)"></el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="600px">
      <el-table-column align="center" label="标题" prop="title"></el-table-column>
      <el-table-column align="center" label="发布者" prop="authorId"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="编辑时间" prop="updateTime"></el-table-column>
      <el-table-column label="最后一次回复时间" prop="lastReplyTime"></el-table-column>
      <el-table-column align="center" label="回帖数量" prop="replyNum">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="success">{{ scope.row.replyNum }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
const axios = require('axios')

export default {
  created() {
    this.getPosts()
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
        id: 1,
        name: '',
        imgUrl: '',
        imageUrl: '',
        dialogVisible: false
      },
      ruleTable: {
        name: '',
        imgUrl: '',
        imageUrl: '',
        dialogVisible: false
      },
      options: [
        {
          value: 1,
          label: '文章名'
        },
        {
          value: 2,
          label: '作者ID'
        }
      ],
      value: 1,
      disabled: false,
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
    searchType(value) {
      if (value === 1) {
        this.getPosts()
      } else if (value === 2) {
        this.pagePostByAuthorId()
      }
    },
    pagePostByAuthorId() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/post/api/pagePostByAuthorId',
        params: this.query
      }).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime),
            lastReplyTime: this.handleTime(item.lastReplyTime)
          })
        })
      })
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
            url: 'http://127.0.0.1:8088/post/api/deletePost/' + row.id
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
            this.getPosts()
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
      this.getPosts()
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
    getPosts() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/post/api/pagePosts',
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
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime),
            lastReplyTime: this.handleTime(item.lastReplyTime)
          })
        })
      })
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
.divider {
  .el-divider__text {
    font-size: 30px;
  }
}
</style>
