// pages/login.js
Page({

  data: {
    // 是否显示登录后界面
    isLoggedin: false,
    // 是否显示注册界面
    isSignUp: false,
    //是否显示管理员界面
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
        this.processLogin(res)
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败！',
          icon: 'error',
        })
      }
    })
  },

  // 用户注册使用
  onSignUp() {
    wx.showLoading({
      title: '注册中',
      mask: true
    })
    const cloudPath = 'avatars/' + Math.random().toString(36).substr(2, 15); + '.jpg';
    // 上传图片到云存储
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.tempAvatar,
      success: res => {
        wx.cloud.callFunction({
          name: 'signUpAndLogin',
          data: {
            isSignUp: true,
            avatar: res.fileID,
            name: this.data.tempNickName,
          },
          success: res => {
            this.processLogin(res)
          },
          fail: res => {
            wx.hideLoading()
            wx.showToast({
              title: '加载失败！',
              icon: 'error',
            })
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '上传头像失败',
          icon: 'error',
        })
      }
    });
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
  },

  // 处理登录用函数
  processLogin(res) {
    console.log(res)
    if (res.result.signedUp) {
      this.setData({
        name: res.result.name,
      })
      wx.setStorageSync('userName', res.result.name);
      if(res.result.company === null){
        wx.setStorageSync('company', null);
      }else{
        wx.setStorageSync('company', res.result.company);
      }
      wx.cloud.downloadFile({
        fileID: res.result.avatar,
        success: res => {
          this.setData({
            avatar: res.tempFilePath,
            isSignUp: false,
            isLoggedin: true
          })
          wx.setStorageSync('isLoggedIn', true);
          wx.setStorageSync('userAvatar', res.tempFilePath);
          wx.hideLoading();
          wx.showToast({
            title: '已登录',
            icon: 'success',
            duration: 2000,
          });
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 2000);
        },fail: res =>{
          wx.hideLoading();
          wx.showToast({
            title: '获取用户失败',
            icon: 'error',
            duration: 2000,
          });
        }
      });
    } else {
      wx.clearStorage()
      wx.hideLoading()
    }
  }
})