import fs from "fs"
import path from "path";
import PDFDocument from "pdfkit";

const generateHeader = (doc) => {
  doc.fontSize(40).text("Trip Invoice", 250, 50, { align: "right" })
    .moveDown();
}
function generateCustomerInformation(doc, invoice) {
  doc.
    fontSize(20).text(`Invoice to : ${invoice.user}`, 250, 170, { align: "right" })
    .fontSize(20).text(`Invoice Number: ${invoice.InvoiceNumber}`, 250, 150, { align: "right" })
    .fontSize(20).text(`Date: ${invoice.date}`, 250, 190, { align: "right" })
    .moveDown();
  doc.fontSize(18).text(`trip title: ${invoice.triptitle}`, 60, 250, { align: "left" })
    .fontSize(18).text(`number of member: ${invoice.numberOfMembers}`, 60, 270, { align: "left" })
    .fontSize(18).text(`Start Date: ${invoice.startsAt}`, 60, 290, { align: "left" })
    .fontSize(18).text(`end Date: ${invoice.endsAt}`, 60, 310, { align: "left" })
    .moveDown()
  doc.fontSize(25).text(`total: ${invoice.totalPrice}`, 50, 330, { align: "center" })
    .moveDown()
}
const generateFooter = (doc) => {
  doc.fontSize(20).text('thanks for tarveling with us,see you soon', 50, 700, { align: "center" });
}
const createInvoice = async (invoice = {
  user,
  orderNumber,
  date,
  numberOfMembers,
  trips: [],
  totalPrice,
  startsAt,
  endsAT
}, pathVar) => {
  let doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.image("../Untitled design.png", { width: 200 })
  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice)
  doc.image("../Travellin_agency-removebg-preview.png", 145, 350, { width: 350, align: "right" })
  generateFooter(doc, invoice);
  doc.pipe(fs.createWriteStream(path.resolve(pathVar))).on("error", erorr => console.log("PDF erorr", erorr))
  doc.end()
}


export default createInvoice