<template>
  <div class="index-container">
    <el-container>
      <el-main class="mian">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in img" :key="item">
            <img :src="item.imgUrl" alt="" class="carouselImg">
          </el-carousel-item>
        </el-carousel>
        <el-row>
          <el-col v-for="item in tableData" :key="item.id">
            <el-card class="post">
              <div><img src="@/assets/github.png" alt="" class="postImg" /></div>
              <div class="postDetail">
                <p class="postTitle">{{ item.title }}</p>
                <div v-html="item.htmlContent" class="content"></div>
                <div class="view">
                  <div class="reply">
                    <span><i class="el-icon-time"></i>{{ item.createTime }}</span>
                    <span><i class="el-icon-view"></i>浏览({{ item.replyNum }})</span>
                    <span><i class="el-icon-chat-round"></i>评论({{ item.replyNum }})</span>
                  </div>
                  <el-button type="success" class="button">阅读全文</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination @current-change="pageChange" :page-size="query.size" :pager-count="11" layout="prev, pager, next"
          :total="total" style="margin-left: 0px" :current-page="query.page"></el-pagination>
      </el-main>
      <el-aside width="400px">
        <el-row class="row-bg">
          <el-col :span="24">
            <el-card class="description">
              <div>
                <span><i class="el-icon-s-home"></i></span><el-divider
                  direction="vertical"></el-divider><span>关于我</span>
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
      },
      img: [{
        imgUrl: require('@/assets/img-1.png')
      }, {
        imgUrl: require('@/assets/img-2.png')
      }, {
        imgUrl: require('@/assets/img-3.png')
      }]
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    pageChange(res) {
      this.query.page = res
      this.getUsers()
    },
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
.carouselImg {
  width: 100%;
  height: 100%;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.post {
  display: flex;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;

  // height: 300px;
  .postImg {
    height: 90%;
    width: 100px;
  }


  .postDetail {
    display: flex;
    flex-direction: column;
    width: 100%;

    .postTitle {
      font-size: 20px;
      font-weight: 700;
    }

    .content {
      height: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .view {
      display: flex;
      justify-content: space-between;

      .reply span {
        margin-right: 10px;
      }
    }
  }

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

    .title {
      font-size: 12px;
    }
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
  max-width: 1600px;
}
</style>
