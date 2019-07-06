<template>
  <div class="books">
    <div v-if="!books.length" class="add-book-wrapper">
      <button type="primary" @click="addBook">暂无书籍，点击扫码添加</button>
    </div>
    <div v-else>
      <div v-for="(book,i) in books" :key="i">
        <bookCard :data="book"/>
      </div>
    </div>
  </div>
</template>

<script>
  import bookCard from '@/components/bookCard'

  export default {
    data() {
      return {
        userInfo: {},
        books: []
      }
    },

    methods: {
      async _initBooks() {
        const db = wx.cloud.database()
        const booksCollection = db.collection('books')
        let res = await booksCollection.get()
        this.books = res.data
      },
      addBook() {
        wx.scanCode({
          success: (res) => {
            this.getBookDetail(res.result)
          }
        })
      },
      getBookDetail(isbn) {
        wx.request({
          url: 'http://feedback.api.juhe.cn/ISBN',
          data: {
            key: 'ceaffd52178652d48644b9624e21ec02',
            sub: isbn
          },
          success: (res) => {
            this.saveBooks(res.data.result)
          }
        })
      },
      saveBooks(bookInfo) {
        let data = {
          openid: this.userInfo.openid,
          ...bookInfo
        }
        const db = wx.cloud.database()
        const booksCollection = db.collection('books')
        booksCollection.add({
          data
        }).then(res => {
          console.log(res)
          this._initBooks()
        })
      },
      _initUserInfo() {
        this.userInfo = wx.getStorageSync('userInfo')
      }
    },

    created() {
      this._initUserInfo()
    },

    onShow() {
      this._initBooks()
    },

    components: {
      bookCard
    }
  }
</script>

<style scoped>
  .books {
    font-size: 14px;
  }

  .add-book-wrapper {
    margin: 64 rpx;
  }
</style>
