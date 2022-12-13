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
            <el-card shadow style="margin-bottom:10px;" :body-style="{ padding: '0px' }">
              <div class="post">
                <img src="@/assets/github.png" alt="" class="postImg" />
                <div class="postDetail">
                  <p class="postTitle">{{ item.title }}</p>
                  <div class="content">{{ item.htmlContent }}</div>
                  <div class="view">
                    <div class="reply">
                      <span><i class="el-icon-time"></i>{{ item.createTime }}</span>
                      <span><i class="el-icon-view"></i>浏览({{ item.replyNum }})</span>
                      <span><i class="el-icon-chat-round"></i>评论({{ item.replyNum }})</span>
                    </div>
                    <el-button type="success" class="button">阅读全文</el-button>
                  </div>
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
              <div class="about">
                <span><i class="el-icon-s-home"></i></span>
                <el-divider direction="vertical"></el-divider>
                <span>关于我</span>
              </div>
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
          <el-col :span="24">
            <el-card class="recent">
              <div class="top">
                <span><i class="el-icon-s-ticket"></i>近期文章</span>
                <span><i class="el-icon-thumb"></i>站长推荐</span>
                <span><i class="el-icon-refresh"></i>随机文章</span>
              </div>
              <div v-for="item in tableData" :key="item.id" class="order">
                <p><i class="el-icon-s-order"></i><span>{{ item.title }}</span></p>
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
        size: 5,
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
  height: 100%;
  width: 100%;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.post {
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: space-between;

  .postImg {
    width: 200px;
    height: 100%;
    align-items: center;
    margin-right: 30px;
  }

  .postDetail {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    margin-right: 20px;

    .postTitle {
      font-size: 20px;
      font-weight: 700;
    }

    .content {
      width: 100%;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      /* 这里是超出几行省略 */
      overflow: hidden;
      margin-bottom: auto;
    }

    .view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .reply span {
        margin-right: 10px;
      }

      .reply span:nth-child(3) {
        color: #5cb87a;
      }
    }
  }

}

.description {
  .about {
    display: flex;
    font-size: 12px;
    padding: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #c0c4cc;
    align-items: center;
  }

  .anvter {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    font-weight: 700;

    .img {
      width: 120px;
      height: 120px;
      border-radius: 10px;
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

.recent {
  .top {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }

  .top span:nth-child(1) {
    font-weight: 700;
  }

  .order {
    font-size: 12px;

    p {
      width: 100%;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      /* 这里是超出几行省略 */
      overflow: hidden;

      i {
        margin-right: 10px;
      }
    }
  }

}


.index-container {
  max-width: 1600px;
}
</style>
