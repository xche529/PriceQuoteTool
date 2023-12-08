const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    selectedCapacityIndex: '',
    selectedCapacityValue: '',

    tempList: [],
    searchResult: null,
    capacityArray: null,

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
    db.collection('searchInfo').get({
      success: (res) => {
        this.data.capacityArray = res.data[0].capacity;
        console.log(res.data[0].capacity)
        this.data.selectedCapacityIndex = Math.floor(res.data[0].capacity.length / 2);
        console.log(this.data.selectedCapacityIndex)

        this.data.selectedCapacityValue = res.data[0].capacity[this.data.selectedCapacityIndex];
        console.log(this.data.selectedCapacityValue);
        this.setData({
          capacityArray: this.data.capacityArray,
          selectedCapacityIndex: this.data.selectedCapacityIndex,
          selectedCapacityValue: this.data.selectedCapacityValue,
        })
      }
    })
  },

  onSearch: function () {
    db.collection('transformer').get({
      success: (res) => {
        console.log(res.data)
        this.searchResult = res.data;
        this.setResult();
      },
      fail: (error) => {
        console.error(error);
      }
    })
  },

  onSelectCapacity: function (event) {
    this.data.selectedCapacityIndex = event.detail.value;
    this.data.selectedCapacityValue = this.data.capacityArray[this.data.selectedCapacityIndex];
    this.setData({selectedCapacityValue:this.data.selectedCapacityValue})
  },

  setResult: function () {
    this.data.tempList = [];
    this.searchResult.forEach((transformer) => {
      let temp = {
        ...this.data.template
      };
      temp.name = transformer.type;
      temp.price = transformer.price;
      temp.capacity = transformer.capacity;
      temp.material = transformer.material;
      temp.voltage = transformer.voltage;
      this.data.tempList.push(temp);
    });
    this.setData({
      tempList: this.data.tempList
    });
    console.log(this.data.tempList);
  }

})