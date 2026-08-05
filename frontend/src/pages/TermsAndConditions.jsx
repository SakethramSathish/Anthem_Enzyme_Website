import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
  const toc = [
    { num: 1, title: 'Acceptance of Terms' },
    { num: 2, title: 'Eligibility & Intended Use' },
    { num: 3, title: 'Products & Descriptions' },
    { num: 4, title: 'Orders & Pricing' },
    { num: 5, title: 'Payment' },
    { num: 6, title: 'Shipping & Delivery' },
    { num: 7, title: 'Returns & Refunds' },
    { num: 8, title: 'Intellectual Property' },
    { num: 9, title: 'Disclaimers & Warranties' },
    { num: 10, title: 'Limitation of Liability' },
    { num: 11, title: 'Governing Law & Disputes' },
    { num: 12, title: 'Changes to Terms' },
    { num: 13, title: 'Contact Us' }
  ];

  return (
    <>
      <SEOHead
        title="Terms & Conditions"
        description="Review the terms and conditions for purchasing recombinant enterokinase from Anthem Biosciences. Covers orders, payments, shipping, returns, and intellectual property."
        canonicalPath="/terms"
      />
    <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 pb-24">
      {/* Header */}
      <div className="bg-[#0f1115] dark:bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-slate-600 dark:bg-slate-300"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase transition-colors duration-300">Legal</span>
          </div>
          <h1 className="text-5xl font-serif font-black text-white dark:text-slate-900 mb-6 tracking-tight transition-colors duration-300">Terms & Conditions</h1>
          <p className="text-slate-400 dark:text-slate-600 text-[15px] transition-colors duration-300">
            Last updated: May 29, 2026 <span className="mx-2">&bull;</span> Effective: May 29, 2026
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Intro Box */}
        <div className="bg-[#EDF2FE] dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 p-6 sm:p-8 rounded-r-xl shadow-sm mb-8 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300">
          Please read these Terms & Conditions carefully before using the Anthem Biosciences website or placing an order. By accessing our site or purchasing our products, you agree to be bound by these terms. If you do not agree, please do not use our services.
        </div>

        {/* Contents Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm mb-16 transition-colors duration-300">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase mb-6">Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {toc.map((item) => (
              <a 
                key={item.num} 
                href={`#section-${item.num}`} 
                className="text-[14px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-200 w-5">{item.num}.</span> {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed dark-mode-content">
          
          <section id="section-1" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">1. Acceptance of Terms</h2>
            <p className="mb-4">These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("Customer", "you") and <strong>Anthem Biosciences Ltd.</strong> ("Anthem", "we", "us"), a company incorporated under the laws of India with its principal office in Bengaluru, Karnataka.</p>
            <p>By visiting <strong>anthembio.com</strong>, creating an account, or placing an order, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference.</p>
          </section>

          <section id="section-2" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">2. Eligibility & Intended Use</h2>
            <p className="mb-6">Our products and services are intended exclusively for <strong>professional, research, and commercial use</strong> by qualified scientists, laboratory personnel, and representatives of academic institutions, pharmaceutical companies, and biotechnology firms.</p>
            
            <div className="bg-[#FFF8E6] dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm mb-6 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300">
              <strong>Important &mdash; Research Use Only:</strong> Unless explicitly labelled otherwise, all Anthem Biosciences products are for <em>research use only (RUO)</em> and are not intended, approved or validated for diagnostic, therapeutic, or clinical use in humans or animals. Customers are solely responsible for ensuring that products are used in compliance with all applicable laws and regulations.
            </div>
            
            <p>You must be at least 18 years of age and have the authority to enter into binding contracts on behalf of yourself or your organisation to use our services.</p>
          </section>

          <section id="section-3" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">3. Products & Descriptions</h2>
            <p className="mb-4">We make every effort to ensure that product descriptions, specifications, and images on our website are accurate and up to date. However:</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li>Product images are for illustrative purposes only and may not precisely represent the final product or packaging.</li>
              <li>Technical specifications (e.g., unit activity, purity, storage conditions) are based on our standard quality control testing and may vary between lots within stated tolerances, due to the inherent characteristics of biological and chemical manufacturing.</li>
              <li>Certificate of Analysis (CoA) and Safety Data Sheet (SDS) documents for each lot are available on request and may be provided with shipment.</li>
              <li>We reserve the right to modify product formulations, specifications, or availability without prior notice. We will not make changes that materially affect the performance of a product already ordered without contacting you.</li>
            </ul>
          </section>

          <section id="section-4" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">4. Orders & Pricing</h2>
            <p className="mb-4"><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Order acceptance:</strong> Placing an order constitutes an offer to purchase. Anthem reserves the right to accept or decline any order at its discretion. An order is confirmed only upon receipt of a written or electronic order confirmation from us.</p>
            
            <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4 transition-colors duration-300 mt-6">Pricing:</h3>
            <ul className="list-disc pl-5 space-y-3 mb-6 marker:text-slate-400">
              <li>All prices are listed in Indian Rupees (INR) and are exclusive of applicable taxes (GST) and shipping charges unless stated otherwise.</li>
              <li>Prices are subject to change without notice. The price applicable to your order is the price displayed at the time of checkout.</li>
              <li>Discounts, promotions, or special pricing apply only to specific products and time periods as communicated by Anthem.</li>
            </ul>
            <p><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Minimum order quantities</strong> may apply to certain products or customer tiers. Please contact our business development team for volume pricing enquiries.</p>
          </section>

          <section id="section-5" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">5. Payment</h2>
            <p className="mb-4">Payment in full is due at the time of order unless a credit account has been established in writing by Anthem.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li>We accept major credit/debit cards, bank transfers (NEFT/RTGS/IMPS), and other payment methods listed at checkout.</li>
              <li>All transactions are processed through PCI-DSS compliant payment gateways. Anthem does not store raw card numbers.</li>
              <li>For institutional purchase orders (POs), please contact <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 hover:underline">enterokinase@anthembio.com</a> to establish credit terms.</li>
              <li>In the event of a failed or disputed payment, Anthem reserves the right to place your account on hold and suspend order fulfilment until the matter is resolved.</li>
            </ul>
          </section>

          <section id="section-6" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">6. Shipping & Delivery</h2>
            <p className="mb-4">Anthem ships products using temperature-controlled packaging appropriate for each product's stability requirements.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Lead time:</strong> Standard orders are processed and dispatched within 3-5 business days of order confirmation, subject to product availability.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Shipping charges:</strong> Applicable shipping and cold-chain handling fees will be displayed at checkout or communicated prior to order confirmation.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Risk of loss:</strong> Title and risk of loss pass to the customer upon handover to the carrier. Anthem is not liable for delays or damage caused by the carrier.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Inspection on receipt:</strong> Customers must inspect shipments upon delivery. Claims for damage, incorrect products, or shortages must be reported in writing to <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 hover:underline">enterokinase@anthembio.com</a> within <strong>48 hours</strong> of receipt.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Export controls:</strong> Customers are responsible for compliance with all applicable export control laws and regulations in their jurisdiction.</li>
            </ul>
          </section>

          <section id="section-7" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">7. Returns & Refunds</h2>
            <p className="mb-4">Due to the biological and temperature-sensitive nature of our products, <strong>we cannot accept returns</strong> once a product has been dispatched, if the product is defective or incorrectly supplied, please contact our support team within 24 to 48 hours of delivery to discuss potential replacements, but direct refunds are not guaranteed.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Defective or incorrect products:</strong> If you receive a product that does not meet the specifications stated in the CoA or is not what you ordered, contact us within 48 hours of receipt. We will, at our discretion, provide a replacement, credit, or refund.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Cancellations:</strong> Orders may be cancelled without charge prior to dispatch. Contact <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 hover:underline">enterokinase@anthembio.com</a> immediately if you wish to cancel. Once dispatched, orders cannot be cancelled.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Refund processing:</strong> Approved refunds will be processed to the original payment method within 7-10 business days.</li>
            </ul>
          </section>
          
          <section id="section-8" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">8. Intellectual Property</h2>
            <p className="mb-4">All content on the Anthem Biosciences website - including text, graphics, logos, images, product data sheets, protocols, and software - is the property of Anthem Biosciences Ltd. or its affiliates, or its third-party licensors and is protected by applicable intellectual property laws.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li>You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.</li>
              <li>Purchase of a product does not transfer any intellectual property rights. Products are sold for use only and not for resale, re-manufacture, or reverse engineering.</li>
              <li>Any use of Anthem's trademarks, logos, or branding without prior written authorisation is strictly prohibited.</li>
            </ul>
          </section>

          <section id="section-9" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">9. Disclaimers & Warranties</h2>
            <p className="mb-6">Anthem warrants that its products will conform to the specifications stated on the applicable product datasheet and CoA at the time of shipment. <strong>This is our sole and exclusive warranty.</strong></p>
            
            <div className="bg-[#FFF8E6] dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm mb-6 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 uppercase transition-colors duration-300">
              <strong>Disclaimer:</strong> TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ANTHEM DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES.
            </div>
            
            <p>Anthem makes no representation that its products are appropriate for use in all countries. Customers are responsible for verifying that use of Anthem products complies with local regulations.</p>
          </section>

          <section id="section-10" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">10. Limitation of Liability</h2>
            <p className="mb-4">To the maximum extent permitted by law, Anthem Biosciences' total cumulative liability to you for any claim arising out of or related to your purchase or use of our products or website shall not exceed the amount actually paid by you for the specific product giving rise to the claim in the three (3) months preceding the claim.</p>
            <p>In no event shall Anthem be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, loss of experiments, or business interruption, even if we have been advised of the possibility of such damages.</p>
          </section>

          <section id="section-11" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">11. Governing Law & Disputes</h2>
            <p className="mb-4">These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law principles. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of <strong>Bengaluru, Karnataka, India</strong>.</p>
            <p>Before initiating legal proceedings, you agree to first attempt to resolve any dispute by contacting Anthem in good faith. Most concerns can be evaluated and resolved efficiently through direct communication with our dedicated customer support team.</p>
          </section>

          <section id="section-12" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">12. Changes to Terms</h2>
            <p className="mb-4">We reserve the right to modify these Terms at any time. When we make material changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you by email or a prominent website notice. Your continued use of our website or services after the effective date of revised Terms constitutes your acceptance of the changes.</p>
            <p>If you do not agree to the revised Terms, you must stop using our website and services and, if applicable, cancel any pending orders.</p>
          </section>

          <section id="section-13" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">13. Contact Us</h2>
            <p className="mb-8">For any questions about these Terms, your orders, or our products, please contact our team:</p>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 flex gap-6 items-start shadow-sm transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#EDF2FE] dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Anthem Biosciences Ltd.</h4>
                <p className="mb-1">Email: <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 dark:text-blue-400 hover:underline">enterokinase@anthembio.com</a></p>
                <p className="mb-1">Phone: +91-80-66724000</p>
                <p className="mb-6">Address: No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I, Bommasandra, Bengaluru, Karnataka - 560099, India</p>
                <p>You can also reach us via our <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-blue-600 dark:text-blue-400 hover:underline">Contact form</Link>.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
    </>
  );
}

