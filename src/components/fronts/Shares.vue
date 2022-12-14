<template>
  <div class="shares-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/_frontpage/index' }">首页</el-breadcrumb-item>
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
        <el-row>
          <el-col v-for="item in tableData" :key="item.id">
            <el-card shadow style="margin-bottom:10px;" :body-style="{ padding: '0px' }">
              <div class="post">
                <img src="@/assets/github.png" alt="" class="postImg" />
                <div class="postDetail">
                  <p class="postTitle">{{ item.title }}</p>
                  <div class="view">
                    <div class="reply">
                      <span><i class="el-icon-time"></i>{{ item.createTime }}</span>
                      <span><i class="el-icon-view"></i>浏览({{ item.replyNum }})</span>
                      <span><i class="el-icon-chat-round"></i>评论({{ item.replyNum }})</span>
                    </div>
                    <el-button type="success" class="button" @click="toPost(item)">阅读全文</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <el-pagination @current-change="pageChange" :page-size="query.size" :pager-count="11" layout="prev, pager, next"
        :total="total" style="margin-left: 0px" :current-page="query.page"></el-pagination>
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
export default {
  data() {
    return {
      total: 0,
      pageUsers: [],
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
  computed: mapState({
    postDetail: (state) => state.postDetail
  }),
  created() {
    this.getUsers()
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
      this.$http({
        method: 'get',
        url: 'post/api/pagePosts',
        params: this.query
      }).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime),
            lastReplyTime: this.handleTime(item.lastReplyTime),
            userName: this.getUserName(item.authorId)
          })
        })
      })
    },
    toPost(post) {
      this.setPostDetail(post)
      this.$router.push('/_frontpage/share/' + post.id)
    },
    getUsers() {
      this.$http({
        method: 'post',
        url: 'account/pageAccount',
        data: this.query1
      }).then((response) => {
        this.pageUsers = response.data.list
        this.getShare()
      })
    },
    getUserName(id) {
      let user = this.pageUsers.find((item) => id === item.id)
      if (user !== undefined) return user.name
      else return '已注销'
    }
  }
}
</script>

<style lang="less" scoped>
.shares-container {
  max-width: 1300px;
  padding: 20px;
}

.post {
  display: flex;
  width: 100%;
  height: 150px;
  justify-content: space-between;
  align-items: center;

  .postImg {
    width: 150px;
    height: 100%;
    margin-right: 30px;
    border-radius: 50%;
  }

  .postDetail {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    margin-right: 20px;

    .postTitle {
      align-items: center;
      font-size: 20px;
      font-weight: 700;
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







.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
