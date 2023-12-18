// pages/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      isLogin: false,
      isSignUp: false,
      isAdmin: false,
      tempNickName: '',
      tempAvatar: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    onSignUp(){
      this.setData({
        isSignUp: true
      })
    },

    onInputNickName(event){
      let value = event.detail.value;
      this.setData({
        tempNickName: value
      })
    }

})