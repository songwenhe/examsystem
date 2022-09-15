<template>
  <div class="a-component">
    <slot :form="i" name="abb"></slot>
  </div>
</template>

<script>
export default {
  props: {
    form: Array
  },
  data() {
    return {}
  }
}
</script>

<style></style>
