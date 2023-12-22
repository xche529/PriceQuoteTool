// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openID = event.openID
  const res = await db.collection('users').where({
    openID: openID
  }).get()
  const name = res.data[0].name
  const avatar = res.data[0].avatar
  return {
    name,
    avatar
  }
}