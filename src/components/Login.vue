<template>
  <div class="login-container">
    <div class="loginMain">
      <img src="@/assets/login.jpg" alt="" class="loginImg">
      <div class="login-box">
        <el-form :model="ruleForm" status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" size="medium"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
            <el-button type="primary" @click="submitForm()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
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
  created() {
    console.log(this);
  },
  methods: {
    async submitForm() {
      const response = await this.$http({
        method: 'post',
        url: 'account/api/login',
        params: this.ruleForm
      })
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
    },
    // resetForm() {
    //   this.ruleForm = ''
    // }
  },

}
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #F2F6FF;

  .loginMain {
    display: flex;
    height: 90%;
    margin: auto;
    align-items: center;
    justify-content: center;

    .loginImg {
      height: 100%;
      border-radius: 20px 0 0 20px;
    }

    .login-box {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 1);
      border-radius: 0 20px 20px 0;

      .demo-ruleForm {
        margin-right: 60px;
      }
    }
  }

}
</style>
