<template>
  <div class="person-container">
    <el-card class="box-card" shadow
      ><el-divider content-position="left"><i class="el-icon-user" style="font-size: 20px">个人信息</i></el-divider>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="ruleForm.name" size="medium" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px" disabled>
        <el-form-item label="学号">
          <el-input v-model="ruleForm.id" size="medium" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="QQ">
          <el-input v-model="ruleForm.qq" size="medium" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="手机">
          <el-input v-model="ruleForm.phone" size="medium" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="上传头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8088/uploadfile"
            name="files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <img v-if="ruleForm.ImgUrl" :src="ruleForm.ImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="自我描述">
          <el-input v-model="ruleForm.description" size="medium" style="width: 100%" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="">
          <el-button type="primary" @click="putContest" style="float: right; font-size: 14px">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      userId: 0,
      ruleForm: {},
      tableData: [],
      query: {
        page: 1,
        size: 999,
        keyword: ''
      }
    }
  },
  created() {
    this.userId = parseInt(localStorage.getItem('userId'))
    this.getAccount()
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      this.ruleForm.avatarImgUrl = file.name
      this.ruleForm.ImgUrl = URL.createObjectURL(file.raw)
    },
    getAccount() {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/account/pageAccount',
        data: this.query
      }).then((response) => {
        this.tableData = response.data.list.map((item) => {
          return {
            ...item,
            ImgUrl: 'http://localhost:8088/' + item.avatarImgUrl
          }
        })
        this.ruleForm = this.tableData.find((item) => this.userId === item.id)
      })
    },
    putContest() {
      this.$confirm('此操作修改个人信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios({
            method: 'put',
            url: 'http://127.0.0.1:8088/account/updateIgnoreNull',
            data: this.ruleForm
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
            this.getAccount()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style></style>
