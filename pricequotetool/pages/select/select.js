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
      costFactor: null,
      id: null
    }

  },

  onLoad: function () {


  },

  onSearch: function () {
    db.collection('transformer').get({
      success: function (res) {
        console.log(res.data)
        this.searchResult = res.data;
      }
    })

  },

  setResult: function(){
    this.tempList = [];
    this.searchResult.foreach(function(tramsformer){
      
    });
  }

})