// 云函数入口文件
const fs = require('fs');
const os = require('os');
const path = require('path');
const pdfMake = require('pdfmake');
const cloud = require('wx-server-sdk');

const cloudInit = () => {
    cloud.init({
        env: cloud.DYNAMIC_CURRENT_ENV
    }); // 使用当前云环境
};

const generatePDF = (docDefinition, currentTime) => {
    return new Promise((resolve, reject) => {
        const fonts = {
            Roboto: {
                normal: 'fonts/Deng.ttf',
                bold: 'fonts/Thick.ttf',
                italics: 'fonts/Deng.ttf',
                bolditalics: 'fonts/Deng.ttf'
            }
        };

        const printer = new pdfMake(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, currentTime + '.pdf');
        const writableStream = fs.createWriteStream(tempFilePath);

        pdfDoc.pipe(writableStream);
        pdfDoc.end();

        writableStream.on('finish', () => {
            console.log('PDF generated successfully');
            resolve(tempFilePath);
        });

        writableStream.on('error', (error) => {
            reject(error);
        });
    });
};

const uploadFileToCloud = (filePath, currentTime) => {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, 'base64');
        cloud.uploadFile({
            cloudPath: 'pdfJSON/' + currentTime + '.pdf',
            fileContent: JSON.stringify({
                data: fileContent
            }),
        }).then((result) => {
            console.log('File uploaded successfully:', result.fileID);
            resolve({
                id: result.fileID,
                time: currentTime
            });
        }).catch((error) => {
            reject(error);
        });
    });
};

function toChinese(n) {
    if (n === 0)
        return "零";
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "";
    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
        str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    let logPath = null;
    const fileID = 'cloud://quote-tool-2gbgpdk5df638d67.7175-quote-tool-2gbgpdk5df638d67-1322576963/icon/a7cfd437c52e484a6369a3785b40018.png';
    cloudInit();
    const res = await cloud.downloadFile({
        fileID: fileID,
    })
    const buffer = res.fileContent
    const logoPath = null;
    console.log(buffer)
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    const docDefinition = {
        content: [{
                table: {
                    widths: [130, '*'],
                    text: '',
                    body: [
                        [
                            buffer ? {
                                image: buffer,
                                width: 110
                            } : '', {
                                table: {
                                    body: [
                                        ['单位：国加电器设备（北京）有限公司', '地址：北京市丰台区未来假日花园51-15'],
                                        ['电话：010-8639 8618转802', '邮编：100068'],
                                        ['网址：http://wwwx.hcbyq.com', 'E-mail：marcy.han@npeec.com']
                                    ]
                                },
                                widths: ['*', '*'],
                                layout: 'noBorders',
                                fontSize: 10.5,
                            }
                        ]
                    ]
                },
                layout: 'noBorders',
            },
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        ['', ''],
                        ['收件人：' + event.to, '发件人：' + event.from],
                        ['副 本：' + event.copy, '手 机：' + event.phone],
                        ['电 话：' + event.telephone, '微 信：' + event.wechatID],
                        ['传 真：' + event.fox, '文件页数：' + '1'],
                        ['单 位：' + event.company, '报价日期：' + year + '年' + month + '月' + day + '日'],
                        ['使用地点：' + event.location, ''],
                        [{
                            text: '项目名称：' + event.projectName,
                            colSpan: 2,
                        }, ''],
                        ['', ''],
                    ]
                },
                layout: {
                    vLineWidth: function (i, node) {
                        return 0;
                    },
                    paddingTop: function (i, node) {
                        let top = 2;
                        if (i === node.table.body.length - 1) {
                            top = 0.9;
                        } else if (i === 0) {
                            top = 0.9;
                        }
                        return top;
                    },
                    paddingBottom: function (i, node) {
                        let bottom = 2;
                        if (i === node.table.body.length - 1) {
                            bottom = 0;
                        } else if (i === 0) {
                            bottom = 0;
                        }
                        return bottom;
                    },

                }
            },


            {
                text: '报   价   单',
                style: 'header',
                alignment: 'center'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    const transformerTable = {
        table: {
            widths: ['*', '*', 'auto', 'auto', '*', '*', '*', 'auto'],
            headerRows: 1,
            body: [],
            layout: 'noBorders',
            fontSize: 8,
        }
    };

    const transformers = event.products;
    const header = {
        fontSize: 10,
        bold: true,
        alignment: 'justify'
    }

    if (Array.isArray(transformers)) {

        transformerTable.table.body.push([{
            text: '名称',
            style: header
        }, {
            text: '规格型号',
            style: header
        }, {
            text: '分接范围',
            style: header
        }, {
            text: '联结组标号',
            style: header
        }, {
            text: '短路阻抗',
            style: header
        }, {
            text: '制造商',
            style: header
        }, {
            text: '数量（台）',
            style: header
        }, {
            text: '单价（元）',
            style: header
        }, {
            text: '总价（元）',
            style: header
        }, {
            text: '备注',
            style: header
        }]);
    }
    let totalCost = 0;
    let totalNumber = 0;
    transformers.forEach(transformer => {
        totalCost += (transformer.price * transformer.costFactor / 100 * transformer.number);
        totalNumber += parseFloat(transformer.number);
        const detail = [
            transformer.typeA || '',
            transformer.typeB || '',
            transformer.typeC || '',
            transformer.typeD || '',
            transformer.typeE || '',
            transformer.producer || '',
            transformer.material || '',
            transformer.number || '',
            (transformer.price * transformer.costFactor / 100).toFixed(2) || '',
            (transformer.price * transformer.costFactor / 100 * transformer.number).toFixed(2) || '',
            transformer.note || ''
        ];
        transformerTable.table.body.push(detail);
    }) 
    const totalRow = [{
        text: '总计',
        style: header,
        fillColor: '#ffc000'
    }, {
        text: '人民币大写：' + toChinese(totalCost.toFixed(2)),
        style: header,
        colSpan: 3,
        fillColor: '#ffc000'
    }, , , {
        text: totalNumber,
        style: header,
        fillColor: '#ffc000'
    }, {
        text: '',
        style: header,
        fillColor: '#ffc000'
    }, {
        text: totalCost.toFixed(2),
        style: header,
        fillColor: '#ffc000'
    }, {
        text: '',
        style: header,
        fillColor: '#ffc000'
    }]
    transformerTable.table.body.push(totalRow);

    docDefinition.content.push(transformerTable);

    const finalTable = {
        table: {
            body: [
                ['说明：  ', '1. 以上价格含税含运费，含风机、温控（带485通讯接口），不锈钢外壳（底板，整件）；'],
                ['', '2. 质量承诺：若出现质量问题，一年内免费更换，三年保修，终身维护；'],
                ['', '3. 技术标准：国标；'],
                ['', '4. 报价有效期：3天。']
            ]
        },
        widths: ['auto', '*'],
        layout: {
            vLineWidth: function (i, node) {
                return 0;
            },
            hLineWidth: function (i, node) {
                return 0;
            },

            paddingTop: function (i, node) {
           if (i === 0) {
               return 20;
            }

                return 5;
            },
            paddingBottom: function (i, node) {
                return 5;
            },

        },

        fontSize: 11,
    }

    docDefinition.content.push(finalTable);

    try {
        const filePath = await generatePDF(docDefinition, currentTime);
        const result = await uploadFileToCloud(filePath, currentTime);
        return result;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};