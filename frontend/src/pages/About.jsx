import React from 'react';
import SEOHead from '../components/SEOHead';

function About() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Anthem Biosciences",
    "url": "https://enterokinase.in",
    "logo": "https://enterokinase.in/assets/anthem-logo.png",
    "description": "Anthem Biosciences is a Contract Research and Innovation Service Provider (CRISP) headquartered in Bangalore, India with 2,500+ researchers and 4 world-class facilities.",
    "foundingDate": "2005",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 2500
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No 49, F1 & F2, Canara Bank Road, Bommasandra Industrial Area, Phase I",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560099",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://in.linkedin.com/company/anthembiosciences",
      "https://x.com/AnthemBio"
    ]
  };

  return (
    <>
      <SEOHead
        title="About Anthem Biosciences — Innovation from Lab to Life"
        description="Anthem Biosciences is a CRISP headquartered in Bangalore, India. 2,500+ researchers, 4 world-class facilities, serving 50+ countries with end-to-end drug discovery solutions."
        canonicalPath="/about"
        jsonLd={organizationJsonLd}
      />
    <div className="bg-[#f8f9fa] dark:bg-slate-950 transition-colors duration-300 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/about-us.png" alt="About Anthem Biosciences — research facilities and team" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='500'%3E%3Crect width='1600' height='500' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EAbout Us Hero Image%3C/text%3E%3C/svg%3E"; }} />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-slate-400"></div>
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">About Anthem Biosciences</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight font-light italic">
              "Anthem Biosciences &mdash;<br />
              Innovation from lab to life."
            </h1>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400 uppercase">Our Story</span>
              <div className="w-16 h-[1px] bg-blue-200 dark:bg-blue-900"></div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg font-light">
              Anthem Biosciences is a Contract Research and Innovation Service Provider (CRISP) headquartered in Bangalore, India. With four world-class facilities and a team of over 2,500 researchers, we deliver end-to-end solutions in drug discovery, development, and manufacturing.
            </p>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg font-light">
              We specialize in both biology and chemistry-driven innovation, offering expertise in proteins, peptides, monoclonal antibodies, small molecules, and specialty chemicals. Our integrated approach ensures seamless progression from early-stage research to commercial-scale production.
            </p>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
              At Anthem, we are committed to scientific excellence, sustainability, and trusted partnerships, empowering global pharma and biotech companies to bring breakthrough therapies to market faster and more efficiently.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center min-h-[160px] transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-serif font-bold text-blue-600 dark:text-blue-500 mb-3 tracking-tight">2,500<span className="font-sans text-blue-400 dark:text-blue-600 font-light">+</span></div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide">Expert Researchers</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center min-h-[160px] transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-serif font-bold text-blue-600 dark:text-blue-500 mb-3 tracking-tight">4</div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide">World-Class Facilities</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center min-h-[160px] transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-serif font-bold text-blue-600 dark:text-blue-500 mb-3 tracking-tight">20<span className="font-sans text-blue-400 dark:text-blue-600 font-light">+</span></div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide">Years of Innovation</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center min-h-[160px] transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-serif font-bold text-blue-600 dark:text-blue-500 mb-3 tracking-tight">50<span className="font-sans text-blue-400 dark:text-blue-600 font-light">+</span></div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default About;
