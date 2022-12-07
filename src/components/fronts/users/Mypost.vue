<template>
  <div class="mypost-container">
    <el-card class="box-card" shadow>
      <el-divider content-position="left"><i class="el-icon-chat-dot-square" style="font-size: 20px">我的发帖</i></el-divider>
      <div v-for="i in tableData" :key="i" class="post">
        <a href="javascript:" class="title">
          <h4>{{ i.title }}</h4>
        </a>
        <div class="createTime">
          <span>
            <i class="el-icon-chat-line-round">{{ i.replyNum }}</i>
          </span>
          <span>发布于：{{ i.createTime }}</span>
        </div>
      </div>
      <el-pagination
        @current-change="pageChange"
        :page-size="query.pageSize"
        :pager-count="11"
        layout="prev, pager, next"
        :total="total"
        style="margin-left: 0px"
        :current-page="query.pageNum"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      total: '',
      tableData: '',
      query: {
        page: 10,
        page: 1
      }
    }
  },
  created() {
    this.getMypost()
  },
  methods: {
    pageChange(res) {
      this.query.page = res
      this.getMypost()
    },
    getMypost() {
      axios({
        methods: 'get',
        url: 'http://127.0.0.1:8088/post/api/pagePosts',
        params: this.query
      }).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime)
          })
        })
      })
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
    }
  }
}
</script>

<style lang="less" scoped>
.createTime {
  font-size: 14px;
  color: #999;
  display: flex;
  justify-content: space-between;
}
.title {
  text-decoration: none;
  font-size: 22px;
  margin: 10px 0;
}
</style>
