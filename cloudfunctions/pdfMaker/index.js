// 云函数入口文件
const { PDFDocument, StandardFonts } = require('pdf-lib');
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30
    page.drawText('test',{
      x:50,
      y:height - 4 * fontSize,
      size: fontSize,
    })
    const pdfBytes = await pdfDoc.save()
    const base64Data = Buffer.from(pdfBytes).toString('base64');

    return {
      base64Data
    }
}