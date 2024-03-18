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
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf'
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
                            buffer ? { image: buffer, width: 100 } : ''
                        , {
                            table: {
                                body: [
                                    ['单位：国加电器设备（北京）有限公司', '地址：北京市丰台区未来假日花园51-15'],
                                    ['电话：010-8639 8618转802', '邮编：100068'],
                                    ['网址：http://wwwx.hcbyq.com', 'E-mail：marcy.han@npeec.com']
                                ]
                            },
                            layout: 'noBorders',
                            fontSize: 8,
                        }]
                    ]
                },
                layout: 'noBorders',
            },
        ],
        defaultStyle: {
            font: 'Roboto'
        }
    };

    const transformerTable = {
        table: {
            widths: ['*', '*', '*', '*', 'auto'],
            headerRows: 1,
            body: [
            ],
            layout: 'noBorders',
            fontSize: 8,
        }
    };

    const transformers = event.products;
    if (Array.isArray(transformers)) {
        transformerTable.table.body.push(['型号', '材料', '电压', '容量', '价格']);
    }
    
    transformers.forEach(transformer => {
        const detail = [
            transformer.name || '',
            transformer.material || '',
            transformer.voltage || '',
            transformer.capacity || '',
            transformer.price || ''
        ];
        transformerTable.table.body.push(detail);
    })

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