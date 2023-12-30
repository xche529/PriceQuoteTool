// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let memberSize = null
  let waitSize = null
  let blackSize = null
  console.log('a')
  try {
    let user = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    console.log('a')

    console.log(user)

    const company = user.data[0].company;
    console.log(company)

    const companies = await db.collection('companies').where({
      companyID: company
    }).get();
    console.log(companies)
    memberSize = companies.data[0].members.length;
    waitSize = companies.data[0].waitList.length;
    blackSize = companies.data[0].blackList.length;

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