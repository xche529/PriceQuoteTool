const app = getApp()

Page({
  onLoad: function () {
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    const userAvatar = wx.getStorageSync('userAvatar');
    const userName = wx.getStorageSync('userName');

    if (isLoggedIn) {
      this.setData({
        isLoggedIn: true,
        userAvatar: userAvatar,
        userName: userName
      })
    }
    
    let numberArray = [];
    let localTransList = getApp().globalData.transSelectedList;
    for (var i = -100; i <= 200; i++) {
      numberArray.push(i.toString());
    }
    this.setData({
      selectedTransformer: getApp().globalData.selectedTransformer,
      costFactorArray: numberArray,
      selectedList: localTransList
    });
  },

  onShow(){
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    const userAvatar = wx.getStorageSync('userAvatar');
    const userName = wx.getStorageSync('userName');

    if (isLoggedIn) {
      this.setData({
        isLoggedIn: true,
        userAvatar: userAvatar,
        userName: userName
      })
    }

  },

  data: {
    userName: '',
    userAvatar: '',
    costFactorArray: [],
    selectedList: [],
    selectedTransformer: '',
    inputCostFactor: '',
    isLoggedIn: false
  },

  onAdd: function () {
    let localTransList = getApp().globalData.transSelectedList;
    let temp = {
      ...getApp().globalData.selectedTransformer
    };
    if (Object.keys(temp).length === 0) {
      wx.showToast({
        title: '请选择变压器',
        icon: 'none',
        duration: 2000,
      });
    } else {
      localTransList.push(temp);
      this.setData({
        selectedList: localTransList
      });
    }
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

  onCalculator: function () {
    wx.navigateTo({
      url: '/pages/calculator/calculator'
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
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    selectedList[index].costFactor = costFactor;
    this.setData({
      selectedList: selectedList
    });
  },

  onChangeNumber: function (event) {
      console
    let number = event.detail.value;
    let index = event.currentTarget.dataset.index;
    let selectedList = this.data.selectedList;
    console.log('new number: ' + number)
    console.log('index: ' + index)
    console.log(selectedList[index].number)
    selectedList[index].number = number;
    this.setData({
      selectedList: selectedList
    });
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
  },

  onLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  onLogoff: function () {
    wx.clearStorageSync();
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  onUserSetting: function () {
    wx.navigateTo({
      url: '/pages/user/user',
    })
  }
})