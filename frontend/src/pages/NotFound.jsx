import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { LogIn, ShoppingBag, ArrowLeft, HelpCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function NotFound({ openAuthModal: propOpenAuthModal }) {
  const { user, openAuthModal: contextOpenAuthModal } = useAuth();

  const handleOpenAuth = (mode = 'login') => {
    if (typeof propOpenAuthModal === 'function') {
      propOpenAuthModal(mode);
    } else if (typeof contextOpenAuthModal === 'function') {
      contextOpenAuthModal(mode);
    }
  };

  return (
    <>
      <SEOHead
        title="Page Not Found | Anthem Enzyme"
        description="The requested page could not be found or requires authentication."
        canonicalPath="/404"
      />
      <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
        {/* Background decorative blurred circles */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Center Card */}
        <div className="relative z-10 max-w-lg w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 shadow-inner">
            <HelpCircle className="w-10 h-10" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
            404 &bull; Page Not Found
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Looking for something?
          </h1>

          <p className="text-[17px] text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            The page you requested may be protected or require you to log in. Please sign in to verify your access or return to the product catalogue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {!user ? (
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="py-3.5 px-6 bg-[#1A4BDB] hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Account
              </button>
            ) : null}

            <Link
              to="/products"
              className="py-3.5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              View Products
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
