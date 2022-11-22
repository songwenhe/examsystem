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
    <div>
      <el-card class="box-card">
        <div v-html="post.htmlContent"></div>
      </el-card>
    </div>
    <div><el-divider></el-divider></div>
    <p>
      <i class="el-icon-chat-dot-round">回复({{ post.replyNum }})</i>
    </p>
    <div>
      <div v-for="i in comments" :key="i.id">
        <div><span></span></div>
        <div>{{ i.content }}</div>
        <!-- <a href="javascript:;" @click.prevent="">回复</a> -->
        <a href="" @click.prevent="$router.push('')">回复</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      post: {},
      userName: '',
      comments: []
    }
  },
  computed: mapState({
    postDetail: (state) => state.postDetail
  }),
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
    getComment() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/reply/api/getCommentsByPostId',
        params: { postId: this.post.id }
      }).then((response) => {
        this.comments = response.data
      })
    }
  },
  created() {
    this.userName = localStorage.getItem('userName')
    this.post = this.postDetail
    this.getComment()
    console.log(this.post)
  }
}
</script>

<style lang="less" scoped>
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
</style>
