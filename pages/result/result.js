Page({
  data: {
    selectedList: [],
    totalCost: 0
  },

  onLoad: function () {
    this.setData({
      selectedList: getApp().globalData.transSelectedList
    })
    this.calcCost();
  },

  calcCost: function () {
    let totalCost = 0

    this.data.selectedList.forEach(function (transformer) {
      totalCost += transformer.price * transformer.costFactor / 100;
    }, this);
    totalCost = totalCost.toFixed(2);
    console.log(totalCost)
    this.setData({totalCost: totalCost});
  },

})