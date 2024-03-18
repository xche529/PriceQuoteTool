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
    const docDefinition = {
        content: ['Test',
            {
                table: {
                    widths: [200, '*'],
                    text: '',
                    body: [
                        [
                            buffer ? {
                                image: buffer,
                                width: 100
                            } : '', {
                                table: {
                                    body: [
                                        ['单位：国加电器设备（北京）有限公司', '地址：北京市丰台区未来假日花园51-15'],
                                        ['电话：010-8639 8618转802', '邮编：100068'],
                                        ['网址：http://wwwx.hcbyq.com', 'E-mail：marcy.han@npeec.com']
                                    ]
                                },
                                layout: 'noBorders',
                                fontSize: 8,
                            }
                        ]
                    ]
                },
                layout: 'noBorders',
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
            widths: ['*', 'auto', 'auto', 'auto', '*', '*', '*', 'auto'],
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
            text: '型号',
            style: header
        }, {
            text: '材料',
            style: header
        }, {
            text: '电压',
            style: header
        }, {
            text: '容量',
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
            transformer.name || '',
            transformer.material || '',
            transformer.voltage || '',
            transformer.capacity || '',
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
        text: '人民币大写(未完成）：',
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


    try {
        const filePath = await generatePDF(docDefinition, currentTime);
        const result = await uploadFileToCloud(filePath, currentTime);
        return result;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};