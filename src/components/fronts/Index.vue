<template>
  <div class="index-container">
    <el-container>
      <el-main>
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in 3" :key="item">
            <h3>{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
        <div v-for="i in tableData" :key="i.id" class="text item">
          <div>
            <a href="javascript:;" @click="toPost(i)" class="title">
              <h3>{{ i.title }}</h3>
            </a>
            <p>
              <span class="time">{{ i.userName }}</span>
              <span class="time">{{ i.createTime }}<em>发表在[我要提问]</em></span>
              <span class="time"><em>最后回复时间:</em>{{ i.lastReplyTime }}</span>
            </p>
          </div>
          <div class="icons">
            <p><i class="el-icon-chat-dot-round"></i>{{ i.replyNum }}</p>
            <p><i class="el-icon-thumb"></i>{{ i.replyNum }}</p>
            <p><i class="el-icon-view"></i>{{ i.replyNum }}</p>
          </div>
        </div>
        <el-pagination
          @current-change="pageChange"
          :page-size="query.size"
          :pager-count="11"
          layout="prev, pager, next"
          :total="total"
          style="margin-left: 0px"
          :current-page="query.page"
        ></el-pagination>
      </el-main>
      <el-aside width="400px">
        <el-row class="row-bg">
          <el-col :span="24">
            <el-card class="description">
              <div>
                <span><i class="el-icon-s-home"></i></span><el-divider direction="vertical"></el-divider><span>关于我</span>
              </div>
              <el-divider></el-divider>
              <div class="anvter">
                <img src="@/assets/微信图片_20221208000319.jpg" alt="" class="img" />
                <p>exam开源考试系统</p>
              </div>
              <p class="title">exam开源考试系统是一款简洁美观、自适应的Java考试系统</p>
              <div class="social">
                <img src="@/assets/weixin.png" alt="" class="icons" />
                <img src="@/assets/qq.jpg" alt="" class="icons" />
                <img src="@/assets/weibo.webp" alt="" class="icons" />
                <img src="@/assets/github.png" alt="" class="icons" />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="24"><el-card>2</el-card></el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="24"><el-card>2</el-card></el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="24"><el-card>2</el-card></el-col>
        </el-row>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      total: 0,
      tableData: [],
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
  created() {
    this.getUsers()
  },
  methods: {
    async getShare() {
      const response = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/post/api/pagePosts',
        params: this.query
      })
      this.total = response.data.total
      this.tableData = response.data.list.map((item) => {
        return Object.assign(item, {
          createTime: this.handleTime(item.createTime),
          updateTime: this.handleTime(item.updateTime),
          lastReplyTime: this.handleTime(item.lastReplyTime),
          userName: this.getUserName(item.authorId)
        })
      })
    },
    async getUsers() {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/pageAccount',
        data: this.query1
      })
      this.pageUsers = response.data.list
      this.getShare()
    },
    getUserName(id) {
      let user = this.pageUsers.find((item) => id === item.id)
      if (user !== undefined) return user.name
      else return '已注销'
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
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.description {
  .anvter {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
  }
  .title {
    font-size: 12px;
  }
  .social {
    display: flex;
    justify-content: space-around;
    .icons {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }
}

.index-container {
  min-width: 1600px;
}
.title {
  text-decoration: none;
}
.item {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 18px;
}
.time {
  margin-right: 10px;
}
.icons {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  bottom: 20px;
  right: 0;
}
.icons i {
  padding: 0 4px;
}
</style>
