// 云函数入口文件

const fs = require('fs');
var pdfMake = require('pdfmake')
const cloud = require('wx-server-sdk')
var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
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
  transformers.forEach(transformer => {
    number++;
  });
  const wxContext = cloud.getWXContext();

  const docDefinition = {
    content: [
      'Test',
      {
        table: {
          body: [
            ['c1', 'c2', 'c3'],
            ['c11', 'c12', 'c13'],
            ['c21', 'c22', 'c23']
          ]
        }
      }
    ]
  }

  var pdfDoc = printer.createPdfKitDocument(docDefinition)
  const tempFilePath = `/tmp/document.pdf`;

  // 将 PDF 写入到临时文件中
  const writeFile = promisify(fs.writeFile);
  await writeFile(tempFilePath, pdfDoc);

  const result = await storage.uploadFile({
    cloudPath: 'document.pdf',
    filePath: tempFilePath, 
  });

  return result.fileID;
};