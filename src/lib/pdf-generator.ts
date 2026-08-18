import { jsPDF } from 'jspdf';

export interface RegistrationSlipData {
  registrationCode: string;
  parentName: string;
  parentPhone: string;
  paymentMethod: string;
  transactionNumber: string;
  totalRegFee: number;
  players: Array<{
    fullName: string;
    birthDate: string;
    position: string;
    ageCategory: string;
  }>;
  submittedAt?: string;
}

export function generateRegistrationSlipPDF(data: RegistrationSlipData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Background Fill
  doc.setFillColor(7, 13, 27); // #070D1B
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border (Gold / Navy)
  doc.setDrawColor(229, 169, 60); // Gold #E5A93C
  doc.setLineWidth(1.2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner Border
  doc.setDrawColor(30, 45, 74);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Header Brand
  doc.setTextColor(229, 169, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NISIR FOOTBALL ACADEMY • ADAMA, ETHIOPIA', pageWidth / 2, 22, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('OFFICIAL REGISTRATION SLIP', pageWidth / 2, 32, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.text('"A Better Dream for a Better Life" • Founded 2013 E.C.', pageWidth / 2, 38, { align: 'center' });

  // Registration Code Banner
  doc.setFillColor(15, 26, 48);
  doc.roundedRect(20, 44, pageWidth - 40, 16, 3, 3, 'F');
  doc.setTextColor(229, 169, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`REGISTRATION CODE: ${data.registrationCode}`, pageWidth / 2, 54, { align: 'center' });

  // Divider
  doc.setDrawColor(30, 45, 74);
  doc.line(20, 66, pageWidth - 20, 66);

  // Parent & Payment Information Grid
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SUBMISSION & PAYMENT DETAILS', 20, 74);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  doc.text(`Parent / Guardian: ${data.parentName}`, 20, 82);
  doc.text(`Contact Phone: ${data.parentPhone}`, 20, 88);
  doc.text(`Payment Method: ${data.paymentMethod}`, 20, 94);

  doc.text(`Transaction Reference: ${data.transactionNumber}`, 115, 82);
  doc.text(`Total Registration Fee Paid: ${data.totalRegFee.toLocaleString()} ETB`, 115, 88);
  doc.text(`Status: PENDING ADMIN VERIFICATION`, 115, 94);

  // Divider
  doc.line(20, 102, pageWidth - 20, 102);

  // Registered Players Table
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`REGISTERED TRAINEES (${data.players.length})`, 20, 110);

  let currentY = 118;
  data.players.forEach((p, idx) => {
    doc.setFillColor(13, 21, 39);
    doc.roundedRect(20, currentY, pageWidth - 40, 14, 2, 2, 'F');

    doc.setTextColor(229, 169, 60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${idx + 1}. ${p.fullName}`, 25, currentY + 9);

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Category: ${p.ageCategory}   |   Position: ${p.position}   |   DOB: ${p.birthDate || 'N/A'}`, 90, currentY + 9);

    currentY += 18;
  });

  // Important Notice Box (Per Spec)
  currentY += 6;
  doc.setFillColor(30, 20, 10);
  doc.setDrawColor(229, 169, 60);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, currentY, pageWidth - 40, 26, 3, 3, 'FD');

  doc.setTextColor(229, 169, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('CRITICAL NEXT STEP INSTRUCTION:', pageWidth / 2, currentY + 8, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Keep your payment receipt and this slip, and report to Chapi Stadium, Adama.', pageWidth / 2, currentY + 15, { align: 'center' });
  doc.text('Trainee kit assignment, schedule orientation, and squad grouping will be provided on ground.', pageWidth / 2, currentY + 21, { align: 'center' });

  // Academy Ground & Contact Details
  currentY += 34;
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Training Grounds: Chapi Meda / Chapi Stadium, Adama', 20, currentY);
  doc.text('Office: Franco Batu Tower, 2nd Floor, Adama', 20, currentY + 5);
  doc.text('Coach Fisha Welde Meskel: +251 911 651 214 / +251 908 171 773', 20, currentY + 10);

  // Agency Credit
  doc.text('Powered by Imako Digital Marketing Agency (+251 912 251 113)', pageWidth - 20, currentY + 10, { align: 'right' });

  // Save PDF
  const fileName = `Nisir-Registration-${data.registrationCode}.pdf`;
  doc.save(fileName);
}
