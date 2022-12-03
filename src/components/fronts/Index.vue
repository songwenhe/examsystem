<template>
  <div class="index-container">
    <template>
      <el-carousel indicator-position="outside" autoplay height="70vh" trigger="click">
        <el-carousel-item v-for="item in carouseData" :key="item.title" class="carousel">
          <h1 class="i-title">{{ item.title }}</h1>
          <el-button class="i-button" type="text" @click="toIndex">{{ item.button }}</el-button>
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carouseData: [
        {
          title: '安全稳定专业的考试系统',
          button: '去考试'
        },
        {
          title: '全方位保证严肃考试公平公正',
          button: '去考试'
        },
        {
          title: '艾刷智能AI刷题-您的智能刷题管家',
          button: '去考试'
        },
        {
          title: '高效的线上学考结合一体化平台',
          button: '去学习'
        }
      ]
    }
  },
  methods: {
    toIndex() {
      // localStorage.setItem('index', this.router)
      this.$router.push('/_frontpage/contest')
    }
  }
}
</script>

<style lang="less" scoped>
.index-container {
  background-color: #409eff;
  width: 100vw;
}
.carousel {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .i-title {
    line-height: 20vh;
    text-align: center;
    font-size: 60px;
  }
  .i-button {
    width: 100px;
    color: #000000;
    margin: auto;
    font-size: 30px;
  }
  .i-button:hover {
    transform: scale(1.1);
    background-color: #fb9730;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 70vh;
  margin: 0;
}

.el-carousel__item {
  background-color: #409eff;
}

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
</style>
