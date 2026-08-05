import React, { useState } from 'react';
import { FileText, AlertTriangle, Award, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthProvider';
import SEOHead from '../components/SEOHead';

export default function ProductDetailsB({ openAuthModal }) {
  const { user } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState('50');
  const [quantity, setQuantity] = useState(1);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { prices, formatCurrency } = useLocalization();
  const [toastMessage, setToastMessage] = useState(null);

  const units = [
    { id: '50', label: '50 Units', price: prices['50'] }
  ];

  const currentUnit = units.find(u => u.id === selectedUnit);
  const totalPrice = typeof currentUnit.price === 'number' ? currentUnit.price * quantity : null;

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    addToCart({
      id: 'AB-EK-B0001',
      name: 'Recombinant Enterokinase B',
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
    "name": "Recombinant Enterokinase B",
    "image": "https://enterokinase.in/assets/enterokinease-vial-b.png",
    "description": "Recombinant enterokinase is a highly specific serine protease used for targeted cleavage of fusion proteins. It recognizes the DDDDK sequence and cleaves at the C-terminal side of lysine.",
    "sku": "AB-EK-B0001",
    "brand": {
      "@type": "Brand",
      "name": "Anthem Biosciences"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": "180000",
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
        title="Recombinant Enterokinase B — Product Details & Pricing"
        description="Recombinant enterokinase B serine protease for DDDDK tag removal. Available in 50 unit vials. View specifications, pricing, and order online."
        canonicalPath="/product/b"
        ogType="product"
        jsonLd={productJsonLd}
      />
    <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-24 mt-8">
        
        {/* Left Column - Image & Docs */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col items-center transition-colors duration-300">
            
            <div className="w-full max-w-sm bg-[#f8f9fa] dark:bg-slate-800 rounded-xl overflow-hidden aspect-[3/4] relative flex items-center justify-center mb-6 transition-colors duration-300">
              <img 
                src="/assets/enterokinease-vial-b.png" 
                alt="Recombinant Enterokinase vial by Anthem Biosciences — serine protease for DDDDK tag cleavage" 
                loading="lazy"
                className="w-full h-full p-4 object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EProduct Image%3C/text%3E%3C/svg%3E"; }} 
              />
            </div>
            
            <p className="text-center text-slate-600 dark:text-slate-400 text-[14px] font-medium mb-8">Recombinant Enterokinase B</p>
          
            <div className="w-full space-y-3">
              <a href="/assets/MoA for EK A.pdf" download="MoA for EK A.pdf" className="w-full flex items-center gap-3 p-4 bg-[#f8f9fa] hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-sm text-[14px] font-medium text-slate-700 dark:text-slate-300 text-left">
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                Manual / Protocol
              </a>
              <a href="/assets/EK SDS.pdf" download="EK SDS.pdf" className="w-full flex items-center gap-3 p-4 bg-[#f8f9fa] hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-sm text-[14px] font-medium text-slate-700 dark:text-slate-300 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Safety Data Sheet (SDS)
              </a>
              <Link to="/contact" state={{ subject: 'Request for Certificate of Analysis (CoA)' }} className="w-full flex items-center gap-3 p-4 bg-[#f8f9fa] hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-sm text-[14px] font-medium text-slate-700 dark:text-slate-300 text-left">
                <Award className="w-4 h-4 text-rose-500" />
                Certificate of Analysis (CoA)
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Order */}
        <div className="flex flex-col pt-2">
          
          <div className="mb-10">
            <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[11px] font-bold tracking-[0.15em] text-slate-600 dark:text-slate-400">CAT. NO: AB-EK-B0001</span>
            </div>
            <h1 className="text-[32px] md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Recombinant Enterokinase B</h1>
            <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Recombinant enterokinase is a highly specific serine protease used for targeted cleavage of fusion proteins. It recognizes the DDDDK sequence and cleaves at the C-terminal side of lysine. This enables efficient removal of tags while preserving the native protein sequence.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-4">Key Features</h3>
            <div className="space-y-4 text-[14px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-blue-600 dark:text-blue-500 font-medium">&rarr;</span>
                <p>Enterokinase without tag (tag-free formulation eliminating purification tag interference)</p>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-blue-600 dark:text-blue-500 font-medium">&rarr;</span>
                <p>Minimizes non-specific proteolysis</p>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-blue-600 dark:text-blue-500 font-medium">&rarr;</span>
                <p>Reliable, reproducible cleavage at DDDDK&darr; sites</p>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-blue-600 dark:text-blue-500 font-medium">&rarr;</span>
                <p>Suitable for both lab-scale and large-scale workflows</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-4">Storage</h3>
            <div className="space-y-4 text-[14px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-blue-600 dark:text-blue-500 font-medium">&rarr;</span>
                <p>Store at -20°C for long-term use</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <button
              onClick={() => setIsIntroModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-[#1A4BDB] hover:bg-blue-700 text-white transition-colors rounded-sm text-[14px] font-medium shadow-sm cursor-pointer"
            >
              <span>Product Introduction</span>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded font-semibold">&rarr; View Table</span>
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase mb-4">Select Units</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-sm border transition-all ${
                    selectedUnit === unit.id 
                      ? 'bg-[#EDF2FE] dark:bg-blue-900/30 border-blue-400 dark:border-blue-500' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <span className={`text-[14px] mb-2 ${selectedUnit === unit.id ? 'text-blue-700 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                    {unit.label}
                  </span>
                  <span className={`font-bold text-lg ${selectedUnit === unit.id ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                    {typeof unit.price === 'number' ? formatCurrency(unit.price) : unit.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-8">
              <h3 className="text-[11px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase">Quantity</h3>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors duration-300">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center font-medium text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-[18px] font-bold text-blue-600 dark:text-blue-400">
              {totalPrice !== null ? formatCurrency(totalPrice) : '-'}
            </div>
          </div>

          <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A4BDB] text-white rounded-sm hover:bg-blue-700 transition-colors font-medium text-[15px] shadow-sm">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Product Introduction Popup Modal */}
      {isIntroModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Introduction</h2>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border border-slate-200 dark:border-slate-800 border-collapse text-sm">
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white w-1/3 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Source</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">E. coli</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Species</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">Bovine</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Purity</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">&gt; 95%</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">Unit Definition</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                      One unit of enterokinase enzyme will produce 1.0 nanomole of trypsin from trypsinogen per minute at pH 5.6 at 25°C.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsIntroModalOpen(false)}
                className="px-6 py-2.5 bg-[#1A4BDB] text-white hover:bg-blue-700 text-sm font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#186036] text-white px-6 py-4 rounded-md shadow-lg flex items-center text-[15px] font-medium z-50 transition-all duration-300 transform ${
          toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        {toastMessage}
      </div>
    </div>
    </>
  );
}
