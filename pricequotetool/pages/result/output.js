let wxml = `
<view class = "container">
<view class = "itemBoxRed"> </view>
<view class = "itemBoxGreen"> <text class = "text">测试</text></view>
<view class = "itemBoxBlue"> </view>
</view>
`
const style = {
  container: {
    width: 150,
    height: 306,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemBoxRed: {
    borderColor: '#000000',
    borderWidth: 2,
    width: 150,
    height: 100,
    backgroundColor: '#FF0000',
    margin: 25,
  },
  itemBoxGreen: {
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 2,
    width: 150,
    height: 100,
    backgroundColor: '#00FF00',
    margin: 3
  },
  itemBoxBlue: {
    borderColor: '#000000',
    borderWidth: 2,
    width: 150,
    height: 100,
    backgroundColor: '#0000FF',
  },
  text:{
    fontSize: 25,
    width: 100,
    height:100,
  }
}

module.exports = {
  wxml,
  style
}