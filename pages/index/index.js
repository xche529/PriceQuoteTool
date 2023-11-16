const app = getApp()

Page({
  data: {
    transSelectedList: [],

    transList: [
      {
      name: 'S11',
      capacity: 20,
      /*单位kVA*/
      price: 6500,
      voltage: 10,
      /* 单位kV */
      material: '全铜',
      id: 1
    }
  ],

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

  onAdd: function() {
    let locelTransList = this.data.transSelectedList;
    let transOne = this.data.transList[0];
    locelTransList.push(transOne);
    console.log('transformer added');
    this.setData({
      transSelectedList: locelTransList
    })
  },

  onDelete: function(){
    let transList = this.data.transSelectedList;
    transList.pop();
    console.log('transformer deleted');
    this.setData({
      transSelectedList: transList
    })
  },

  onSelect: function(){
    wx.navigateTo({
      url: '/pages/select/select'
    });
    
  }
})