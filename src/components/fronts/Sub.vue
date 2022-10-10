<template>
  <div class="contest-container">科目学习</div>
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
    }
  }
}
</script>

<style></style>
