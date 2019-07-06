<template>
  <div class="index">
    <div v-if="!userInfo">
      <img class="avatar" src="../../../static/images/unlogin.png">
      <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">点击登录</button>
    </div>
    <div v-else>
      <img class="avatar" :src="userInfo.avatarUrl">
      <p class="name">{{userInfo.nickName}}</p>
      <button type="primary" @click="launch">开启旅程</button>
    </div>
  </div>
</template>

<script>
  import {showLoading, hideLoading} from '../../utils'

  const AppID = 'wx5ec98955b095e7fd'
  const AppSecret = 'c171078bd9672441906159194f16a59c'

  export default {
    data() {
      return {
        userInfo: ''
      }
    },
    methods: {
      _initUserInfo() {
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
          this.userInfo = userInfo
        }
      },
      bindGetUserInfo(e) {
        if (e.mp.detail.rawData){
          //用户按了允许授权按钮
          console.log('用户按了允许授权按钮')
          this.getUserInfo()
        } else {
          //用户按了拒绝按钮
          console.log('用户按了拒绝按钮')
        }
      },
      getUserInfo() {
        showLoading()
        wx.getUserInfo({
          success: (res) => {
            this.extraUserInfo(res.userInfo)
          },
          fail(res) {
            console.log(res)
            hideLoading()
          }
        })
      },
      extraUserInfo(userInfo={}) {
        wx.login({
          success: (res) => {
            if (res.code) {
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                data: {
                  appid: AppID,
                  secret: AppSecret,
                  js_code: res.code,
                  grant_type: 'authorization_code'
                },
                success: (res) => {
                  hideLoading()
                  this.userInfo = Object.assign({}, userInfo, res.data)
                  this.saveUserInfo()
                },
                fail(res) {
                  console.log(res)
                  hideLoading()
                }
              })
            }
          }
        })
      },
      saveUserInfo() {
        wx.setStorageSync('userInfo', this.userInfo)
        const db = wx.cloud.database()
        const usersCollection = db.collection('users')
        usersCollection.add({
          data: this.userInfo
        })
      },
      launch() {
        wx.switchTab({
          url: '/pages/books/main'
        })
      }
    },
    created() {
      this._initUserInfo()
    }
  }
</script>

<style scoped>
  .index {
    display: flex;
    justify-content: center;
    padding-top: 256rpx;
    font-size: 14px;
    text-align: center;
  }

  .avatar {
    margin-bottom: 12px;
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
  }
  .name{
    margin-top: -12px;
    margin-bottom: 12px;
  }
</style>
