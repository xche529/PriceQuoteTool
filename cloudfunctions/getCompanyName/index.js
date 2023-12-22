// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const company = event.company
  let companyName = ''

  try {
    const res = await db.collection('companies').where({
      companyID: company
    }).get()
    if (res.data[0].admin.includes(wxContext.OPENID) || res.data[0].members.includes(wxContext.OPENID)) {
      companyName = res.data[0].name
    }
  } catch {

  }
  return {
    companyName
  }
}