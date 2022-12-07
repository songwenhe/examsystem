<template>
  <div class="contests-container">
    <el-container>
      <el-main>
        <el-card>
          <span class="el-icon-time surplus">考试倒计时 - {{ surplusTime }}</span>
        </el-card>
        <el-form :model="answerCardForm" ref="answerCardForm" class="cardForm">
          <el-form-item
            label=""
            v-for="(item, index) in answerCardForm.problemList"
            :key="item.id"
            :prop="'problemList.' + index + '.value'"
            :rules="[{ required: true, message: '', trigger: 'blur' }]"
          >
            <el-card class="answer-area" :class="index + 1 === currentIndex ? '' : 'hidden-s'">
              <el-divider class="answer-title">
                <i class="el-icon-question">题目描述</i>
              </el-divider>
              <div class="desc">
                <span class="qType" v-if="item.questionType === 0">(单选)</span>
                <span class="qType" v-else-if="item.questionType === 1">(多选)</span>
                <span class="qType" v-else-if="item.questionType === 2">(问答)</span>
                <span class="qType" v-else>(编程)</span>
                <span class="qContent">{{ item.content }}</span>
                <span class="qScore"> ({{ item.score }}分)</span>
              </div>
              <el-divider class="answer-title">
                <i class="el-icon-edit">作答区域</i>
              </el-divider>
              <div class="answer-content">
                <!-- {{ item.value }} -->
                <!-- 单选 -->
                <div class="select" v-if="item.questionType === 0">
                  <el-radio label="A" v-model="item.value" @change="handleVal(index, item.value)" border>{{ item.optionA }}</el-radio>
                  <el-radio label="B" v-model="item.value" @change="handleVal(index, item.value)" border>{{ item.optionB }}</el-radio>
                  <el-radio label="C" v-model="item.value" @change="handleVal(index, item.value)" border>{{ item.optionC }}</el-radio>
                  <el-radio label="D" v-model="item.value" @change="handleVal(index, item.value)" border>{{ item.optionD }}</el-radio>
                </div>
                <!-- 多选 -->
                <div class="select-mut" v-else-if="item.questionType === 1">
                  <el-checkbox-group v-model="item.value" @change="handleVal(index, item.value)">
                    <el-checkbox label="A" border>{{ item.optionA }}</el-checkbox>
                    <el-checkbox label="B" border>{{ item.optionB }}</el-checkbox>
                    <el-checkbox label="C" border>{{ item.optionC }}</el-checkbox>
                    <el-checkbox label="D" border>{{ item.optionD }}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <!-- 问答 + 代码 -->
                <div class="ques" v-else>
                  <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="item.value" @change="handleVal(index, item.value)">
                  </el-input>
                </div>
              </div>
            </el-card>
          </el-form-item>
        </el-form>
      </el-main>
      <el-aside>
        <el-card class="box-card" body-style="padding:10px">
          <dl>
            <dd>
              <span>学生考号：</span><span>{{ userId }}</span>
            </dd>
            <dd>
              <span>当前考生：</span><span>{{ userName }}</span>
            </dd>
            <dd>
              <span>开始时间：</span><span> {{ contestData.createTime }}</span>
            </dd>
            <dd>
              <span>结束时间：</span><span>{{ contestData.updateTime }}</span>
            </dd>
            <dd>
              <span class="last">总分：</span><span> {{ contestData.totalScore }}</span>
            </dd>
          </dl>
        </el-card>
        <el-card class="aside-bottom">
          <div class="select-problem">
            <button
              class="problem"
              v-for="index in problemNum"
              :key="index"
              @click="showProblem(index)"
              :class="{
                'problem-current': index === currentIndex,
                'problem-active': existArray[index]
              }"
            >
              {{ index }}
            </button>
            <button class="problem-fill" v-for="index in fillNum" :key="index + 'sss'"></button>
            <el-button type="success" @click="submitCard">交卷</el-button>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
const axios = require('axios')
import { mapState, mapMutations } from 'vuex'
export default {
  props: ['id', 'name'],
  data() {
    return {
      ques: '',
      problemList: [],
      currentIndex: 1,
      answerCardForm: {
        problemList: []
      },
      existArray: [],
      cUser: {},
      cContest: {},
      surplusTime: '',
      timer: ''
    }
  },
  computed: mapState({
    contest: (state) => state.contest,
    problemNum() {
      return this.answerCardForm.problemList.length
    },
    // 空位数量
    fillNum() {
      return this.problemNum % 5 === 0 ? 0 : 5 - (this.problemNum % 5)
    }
  }),

  created() {
    this.userId = parseInt(localStorage.getItem('userId'))
    this.userName = localStorage.getItem('userName')
    this.contestData = Object.assign(this.contest, {
      questionTypeName: this.getQuestionType(this.contest.questionType),
      createTime: this.handleTime(this.contest.createTime),
      updateTime: this.handleTime(this.contest.updateTime)
    })

    this.getQuestions()
  },
  mounted() {
    this.handleSurplus()
    this.timer = setInterval(this.handleSurplus, 1000)
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
    handleSurplus() {
      const now = Date.now()
      const end = new Date(this.contestData.endTime).getTime()
      let diff = end > now ? end - now : 0
      if (diff > 0) {
        diff /= 1000
        const d = Math.floor(diff / 60 / 60 / 24)
        const h = Math.floor((diff / 60 / 60) % 24)
        const m = Math.floor((diff / 60) % 60)
        const s = Math.floor(diff % 60)
        this.surplusTime = `${this.pad0(d)} 天 ${this.pad0(h)}时${this.pad0(m)}分${this.pad0(s)}秒`
      }
    },
    // 时间补0
    pad0(val, len = 2) {
      return ('000000000000' + val).substr(-len)
    },
    showActive(index) {
      return this.existArray[index]
    },
    handleVal(index, val) {
      this.existArray[index + 1] = val.length > 0
    },
    showProblem(id) {
      this.currentIndex = id
      this.$refs.answerCardForm.clearValidate()
    },
    getQuestions() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/question/api/getQuestionsByContestId',
        params: { contestId: this.$route.params.id }
      }).then((response) => {
        response.data.forEach((item) => {
          this.answerCardForm.problemList.push(Object.assign(item, { value: [] }))
        })
        this.answerCardForm.problemList = response.data.map((item) => {
          return Object.assign(item, {
            questionTypeName: this.getQuestionType(item.questionType)
          })
        })
        this.fillNum = this.answerCardForm.problemList.length
      })
    },
    getQuestionType(type) {
      if (type === 0) {
        return '单选'
      } else if (type === 1) {
        return '多选'
      } else if (type === 2) return '问答'
      else if (type === 3) return '编程'
      else return '未知题型'
    },
    submitCard() {
      this.$refs.answerCardForm.validate(async (valid) => {
        if (!valid) return this.$message.error('还有未写题目')
        const answer = []
        this.answerCardForm.problemList.forEach((item) => {
          answer.push(item.value)
        })

        console.log(this.answer)
        // const obj = {}
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8088/grade/api/submitContest',
          data: {
            answerJson: answer.join('_~_'),
            studentId: this.userId,
            contestId: this.contestData.id,
            finishTime: new Date()
          }
        }).then((response) => {
          console.log(response)
          if (response.status === 200) {
            if (response.data.success) {
              this.loading()
              this.$message.success(response.data.message)
            } else {
              this.$message.warning(response.data.message)
            }
          } else {
            this.$message.warning('请求失败')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contests-container {
  padding: 20px;
  width: 1300px;
}
.el-main {
  padding: 0 20px;
}

// 题目标题
.answer-title {
  i {
    letter-spacing: 0.2em;
    font-size: 20px;
  }
}

// 题目内容
.desc {
  padding: 20px 0;
  letter-spacing: 0.2em;

  .qType {
    color: red;
  }
}

[class^='select'] {
  padding: 20px 0;

  .el-radio,
  .el-checkbox {
    display: block;
    width: 100%;
    margin: 20px 0;
  }

  .el-radio:hover,
  .el-checkbox:hover {
    border-color: #e74c3c;
  }

  .el-radio.is-bordered + .el-radio.is-bordered,
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0;
  }
}

.ques {
  padding: 40px 0;
}

// 侧边信息
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

  dd > span:first-child {
    min-width: 60px;
    font-weight: 600;
    letter-spacing: 0.1em;
  }

  dd > span:last-child {
    padding-left: 20px;
  }
}

// 自定义按钮样式
.select-problem {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  [class^='problem'] {
    display: inline-block;
    width: 34px;
    height: 28px;
    margin-bottom: 10px;
    border: 2px solid #ccc;
    color: #ccc;
    outline: none;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all linear 0.1s;
  }

  [class^='problem']:hover {
    transform: scale(1.2);
  }

  .problem.problem-active {
    color: #2ecc71;
    border-color: #2ecc71;
  }

  .problem.problem-current {
    color: #fff;
    background-color: #2ecc71;
    border-color: #2ecc71;
  }

  .problem-fill {
    visibility: hidden;
  }
}

.hidden-s {
  display: none;
}

.cardForm {
  .el-form-item {
    margin-bottom: 0;
  }
}

.surplus {
  color: #db2828;
  font-size: 26px;
}
</style>

<style lang="less">
.cardForm .el-form-item__error {
  display: none;
}
</style>
