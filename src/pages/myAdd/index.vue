<template>
  <div>
    <div v-for="(book, i) in books" :key="i">
      <bookCard :data="book"/>
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
        const booksCollection = db.collection('books')
        let res = await booksCollection.where({
          openid: this.userInfo.openid
        }).get()
        this.books = res.data
        hideLoading()
      }
    },
    onShow() {
      this._initUserInfo()
      this._initBooks()
    },
    components: {
      bookCard
    }
  }
</script>

<style>

</style>
