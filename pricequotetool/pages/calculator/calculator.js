const app = getApp()

Page({
  onLoad: function () {
    let numberArray = [];
    for (var i = -100; i <= 200; i++) {
      numberArray.push(i.toString());
    }
    this.setData({
      costFactorArray: numberArray
    });
  },

  data: {
    totalPrice : 0,
    quantity : 0,
    tax: 15,
    costFactorArray: [],
    selectedList: [],
    inputCostFactor: '',
    transList: [{
      price: 6500,
      costFactor: 100,
      quantity: 1,
      id: 1
    }],

  },

  onAdd: function () {
    let localTransList = this.data.selectedList;
    let transOne = {
      ...this.data.transList[0]
    };
    localTransList.push(transOne);
    console.log('transformer added');
    this.setData({
      selectedList: localTransList
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

  onChangePriceFactor: function (event) {
    let costFactor = event.detail.value - 100;
    console.log('new factor:', costFactor)
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList[index].costFactor = costFactor;
    this.setData({
      selectedList: selectedList
    });
    console.log('new factor:', costFactor)
  },

  onInputAllCostFactor: function (event) {
    let value = event.detail.value;
    this.setData({
      inputCostFactor: value
    })
    console.log(value)
    console.log(this.data.inputCostFactor)
  },


  onUpdateAllCostFactor: function (event) {
    let numericValue = parseFloat(this.data.inputCostFactor);
    console.log(numericValue)
    if (!isNaN(numericValue)) {
      this.setData({
        inputCostFactor: numericValue
      })
      this.updateAllCostFactor(numericValue);
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none',
        duration: 2000,
      });
      this.emptyCostFactorInput();
    }
  },

  updateAllCostFactor: function (value) {
    let selectedList = this.data.selectedList;
    selectedList.forEach(transformer => {
      transformer.costFactor = value;
    });
    this.setData({
      selectedList: selectedList
    });
    this.emptyCostFactorInput();
  },

  emptyCostFactorInput: function () {
    let empty = '';
    this.setData({
      inputCostFactor: empty
    });
  }
})