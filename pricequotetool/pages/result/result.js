Page({
  data: {
    selectedList: [],
    totalCost: 0,
    txtFile: '',
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
      data: {
        products: this.data.selectedList,
      },
      success: async (res) => {
        console.log(res)
        const fs = wx.getFileSystemManager()
        this.downloadID(res.result.id)
        fs.readFile({
          filePath: this.data.txtFile,
          success(res) {
            this.createPDF(res.data);
          },
          fail(res){
            console.error('读取txt失败',res)
          }
        })
      },
      fail: (err) => {
        console.error("调用云函数失败", err);
      }
    })
  },

  downloadID: function (id) {
    wx.cloud.downloadFile({
      fileID: id,
      success: res => {
        this.data.txtFile = res.tempFilePath;
        console.log(res)
      },
      fail: res=>{
        console.error('下载txt文件失败',res)
      }
    })
  },

  createPDF: function (base64){
    const filePath = wx.env.USER_DATA_PATH + '/test.pdf';
    fs.writeFile({
      filePath: filePath,
      data: base64,
      encoding: 'base64',
      success: () => {
        console.log('存储pdf成功')
        wx.openDocument({
          showMenu: true,
          filePath,
          success: (res) => {
            console.log('打开pdf成功', res);
          },
          fail: (err) => {
            console.error('打开pdf失败', err);
          },
        });
      },
      fail: (err) => {
        console.error('存储pdf失败', err);
      }
    });
  }
})