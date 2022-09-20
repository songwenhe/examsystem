<template>
  <div class="test-container">
    <el-divider><i class="el-icon-s-platform"></i>考试列表</el-divider>
    <div>
      <el-select
        v-model="value"
        placeholder="请选择"
        size="medium"
        style="width: 100px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-input
        v-model="query.keyword"
        size="medium"
        placeholder="输入关键字搜索"
        class="inputSearch"
        style="width: 300px"
      />
      <el-button
        class="el-icon-search"
        size="medium"
        @click="getComments()"
        style="position: absolute; top: 147px; left: 628px"
      ></el-button>
    </div>
    <el-table :data="tableData" style="width: 90%">
      <el-table-column
        align="center"
        label="标题"
        prop="title"
      ></el-table-column>
      <el-table-column
        align="center"
        label="发布者"
        prop="authorId"
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        align="center"
        label="编辑时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column
        label="最后一次回复时间"
        prop="lastReplyTime"
      ></el-table-column>
      <el-table-column align="center" label="回帖数量" prop="replyNum">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="success">{{ scope.row.replyNum }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="danger"
            icon="el-icon-delete"
            @click="openDel(scope.$index, scope.row)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="pageChange"
      :page-size="query.size"
      :pager-count="11"
      layout="prev, pager, next"
      :total="total"
      style="margin-left: 0px"
      :current-page="query.page"
    ></el-pagination>

    <el-dialog :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="ruleForm.name"></el-input>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8088/uploadfile"
            name="files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <img
              v-if="ruleForm.imageUrl"
              :src="ruleForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取消</el-button>
        <el-button type="primary" @click="updateSubject">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogTableVisible" @close="clearTable">
      <el-form :model="ruleTable" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="ruleTable.name"></el-input>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8088/uploadfile"
            name="files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
          >
            <img
              v-if="ruleTable.imageUrl"
              :src="ruleTable.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearTable">取消</el-button>
        <el-button type="primary" @click="addSubject">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  created() {
    this.allSubjects();
  },
  data() {
    return {
      scope: "考试名称",
      tableData: [],
      pageSubjects: [],
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      tableData1: {},
      ruleForm: {
        id: 1,
        name: "",
        imgUrl: "",
        imageUrl: "",
        dialogVisible: false,
      },
      ruleTable: {
        name: "",
        imgUrl: "",
        imageUrl: "",
        dialogVisible: false,
      },
      options: [
        {
          value: 1,
          label: "文章名",
        },
        {
          value: 2,
          label: "作者ID",
        },
      ],
      value: 1,
      disabled: false,
      // rules: {
      //   name: [
      //     { required: true, message: '考试名称', trigger: 'blur' },
      //     { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      //   ],
      //   region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
      //   date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      //   date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
      //   type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
      //   resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
      //   desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      // },
      query: {
        size: 10,
        page: 1,
        keyword: "",
      },
    };
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      this.ruleForm.imgUrl = file.name;
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess2(res, file) {
      this.ruleTable.imgUrl = file.name;
      this.ruleTable.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.ruleTable.imgUrl);
    },
    openDel(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          axios({
            method: "delete",
            url: "http://127.0.0.1:8088/post/api/deletePost/" + row.id,
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "warning",
                message: "删除失败!",
              });
            }
            this.getComments();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    pageChange(res) {
      this.query.page = res;
      this.getComments();
    },
    updateSubject() {
      axios({
        method: "post",
        url: "http://127.0.0.1:8088/subject/api/updateSubject",
        data: this.ruleForm,
      }).then((response) => {
        this.getComments();
        this.clearForm();
      });
    },
    addSubject() {
      axios({
        method: "post",
        url: "http://127.0.0.1:8088/subject/api/addSubject",
        data: this.ruleTable,
      }).then((response) => {
        this.getComments();
        this.clearTable();
      });
    },
    clearForm() {
      this.dialogFormVisible = false;
    },
    clearTable() {
      this.dialogTableVisible = false;
    },
    handleEdit(index, row) {
      // console.log(index, row)
      this.tableData1 = row;
      this.dialogFormVisible = true;
      this.ruleForm.id = row.id;
      this.ruleForm.name = row.name;
      this.ruleForm.imageUrl = "http://127.0.0.1:8088/" + row.imgUrl;
      // axios({
      //   method: 'put',
      //   url: 'http://127.0.0.1:8088/contest/api/updateContest',
      //   params: {}
      // })
    },
    handleTime(now) {
      const time = new Date(now);
      let res = "";
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let day = time.getDate();
      day = day > 9 ? day : "0" + day;
      let hour = time.getHours();
      hour = hour > 9 ? hour : "0" + hour;
      let minutes = time.getMinutes();
      minutes = minutes > 9 ? minutes : "0" + minutes;
      let seconds = time.getSeconds();
      seconds = seconds > 9 ? seconds : "0" + seconds;
      res =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;
      return res;
    },
    subjectName(id) {
      // console.log(id)
      // console.log(this.pageSubjects)
      let subject = this.pageSubjects.find((item) => id === item.id);
      if (subject !== undefined) return subject.name;
      else return "综合实训";
    },
    getComments() {
      axios({
        method: "get",
        url: "http://127.0.0.1:8088/post/api/pagePosts",
        params: this.query,
      }).then((response) => {
        /* this.tableData = response.data.list
          this.tableData.forEach((item) => {
            item.startTime = this.handleTime(item.startTime)
            item.endTime = this.handleTime(item.endTime)
            item.subjectId = this.subjectName(item.subjectId)
            // console.log(Data.subjectName(item.subjectId))
          }) */
        this.total = response.data.total;
        this.tableData = response.data.list.map((item) => {
          /*  return {
              ...item,
              startTime: this.handleTime(item.startTime),
              endTime: this.handleTime(item.endTime),
              subjectId: this.subjectName(item.subjectId)
            } */
          console.log(item.lastReplyTime);
          return Object.assign(item, {
            createTime: this.handleTime(item.createTime),
            updateTime: this.handleTime(item.updateTime),
            lastReplyTime: this.handleTime(item.lastReplyTime),
          });
        });
        console.log(this.tableData);
      });
    },
    allSubjects() {
      axios({
        method: "get",
        url: "http://127.0.0.1:8088/subject/api/pageSubjects?size=999",
      }).then((response) => {
        this.pageSubjects = response.data.list;
        this.getComments();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
