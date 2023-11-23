const app = getApp()

Page({
  onLoad: function () {
    let numberArray = [];
    for (var i = -100; i <= 200; i++) {
      numberArray.push(i.toString());
    }
    this.setData({
      pickerArray: numberArray
    });
  },

  data: {
    totalPrice: 0.00,
    finalPrice: 0.00,
    finalPriceTaxed: 0.00,
    priceDifference: 0.00,
    quantity: 0,
    taxCost: 0.00,
    taxRate: 15,
    pickerArray: [],
    selectedList: [],
    inputCostFactor: '',
    inputTax: '',
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
    this.updateAll();
  },

  onDeleteTransformer: function (event) {
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList.splice(index, 1);
    this.setData({
      selectedList: selectedList
    });
    this.updateAll();
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
    this.updateAll();
  },

  onChangePrice: function (event) {
    let costFactor = event.detail.value - 100;
    console.log('new factor:', costFactor)
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList[index].costFactor = costFactor;
    this.setData({
      selectedList: selectedList
    });
    console.log('new factor:', costFactor)
    this.updateAll();
  },

  onChangeQuantity: function (event) {
    let costFactor = event.detail.value - 100;
    console.log('new factor:', costFactor)
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList[index].costFactor = costFactor;
    this.setData({
      selectedList: selectedList
    });
    console.log('new factor:', costFactor)
    this.updateAll();
  },

  onInputAllCostFactor: function (event) {
    let value = event.detail.value;
    this.setData({
      inputCostFactor: value
    })
  },

  onInputTax: function (event) {
    let value = event.detail.value;
    this.setData({
      inputTax: value
    })
  },

  onUpdateTax: function () {
    let numericValue = parseFloat(this.data.inputTax);
    console.log(numericValue)
    if (!isNaN(numericValue)) {
      this.setData({
        taxRate: numericValue
      })
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none',
        duration: 2000,
      });
    }
    this.emptyTaxInput();
    this.updateAll();
  },

  onUpdateAllCostFactor: function (event) {
    let numericValue = parseFloat(this.data.inputCostFactor);
    console.log(numericValue)
    if (!isNaN(numericValue)) {
      this.updateAllCostFactor(numericValue);
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none',
        duration: 2000,
      });
      this.emptyCostFactorInput();
    }
    this.updateAll();
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
  },
  emptyTaxInput: function () {
    let empty = '';
    this.setData({
      inputTax: empty
    });
  },
  updateAll: function(){
    this.updateTotalPrice();
    this.updateFinalCost();
    this.updateQuantity();
    this.priceDifference = this.finalPrice - this.totalPrice;
    this.finalPriceTaxed = parseFloat(this.finalPrice) + (parseFloat(this.finalPrice) * parseFloat(this.data.taxRate) / 100);
    this.taxCost = this.finalPriceTaxed - this.finalPrice;
    this.setData({
      totalPrice: this.totalPrice,
      finalPrice: this.finalPrice,
      priceDifference: this.priceDifference,
      finalPriceTaxed: this.finalPriceTaxed,
      taxCost: this.taxCost,
      quantity: this.quantity
    })
  },

  updateTotalPrice: function(){
    let totalCost = 0
    this.data.selectedList.forEach(function (transformer) {
      totalCost += transformer.price;
    }, this);
    totalCost = totalCost.toFixed(2);
    this.totalPrice= totalCost;
  },
  updateFinalCost: function(){
    let finalPrice = 0
    this.data.selectedList.forEach(function (transformer) {
      finalPrice += transformer.price * transformer.costFactor / 100;
    }, this);
    finalPrice = finalPrice.toFixed(2);
    this.finalPrice = finalPrice;
  },
  
  updateQuantity: function(){
    let quantity = 0
    this.data.selectedList.forEach(function (transformer) {
      quantity += transformer.quantity;
    }, this);
    this.quantity = quantity;
  }
})