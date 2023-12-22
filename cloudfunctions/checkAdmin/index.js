// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let admin = false;
  try {
    let user = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    const company = user.data[0].company;
    console.log(company)
    const companies = await db.collection('companies').where({
      companyID: company
    }).get();
    console.log(companies)

    c = companies
    if (companies.data[0].admin.includes(wxContext.OPENID)) {
      admin = true;
      return {
        admin
      }
    } else {
      return {
        admin,
      }
    }
  } catch (error) {
    return {
      admin,
    }
  }

}