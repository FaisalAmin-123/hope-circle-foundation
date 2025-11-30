const PDFDocument = require('pdfkit');

// Generate donation receipt
const generateReceipt = (donation, res) => {
  // Create PDF document
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=receipt_${donation._id}.pdf`
  );

  // Pipe PDF to response
  doc.pipe(res);

  // Add header
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('DONATION RECEIPT', { align: 'center' })
    .moveDown();

  doc
    .fontSize(16)
    .font('Helvetica')
    .text('Hope Circle Foundation', { align: 'center' })
    .fontSize(10)
    .text('Charitable Organization', { align: 'center' })
    .moveDown(2);

  // Add horizontal line
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown();

  // Receipt details
  const startY = doc.y;

  // Left column
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Receipt Number:', 50, startY)
    .font('Helvetica')
    .text(donation._id.toString().slice(-8), 180, startY)
    .moveDown(0.5);

  doc
    .font('Helvetica-Bold')
    .text('Date:', 50)
    .font('Helvetica')
    .text(new Date(donation.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), 180)
    .moveDown(0.5);

  doc
    .font('Helvetica-Bold')
    .text('Payment ID:', 50)
    .font('Helvetica')
    .text(donation.paymentId || 'N/A', 180)
    .moveDown(0.5);

  doc
    .font('Helvetica-Bold')
    .text('Payment Method:', 50)
    .font('Helvetica')
    .text((donation.paymentMethod || 'N/A').toUpperCase(), 180)
    .moveDown(2);

  // Donor details
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Donor Information', 50)
    .moveDown(0.5);

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Name:', 50)
    .font('Helvetica')
    .text(donation.donor?.name || 'Anonymous', 180)
    .moveDown(0.5);

  doc
    .font('Helvetica-Bold')
    .text('Email:', 50)
    .font('Helvetica')
    .text(donation.donor?.email || 'N/A', 180)
    .moveDown(0.5);

  if (donation.donor?.phone) {
    doc
      .font('Helvetica-Bold')
      .text('Phone:', 50)
      .font('Helvetica')
      .text(donation.donor.phone, 180)
      .moveDown(0.5);
  }

  doc.moveDown(2);

  // Amount box
  doc
    .rect(50, doc.y, 500, 80)
    .fillAndStroke('#f0f9ff', '#3b82f6')
    .fill('#000000');

  const amountY = doc.y + 15;
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#1e40af')
    .text('DONATION AMOUNT', 60, amountY, { align: 'center', width: 480 })
    .moveDown(0.5);

  doc
    .fontSize(28)
    .font('Helvetica-Bold')
    .fillColor('#059669')
    .text(
      `₹${donation.amount.toLocaleString('en-IN')}`,
      60,
      doc.y,
      { align: 'center', width: 480 }
    )
    .fillColor('#000000');

  doc.y += 100;

  // Description
  if (donation.description) {
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Purpose:', 50)
      .font('Helvetica')
      .text(donation.description, 180, doc.y - 12, { width: 350 })
      .moveDown(2);
  }

  // Add horizontal line
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown();

  // Tax information
  doc
    .fontSize(10)
    .font('Helvetica-Oblique')
    .fillColor('#6b7280')
    .text(
      'This receipt is issued for the purpose of claiming tax benefits under Section 80G of the Income Tax Act.',
      50,
      doc.y,
      { width: 500, align: 'justify' }
    )
    .moveDown();

  // Thank you message
  doc.moveDown(2);
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#059669')
    .text('Thank you for your generous donation!', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#6b7280')
    .text('Your contribution helps us support those in need.', { align: 'center' });

  // Footer
  doc
    .moveDown(3)
    .fontSize(8)
    .fillColor('#9ca3af')
    .text(
      '_______________________________________________________________',
      { align: 'center' }
    )
    .text('Hope Circle Foundation | Charitable Registration No: 12345', {
      align: 'center',
    })
    .text('Email: info@hopecirclefoundation | Phone: +91-7051696994', {
      align: 'center',
    })
    .text(
      `Generated on: ${new Date().toLocaleString('en-IN')}`,
      { align: 'center' }
    );

  // Finalize PDF
  doc.end();
};

module.exports = {
  generateReceipt,
};