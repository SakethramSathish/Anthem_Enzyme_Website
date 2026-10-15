import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Lock, LogIn, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles, openAuthModal: propOpenAuthModal }) {
  const { user, role, loading, userData, openAuthModal: contextOpenAuthModal } = useAuth();

  const handleOpenAuth = (mode = 'login') => {
    if (typeof propOpenAuthModal === 'function') {
      propOpenAuthModal(mode);
    } else if (typeof contextOpenAuthModal === 'function') {
      contextOpenAuthModal(mode);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in: show the page content with a heavy blur and a glassmorphic login gate card
  if (!user) {
    return (
      <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Blurred underlying page preview */}
        <div className="filter blur-xl select-none pointer-events-none opacity-25 dark:opacity-20 scale-[0.98] transition-all duration-500 max-h-[85vh] overflow-hidden">
          {children}
        </div>

        {/* Backdrop glassmorphism overlay */}
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-30 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
            {/* Top glowing gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

            {/* Lock Icon badge */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Authentication Required
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              This page contains protected member data. Please log in or create an account to view and continue.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="w-full py-3.5 px-6 bg-[#1A4BDB] hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Proceed
              </button>

              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                Create an Account
              </button>

              <Link
                to="/"
                className="w-full py-2.5 px-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role permissions for authenticated users
  // Strict role check: Firestore role is the primary source of truth
  const effectiveRole = (
    userData?.role?.toLowerCase() === 'admin' ? 'admin' :
    userData?.role?.toLowerCase() === 'customer' ? 'user' :
    (userData?.role?.toLowerCase() || role || 'user')
  );
  const hasAllowedRole = !allowedRoles || allowedRoles.includes(effectiveRole);

  if (!hasAllowedRole) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Your account does not have sufficient permissions to view this administrative resource.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium text-sm rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
