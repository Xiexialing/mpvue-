<template>
  <div class="book-card" @click="gotoBookDetail(data.isbn10)">
    <img class="book-img" :src="data.images_medium">
    <div class="book-detail">
      <p class="title">{{data.title}}</p>
      <p class="summary">{{data.summary}}</p>
      <p class="publisher">{{data.publisher}}</p>
      <p class="price">￥{{data.price}}</p>
      <Stars :data="data.levelNum"/>
    </div>
  </div>
</template>

<script>
  import Stars from './stars'

  export default {
    name: "bookCard",
    props: {
      data: {
        type: Object
      }
    },
    methods:{
      gotoBookDetail(isbn) {
        wx.navigateTo({
          url: '/pages/bookDetail/main?isbn10=' + isbn
        })
      }
    },
    components:{
      Stars
    }
  }
</script>

<style scoped>
  .book-card {
    margin-bottom: 12rpx;
    padding: 12rpx;
    width: 100%;
    display: flex;
    background-color: #FFF;
    box-sizing: border-box;
  }

  .book-img {
    margin-right: 24rpx;
    width: 240rpx;
    height: 300rpx;
  }

  .book-detail {
    flex: 1;
  }

  .title {
    line-height: 42rpx;
    font-size: 28rpx;
    font-weight: bold;
  }

  .summary {
    font-size: 14px;
    margin: 12rpx 0;
    height: 32rpx;
    overflow: hidden;
  }

  .publisher {
    margin: 12rpx 0;
    height: 32rpx;
  }

  .price {
    margin: 24rpx 0;
    color: red;
    font-size: 48rpx;
  }
</style>
