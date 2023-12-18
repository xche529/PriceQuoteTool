// pages/login.js
Page({

  data: {
    isLogin: false,
    isSignUp: false,
    isAdmin: false,
    tempNickName: '',
    tempAvatar: '../../image/Search.jpg',
  },

  onLoad() {
    wx.cloud.callFunction({
      name: 'signUpAndLogin',
      data: {
        isSignUp: false
      },
      success: res =>{
        console.log(res)
      }
    })
  },

  onSignUp() {
    this.setData({
      isSignUp: true
    })
  },

  onInputNickName(event) {
    let value = event.detail.value;
    this.setData({
      tempNickName: value
    })
  },

  onLoadAvatar(event) {
    const avatar = event.detail.avatarUrl
    console.log(avatar)
    this.setData ({
      tempAvatar: avatar
    })
  },

  onLogin(){
    wx.cloud.callFunction({
      name: 'signUpAndLogin',
      data: {
        avatar: this.data.tempAvatar,
        name: this.data.tempNickName
      }
    })
  }
})