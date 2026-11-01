import { jsPDF } from "jspdf";
import { IBooking } from "../types";
import { formatCurrency, formatDate } from "./utils";

export function generateBookingInvoice(booking: IBooking): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [245, 158, 11]; // Amber #F59E0B
  const darkSlate = [15, 23, 42];     // #0F172A
  const textMuted = [100, 116, 139];   // #64748B

  // Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, 210, 45, "F");

  // Title & Brand
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("StudioSpace", 20, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("CREATIVE MARKETPLACE RESERVATION INVOICE", 20, 30);

  // Invoice Number & Status
  doc.setFontSize(9);
  doc.text(`Booking Ref: #${booking._id.slice(-8).toUpperCase()}`, 140, 22);
  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 140, 28);
  doc.text(`Status: ${booking.status.toUpperCase()}`, 140, 34);

  // Bill To / Creator Details
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("RESERVED BY (CREATOR):", 20, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(booking.renterName, 20, 67);
  doc.text(booking.renterEmail, 20, 73);

  // Studio Host Details
  doc.setFont("helvetica", "bold");
  doc.text("STUDIO HOST DETAILS:", 120, 60);

  doc.setFont("helvetica", "normal");
  doc.text(`Studio: ${booking.studioTitle}`, 120, 67);
  doc.text(`Host: ${booking.ownerEmail}`, 120, 73);

  // Shoot Schedule Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 85, 170, 26, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SHOOT SCHEDULE:", 26, 95);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${formatDate(booking.bookingDate)}`, 26, 103);
  doc.text(`Time Window: ${booking.startTime} - ${booking.endTime} (${booking.totalHours} hrs)`, 105, 103);

  // Line Item Table
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(20, 120, 170, 9, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", 26, 126);
  doc.text("RATE / UNIT", 120, 126);
  doc.text("AMOUNT", 165, 126);

  // Item Rows
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont("helvetica", "normal");

  // Row 1: Studio Rental
  doc.text(`${booking.studioTitle} (${booking.totalHours} hrs)`, 26, 138);
  doc.text(`$${booking.hourlyRate}/hr`, 120, 138);
  doc.text(formatCurrency(booking.subtotal), 165, 138);

  // Row 2: Security Deposit
  doc.text("Refundable Security Deposit", 26, 148);
  doc.text("Fixed", 120, 148);
  doc.text(formatCurrency(booking.securityDeposit), 165, 148);

  // Row 3: Platform Service Fee
  doc.text("Platform Service & Insurance Fee (8%)", 26, 158);
  doc.text("8%", 120, 158);
  doc.text(formatCurrency(booking.serviceFee), 165, 158);

  // Separator Line
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 168, 190, 168);

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL RESERVATION COST:", 95, 180);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(booking.totalAmount), 165, 180);

  // Footer / Terms
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Terms: Bookings are protected by $1,000,000 StudioSpace Host Guarantee.", 20, 260);
  doc.text("Questions? Contact support@studiospace.io • StudioSpace Marketplace Inc.", 20, 266);

  // Save PDF
  doc.save(`StudioSpace-Invoice-${booking._id.slice(-6).toUpperCase()}.pdf`);
}

