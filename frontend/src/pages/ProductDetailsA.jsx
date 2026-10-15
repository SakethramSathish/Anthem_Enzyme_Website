import React, { useState } from 'react';
import { FileText, AlertTriangle, Award, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthProvider';
import SEOHead from '../components/SEOHead';

export default function ProductDetailsA({ openAuthModal }) {
  const { user } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState('100');
  const [quantity, setQuantity] = useState(1);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { prices, formatCurrency } = useLocalization();
  const [toastMessage, setToastMessage] = useState(null);

  const units = [
    { id: '100', label: '100 Units', price: prices['100'] },
    { id: '500', label: '500 Units', price: prices['500'] },
    { id: '5000', label: '5000 Units', price: prices['5000'] },
    { id: 'bulk', label: 'Buy in Bulk', price: 'Contact Us' }
  ];

  const currentUnit = units.find(u => u.id === selectedUnit);
  const totalPrice = typeof currentUnit.price === 'number' ? currentUnit.price * quantity : null;

  const handleAddToCart = () => {
    if (selectedUnit === 'bulk') {
      window.location.href = '/contact';
      return;
    }
    
    if (!user) {
      openAuthModal('login');
      return;
    }
    addToCart({
      id: 'AB-EK-A0001',
      name: 'Recombinant Enterokinase (Light Chain)',
      unitId: currentUnit.id,
      unitLabel: currentUnit.label,
      price: currentUnit.price,
      quantity: quantity
    });
    
    setToastMessage(`✓ Added to cart — ${quantity}x ${currentUnit.label}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Recombinant Enterokinase (Light Chain)",
    "image": "https://enterokinase.in/assets/enterokinease-vial-a.png",
    "description": "Recombinant enterokinase is a highly specific serine protease used for targeted cleavage of fusion proteins. It recognizes the DDDDK sequence and cleaves at the C-terminal side of lysine.",
    "sku": "AB-EK-A0001",
    "brand": {
      "@type": "Brand",
      "name": "Anthem Biosciences"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://enterokinase.in/product/a",
      "priceCurrency": "INR",
      "lowPrice": "2700",
      "highPrice": "40500",
      "offerCount": "3",
      "availability": "https://schema.org/InStock"
    },
    "category": "Enzymes > Serine Proteases",
    "manufacturer": {
      "@type": "Organization",
      "name": "Anthem Biosciences",
      "url": "https://enterokinase.in"
    }
  };

  return (
    <>
      <SEOHead
        title="Recombinant Enterokinase (Light Chain) — Product Details & Pricing"
        description="Recombinant enterokinase (light chain) serine protease for DDDDK tag removal. Available in 250, 1000, and 5000 unit vials. View specifications, pricing, and order online."
        canonicalPath="/product/a"
        ogType="product"
        jsonLd={productJsonLd}
      />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-6 sm:py-16 px-3 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-24 mt-2 sm:mt-8">
        
        {/* Left Column - Image & Docs */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center transition-colors duration-300">
            
            <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden aspect-[3/4] relative flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50">
              <img 
                src="/assets/enterokinease-vial-a.png" 
                alt="Recombinant Enterokinase vial by Anthem Biosciences — serine protease for DDDDK tag cleavage" 
                loading="lazy"
                className="w-full h-full p-4 object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EProduct Image%3C/text%3E%3C/svg%3E"; }} 
              />
            </div>
            
            <p className="text-center text-slate-700 dark:text-slate-300 text-sm sm:text-base font-semibold mb-6 sm:mb-8">Recombinant Enterokinase (Light Chain)</p>
          
            <div className="w-full space-y-2.5">
              <a href="/assets/MoA for EK B.pdf" download="MoA for EK B.pdf" className="w-full flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors rounded-xl text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 text-left border border-slate-200/50 dark:border-slate-700/50">
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span>Manual / Protocol</span>
              </a>
              <a href="/assets/EK SDS.pdf" download="EK SDS.pdf" className="w-full flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors rounded-xl text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 text-left border border-slate-200/50 dark:border-slate-700/50">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Safety Data Sheet (SDS)</span>
              </a>
              <a href="/assets/CoA for EK A.pdf" download="CoA for EK A.pdf" className="w-full flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors rounded-xl text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 text-left border border-slate-200/50 dark:border-slate-700/50">
                <Award className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Certificate of Analysis (CoA)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Order */}
        <div className="flex flex-col pt-0 sm:pt-2">
          
          <div className="mb-6 sm:mb-10">
            <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-3.5 py-1 mb-3 bg-slate-50 dark:bg-slate-800">
              <span className="text-xs font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400">CAT. NO: AB-EK-A0001</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-3 sm:mb-6 tracking-tight">Recombinant Enterokinase (Light Chain)</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Recombinant enterokinase is a highly specific serine protease used for targeted cleavage of fusion proteins. It recognizes the DDDDK sequence and cleaves at the C-terminal side of lysine. This enables efficient removal of tags while preserving the native protein sequence.
            </p>
          </div>

          <div className="mb-6 sm:mb-10">
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-3 sm:mb-4">Key Features</h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-[16px] text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Enterokinase without tag (tag-free formulation eliminating purification tag interference)</p>
              </div>
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Minimizes non-specific proteolysis</p>
              </div>
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Reliable, reproducible cleavage at DDDDK&darr; sites</p>
              </div>
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Suitable for both lab-scale and large-scale workflows</p>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-3 sm:mb-4">Storage</h3>
            <div className="space-y-3 text-sm sm:text-[16px] text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Store at -20°C for long-term use</p>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-3 sm:mb-4">Shipping</h3>
            <div className="space-y-3 text-sm sm:text-[16px] text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-blue-600 dark:text-blue-500 font-bold mt-0.5">&rarr;</span>
                <p>Shipping will be done at room temperature</p>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <button
              onClick={() => setIsIntroModalOpen(true)}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-[#1A4BDB] hover:bg-blue-700 text-white transition-colors rounded-xl text-sm sm:text-base font-semibold shadow-sm cursor-pointer active:scale-[0.99]"
            >
              <span>Product Introduction</span>
              <span className="text-xs sm:text-sm bg-white/20 px-2.5 py-1 rounded-lg font-semibold">&rarr; View Table</span>
            </button>
          </div>

          <div className="mb-6 sm:mb-10">
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-3 sm:mb-4">Select Units</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-xl border transition-all ${
                    selectedUnit === unit.id 
                      ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <span className={`text-xs sm:text-sm mb-1 sm:mb-2 ${selectedUnit === unit.id ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                    {unit.label}
                  </span>
                  <span className={`font-bold text-base sm:text-xl ${selectedUnit === unit.id ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                    {typeof unit.price === 'number' ? formatCurrency(unit.price) : unit.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between sm:justify-start gap-6">
              <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase">Quantity</h3>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 sm:hidden">Total Amount:</span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {totalPrice !== null ? formatCurrency(totalPrice) : '-'}
              </div>
            </div>
          </div>

          <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A4BDB] hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-base shadow-sm active:scale-[0.98]">
            {selectedUnit === 'bulk' ? null : <ShoppingCart className="w-5 h-5" />}
            {selectedUnit === 'bulk' ? 'Get a Quote' : 'Add to Cart'}
          </button>
        </div>
      </div>
      
      {/* Product Introduction Popup Modal */}
      {isIntroModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Product Introduction</h2>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-grow mb-4 custom-scrollbar">
              <table className="w-full text-left border border-slate-200 dark:border-slate-800 border-collapse text-xs sm:text-sm">
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white w-1/3 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Source</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">E. coli</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Species</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">Bovine</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Purity</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">&gt; 95%</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Type</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">Protein</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Molecular Weight</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">26.3 kDa</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Conjugate</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">Unconjugated</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Form</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">Lyophilized</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Purification</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300">Purified</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Unit Definition</td>
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                      One unit of enterokinase enzyme is defined as the amount of enzyme that will cleave 50 &mu;g of fusion protein in 16 hours at 22&deg;C, in a buffer containing 20 mM Tris-HCl pH 7.4, 50 mM NaCl, 2 mM CaCl&#8322;.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsIntroModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1A4BDB] text-white hover:bg-blue-700 text-sm sm:text-base font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`fixed bottom-4 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-[#186036] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center justify-center text-sm sm:text-base font-semibold z-50 transition-all duration-300 transform ${
          toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        {toastMessage}
      </div>
    </div>
    </>
  );
}
