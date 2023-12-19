// 云函数入口文件
const {
  userInfo
} = require('os')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let success = false
  const wxContext = cloud.getWXContext()
  const res = await db.collection('users').where({
    openID: wxContext.OPENID
  }).get();
  //检查用户是否已注册
  if (res.data.length === 1) {
    const userInfo = {
      name: event.name,
      avatar: event.avatar,
    }
    await db.collection('users').where({
      openID: wxContext.OPENID
    }).update({
      data: userInfo,
    }).then(res => {
      success = res
    })
  }
  
  return {
    success
  }
}