// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let name = ''
  let avatar = ''
  let id = ''

  try {
    let user = await db.collection('users').where({
      openID: wxContext.OPENID
    }).get();
    const company = user.data[0].company;
    const companies = await db.collection('companies').where({
      companyID: company
    }).get();
    //get openID of the target user
    if (event.type === 'member') {
      id = companies.data[0].members[event.index]
    } else if (event.type === 'wait') {
      id = companies.data[0].waitList[event.index]
    } else {
      id = companies.data[0].blackList[event.index]
    }
    console.log(id)

  
    let res = await db.collection('users').where({
      openID: id
    }).get();
    console.log(res)

    name = res.data[0].name
    const image = await cloud.downloadFile({
      fileID: res.data[0].avatar,
    })
    const buffer = image.fileContent
    avatar = buffer.toString('base64')

    return {
      name,
      avatar
    }
  } catch {
    return {
      name,
      avatar
    }
  }
}