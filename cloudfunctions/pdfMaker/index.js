// 云函数入口文件

const fs = require('fs');
const os = require('os');
const path = require('path');
var pdfMake = require('pdfmake');
const cloud = require('wx-server-sdk');

var fonts = {
    Roboto: {
        normal: 'fonts/Deng.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};
var printer = new pdfMake(fonts);
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const transformers = event.products
    const wxContext = cloud.getWXContext();

    const docDefinition = {
        content: ['Test',
            {
                table: {
                    body: [
                        ['单位：rr', 'c2', 'c3'],
                        ['c11', 'c12', 'c13'],
                        ['c21', 'c22', 'c23']
                    ]
                }
            }
        ],
        defaultStyle:{
            font: 'Roboto'
        }
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition)
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, 'document.pdf');
    const writableStream = fs.createWriteStream(tempFilePath);
    pdfDoc.pipe(writableStream);
    pdfDoc.end();

    writableStream.on('finish', async () => {
        console.log('PDF generated successfully');
    });

    const fileContent = fs.readFileSync(tempFilePath, 'base64');
    console.log('finished read')
    const result = await cloud.uploadFile({
        cloudPath: 'test.json',
        fileContent: JSON.stringify({
            data: fileContent
        }),
    });
    console.log('File uploaded successfully:', result.fileID);
    return {
        id: result.fileID
    }

};