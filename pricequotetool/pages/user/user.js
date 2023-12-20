// pages/user.js
Page({

  data: {
    isEdit: false,
    isCompany: false,
    isInvite: false,
    tempAvatar: '',
    tempNickName: '',
  },

  onLoad() {
    const userAvatar = wx.getStorageSync('userAvatar');
    const userName = wx.getStorageSync('userName');
    this.setData({
      tempAvatar: userAvatar,
      tempNickName: userName
    })
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

  onShowInvite(){
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

  onChangeUserInfo() {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    const cloudPath = 'avatars/' + Math.random().toString(36).substr(2, 15); + '.jpg';
    // 上传图片到云存储
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


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})