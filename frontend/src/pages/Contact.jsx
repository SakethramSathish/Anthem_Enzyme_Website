import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    subject: location.state?.subject || 'Product Inquiry',
    message: ''
  });

  useEffect(() => {
    if (location.state?.subject) {
      setFormData(prev => ({ ...prev, subject: location.state.subject }));
    }
  }, [location.state]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          organization: formData.organization,
          subject: formData.subject,
          message: formData.message
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccessMessage("Message sent successfully!");
        setFormData({
          fullName: '',
          email: '',
          organization: '',
          subject: 'Product Inquiry',
          message: ''
        });
      } else {
        setErrorMessage(result.detail || result.message || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send the message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Anthem Biosciences - Orders, Support & Partnerships"
        description="Reach Anthem Biosciences for enterokinase orders, technical support, bulk inquiries, and partnership opportunities. Email, phone, and contact form available."
        canonicalPath="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Anthem Biosciences",
          "url": "https://enterokinase.in/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "Anthem Biosciences",
            "telephone": "+91-80-66724000",
            "email": "enterokinase@anthembio.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "postalCode": "560099",
              "addressCountry": "IN"
            }
          }
        }}
      />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 flex justify-center items-start">
      
      {/* Error Message Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-red-100 dark:border-red-900/30 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notice</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-6">
              {errorMessage}
            </p>
            <button 
              onClick={() => setErrorMessage('')} 
              className="w-full py-3 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-green-100 dark:border-green-900/30 max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">&#10003;</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Success</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-6">
              {successMessage}
            </p>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 sm:gap-12 lg:gap-24 mt-2 sm:mt-8 lg:mt-12">
        {/* Left Side */}
        <div className="flex flex-col justify-start pt-2">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-[#1A4BDB] uppercase">Get In Touch</span>
            <div className="w-10 sm:w-12 h-[1px] bg-blue-200"></div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[17px] leading-relaxed mb-8 sm:mb-12 max-w-md">
            Reach our business development team for orders, technical queries, or partnerships.
          </p>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 border border-blue-50 dark:border-blue-900/50">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:enterokinase@anthembio.com" className="text-slate-900 dark:text-slate-200 font-medium text-sm sm:text-[17px] hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">enterokinase@anthembio.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-100/50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 border border-purple-50 dark:border-purple-900/50">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                <a href="tel:+918066724000" className="text-slate-900 dark:text-slate-200 font-medium text-sm sm:text-[17px] hover:text-purple-600 dark:hover:text-purple-400 transition-colors">+91-80-66724000</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-pink-100/50 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0 border border-pink-50 dark:border-pink-900/50">
                <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Address</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium text-sm sm:text-[17px] leading-relaxed">No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I, Bengaluru, Karnataka - 560099, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 sm:p-8 md:p-10 transition-colors duration-300">
          <h2 className="text-lg sm:text-[20px] font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 font-serif tracking-tight">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white text-base" 
                placeholder="Dr. Jane Smith" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white text-base" 
                placeholder="you@organization.com" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Organization</label>
              <input 
                type="text" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white text-base" 
                placeholder="Lab / Institution" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white text-base appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1rem' }}
              >
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Order Support">Order Support</option>
                <option value="Technical Question">Technical Question</option>
                <option value="Partnership / Business">Partnership / Business</option>
                <option value="Bulk Order (GMP)">Bulk Order (GMP)</option>
                <option value="Bulk Order (Non-GMP)">Bulk Order (Non-GMP)</option>
                <option value="Request for Cancellation">Request for Cancellation</option>
                <option value="Request for Certificate of Analysis (CoA)">Request for Certificate of Analysis (CoA)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Message</label>
              <textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white text-base resize-y" 
                placeholder="How can we help you?" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#1A4BDB] hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-base sm:text-lg font-bold py-3.5 sm:py-4 rounded-xl transition-all mt-3 sm:mt-4 shadow-sm active:scale-[0.98]"
            >
              {isSubmitting ? "Sending... Don't Close the Window" : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

