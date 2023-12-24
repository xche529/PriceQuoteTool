// pages/user.js
Page({

  data: {
    isAdmin: false,
    company: null,
    isEdit: false,
    isCompany: false,
    isInvite: false,
    showCompanyInfo: false,
    tempAvatar: '',
    tempNickName: '',
    tempCompanyName: '',
    companyName: '加载中',
    members: [1, 2, 3],
    waitList: [],
    blackList: [],
  },

  onLoad() {
    const company = wx.getStorageSync('company');
    const userAvatar = wx.getStorageSync('userAvatar');
    const userName = wx.getStorageSync('userName');
    this.setData({
      tempAvatar: userAvatar,
      tempNickName: userName
    })
    if (company != null) {
      this.setData({
        showCompanyInfo: true,
      })
      console.log('company:', company)
      let compName = ''
      try {
        wx.cloud.callFunction({
          name: 'getCompanyName',
          data: {
            company
          },
          success: res => {
            compName = res.result.companyName
            this.setData({
              companyName: compName
            })
          },
          fail: res => {
            this.setData({
              companyName: '加载失败'
            })
          }
        })
      } catch {
        this.setData({
          companyName: '加载失败'
        })
      }
    }
    wx.hideLoading()
  },

  onShowEdit() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },

  onShowCompany() {
    this.setData({
      isCompany: !this.data.isCompany
    })
  },

  onShowInvite() {
    this.setData({
      isInvite: !this.data.isInvite
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

  onInputCompanyName(event) {
    let value = event.detail.value;
    this.setData({
      tempCompanyName: value
    })
  },

  onChangeUserInfo() {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const cloudPath = 'avatars/' + Math.random().toString(36).substr(2, 15); + '.jpg';
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.tempAvatar,
      success: res => {
        wx.hideLoading()
        wx.showLoading({
          title: '修改中',
          mask: true
        })
        wx.cloud.callFunction({
          name: 'changeUserInfo',
          data: {
            name: this.data.tempNickName,
            avatar: res.fileID,
          },
          success: res => {
            wx.hideLoading()
            if (res.result.success) {
              wx.showToast({
                icon: 'success',
                title: '修改成功！',
              })
              wx.clearStorageSync();
              wx.setStorageSync('isLoggedIn', true);
              wx.setStorageSync('userName', this.data.tempNickName);
              wx.setStorageSync('userAvatar', this.data.tempAvatar);
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index'
                });
              }, 1000);
            } else {
              wx.showToast({
                icon: 'error',
                title: '修改失败！',
              })
            }
            console.log(res)
          },
          fail: res => {
            wx.hideLoading()
            wx.showToast({
              title: '提交失败！',
              icon: 'error',
            })
          }
        })
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败！',
          icon: 'error',
        })
      }
    })
  },

  onSignupCompany() {
    wx.showLoading({
      title: '注册中',
    })
    wx.cloud.callFunction({
      name: 'signUpCompany',
      data: {
        name: this.data.tempCompanyName,
      },
      success: res => {
        wx.hideLoading()
        if (res.result.signedUp) {
          wx.showToast({
            title: '注册成功！',
          })
          this.setData({
            isCompany: false,
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '注册失败！',
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          icon: 'error',
          title: '注册失败！',
        })
      }
    })
  },

  onShowCompanyInfo() {
    wx.showLoading({
      title: '加载中',
    })
    console.log('yes')
    wx.cloud.callFunction({
      name: 'checkAdmin',
      success: res => {
        if (res.result.admin) {
          console.log('admin: true')
          this.getMemberInfo()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '您没有权限',
            icon: 'error'
          })
        }
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    })
  },

  getMemberInfo() {
    let memberSize = 0
    let waitSize = 0
    let blackSize = 0

    wx.cloud.callFunction({
      name: 'getMemberInfo',
      success: res => {
        console.log(res)
        this.setData({
          memmemberSizebers: res.result.membersName,
          waitList: res.result.waitList,
          blackList: res.result.blackList,
          isAdmin: true
        })
      },
      fail: res=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    })

    
    wx.cloud.callFunction({
      name: 'getCompanyInfo',
      success: res => {
        wx.hideLoading()
        console.log(res)
        this.setData({
          members: res.result.membersName,
          waitList: res.result.waitList,
          blackList: res.result.blackList,
          isAdmin: true
        })
      },
      fail: res=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    })
  }

})