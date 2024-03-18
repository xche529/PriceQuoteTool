const fs = wx.getFileSystemManager()

Page({
    data: {
        selectedList: [],
        totalCost: 0,
        logo: null,
    },

    onLoad: function () {
        this.setData({

        })
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

    onTest() {
        wx.showLoading({
            title: '生成中',
        })
        wx.cloud.callFunction({
            name: 'pdfMaker',
            data: {
                products: this.data.selectedList,
            },
            success: async (res) => {
                console.log(res)
                wx.hideLoading()
                wx.showLoading({
                    title: '下载中',
                })
                this.downloadID(res.result.id, res.result.time)
            },
            fail: (err) => {
                wx.hideLoading()
                wx.showToast({
                    title: '生成失败',
                })
                console.error("调用云函数失败", err);
            }
        })
    },

    downloadID(id, time) {
        wx.cloud.downloadFile({
            fileID: id,
            success: res => {
                wx.hideLoading()
                fs.readFile({
                    filePath: res.tempFilePath,
                    encoding: 'utf-8',
                    success: res => {
                        const localFilePath = wx.env.USER_DATA_PATH + '/' + time + '.pdf';
                        const jsonContent = JSON.parse(res.data.trim());
                        const base64Data = jsonContent.data;
                        console.log('读取json成功');
                        fs.writeFile({
                            filePath: localFilePath,
                            data: base64Data,
                            encoding: 'base64',
                            success: () => {
                                console.log('存储pdf成功')
                                wx.openDocument({
                                    showMenu: true,
                                    filePath: localFilePath,
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
                        });;
                    },
                    fail(res) {
                        console.error('读取txt失败', res)
                    }
                })
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '下载失败',
                })
                console.error('下载txt文件失败', res)
            },
            complete: res => {
                wx.cloud.deleteFile({
                    fileList: [id],
                    success: res => {
                        console.log('成功删除')
                    },
                    fail: res => {
                        ('删除失败')
                    }
                })
            }
        })
    },
})