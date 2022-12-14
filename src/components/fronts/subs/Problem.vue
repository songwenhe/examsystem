<template>
  <div class="problem-container">
    <el-container>
      <el-main>
        <el-card class="box-card" shadow>
          <el-divider class="title">
            <h1><i class="el-icon-question"></i>题目标题</h1>
          </el-divider>
          <div class="answerArea">
            <P>{{ question.title }}</P>
          </div>
        </el-card>
        <el-card class="box-card">
          <el-divider class="title">
            <h1><i class="el-icon-info"></i>题目内容</h1>
          </el-divider>
          <div class="answerArea" shadow>
            <P>A、{{ question.optionA }}</P>
            <P>B、{{ question.optionB }}</P>
            <P>C、{{ question.optionC }}</P>
            <P>D、{{ question.optionD }}</P>
          </div>
        </el-card>
        <el-card class="box-card" shadow>
          <el-divider class="title">
            <h1><i class="el-icon-success"></i>正确答案</h1>
          </el-divider>
          <el-collapse>
            <el-collapse-item title="正确答案" name="1">
              <div>
                <el-divider class="title">正确答案</el-divider>
                <p>{{ question.answer }}</p>
              </div>
              <div>
                <el-divider class="title">答案解析</el-divider>
                <p>{{ question.parse }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-main>
      <el-aside>
        <el-card class="box-card" body-style="padding:10px">
          <dl>
            <dd>
              <span>题目类型：</span><span>{{ question.questionTypeName }}</span>
            </dd>
            <dd><span>上传者：</span><span>admin</span></dd>
            <dd>
              <span>题目难度：</span><span><el-rate v-model="question.difficulty" disabled></el-rate></span>
            </dd>
            <dd>
              <span>发布时间：</span><span>{{ question.createTime }}</span>
            </dd>
            <dd>
              <span>更新事件：</span><span>{{ question.updateTime }}</span>
            </dd>
          </dl>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>

export default {
  data() {
    return {
      show3: false,
      pageQuestions: [],
      question: {},
      questionId: 0
    }
  },
  created() {
    this.getQuestions()
    this.questionId = parseInt(localStorage.getItem('questionId'))
  },

  methods: {
    getQuestions() {
      this.$http({
        method: 'get',
        url: 'question/api/pageQuestion?size=999'
      }).then((response) => {
        this.pageQuestions = response.data.list.map((item) => {
          return Object.assign(item, {
            questionTypeName: this.getQuestionType(item.questionType),
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime)
          })
        })
        this.question = this.pageQuestions.find((item) => this.questionId === item.id)
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
    },
    getQuestionType(type) {
      if (type === 0) {
        return '单选题'
      } else if (type === 1) {
        return '多选题'
      } else if (type === 2) return '问答题'
      else if (type === 3) return '编程题'
      else return '未知题型'
    }
  }
}
</script>

<style lang="less" scoped>
.problem-container {
  padding: 20px;
  width: 1300px;
}

.answerArea {
  padding: 20px 0;
  padding-left: 20px;
}

.title {
  font-size: 20px;
}

.box-card {
  span {
    display: inline-block;
    // line-height: 40px;
    font-size: 13px;
  }

  dd {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }

  dd:last-child {
    border-bottom: none;
  }

  dd>span:first-child {
    min-width: 60px;
    font-weight: 600;
    letter-spacing: 0.1em;
  }

  dd>span:last-child {
    padding-left: 20px;
  }
}
</style>
