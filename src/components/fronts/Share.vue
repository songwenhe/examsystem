<template>
  <div class="contest-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分享中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div v-for="i in tableData" :key="i" class="text item">
          <a href="">
            <h3>{{ i.title }}</h3>
          </a>
          <p>
            <span>{{ i.authorId }}</span>
            <span>{{ i.createTime }}<em>发表在[我要提问]</em></span>
            <span><em>最后回复时间:</em>{{ i.lastReplyTime }}</span>
          </p>
          <p class="icons"><i class="el-icon-chat-dot-round"></i>{{ i.replyNum }}</p>
        </div>
      </el-card>
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
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      index: '',
      total: '',
      tableData: '',
      query: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created() {
    this.getShare()
    this.index = localStorage.getItem('index')
  },
  methods: {
    slt(evt) {
      localStorage.setItem('index', evt)
      this.index = localStorage.getItem('index')
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
    getShare() {
      axios({
        methods: 'get',
        url: 'http://127.0.0.1:8088/post/api/pagePosts',
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
    }
  }
}
</script>

<style lang="less" scoped>
.contest-container {
  min-width: 1300px;
}
.icons {
  position: absolute;
  bottom: 20px;
  right: 0;
}
.icons i {
  padding: 0 4px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>
