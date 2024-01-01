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
            if (res.data[0].company === null) {
                const company = await db.collection('companies').where({
                    companyID: inviteCode
                }).get();
                console.log(company)

                if (company.data.length === 1) {
                    const updateRes = await db.collection('companies').where({
                        companyID: inviteCode
                    }).update({
                        data: {
                            waitList: db.command.push(wxContext.OPENID)
                        }
                    });
                    console.log(updateRes)
                    if (updateRes.stats.updated === 1) {
                        const userRes = await db.collection('users').where({
                            openID: wxContext.OPENID
                        }).update({
                            data: {
                                company: inviteCode
                            },
                        })
                        if (userRes.stats.updated === 1) {
                            isSuccess = true
                        }
                    }
                }
            }
            return {
                isSuccess,
            }
        }
    } catch {
        return {
            isSuccess
        }
    }
}