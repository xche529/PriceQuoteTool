// pages/login.js
Page({

  data: {
    // 控制页面状态
    isLogin: false,
    isSignUp: false,
    isAdmin: false,
    name: '加载失败',
    avatar: '',

    tempNickName: '',
    tempAvatar: '../../image/Search.jpg',
  },


  onLoad() {
    //检测用户是否注册
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'signUpAndLogin',
      data: {
        isSignUp: false
      },
      success: res => {
        console.log(res)
        if (res.result.signedUp) {
          this.setData({
            name: res.result.name,
            avatar: res.result.avatar,
            isLogin: true
          })
        }
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败！',
          icon: error
        })
      }
    })
  },

  // 用户注册使用
  onSignUp() {
    wx.cloud.callFunction({
      name: 'signUpAndLogin',
      data: {
        isSignUp: true,
        avatar: this.data.tempAvatar,
        name: this.data.tempNickName,
      },
      success: res => {
        console.log(res)
        console.log(this.data.tempNickName)
      }
    })
  },

  // 存储用户昵称
  onInputNickName(event) {
    let value = event.detail.value;
    this.setData({
      tempNickName: value
    })
  },

  // 存储用户选择头像
  onLoadAvatar(event) {
    const avatar = event.detail.avatarUrl
    console.log(avatar)
    this.setData({
      tempAvatar: avatar
    })
  },

  // 用于用户登录
  onLogin() {
    this.setData({
      isSignUp: true
    })
  }
})