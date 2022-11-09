<template>
  <div class="password-container">
    <el-card class="box-card" shadow>
      <el-divider content-position="left"><i class="el-icon-edit" style="font-size: 20px">更改密码</i></el-divider>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model.number="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword()">确认修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        password: '',
        checkPass: '',
        oldPass: '',
        id: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.ruleForm.id = parseInt(localStorage.getItem('userId'))
    // this.getAccount()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changePassword() {
      this.$confirm('请确实是本人操作, 是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        axios({
          method: 'get',
          url: 'http://127.0.0.1:8088/account/changePassword',
          params: this.ruleForm
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '修改失败!'
            })
          }
        })
      })
    }
  }
}
</script>

<style></style>
