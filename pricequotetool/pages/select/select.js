const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    selectedCapacityIndex: '',
    selectedCapacityValue: '',
    isUsingCapacity: true,

    selectedMaterialIndex: 0,
    selectedMaterialValue: '',
    isUsingMaterial: true,

    selectedTypeIndex: 0,
    selectedTypeValue: '',
    isUsingType: true,

    tempList: [],
    searchResult: null,
    capacityArray: null,
    materialArray: null,
    typeArray: null,

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
        this.data.typeArray = res.data[1].type;
        this.data.materialArray = res.data[2].material;

        console.log(res.data[2].material);
        this.data.selectedCapacityIndex = Math.floor(res.data[0].capacity.length / 2);
        this.data.selectedMaterialValue = res.data[2].material[0];
        this.data.selectedTypeValue = res.data[1].type[0];
        this.data.selectedCapacityValue = res.data[0].capacity[this.data.selectedCapacityIndex];
        console.log(this.data.selectedCapacityValue);

        this.setData({
          capacityArray: this.data.capacityArray,
          typeArray: this.data.typeArray,
          materialArray: this.data.materialArray,
          selectedCapacityIndex: this.data.selectedCapacityIndex,
          selectedCapacityValue: this.data.selectedCapacityValue,
          selectedMaterialValue: this.data.selectedMaterialValue,
          selectedTypeValue: this.data.selectedTypeValue,
        
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
    this.setData({
      selectedCapacityValue: this.data.selectedCapacityValue
    })
  },

  onSelectMaterial: function(event){

  },

  onSelectType: function(event){

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