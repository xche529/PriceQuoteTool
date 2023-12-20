// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let signedUp = null;
  let name = '数据加载失败';
  let avatar = '';
  const wxContext = cloud.getWXContext();
  const isSignUp = event.isSignUp;
  //判断是否为注册行为
  if (isSignUp) {
    try {
      userInfo = {
        openID: wxContext.OPENID,
        avatar: event.avatar,
        name: event.name,
        company: null
      }
      const res = await db.collection('users').where({
        openID: wxContext.OPENID
      }).get();
      if (!res.data.length > 0) {
        await db.collection('users').add({
          data: userInfo
        })
        signedUp = true;
      } else {
        signedUp = true;
      }
    } catch {
      signedUp = false;
    }
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

  if (signedUp) {
    try {
      const user = await db.collection('users').where({
        openID: wxContext.OPENID
      }).get();

      name = user.data[0].name
      avatar = user.data[0].avatar
    } catch {
      signedUp = false
    }
  }

  return {
    msg: 'ok',
    signedUp,
    name,
    avatar,
  }
}