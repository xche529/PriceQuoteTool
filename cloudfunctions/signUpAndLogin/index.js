// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let signedUp = null;
  const wxContext = cloud.getWXContext();
  const isSignUp = event.isSignUp;
  if (isSignUp) {

  } else {
    try {
      const res = await db.collection('users').where({
        openID: wxContext.OPENID
      }).get();

      signedUp = res.data.length > 0;
    } catch (error) {
      console.error('Error querying database:', error);
      signedUp = false;
    }
  }
  return {
    msg: 'ok',
    signedUp
  }
}