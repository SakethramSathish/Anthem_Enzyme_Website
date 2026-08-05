import React from 'react';
import SEOHead from '../components/SEOHead';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const toc = [
    { num: 1, title: 'Information We Collect' },
    { num: 2, title: 'How We Use Your Information' },
    { num: 3, title: 'Sharing of Information' },
    { num: 4, title: 'Cookies & Tracking' },
    { num: 5, title: 'Data Retention' },
    { num: 6, title: 'Security' },
    { num: 7, title: 'Your Rights' },
    { num: 8, title: 'International Transfers' },
    { num: 9, title: "Children's Privacy" },
    { num: 10, title: 'Changes to This Policy' },
    { num: 11, title: 'Contact Us' }
  ];

  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Read the privacy policy for Enterokinase by Anthem Biosciences. Learn how we collect, use, and protect your personal information when you use our services."
        canonicalPath="/privacy-policy"
      />
    <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 pb-24">
      {/* Header */}
      <div className="bg-[#0f1115] dark:bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-slate-600 dark:bg-slate-300"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase transition-colors duration-300">Legal</span>
          </div>
          <h1 className="text-5xl font-serif font-black text-white dark:text-slate-900 mb-6 tracking-tight transition-colors duration-300">Privacy Policy</h1>
          <p className="text-slate-400 dark:text-slate-600 text-[15px] transition-colors duration-300">
            Last updated: May 29, 2026 <span className="mx-2">&bull;</span> Effective: May 29, 2026
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Intro Box */}
        <div className="bg-[#EDF2FE] dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 p-6 sm:p-8 rounded-r-xl shadow-sm mb-8 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300">
          This Privacy Policy describes how <strong>Anthem Biosciences Ltd.</strong> ("Anthem", "we", "us", or "our") collects, uses, discloses, and safeguards information about you when you visit <strong>anthembio.com</strong> or place an order for our products. Please read it carefully.
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
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">1. Information We Collect</h2>
            <p className="mb-6">We collect information you provide directly to us and information collected automatically when you use our website.</p>
            
            <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4 transition-colors duration-300">Information you provide:</h3>
            <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Account registration:</strong> name, email address, organisation/institution name, and password when you create an account.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Orders & billing:</strong> shipping address, billing address, phone number, and payment details (processed securely by our payment processor; we do not store raw card numbers).</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Contact & enquiries:</strong> messages you send via our contact form, including any supporting information you attach.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Technical support:</strong> details about experiments, protocols, or product usage shared to obtain technical assistance.</li>
            </ul>

            <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4 transition-colors duration-300">Information collected automatically:</h3>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Usage data:</strong> pages viewed, links clicked, time spent on pages, referral URLs, and search queries on our site.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Device & log data:</strong> IP address, browser type and version, operating system, device identifiers, and access timestamps.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Cookies & similar technologies:</strong> see Section 4 for details.</li>
            </ul>
          </section>

          <section id="section-2" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-3 mb-6 marker:text-slate-400">
              <li>To process and fulfil your orders, including shipping notifications and order confirmations.</li>
              <li>To manage your account and authenticate your identity.</li>
              <li>To respond to your enquiries, provide technical support, and send service-related communications.</li>
              <li>To improve our website, products, and services based on usage patterns and feedback.</li>
              <li>To send you product updates, scientific content, or promotional offers where you have consented or where we have a legitimate interest - with an easy opt-out in every email.</li>
              <li>To detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
              <li>To comply with applicable laws, regulations, and legal obligations.</li>
            </ul>
            <p>We will not use your information for automated decision-making that produces legal or similarly significant effects without your explicit consent.</p>
          </section>

          <section id="section-3" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">3. Sharing of Information</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Service providers:</strong> trusted third parties who assist in operating our website and business (e.g., payment processors, logistics partners, cloud hosting providers, email delivery services). These providers are contractually obligated to handle data securely and only for the purposes we specify.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Business partners:</strong> authorised distributors fulfilling orders on our behalf in your region, subject to appropriate data protection agreements.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Legal compliance:</strong> when required by law, court order, or governmental authority, or to protect the rights, property, or safety of Anthem, our customers, or the public.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Business transfers:</strong> in the event of a merger, acquisition, or sale of assets, personal data may be transferred as part of that transaction. We will notify you before your data is subject to a different privacy policy.</li>
            </ul>
          </section>

          <section id="section-4" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">4. Cookies & Tracking</h2>
            <p className="mb-4">Our website uses cookies and similar tracking technologies to enhance your experience and analyse usage.</p>
            <ul className="list-disc pl-5 space-y-3 mb-6 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Essential cookies:</strong> required for the website to function (e.g., session management, shopping cart persistence). You cannot opt out of these without affecting site functionality, as they are crucial for core security, network management, and accessibility.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Analytics cookies:</strong> help us understand how visitors interact with the site so we can improve it (e.g., page views, bounce rates). We anonymise this data where possible.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Preference cookies:</strong> remember your settings and choices across visits. By storing custom configurations like your preferred language, geographic region, or visual settings etc, these cookies deliver a personalized and seamless browsing experience.</li>
            </ul>
            <p>You can control or delete cookies through your browser settings. Please note that disabling certain cookies may impact the functionality of the site.</p>
          </section>

          <section id="section-5" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">5. Data Retention</h2>
            <p className="mb-4">We retain personal data for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Order records:</strong> retained for a minimum of 7 years to comply with financial and tax regulations.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Account data:</strong> retained while your account is active. You may request deletion at any time (see Section 7).</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Marketing preferences:</strong> retained until you unsubscribe or withdraw consent.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Contact form submissions:</strong> retained for up to 2 years after the last interaction.</li>
            </ul>
          </section>

          <section id="section-6" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">6. Security</h2>
            <p className="mb-4">We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include:</p>
            <ul className="list-disc pl-5 space-y-3 mb-6 marker:text-slate-400">
              <li>TLS/HTTPS encryption for all data in transit.</li>
              <li>Encrypted storage of sensitive data at rest.</li>
              <li>Role-based access controls limiting data access to authorised personnel only.</li>
              <li>Regular security reviews of our systems and third-party processors.</li>
            </ul>
            <p>No method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security. While we implement robust administrative, technical, and physical safeguards to protect your personal information, no system is entirely immune to potential risks. If you suspect a security breach, unauthorized access, or compromise affecting your data, please contact us immediately so we can investigate and take prompt protective action at <a href="mailto:enterokinase@anthembio.com" className="text-blue-600 hover:underline">enterokinase@anthembio.com</a>.</p>
          </section>

          <section id="section-7" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">7. Your Rights</h2>
            <p className="mb-4">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Access:</strong> request a copy of the personal data we hold about you.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Correction:</strong> request correction of inaccurate or incomplete data.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Erasure:</strong> request deletion of your data, subject to our legal retention obligations.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Portability:</strong> receive your data in a structured, machine-readable format.</li>
              <li><strong className="text-slate-900 dark:text-slate-200 transition-colors duration-300">Restriction:</strong> request that we restrict processing of your data in certain circumstances.</li>
            </ul>
          </section>

          <section id="section-8" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">8. International Transfers</h2>
            <p>As a global business, we may transfer, store, and process your personal data in countries other than your own. When we do so, we ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.</p>
          </section>

          <section id="section-9" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">9. Children's Privacy</h2>
            <p>Our website and products are intended for businesses and professionals and are not directed towards minors. We do not knowingly solicit or collect personal data from children under the age of 16. If we become aware that we have inadvertently collected such data, we will take steps to delete it promptly. If you believe that a child under 16 has provided us with personal data, please contact us, so that we can initiate removal procedures promptly.</p>
          </section>

          <section id="section-10" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-300">10. Changes to This Policy</h2>
            <p className="mb-4">We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you by email or a prominent notice on our website.</p>
            <p>Your continued use of our website after changes become effective constitutes your acceptance of the revised policy.</p>
          </section>

          <section id="section-11" className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">11. Contact Us</h2>
            <p className="mb-8">If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please reach out:</p>
            
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
