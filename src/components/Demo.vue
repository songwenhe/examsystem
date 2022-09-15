<template>
  <div>
    <div v-for="i in tableData" :key="i.data">
      <div slot="reference" class="name-wrapper" v-if="i.name === 1">
        <el-tag>未开始</el-tag>
      </div>
      <div slot="reference" class="name-wrapper" v-else-if="i.name === 2">
        <el-tag type="success">进行中</el-tag>
      </div>
      <div slot="reference" class="name-wrapper" v-else-if="i.name === 3">
        <el-tag type="danger">已结束</el-tag>
      </div>
      <div slot="reference" class="name-wrapper" v-else-if="i.name === 4">
        <el-tag type="danger">开始了</el-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: 1,
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: 2,
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: 3,
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: 4,
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style></style>
