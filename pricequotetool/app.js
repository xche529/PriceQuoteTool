// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      traceUser: true,
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    selectedTransformer: '',
    transSelectedList: [],
  },

  selectTransformer: function(transformer){
    this.globalData.selectedTransformer = transformer;
    console.log(this.globalData.selectedTransformer)
  }
})
