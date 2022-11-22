<template>
  <div class="submitPost-container">
    <div style="height: 50px; text-align: center">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分享中心</el-breadcrumb-item>
        <el-breadcrumb-item>文章发布</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-alert
      type="warning"
      title="请注意帖子的言语措辞,如果出现恶意中伤别人,诽谤他人,帖子将被删除,发帖人将会被惩罚。"
      show-icon
      center
      class="postAlert"
    >
    </el-alert>

    <el-input placeholder="请输入内容" v-model="title" class="postTitle">
      <template slot="prepend">标题</template>
    </el-input>

    <quill-editor ref="myLQuillEditor" v-model="content" :options="editorOption" class="editor"> </quill-editor>
    <el-button class="submitPost" type="danger" @click="getContent" plain> 提交 </el-button>
  </div>
</template>

<script>
import axios from 'axios'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块
  [{ header: 1 }, { header: 2 }], // 几级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
  [{ script: 'sub' }, { script: 'super' }], // 下角标，上角标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  // [{ direction: "rtl" }], // 文字输入方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 颜色选择
  [{ font: [] }], // 字体
  [{ align: [] }], // 居中
  ['clean'], // 清除样式
  [('link', 'image', 'video')] // 控制能上传的内容
]
export default {
  data() {
    return {
      content: '',
      title: '',
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow',
        placeholder: '请输入正文'
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myLQuillEditor.quill
    }
  },
  methods: {
    getContent() {
      const temp = {
        textContent: this.editor.getText().trim(),
        htmlContent: this.content.trim(),
        authorId: localStorage.getItem('userId'),
        title: this.title.trim()
      }
      console.log(this.editor)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8088/post/api/addPost',
        data: temp
      }).then((response) => {
        console.log(response)
        if (response.status === 200) {
          if (response.data.success) {
            this.$message.success(response.data.message)
            this.title = ''
            this.content = ''
            window.history.go(-1)
          }
        } else {
          this.$message.warning('添加失败')
        }
      })
    }
    // onEditorBlur(e) {
    //   console.log('onEditorBlur: ', e)
    // },
    // // 获得焦点事件
    // onEditorFocus(e) {
    //   console.log('onEditorFocus: ', e)
    // },
    // // 内容改变事件
    // onEditorChange(e) {
    //   console.log('onEditorChange: ', e)
    // }
  }
}
</script>

<style lang="less" scoped>
.editor {
  height: 400px;
}
.el-alert {
  margin: 20px 0;
  .el-alert__description {
    font-size: 20px;
  }
}

.el-alert .el-alert__description {
  font-size: 20px;
}

.submitPost {
  float: right;
  margin: 50px;
}
</style>

<style lang="less">
.postAlert {
  .el-alert__title {
    font-size: 15px;
  }
}
.postTitle {
  border-radius: 6px;
  margin-bottom: 20px;
  outline: none;
}
.postTitle.el-input.el-input-group.el-input-group--prepend {
  width: 500px;
}
</style>
