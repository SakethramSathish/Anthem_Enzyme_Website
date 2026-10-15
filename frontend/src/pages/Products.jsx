import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function Products() {
  return (
    <>
      <SEOHead
        title="Our Products — Anthem Biosciences"
        description="Browse our range of recombinant enterokinase products for precise fusion protein tag removal."
        canonicalPath="/products"
      />
      <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 flex justify-center items-start">
        <div className="max-w-[1400px] w-full flex flex-col items-center pt-2 sm:pt-8">
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400 uppercase">Our Offerings</span>
              <div className="w-8 sm:w-12 h-[1px] bg-blue-200 dark:bg-blue-900"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-3 sm:mb-6 font-bold tracking-tight">Recombinant Enterokinase</h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-light px-2">
              Choose from our high-quality recombinant enterokinase products designed for targeted cleavage of fusion proteins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 w-full max-w-5xl mx-auto">
            {/* Product A Card */}
            <Link to="/product/a" className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden active:scale-[0.99]">
              <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                <img 
                  src="/assets/enterokinease-vial-a.png" 
                  alt="Recombinant Enterokinase (Light Chain)" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-8 flex flex-col flex-grow">
                <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 mb-3 sm:mb-4 self-start bg-slate-50 dark:bg-slate-800">
                  <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">CAT. NO: AB-EK-A0001</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">Recombinant Enterokinase (Light Chain)</h2>
                <p className="text-sm sm:text-[16px] text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 flex-grow leading-relaxed">
                  Highly specific serine protease for targeted cleavage of fusion proteins. Available in multiple unit sizes for various scales.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base group-hover:gap-3 transition-all">
                  View Product &rarr;
                </div>
              </div>
            </Link>

            {/* Recombinant Enterokinase Card */}
            <Link to="/product/b" className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden active:scale-[0.99]">
              <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                <img 
                  src="/assets/enterokinease-vial-b.png" 
                  alt="Recombinant Enterokinase" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-8 flex flex-col flex-grow">
                <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 mb-3 sm:mb-4 self-start bg-slate-50 dark:bg-slate-800">
                  <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">CAT. NO: AB-EK-B0001</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">Recombinant Enterokinase</h2>
                <p className="text-sm sm:text-[16px] text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 flex-grow leading-relaxed">
                  Highly specific protease that cleaves after lysine at its cleavage site Asp-Asp-Asp-Asp-Lys (DDDDK). Available strictly in 50 Units size.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base group-hover:gap-3 transition-all">
                  View Product &rarr;
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
