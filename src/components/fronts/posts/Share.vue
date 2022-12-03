<template>
  <div class="share-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分享中心</el-breadcrumb-item>
        <el-breadcrumb-item>{{ post.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div><el-divider></el-divider></div>
    <div class="postdesc">
      <el-row>
        <el-col :span="12">
          <div class="content">
            <a href=""
              ><h4>{{ userName }}</h4>
            </a>
            <span class="createDate">{{ post.createTime }}发表</span>
          </div>
          <p class="icons">
            <i class="el-icon-chat-dot-round">{{ post.replyNum }}</i>
            <i class="el-icon-thumb">6</i>
            <i class="el-icon-view">123</i>
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="postContent">
      <el-card shadow="always">
        <div v-html="post.htmlContent"></div>
      </el-card>
    </div>
    <div><el-divider></el-divider></div>
    <div class="reply">
      <div>
        <p>
          <i class="el-icon-chat-dot-round">回复({{ post.replyNum }})</i>
        </p>
      </div>
      <div>
        <el-row v-for="item in comments" :key="item.id">
          <el-col :span="1">
            <el-avatar shape="square" :size="36"></el-avatar>
          </el-col>
          <el-col :span="23">
            <a href="javascript:;" class="author">{{ item.user }}</a>
            <span class="replyDate"></span>
            <div class="text">{{ item.content }}</div>
            <a href="javascript:;" class="actions" @click="showTextarea(item.id)">回复</a>
            <!-- <div>--{{ item.replies }}--</div> -->
            <div class="comments">
              <el-row v-for="reply in item.replies" :key="reply.id">
                <el-col :span="1">
                  <el-avatar shape="square" :size="36"></el-avatar>
                </el-col>
                <el-col class="info" :span="15">
                  <a href="javascript:;" class="author">{{ reply.user }}</a>
                  <span class="replyDate">{{ reply.createTime | formatDate }}</span>
                  <div class="text">{{ reply.content }}</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return { replies: [], post: {}, userName: '', comments: [] }
  },
  computed: mapState({
    postDetail: (state) => state.postDetail
  }),
  created() {
    this.userName = localStorage.getItem('userName')
    this.post = this.postDetail
    this.getComments()
  },
  methods: {
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
    async getComments() {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/reply/api/getCommentsByPostId',
        params: { postId: this.postDetail.id }
      })
      //   .then((response) => {
      console.log(response)
      this.comments = response.data
      response.data.forEach((item, index) => {
        this.getReplys(item.id, index)
        this.getUserById(item.userId, index)
      })
      // })
    },
    async getReplys(id, i) {
      const res = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/reply/getReplysByCommentId',
        params: { commentId: id }
      })
      //   .then((res) => {
      this.comments[i].replies = res.data
      res.data.forEach((item, index) => {
        this.getUserById(item.userId, index, i)
      })
      // })
    },
    async getUserById(userId, index, i) {
      const res = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/account/getById',
        params: { id: userId }
      })
      if (res.status === 200) {
        if (i !== undefined) {
          if (res.data !== '') {
            console.log(this.comments[i])
            this.comments[i].replies[index].user = res.data.name
          } else {
            this.comments[i].replies[index].user = '已注销'
          }
        } else {
          this.comments[index].user = res.data.name
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.author {
  text-decoration: none;
}
.share-container {
  padding: 20px;
  width: 1300px;
}

.title {
  i {
    margin-right: 6px;
  }
}
.postDetail {
  .el-main {
    padding: 0 20px;
  }
}

.postdesc {
  font-size: 14px;
  position: relative;
  .content {
    a h4 {
      margin: 0 0 12px 0;
    }
  }
  .icons {
    position: absolute;
    bottom: 0;
    right: 0;
    i {
      font-size: 16px;
      padding: 0 4px;
    }
  }
}

.postContent {
  margin: 40px 0;
  letter-spacing: 0.1em;
}

.replyTitle {
  font-size: 20px;
  i {
    padding-right: 4px;
  }
}

.comment {
  .content {
    font-size: 14px;
    .replyDate {
      color: #aaa;
    }
    .actions {
      color: #e74c3c;
    }
    .el-row {
      margin-bottom: 20px;
    }
  }
  .comments {
    margin-top: 6px;
  }
  .text {
    width: 350px;
  }
}

.commentArea,
.replyArea {
  position: relative;
  width: 600px;
  margin-bottom: 30px;
  .btns {
    position: absolute;
    right: 0;
    bottom: -35px;
    margin: 10px 10px 0 0;
    z-index: 99;
  }
}
// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.postContent {
  margin: 40px 0;
  letter-spacing: 0.1em;
}
</style>
