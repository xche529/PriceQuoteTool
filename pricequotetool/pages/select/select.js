const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    selectedCapacityIndex: '',
    selectedCapacityValue: '',
    isUsingCapacity: false,

    selectedMaterialIndex: 0,
    selectedMaterialValue: '',
    isUsingMaterial: false,

    selectedTypeIndex: 0,
    selectedTypeValue: '',
    isUsingType: false,

    tempList: [],
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
        this.data.selectedCapacityIndex = Math.floor(res.data[0].capacity.length / 2);
        this.data.selectedMaterialValue = res.data[2].material[0];
        this.data.selectedTypeValue = res.data[1].type[0];
        this.data.selectedCapacityValue = res.data[0].capacity[this.data.selectedCapacityIndex];

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
    let filter = {};

    if (this.data.isUsingCapacity) {
      filter.capacity = _.eq(this.data.selectedCapacityValue);
    }

    if (this.data.isUsingMaterial) {
      filter.material = _.eq(this.data.selectedMaterialValue);
    }

    if (this.data.isUsingType) {
      filter.type = _.eq(this.data.selectedTypeValue);
    }

    db.collection('transformer').where(
      filter
    ).get({
      success: (res) => {
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

  onSelectMaterial: function (event) {
    this.data.selectedMaterialIndex = event.detail.value;
    this.data.selectedMaterialValue = this.data.materialArray[this.data.selectedMaterialIndex];
    this.setData({
      selectedMaterialValue: this.data.selectedMaterialValue
    })
  },

  onSelectType: function (event) {
    this.data.selectedTypeIndex = event.detail.value;
    this.data.selectedTypeValue = this.data.typeArray[this.data.selectedTypeIndex];
    this.setData({
      selectedTypeValue: this.data.selectedTypeValue
    })

  },

  onSwitchChange: function (event) {
    console.log(event)
    if (event.currentTarget.id === 'TSwitch') {
      this.setData({
        isUsingType: !this.data.isUsingType
      })
    } else if (event.currentTarget.id === 'CSwitch') {
      this.setData({
        isUsingCapacity: !this.data.isUsingCapacity
      })
    } else {
      this.setData({
        isUsingMaterial: !this.data.isUsingMaterial
      })
    }
  },

  onSelect: function(event){
    let index = event.currentTarget.dataset.index;
    let target = getApp().globalData.selectedTransformer;
    target = {...this.data.tempList[index]};
    target.costFactor = 100;
    getApp().selectTransformer(target);
    wx.navigateTo({
      url: '/pages/index/index'
    });

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