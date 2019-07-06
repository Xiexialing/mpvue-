<template>
  <div class="book-detail">
    <div class="book-image-area">
      <img class="book-image" :src="bookDetail.images_large" alt="">
    </div>
    <p class="title">{{bookDetail.title}}</p>
    <div class="flex">
      <p class="author">作者：{{bookDetail.author}}</p>
      <p class="price">￥{{bookDetail.price}}</p>
    </div>
    <Stars :data="bookDetail.levelNum"/>
    <div class="publish flex">
      <p>出版社：{{bookDetail.publisher}}</p>
      <p>出版时间：{{bookDetail.pubdate}}</p>
    </div>
    <div class="flex">
      <p class="translator">译：{{bookDetail.translator}}</p>
      <p>{{bookDetail.binding}}</p>
    </div>
    <p class="summary">{{bookDetail.summary}}</p>
    <div>
      <p>评价：</p>
      <div v-if="!comments.length" class="no-comment">
        暂无评论
      </div>
      <div v-for="(item,index) in comments" :key="index" class="comment-item">
        <div>
          <p> {{item.comment}}</p>
          <div class="flex wrapper">
            <p> {{item.create_time}}</p>
            <a class="del-btn" @click="del(item)" v-if="item.openid === userInfo.openid">删除</a>
          </div>
        </div>
        <div v-if="item.user" class="user-info">
          <img class="avatar" :src="item.user.avatarUrl" alt="">
          <p>{{item.user.nickName}}</p>
        </div>
      </div>
      <div v-if="!hasComment">
        <textarea class="comment" cols="30" placeholder="小主，评论下呗" v-model="form.comment"></textarea>
        <button type="primary" @click="onSubmit" :disabled="!form.comment">评论</button>
      </div>
      <div class="my-comment" v-else>您已经评论过了~~</div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Stars from '../../components/stars'

  export default {
    data() {
      return {
        userInfo: {},
        bookDetail: {},
        isbn10: '',
        comments: [],   // 全部评价
        form: {
          comment: ''
        }
      }
    },
    computed: {
      /**
       * 是否已经评论过
       */
      hasComment() {
        return this.comments.filter(item => {
          return item.openid === this.userInfo.openid
        }).length
      }
    },
    methods: {
      formatTime(val) {
        return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
      },
      onSubmit() {
        let data = {
          openid: this.userInfo.openid,
          isbn10: this.isbn10,
          comment: this.form.comment,
          create_time: parseInt(new Date().getTime() / 1000)
        }
        const db = wx.cloud.database()
        const commentsCollection = db.collection('comments')
        commentsCollection.add({
          data
        }).then(() => {
          this._initComments()
          this.form.comment = ''
          wx.showToast({
            title: '评论成功'
          })
        })
      },
      _initUserInfo() {
        this.userInfo = wx.getStorageSync('userInfo')
      },
      async _initComments() {
        const db = wx.cloud.database()
        const commentsCollection = db.collection('comments')
        let res = await commentsCollection.where({
          isbn10: this.isbn10
        }).get()
        this.comments = res.data || []
        this.comments.forEach(item => {
          this.$set(item, 'create_time', this.formatTime(item.create_time))
          const usersCollection = db.collection('users')
          usersCollection.where({
            openid: item.openid
          }).get().then(res2 => {
            this.$set(item, 'user', res2.data[0])
          })
        })
      },
      async getBookDetail() {
        const db = wx.cloud.database()
        const booksCollection = db.collection('books')
        let res = await booksCollection.where({
          isbn10: this.isbn10
        }).get()
        this.bookDetail = res.data.length ? res.data[0] : {}
        this.setNavigationBarTitle()
        if (this.bookDetail.title) {
          this.updateFoot()
        }
      },
      async checkFoot() {
        const db = wx.cloud.database()
        const footsCollection = db.collection('foots')
        let res = await footsCollection.where({
          isbn10: this.isbn10
        }).get()
        if (res.data.length) {  // 已经浏览过  不在添加浏览记录
          return false
        } else {
          return true
        }
      },
      async updateFoot() {
        let flag = await this.checkFoot()
        if (!flag) {
          return
        }
        const db = wx.cloud.database()
        const footsCollection = db.collection('foots')
        let data = {
          openid: this.userInfo.openid,
          isbn10: this.isbn10,
          create_time: parseInt(new Date().getTime() / 1000)
        }
        await footsCollection.add({
          data
        })
      },
      setNavigationBarTitle() {
        wx.setNavigationBarTitle({
          title: this.bookDetail.title
        })
      },
      del(item) {
        const db = wx.cloud.database()
        const commentsCollection = db.collection('comments')
        commentsCollection.doc(item['_id']).remove({
          success: () => {
            wx.showToast({
              title: '删除成功'
            })
            this._initComments()
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    },

    onLoad(options) {
      this.isbn10 = options.isbn10
      this._initUserInfo()
      this.getBookDetail()
      this._initComments()
    },

    components: {
      Stars
    }
  }
</script>

<style scoped>
  .book-detail {
    padding: 10px;
    background-color: #fff;
    font-size: 14px;
  }

  .book-image-area {
    font-size: 0;
    text-align: center;
  }

  .book-image {
    margin-bottom: 6px;
    width: 50%
  }

  .title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 6px;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .price {
    font-size: 16px;
    color: red;
    margin-bottom: 6px;
  }

  .publish {
    margin: 6px 0;
  }

  .translator {
    margin-bottom: 10px;
  }

  .summary {
    margin-bottom: 18px;
    line-height: 24px;
    text-indent: 28px;
    text-align: justify;
  }

  .no-comment {
    padding: 12px 0;
    text-align: center;
  }

  .comment {
    width: 100%;
    padding: 10px;
    margin: 6px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .my-comment {
    text-align: center;
    padding: 12px 0;
  }

  .comment-item {
    padding: 5px 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .user-info {
    text-align: center;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .wrapper {
    margin-top: 5px;
    font-size: 12px;
  }

  .del-btn {
    color: dodgerblue;
    cursor: pointer;
  }
</style>
