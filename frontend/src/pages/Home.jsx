import React from 'react';
import { ShieldCheck, CheckCircle2, Factory, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

function Home({ user }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Anthem Biosciences",
    "url": "https://enterokinase.in",
    "logo": "https://enterokinase.in/assets/anthem-logo.png",
    "description": "Anthem Biosciences is a Contract Research and Innovation Service Provider (CRISP) headquartered in Bangalore, India.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560099",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-80-66724000",
      "contactType": "sales",
      "email": "enterokinase@anthembio.com"
    },
    "sameAs": [
      "https://in.linkedin.com/company/anthembiosciences",
      "https://x.com/AnthemBio"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Enterokinase by Anthem Biosciences",
    "url": "https://enterokinase.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://enterokinase.in/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const combinedJsonLd = [organizationJsonLd, websiteJsonLd];

  return (
    <>
      <SEOHead
        title="Recombinant Enterokinase - Buy Online"
        description="Buy recombinant enterokinase for precise fusion protein tag removal. GMP compliant, quality tested. Order 50, 100, 500, or 5000 units from Anthem Biosciences."
        canonicalPath="/"
        jsonLd={combinedJsonLd}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center bg-[#0a0f18] overflow-hidden py-32 lg:py-40">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50" onError={(e) => { e.target.style.display = 'none'; }}>
            <source src="/assets/dna-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18] via-[#0a0f18]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-slate-500"></div>
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Recombinant Enzymes</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] tracking-tight">
              Precision tag removal,<br />
              <span className="italic text-slate-300 font-normal">clean purification.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl font-light">
              Enterokinase by Anthem Biosciences &mdash; consistent results across recombinant protein workflows, from bench-scale to commercial production.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" aria-label="Shop recombinant enterokinase products" className="px-8 py-3.5 bg-white text-slate-900 font-semibold rounded hover:bg-slate-100 transition-colors flex items-center justify-center min-w-[160px]">
                Shop Now
              </Link>
              <Link to="/about" aria-label="Learn about Anthem Biosciences" className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-semibold rounded hover:bg-white/10 transition-colors flex items-center justify-center min-w-[160px]">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6 text-sm font-medium text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
          <div className="flex gap-12 whitespace-nowrap items-center min-w-max">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              </div>
              <span>GMP Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <span>Quality Tested</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Factory className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <span>Consistent Batches</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              </div>
              <span>Secure Ordering</span>
            </div>
          </div>
          <div className="whitespace-nowrap ml-12 text-slate-500 dark:text-slate-400 font-normal">
            Trusted by 200+ pharma & biotech labs
          </div>
        </div>
      </div>

      {/* Featured Product Section */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400 uppercase">Featured Product</span>
              <div className="w-16 h-[2px] bg-blue-100 dark:bg-blue-900"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-2 font-bold tracking-tight">Recombinant Enterokinase</h2>
            
            <p className="text-slate-600 dark:text-slate-400 mb-12 leading-relaxed text-lg max-w-2xl font-light">
              A highly specific serine protease for precise tag removal. Recognizes the DDDDK sequence, enabling clean protein purification with minimal off-target cleavage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center transition-colors duration-300">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Units Available</div>
                <div className="font-semibold text-slate-900 dark:text-slate-200 text-lg">50 &middot; 100 &middot; 500 &middot; 5000</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center transition-colors duration-300">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Species</div>
                <div className="font-semibold text-slate-900 dark:text-slate-200 text-lg">Bovine</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center transition-colors duration-300">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Specificity</div>
                <div className="font-semibold text-slate-900 dark:text-slate-200 text-lg">DDDDK&darr;</div>
              </div>
            </div>

            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
              View Product &rarr;
            </Link>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] lg:aspect-square max-h-[600px] bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden relative border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <img src="/assets/enterokinease-vial.jpeg" alt="Recombinant Enterokinase vial by Anthem Biosciences for DDDDK tag cleavage" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EProduct Image Placeholder%3C/text%3E%3C/svg%3E"; }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

