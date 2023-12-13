
let wxml = `
<view class = "container">
<view class = "itemBoxRed"> </view>
<view class = "itemBoxGreen"> <text class = "text">测试</text></view>
<view class = "itemBoxBlue"> </view>
</view>
`
const style = {
  container: {
    width: 150,
    height: 306,
    justifyContent: 'space-around',
  },
  itemBoxRed: {
    borderColor: '#000000',
    borderWidth: 0.5,
    borderTop:2,
    width: 150,
    height: 100,
    padding: 5,
    backgroundColor: '#FF0000',
  },
  itemBoxGreen: {
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 2,
    width: 150,
    height: 100,
    backgroundColor: '#00FF00',
    margin: 0,
  },
  itemBoxBlue: {
    borderColor: '#000000',
    borderWidth: 2,
    width: 150,
    height: 100,
    backgroundColor: '#0000FF',
  },
  text:{
    fontSize: 25,
    width: 100,
    height:100,
    textAlign:'center',
    verticalAlign: 'middle'
  }
}


Page({
  data: {
    selectedList: [],
    totalCost: 0,
    container: '',
    isImg: false
  },

  onLoad: function () {
    this.setData({
      selectedList: getApp().globalData.transSelectedList
    })
    this.calcCost();
    this.widget = this.selectComponent('.widget')
    console.log(this.widget)
  },

  onImg() {
    console.log(wxml)
    console.log(style)
    const p1 = this.widget.renderToCanvas({
      wxml,
      style
    })
    p1.then((res) => {
      console.log('container', res.layoutBox)
      this.data.container = res.layoutBox
      this.data.isImg = true
    })
  },

  onSaveImg() {
    if (this.data.isImg) {
      const p2 = this.widget.canvasToTempFilePath()
      p2.then(res => {
        this.setData({
          src: res.tempFilePath,
        })
        
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000,
            });
      
          },
          fail: function (data) {
            if (data.errMsg.includes('auth deny')) {
              wx.showModal({
                title: '提示',
                content: '请授权保存相册',
                complete: (res) => {
                  if (res.cancel) {}
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {}
                    });
                  }
                }
              })
            }
          }
        })
      })
    } else {
      wx.showToast({
        title: '请先生成图片',
        icon: 'none',
        duration: 2000,
      });
    }
  },

  calcCost: function () {
    let totalCost = 0

    this.data.selectedList.forEach(function (transformer) {
      totalCost += transformer.price * transformer.costFactor / 100;
    }, this);
    totalCost = totalCost.toFixed(2);
    console.log(totalCost)
    this.setData({
      totalCost: totalCost
    });
  },
})