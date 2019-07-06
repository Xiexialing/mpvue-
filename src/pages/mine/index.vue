<template>
  <div>
    <div class="top">
      <img class="avatar" :src="userInfo.avatarUrl" alt="">
      <p class="name">{{userInfo.nickName}}</p>
    </div>
    <div>
      <button type="primary" @click="addBook">添加图书</button>
      <button type="primary" @click="showMyBooks">我添加的</button>
      <button type="primary" @click="showMyComments">我点评的</button>
      <button type="primary" @click="showMyFoots">浏览记录</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: ''
      }
    },
    methods: {
      addBook() {
        this.scanCode()
      },
      scanCode() {
        wx.scanCode({
          success: (res) => {
            this.requestDetail(res.result)
          }
        })
      },
      requestDetail(isbn) {
        wx.request({
          url: 'http://feedback.api.juhe.cn/ISBN',
          data: {
            key: 'ceaffd52178652d48644b9624e21ec02',
            sub: isbn
          },
          success: (res) => {
            this.saveBook(res.data.result)
          }
        })
      },
      saveBook(bookInfo) {
        let data = {
          openid: this.userInfo.openid,
          ...bookInfo
        }
        const db = wx.cloud.database()
        const booksCollection = db.collection('books')
        booksCollection.add({
          data
        }).then(() => {
          wx.showToast({
            title: '添加成功'
          })
        })
      },
      showMyBooks() {
        wx.navigateTo({
          url: '/pages/myAdd/main'
        })
      },
      showMyComments() {
        wx.navigateTo({
          url: '/pages/comments/main'
        })
      },
      showMyFoots() {
        wx.navigateTo({
          url: '/pages/foots/main'
        })
      },
      _initUserInfo() {
        this.userInfo = wx.getStorageSync('userInfo')
      }
    },
    created() {
      this._initUserInfo()
    }
  }
</script>

<style>
  .top {
    padding: 24px 0;
    text-align: center;
    background-color: #FFF;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
</style>
