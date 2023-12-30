// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const inviteCode = event.inviteCode;
    let isSuccess = false
    try {
        const res = await db.collection('users').where({
            openID: wxContext.OPENID
        }).get();
        console.log(res)
        if (res.data.length === 1) {
            if (res.data[0].company == null) {
                const company = await db.collection('companies').where({
                    companyID: inviteCode
                }).get();
                if (company.data.length === 1) {
                    await db.collection('companies').where({
                        companyID: inviteCode
                    }).update({
                        data: {
                            members: db.command.push(wxContext.OPENID)
                        },
                        success: res => {
                            isSuccess = true
                        },
                        complete: res=>{
                            return {
                                isSuccess
                            }                        
                        }
                    })
                }
            }
        }
    } catch {
        return {
            isSuccess
        }
    }

}