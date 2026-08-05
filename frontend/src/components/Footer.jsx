import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#0f1115] dark:bg-slate-950 pt-16 pb-8 border-t border-slate-800 dark:border-slate-800 transition-colors duration-300 mt-auto" role="contentinfo" aria-label="Site footer">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <img src="/assets/anthem-logo-light.png" alt="Anthem Biosciences" className="h-8 opacity-90 dark:hidden" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32'%3E%3Crect width='120' height='32' fill='%231e293b' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ELogo%3C/text%3E%3C/svg%3E"; }} />
            <img src="/assets/anthem-logo.png" alt="Anthem Biosciences" className="h-8 opacity-90 hidden dark:block" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32'%3E%3Crect width='120' height='32' fill='%23f1f5f9' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ELogo%3C/text%3E%3C/svg%3E"; }} />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm text-slate-400">
            <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">About Us</Link>
            <Link to="/products" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Products</Link>
            <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://in.linkedin.com/company/anthembiosciences" target="_blank" rel="noopener noreferrer" aria-label="Anthem Biosciences on LinkedIn" className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-700 hover:text-white hover:border-slate-500 transition-colors">
              <span className="text-xs font-bold">in</span>
            </a>
            <a href="https://x.com/AnthemBio" target="_blank" rel="noopener noreferrer" aria-label="Anthem Biosciences on X (Twitter)" className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-700 hover:text-white hover:border-slate-500 transition-colors">
              <span className="text-xs font-bold">X</span>
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-left text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Anthem Biosciences. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
