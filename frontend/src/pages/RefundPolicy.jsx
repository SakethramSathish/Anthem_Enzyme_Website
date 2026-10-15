import React from 'react';
import SEOHead from '../components/SEOHead';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  const toc = [
    { num: 1, title: 'General Refund Policy' },
    { num: 2, title: 'Order Cancellations' },
    { num: 3, title: 'Refund Processing Time' },
    { num: 4, title: 'Contact Us' }
  ];

  return (
    <>
      <SEOHead
        title="Refund & Cancellation Policy"
        description="Understand the refund and cancellation policy for Enterokinase orders from Anthem Biosciences. Learn about order cancellations and refund processing times."
        canonicalPath="/refund-policy"
      />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 pb-16 sm:pb-24">
      {/* Header */}
      <div className="bg-[#0f1115] dark:bg-white pt-12 sm:pt-24 pb-10 sm:pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-[1px] bg-slate-600 dark:bg-slate-300"></div>
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase transition-colors duration-300">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-white dark:text-slate-900 mb-4 sm:mb-6 tracking-tight transition-colors duration-300">Refund Policy</h1>
          <p className="text-slate-400 dark:text-slate-600 text-xs sm:text-[17px] transition-colors duration-300">
            Last updated: June 19, 2026 <span className="mx-1.5 sm:mx-2">&bull;</span> Effective: June 19, 2026
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Intro Box */}
        <div className="bg-[#EDF2FE] dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 p-6 sm:p-8 rounded-r-xl shadow-sm mb-8 text-[17px] leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300">
          This Refund Policy outlines the terms and conditions regarding refunds and cancellations for products purchased from <strong>Anthem Biosciences Ltd.</strong> ("Anthem", "we", "us", or "our").
        </div>

        {/* Contents Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm mb-16 transition-colors duration-300">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase mb-6">Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {toc.map((item) => (
              <a 
                key={item.num} 
                href={`#section-${item.num}`} 
                className="text-[16px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-200 w-5">{item.num}.</span> {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16 text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed dark-mode-content">
          
          <section id="section-1" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">1. General Refund Policy</h2>
            <p className="mb-6">Due to the sensitive nature of our biological products, including enzymes, reagents and other temperature-sensitive items, <strong>we cannot accept refunds or returns once an order has been shipped or delivered.</strong></p>
            <p className="mb-6">We ensure all products meet strict quality control standards prior to dispatch. If a product arrives severely damaged or completely compromised due to logistical failures out of your control, please contact our support team within 24 to 48 hours of delivery to discuss potential replacements, but direct refunds are not guaranteed.</p>
          </section>

          <section id="section-2" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">2. Order Cancellations</h2>
            <p className="mb-4">You may cancel your order at any time before it has been processed for shipping by our team. You can cancel your order directly from your Shipment Tracking dashboard.</p>
            <ul className="list-disc pl-5 space-y-3 mb-6 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Before Shipping:</strong> If the order is successfully cancelled before dispatch, a full refund will be automatically initiated.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">After Shipping:</strong> Once an order's status changes to "Shipped" or beyond, cancellation is no longer possible, and no refunds can be provided.</li>
            </ul>
          </section>

          <section id="section-3" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">3. Refund Processing Time</h2>
            <p className="mb-4">If your cancellation is successful and a refund is initiated, please allow time for the funds to reflect in your original payment method.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong>Processing Time:</strong> The refunded money will be returned to your original payment source within <strong>3-5 business days</strong>.</li>
              <li>Depending on your banking institution, there may be additional delays outside of our control.</li>
            </ul>
          </section>

          <section id="section-4" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">4. Contact Us</h2>
            <p className="mb-8">If you have any questions about this Refund Policy or need to discuss a specific order, please reach out to our team:</p>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 flex gap-6 items-start shadow-sm transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#EDF2FE] dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Anthem Biosciences Ltd.</h4>
                <p className="mb-1">Email: <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 dark:text-blue-400 hover:underline">enterokinase@anthembio.com</a></p>
                <p className="mb-1">Phone: +91-80-66724000</p>
                <p className="mb-6">Address: No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I, Bommasandra, Bengaluru, Karnataka - 560099, India</p>
                <p>Alternatively, use our <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact form</Link> and select "Other" as the subject.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
    </>
  );
}

