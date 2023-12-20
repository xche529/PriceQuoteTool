// 云函数入口文件
const {
  userInfo
} = require('os')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const oldAvatar = '';
// 云函数入口函数
exports.main = async (event, context) => {
  let success = false
  const wxContext = cloud.getWXContext()
  try {
    const res = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    //检查用户是否已注册
    console.log(res)
    if (res.data.length === 1) {
      const userInfo = {
        name: event.name,
        avatar: event.avatar,
      }
      const res = await db.collection('users').where({
        openID: wxContext.OPENID
      }).update({
        data: userInfo,
      });
      console.log(res)
      if (res.stats.updated === 1) {
        success = true
        return {
          success,
        }
      }
    }
  } catch {
    return {
      success
    }
  }
}