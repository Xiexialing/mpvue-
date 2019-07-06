<template>
  <div class="foots">
    <div v-if="!books.length">您还没留下足迹呢，<a class="text-primary" @click="gotoBooks">赶紧去踩踩</a></div>
    <div v-else>
      <div v-for="(book,i) in books" :key="i">
        <bookCard :data="book.bookInfo" v-if="book.bookInfo"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {showLoading, hideLoading} from '../../utils'
  import bookCard from '../../components/bookCard'

  export default {
    data() {
      return {
        userInfo: '',
        books: []
      }
    },
    methods: {
      _initUserInfo() {
        this.userInfo = wx.getStorageSync('userInfo')
      },
      async _initBooks() {
        showLoading()
        const db = wx.cloud.database()
        const footsCollection = db.collection('foots')
        let res = await footsCollection.where({
          openid: this.userInfo.openid
        }).get()
        this.books = res.data
        this.books.forEach(item => {
          this.getBooksInfo(item)
        })
        hideLoading()
      },
      async getBooksInfo(item) {
        let bookInfo
        const db = wx.cloud.database()
        const booksCollection = db.collection('books')
        let res = await booksCollection.where({
          isbn10: item.isbn10
        }).get()
        bookInfo = res.data[0]
        this.$set(item, 'bookInfo', bookInfo)
      },
      gotoBooks() {
        wx.switchTab({
          url: '/pages/books/main'
        })
      }
    },
    onLoad() {
      this._initUserInfo()
      this._initBooks()
    },
    components: {
      bookCard
    }
  }
</script>

<style scoped>
  .foots {
    padding-top: 32px;
    font-size: 14px;
    text-align: center;
  }

  .text-primary {
    display: inline-block;
    color: #7dc9ff;
  }
</style>
