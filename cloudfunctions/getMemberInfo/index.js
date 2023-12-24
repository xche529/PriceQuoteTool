// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let memberSize = 0
  let waitSize = 0
  let blackSize = 0
  
  try {
    let user = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    const company = user.data[0].company;
    const companies = await db.collection('companies').where({
      companyID: company
    }).get();
    memberSize = companies.data[0].members.length()
    waitSize = companies.data[0].waitList.length()
    blackSize = companies.data[0].blackList.length()

    return {
      memberSize,
      waitSize,
      blackSize
    }
  } catch {
    return {
      memberSize,
      waitSize,
      blackSize
    }
  }


}