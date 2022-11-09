<template>
  <div class="login-container">
    <div class="login-box">
      <el-form :model="ruleForm" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="submitForm()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
const axios = require('axios')
export default {
  name: 'login',
  data() {
    return {
      ruleForm: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/api/login',
        params: this.ruleForm
      }).then((response) => {
        console.log(response)
        if (response.data.success) {
          this.$message({ message: '登录成功', type: 'success' })
          localStorage.setItem('userName', response.data.data.name)
          localStorage.setItem('userId', response.data.data.id)
          if (response.data.data.level === 2) {
            this.$router.push('/_backstagepage')
          } else {
            this.$router.push('/_frontpage')
          }
        } else {
          this.$message({ message: response.data.message, type: 'warning' })
        }
      })
    },
    resetForm(formName) {}
  }
}
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  height: 100%;
  min-width: 1300px;
  background-image: linear-gradient(to top right, #12cbc4, #0652dd);
  .login-box {
    width: 450px;
    height: 300px;
    margin: 0 auto;
    justify-content: center;
    align-items: center;

    .demo-ruleForm {
      position: absolute;
      top: 300px;
    }
  }
}
</style>
