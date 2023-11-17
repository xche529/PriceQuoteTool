const app = getApp()

Page({
  data: {
    selectedList: [],
    transList: [{
      name: 'S11',
      capacity: 20,
      /* 单位kVA */
      price: 6500,
      voltage: 10,
      /* 单位kV */
      material: '全铜',
      id: 1
    }],

    example: {
      name: 'S11',
      capacity: 20,
      /*单位kVA*/
      price: 6500,
      voltage: 10,
      /* 单位kV */
      material: '全铜',
      id: 1
    }
  },

  onAdd: function () {
    let localTransList = getApp().globalData.transSelectedList;
    let transOne = this.data.transList[0];
    localTransList.push(transOne);
    console.log('transformer added');
    this.setData({selectedList: localTransList});
  },

  onDelete: function () {
    let transList = getApp().globalData.transSelectedList;
    transList.pop();
    console.log('transformer deleted');
    this.setData({selectedList: transList});
  },

  onSelect: function () {
    wx.navigateTo({
      url: '/pages/select/select'
    });
  },

  onResult: function () {
    wx.navigateTo({
      url: '/pages/result/result'
    });
  }
})