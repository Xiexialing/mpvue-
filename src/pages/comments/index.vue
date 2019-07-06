<template>
  <div>
    <div v-if="!comments.length" class="none-comment">
      暂无评论，<a class="text-primary" @click="gotoBooks">去评论</a>
    </div>
    <div v-else>
      <div v-for="comment,i in comments" :key="i" class="comment-item">
        <div>
          <p>我的评论内容</p>
          <p class="comment-time">2019-7-3 12:23:13</p>
        </div>
        <p>&gt;</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {},
        comments: []
      }
    },

    methods: {
      _initUserInfo() {
        this.userInfo = wx.getStorageSync('userInfo')
      },

      async _initComments() {
        const db = wx.cloud.database()
        const commentsCollection = db.collection('comments')
        let res = await commentsCollection.where({
          openid: this.userInfo.openid
        }).get()
        this.comments = res.data
      },

      gotoBooks() {
        wx.switchTab({
          url: '/pages/books/main'
        })
      }
    },

    created() {
      this._initUserInfo()
      this._initComments()
    }
  }
</script>

<style scoped>
  .comment-item {
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #FFF;
    font-size: 14px;
  }

  .comment-time {
    margin-top: 6px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }

  .none-comment {
    font-size: 14px;
    text-align: center;
  }

  .text-primary {
    padding-top: 32px;
    display: inline-block;
    color: #7dc9ff;
  }
</style>
