<template>
  <div class="subjects-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/_frontpage/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>科目学习</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1300px">
      <el-row>
        <el-col :span="6" v-for="i in tableData" :key="i">
          <el-card :body-style="{ padding: '0px' }" class="card-content" shadow="hover">
            <a href="javascript:;" @click="subs(i.id)">
              <img :src="i.imgUrl" class="image" />
            </a>
            <button type="button" class="card-title" @click="subs(i.id)">
              <span>{{ i.name }}</span>
            </button>
            <div class="cart-author">
              <span><i class="el-icon-user-solid"> </i> {{ userName }}</span>
            </div>
            <div class="cart-detail">
              <span><i class="el-icon-tickets"></i>{{ i.questionNum }}</span>
              <span><i class="el-icon-upload"></i>私有题库</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination @current-change="pageChange" :page-size="query.size" :pager-count="11" layout="prev, pager, next"
        :total="total" style="margin-left: 0px" :current-page="query.page"></el-pagination>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      userName: '',
      tableData: '',
      total: 0,
      query: {
        size: 12,
        page: 1,
        keyword: ''
      }
    }
  },
  created() {
    this.userName = localStorage.getItem('userName')
    this.getSubjects()
  },
  methods: {
    subs(id) {
      this.$router.push('subs/' + id)
      localStorage.setItem('subjectId', id)
    },
    pageChange(res) {
      this.query.page = res
      this.getSubjects()
    },
    subjectName(id) {
      // console.log(id)
      // console.log(this.pageSubjects)
      let subject = this.pageSubjects.find((item) => id === item.id)
      if (subject !== undefined) return subject.name
      else return '综合实训'
    },
    getSubjects() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/subject/api/pageSubjects',
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
          return {
            ...item,
            imgUrl: 'http://localhost:8088/' + item.imgUrl
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.subjects-container {
  padding: 20px;
}

.cart-detail {
  position: absolute;
  display: flex;
  justify-content: space-around;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 36px;
  line-height: 36px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #999;
  box-sizing: border-box;
  margin-left: 10px;
}

.cart-author {
  margin-left: 10px;
}

.el-button--text {
  color: #409eff;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}

.card-content {
  position: relative;
  width: 260px;
  height: 260px;
  margin-bottom: 20px;
  margin-left: 33px;
  border-radius: 8px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  padding-left: 0;
  padding-right: 0;
  border-color: transparent;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  padding: 12px 20px;
  border-radius: 4px;
}

.image {
  width: 100%;
  height: 140px;
  overflow: hidden;
}
</style>
