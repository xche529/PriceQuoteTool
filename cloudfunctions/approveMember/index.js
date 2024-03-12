// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let isSuccess = false
    try {
        let user = await db.collection('users').where({
            openID: wxContext.OPENID
        }).get();
        const company = user.data[0].company;
        const companies = await db.collection('companies').where({
            companyID: company
        }).get();
        console.log(companies)
        if (companies.data[0].admin.includes(wxContext.OPENID)) {
            console.log('ok')
            let waitList = companies.data[0].waitList
            let targetMember = waitList.splice(event.index, 1)
            console.log(targetMember, waitList)
            await db.collection('companies').where({
                companyID: company
            }).update({
                data: {
                    members: db.command.push(targetMember),
                    waitList: waitList
                },
            });
            return {
                isSuccess: true
            }



        } else {
            console.log('非管理员')
            return {
                isSuccess
            }
        }

    } catch (error) {
        console.log('catch', error)
        return {
            isSuccess
        }
    }
}