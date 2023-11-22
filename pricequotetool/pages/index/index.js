const app = getApp()

Page({
  onLoad: function(){
    let numberArray = [];
    for (var i = -100 ; i <= 200; i++) {
      numberArray.push(i.toString());
    }
    this.setData({
      costFactorArray: numberArray
    });
  },

  data: {
    costFactorArray: [],
    selectedList: [],
    transList: [{
      name: 'S11',
      capacity: 20,
      /* 单位kVA */
      price: 6500,
      voltage: 10,
      /* 单位kV */
      material: '全铜',
      costFactor: 100,
      id: 1
    }],

    example: {
      name: 'S11',
      capacity: 20,
      /* 单位kVA */
      price: 6500,
      voltage: 10,
      /* 单位kV */
      material: '全铜',
      costFactor: 100,
      id: 1
    }
  },

  onAdd: function () {
    let localTransList = getApp().globalData.transSelectedList;
    let transOne = { ...this.data.transList[0] };
    localTransList.push(transOne);
    console.log('transformer added');
    this.setData({selectedList: localTransList});
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
  },

  
  onDeleteTransformer: function (event) {
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList.splice(index, 1);
    this.setData({
      selectedList: selectedList
    });
  },

  onChangePriceFactor: function(event){
    let costFactor = event.detail.value - 100;
    console.log('new factor:', costFactor)
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList[index].costFactor = costFactor;
    this.setData({selectedList: selectedList});
    console.log('new factor:', costFactor)
  }
})