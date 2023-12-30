// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const name = event.name;
    let signedUp = false;
    let random = ''

    try {
        const res = await db.collection('users').where({
            openID: wxContext.OPENID
        }).get();
        console.log(res)
        if (res.data.length === 1) {
            if(res.data[0].company != null){
                return {
                    signedUp,
                    random
                }
            }
            random = Math.random().toString(36).substr(2, 15)
            console.log(random)
            await db.collection('users').where({
                openID: wxContext.OPENID
            }).update({
                data: {
                    'company': random
                }
            })
            compInfo = {
                admin: [wxContext.OPENID],
                name: name,
                companyID: random,
                members: [],
                waitList: [],
                blackList: [],
                inviteCodeList: [],
            }
            await db.collection('companies').add({
                data: compInfo
            })
            signedUp = true;
            return {
                signedUp,
                random
            }
        } else {
            return {
                signedUp,
                random
            }
        }
    } catch {
        console.log('catch')
        return {
            signedUp,
            random
        }
    }
}