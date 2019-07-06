<template>
  <div class="progress-wrapper">
    <progress percent="60" color="red"/>
    <p class="tips">{{year}}已经过去{{days}}天，占{{precent}}%</p>
  </div>
</template>

<script>
  export default {
    name: "DayProgress",
    methods: {
      isLeapYear() {
        let year = new Date().getFullYear()
        return year / 400 === 0 || (year / 4 === 0 && year / 100 !== 0)
      },
      allDays() {
        return this.isLeapYear() ? 366 : 365
      }
    },
    computed: {
      year() {
        return new Date().getFullYear()
      },
      days() {
        let origin = new Date()
        origin.setMonth(0)
        origin.setDate(1)
        let offset = new Date().getTime() - origin.getTime()
        return parseInt(offset / 1000 / 60 / 60 / 24) + 1
      },
      precent() {
        return ((this.days / this.allDays()) * 100).toFixed(2)
      }
    }
  }
</script>

<style scoped>
  .progress-wrapper {
    margin: 24rpx;
  }

  .tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
  }
</style>
