// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
var xlsx = require('node-xlsx');
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    function isNotEmpty(row) {
        let isEmpty = false;
        for (let i = 0; i < 7; i++) {
            const value = row[i];
            if (value === null || value === undefined || value === '') {
                isEmpty = true;
                break;
            }
        }
        return !isEmpty;
    }

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
                if (isNotEmpty) {
                    const promise = db.collection('transformer')
                        .add({
                            data: {
                                capacity: row[0],
                                type: row[1],
                                typeA: row[6],
                                typeB: row[5],
                                typeC: row[7],
                                typeD: row[8],
                                typeE: row[9],
                                producer: row[10],
                                material: row[2],
                                price: row[4]
                            }
                        })
                    tasks.push(promise);
                }
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