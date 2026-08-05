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
      <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
        <div className="max-w-[1400px] w-full flex flex-col items-center pt-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[11px] font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400 uppercase">Our Offerings</span>
              <div className="w-12 h-[1px] bg-blue-200 dark:bg-blue-900"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6 font-bold tracking-tight">Recombinant Enterokinase</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
              Choose from our high-quality recombinant enterokinase products designed for targeted cleavage of fusion proteins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full max-w-5xl mx-auto">
            {/* Product A Card */}
            <Link to="/product/a" className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                <img 
                  src="/assets/enterokinease-vial-a.png" 
                  alt="Recombinant Enterokinase A" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 mb-4 self-start bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">CAT. NO: AB-EK-A0001</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Recombinant Enterokinase A</h2>
                <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
                  Highly specific serine protease for targeted cleavage of fusion proteins. Available in multiple unit sizes for various scales.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-[14px] group-hover:gap-3 transition-all">
                  View Product &rarr;
                </div>
              </div>
            </Link>

            {/* Product B Card */}
            <Link to="/product/b" className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                <img 
                  src="/assets/enterokinease-vial-b.png" 
                  alt="Recombinant Enterokinase B" 
                  loading="lazy" 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 mb-4 self-start bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400 uppercase">CAT. NO: AB-EK-B0001</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Recombinant Enterokinase B</h2>
                <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
                  Highly specific serine protease for targeted cleavage of fusion proteins. Available strictly in 50 Units size.
                </p>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-[14px] group-hover:gap-3 transition-all">
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
