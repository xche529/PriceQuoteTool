// 云函数入口文件

const fs = require('fs');
const {
  PDFDocument,
} = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let number = 0;
  const transformers = event.products
  transformers.forEach(transformer => {
    number++;
  });
  const wxContext = cloud.getWXContext();
  const fontBytes = fs.readFileSync('./font.ttf');
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  const page = pdfDoc.addPage();
  const {
    width,
    height
  } = page.getSize();
  const fontSize = 30
  page.drawText('共选择 ' + number + ' tranformers', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: font
  })
  const pdfBytes = await pdfDoc.save()
  const base64Data = Buffer.from(pdfBytes).toString('base64');
  const res = await cloud.uploadFile({
    cloudPath: 'base64pdf.txt',
    fileContent: base64Data
  })
  const id = res.fileID;
  return {
    id
  }
}