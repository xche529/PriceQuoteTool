// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let memberName = ''
  let waitName = ''
  let blackName = ''

  let memberAvatar = ''
  let waitAvatar = ''
  let blackAvatar = ''

  let memberID = ''
  let waitID = ''
  let blackID = ''

  try {
    let user = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    const company = user.data[0].company;
    const companies = await db.collection('companies').where({
      companyID: company
    }).get();
    if(event.type === 1){
      
    }

    membersID = companies.data[0].members[index]
    waitListID = companies.data[0].waitList[index]
    blackListID = companies.data[0].blackList

    membersID.forEach(memberID => {
      const res = await cloud.callFunction({
        name: 'getMemberInfo',
        data: {
          openID: memberID
        }
      })
      membersName.push(res.result.name)
      membersAvatar.push(res.result.avatar)
    });

    return {
      memberName,
      memberAvatar,
      wait,
      black,
    }
  } catch {
    return {
      members,
      waitList,
      blackList,
    }
  }

}