// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
var xlsx = require('node-xlsx');
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const fileID = event.fileID;
    const res = await cloud.downloadFile({
        fileID: fileID
    })

    const buffer = res.fileContent;
    const tasks = [];
    var sheets = xlsx.parse(buffer);
    sheets.forEach(function (sheet) {
        console.log(sheet['name']);
        for (var rowId in sheet['data']) {
            console.log(rowId);
            var row = sheet['data'][rowId]; //第几行数据
            if (rowId > 0 && row) { 
                const promise = db.collection('transformer')
                    .add({
                        data: {
                            capacity: row[0],
                            type: row[1],
                            material: row[2],
                            price: row[3]
                        }
                    })
                tasks.push(promise)
            }
        }
    });

    let result = await Promise.all(tasks).then(res => {
        return res
    }).catch(function (err) {
        return err
    })
    return result
}