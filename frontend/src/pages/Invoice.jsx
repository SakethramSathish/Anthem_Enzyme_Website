import React, { useRef } from 'react';
import SEOHead from '../components/SEOHead';
import { useLocation, Navigate, Link } from 'react-router-dom';
import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Invoice({ user }) {
  const location = useLocation();
  const invoiceRef = useRef();

  if (!location.state || !location.state.orderData) {
    return <Navigate to="/" />;
  }

  const { orderData, paymentId } = location.state;
  const { 
    customerName, 
    customerEmail, 
    invoiceId,
    shipmentId, 
    shippingDetails, 
    products, 
    totals, 
    createdAt 
  } = orderData;
  
  const orderCurrency = orderData.currency || 'INR';
  const formatInvoiceCurrency = (value) => {
    return new Intl.NumberFormat(orderCurrency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: orderCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPdfCurrency = (value) => {
    const formatted = new Intl.NumberFormat(orderCurrency === 'INR' ? 'en-IN' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
    return `${orderCurrency === 'INR' ? 'Rs.' : orderCurrency} ${formatted}`;
  };

  const handleDownloadPdf = async () => {
    try {
      const JsPDF = jspdf.jsPDF || jspdf.default || jspdf;
      const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;

      // ==========================================
      // 1. EXECUTIVE DARK NAVY HEADER BANNER
      // ==========================================
      const headerHeight = 110;
      doc.setFillColor(15, 23, 42); // Slate 900 / Deep Navy #0F172A
      doc.rect(0, 0, pageWidth, headerHeight, 'F');

      // Top Accent Strip in Vibrant Blue
      doc.setFillColor(37, 99, 235); // Blue 600 #2563EB
      doc.rect(0, 0, pageWidth, 5, 'F');

      // Company Branding (Left)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("ANTHEM BIOSCIENCES", margin, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("Enzyme Division | Quality & Innovation", margin, 58);

      // Invoice Title & Status (Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("INVOICE", pageWidth - margin, 42, { align: "right" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(52, 211, 153); // Emerald 400
      doc.text("STATUS: PAID", pageWidth - margin, 58, { align: "right" });

      // Invoice Sub-Details in Header Bar
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(203, 213, 225); // Slate 300
      doc.text(`Invoice No: #${invoiceId || shipmentId}`, margin, 92);
      doc.text(`Date: ${orderDate}`, pageWidth / 2, 92, { align: "center" });
      doc.text(`Ref: ${paymentId}`, pageWidth - margin, 92, { align: "right" });

      let startY = headerHeight + 25;

      // ==========================================
      // 2. COMPANY ADDRESS BAR
      // ==========================================
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.rect(margin, startY, pageWidth - margin * 2, 45, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.rect(margin, startY, pageWidth - margin * 2, 45, 'D');

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("ISSUED BY:", margin + 12, startY + 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(
        "Anthem Biosciences, No. 49, F1 & F2, Canara Bank Road, Bommasandra Ind. Area, Bommasandra, Bangalore - 560099",
        margin + 70, 
        startY + 18
      );
      doc.text(
        "Email: enterokinase@anthembio.com  |  Web: www.anthembio.com",
        margin + 70,
        startY + 32
      );

      startY += 65;

      // ==========================================
      // 3. BILLED TO & SHIPPED TO ACCENT CARDS
      // ==========================================
      const cardWidth = (pageWidth - margin * 2 - 20) / 2;
      const cardHeight = 95;

      // Billed To Card (Left)
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, startY, cardWidth, cardHeight, 6, 6, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, startY, cardWidth, cardHeight, 6, 6, 'D');
      
      // Left Accent Border
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(margin, startY, 4, cardHeight, 2, 2, 'F');

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("BILLED TO", margin + 15, startY + 20);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(customerName || '', margin + 15, startY + 38);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      let bY = startY + 53;
      if (shippingDetails.organization) {
        doc.text(shippingDetails.organization, margin + 15, bY);
        bY += 14;
      }
      doc.text(customerEmail || '', margin + 15, bY);
      bY += 14;
      doc.text(shippingDetails.phone || '', margin + 15, bY);

      // Shipped To Card (Right)
      const shippedX = margin + cardWidth + 20;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(shippedX, startY, cardWidth, cardHeight, 6, 6, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(shippedX, startY, cardWidth, cardHeight, 6, 6, 'D');

      // Left Accent Border
      doc.setFillColor(71, 85, 105);
      doc.roundedRect(shippedX, startY, 4, cardHeight, 2, 2, 'F');

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("SHIPPED TO", shippedX + 15, startY + 20);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(shippingDetails.address || '', shippedX + 15, startY + 38);
      doc.text(`${shippingDetails.city}, ${shippingDetails.pinCode}`, shippedX + 15, startY + 53);
      doc.text(shippingDetails.country || '', shippedX + 15, startY + 68);

      startY += cardHeight + 30;

      // ==========================================
      // 4. ITEM TABLE STYLING
      // ==========================================
      const tableColumn = ["ITEM DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL AMOUNT"];
      const tableRows = [];

      products.forEach(item => {
        tableRows.push([
          `${item.name}\nSpecification: ${item.unitLabel}`,
          item.quantity,
          formatPdfCurrency(item.price),
          formatPdfCurrency(item.price * item.quantity)
        ]);
      });

      autoTable(doc, {
        startY: startY,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { 
          font: 'helvetica', 
          fontSize: 9, 
          cellPadding: { top: 10, bottom: 10, left: 10, right: 10 },
          lineColor: [226, 232, 240],
          lineWidth: 0.5
        },
        headStyles: { 
          fillColor: [15, 23, 42], // Slate 900
          textColor: [255, 255, 255], 
          fontStyle: 'bold', 
          fontSize: 8,
          halign: 'left'
        },
        bodyStyles: { textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          1: { halign: 'center', cellWidth: 45 },
          2: { halign: 'right', cellWidth: 120 },
          3: { halign: 'right', cellWidth: 125 }
        }
      });

      startY = doc.lastAutoTable.finalY + 30;

      // ==========================================
      // 5. SUMMARY & HIGHLIGHTED TOTAL CARD
      // ==========================================
      const summaryWidth = 250;
      const summaryX = pageWidth - margin - summaryWidth;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);

      doc.text("Subtotal", summaryX, startY);
      doc.setTextColor(15, 23, 42);
      doc.text(formatPdfCurrency(totals.subtotal), pageWidth - margin, startY, { align: "right" });

      startY += 18;
      doc.setTextColor(100, 116, 139);
      doc.text("Shipping & Handling", summaryX, startY);
      doc.setTextColor(15, 23, 42);
      doc.text(formatPdfCurrency(totals.shippingCost), pageWidth - margin, startY, { align: "right" });

      startY += 18;
      doc.setTextColor(100, 116, 139);
      doc.text(`GST ${orderCurrency === 'INR' ? '(18%)' : ''}`, summaryX, startY);
      doc.setTextColor(15, 23, 42);
      doc.text(formatPdfCurrency(totals.gst), pageWidth - margin, startY, { align: "right" });

      startY += 22;

      // Highlighted Total Box (Blue Tint Background with Dark Blue Border)
      doc.setFillColor(239, 246, 255); // Blue 50
      doc.roundedRect(summaryX - 10, startY - 12, summaryWidth + 10, 40, 6, 6, 'F');
      doc.setDrawColor(191, 219, 254); // Blue 200
      doc.setLineWidth(1);
      doc.roundedRect(summaryX - 10, startY - 12, summaryWidth + 10, 40, 6, 6, 'D');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138); // Blue 900
      doc.text("TOTAL AMOUNT PAID", summaryX, startY + 12);

      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235); // Blue 600
      doc.text(formatPdfCurrency(totals.total), pageWidth - margin, startY + 12, { align: "right" });

      // ==========================================
      // 6. PROFESSIONAL FOOTER BANNER
      // ==========================================
      const pageHeight = doc.internal.pageSize.getHeight();
      let footerY = pageHeight - 50;

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      footerY += 18;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text("Thank you for choosing Anthem Biosciences.", pageWidth / 2, footerY, { align: "center" });

      footerY += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Computer generated invoice. For inquiries, reach out to enterokinase@anthembio.com",
        pageWidth / 2, 
        footerY, 
        { align: "center" }
      );

      doc.save(`Invoice_${invoiceId || shipmentId}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(`PDF Error: ${error?.message || error}\n${error?.stack || ''}`);
    }
  };

  const orderDate = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <SEOHead title="Invoice" noIndex={true} />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 flex flex-col items-center">
      
      <div className="w-full max-w-3xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1">
          &larr; Back to Home
        </Link>
        <button 
          onClick={handleDownloadPdf}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A4BDB] hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all font-bold text-sm cursor-pointer active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Invoice
        </button>
      </div>

      <div 
        ref={invoiceRef} 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-12 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">Enterokinase</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Order Invoice</p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              Payment Successful
            </div>
            <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-medium">Invoice: #{invoiceId || shipmentId}</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Date: {orderDate}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Billed To</h3>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{customerName}</p>
            {shippingDetails.organization && <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{shippingDetails.organization}</p>}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{customerEmail}</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{shippingDetails.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Shipped To</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{shippingDetails.address}</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{shippingDetails.city}, {shippingDetails.pinCode}</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{shippingDetails.country}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b-2 border-slate-100 dark:border-slate-800">
                <th className="py-2.5 text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Item</th>
                <th className="py-2.5 text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Qty</th>
                <th className="py-2.5 text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Price</th>
                <th className="py-2.5 text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-3.5">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.unitLabel}</p>
                  </td>
                  <td className="py-3.5 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.quantity}</td>
                  <td className="py-3.5 text-right text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatInvoiceCurrency(item.price)}</td>
                  <td className="py-3.5 text-right text-xs sm:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatInvoiceCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="w-full sm:w-1/2 lg:w-1/3 space-y-2.5">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatInvoiceCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400">Shipping</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatInvoiceCurrency(totals.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400">GST {orderCurrency === 'INR' ? '(18%)' : ''}</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatInvoiceCurrency(totals.gst)}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span className="text-base sm:text-lg font-bold text-[#1A4BDB] dark:text-blue-400">{formatInvoiceCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p className="break-all">Payment ID: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">{paymentId}</span></p>
          <p className="mt-1 sm:mt-0">Thank you for your order!</p>
        </div>

      </div>
    </div>
    </>
  );
}
