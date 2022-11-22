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
          <span>热门帖子</span>
          <el-button style="float: right; padding: 3px 0" type="danger" @click="postEditor" plain>
            <span><i class="el-icon-edit"></i>我要发布</span>
          </el-button>
        </div>
        <div v-for="i in tableData" :key="i.id" class="text item">
          <a href="javascript:;" @click="toPost(i)">
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
// postDetail
/* store/index.js */
/*
  state: {
    postDetail: {}
  },
  mutations: {
    setPostDetail (state,payload) {
      state.postDetail = payload
    }

  }
*/
/* a.vue */
// import { mapState, mapMutations } from 'vuex'
/*
  // 一、取值流程
  // 1. 引入state辅助函数
  computed: mapState({
      postDetail: state => state.postDetail,
  })
  // 2.取值
  this.postDetail
  // 二、赋值流程
  // 1. 引入 mutation辅助函数
   ...mapMutations({
      setPostDetail: 'setPostDetail' //
  // 2. 赋值
   this.setPostDetail(detail)
 */
import { mapState, mapMutations } from 'vuex'
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
      }
    }
  },
  computed: mapState({
    postDetail: (state) => state.postDetail
  }),
  created() {
    this.getShare()
  },
  methods: {
    ...mapMutations({
      setPostDetail: 'setPostDetail' // 将 `this.setPostDetail()` 映射为 `this.$store.commit('setPostDetail')`
    }),
    postEditor() {
      this.$router.push('/_frontpage/submitpost')
    },
    pageChange(res) {
      this.query.page = res
      this.getShare()
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
        method: 'get',
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
    },
    toPost(post) {
      this.setPostDetail(post)
      this.$router.push('/_frontpage/share/' + post.id)
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
