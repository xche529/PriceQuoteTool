const db = wx.cloud.database()
Page({
  data: {
    tempList:[],
    searchResult: null,
    template: {
      name: null,
      capacity: null,
      /* 单位kVA */
      price: null,
      voltage: null,
      /* 单位kV */
      material: null,
      id: null
    }

  },

  onLoad: function () {

  },

  onSearch: function () {
    db.collection('transformer').get({
      success: (res) => {
        console.log(res.data)
        this.searchResult = res.data;
        this.setResult();
      }
      
    })
  },

  setResult: function(){
    this.data.tempList = [];
    this.searchResult.forEach((transformer) => {
      let temp = {...this.data.template};
      temp.name = transformer.type;x
      temp.price = transformer.price;
      temp.capacity = transformer.capacity;
      temp.material = transformer.material;
      temp.voltage = transformer.voltage;
      this.data.tempList.push(temp);
    });
    this.setData({
      tempList : this.data.tempList
    });
    console.log(this.data.tempList);
  }

})