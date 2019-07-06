<template>
  <div>
    <img v-for="i in len" :key="i" v-if="i<=data" class="star-icon" src="./star-avtive.svg" alt="">
    <img v-for="i in len" :key="i" v-if="i>data" class="star-icon" src="./star.svg" alt="">
    {{data}}
  </div>
</template>

<script>
  export default {
    name: "stars",
    props: {
      data: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        len: 5
      }
    }
  }
</script>

<style scoped>
  .star-icon {
    display: inline-block;
    vertical-align: top;
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
</style>
