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
  },

  calcCost: function () {
    let totalCost = 0

    this.data.selectedList.forEach(function (transformer) {
      totalCost += transformer.price * transformer.costFactor / 100;
    }, this);
    totalCost = totalCost.toFixed(2);
    this.setData({
      totalCost: totalCost
    });
  },

  onTest: function () {
    wx.cloud.callFunction({
      name: 'pdfMaker',
      success: async (res) => {
        const fs = wx.getFileSystemManager()
        const filePath = wx.env.USER_DATA_PATH + '/test.pdf';
        try {
          console.log(res.result.base64Data)
          fs.writeFile({
            filePath: filePath,
            data: res.result.base64Data,
            encoding: 'base64',
            success: () => {
              console.log('存储成功')
              wx.openDocument({
                showMenu:true,
                filePath,
                success: (res) => {
                  console.log('打开文档成功', res);
                },
                fail: (err) => {
                  console.error('打开文档失败', err);
                },
              });
            },
            fail: (err) => {
              console.error('存储文档失败', err);
            }
          });

        } catch (error) {
          console.error('转换为base64时出现错误', error);
        }
      },
    })
  },
})