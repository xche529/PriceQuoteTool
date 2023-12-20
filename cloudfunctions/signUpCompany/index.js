// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  update
} = require('XrFrame/kanata/lib/index')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const compName = event.compName;
  let signedUp = false;

  try {
    const res = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    if (!res.data.length === 1) {
      const random = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
      await db.collection('users').where({
        openID: wxContext.OPENID
      }).update({
        data: {
          'company': random
        }
      })
      compInfo = {
        admin: [wxContext.OPENID],
        name: compName,
        companyID: random,
        members: [],
        waitList: [],
        blackList: [],
      }
      await db.collection('companies').add({
        data: compInfo
      })
      signedUp = true;
    }
  } catch {
    signedUp = false;
  }

  return {
    signedUp,
  }
}