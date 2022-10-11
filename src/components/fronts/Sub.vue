<template>
  <div class="contest-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>科目学习</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row gutter="10" type="flex" v-for="(o, index) in 2" :key="o">
      <el-col :span="8" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" class="card-content">
          <a href="">
            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image" />
          </a>
          <button><span></span></button>
          <div>
            <span><i></i>{{}}</span>
          </div>
          <div>
            <span><i></i>{{}}</span>
            <span><i></i>{{}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: ''
    }
  },
  created() {
    this.index = localStorage.getItem('index')
  },
  methods: {
    slt(evt) {
      localStorage.setItem('index', evt)
      this.index = localStorage.getItem('index')
    },
    pageChange(res) {
      this.query.page = res
      this.getSubjects()
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
    subjectName(id) {
      // console.log(id)
      // console.log(this.pageSubjects)
      let subject = this.pageSubjects.find((item) => id === item.id)
      if (subject !== undefined) return subject.name
      else return '综合实训'
    },
    getSubjects() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/subject/api/pageSubjects',
        params: this.query
      }).then((response) => {
        /* this.tableData = response.data.list
          this.tableData.forEach((item) => {
            item.startTime = this.handleTime(item.startTime)
            item.endTime = this.handleTime(item.endTime)
            item.subjectId = this.subjectName(item.subjectId)
            // console.log(Data.subjectName(item.subjectId))
          }) */
        this.total = response.data.total
        this.tableData = response.data.list.map((item) => {
          /*  return {
              ...item,
              startTime: this.handleTime(item.startTime),
              endTime: this.handleTime(item.endTime),
              subjectId: this.subjectName(item.subjectId)
            } */
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime)
          })
        })
      })
    },
    allSubjects() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8088/subject/api/pageSubjects?size=999'
      }).then((response) => {
        this.pageSubjects = response.data.list
        this.getSubjects()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card-content {
  position: relative;
  width: 260px;
  height: 260px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.image {
  width: 100%;
  height: 140px;
  transition: all linear 0.3s;
  cursor: pointer;
}
</style>
