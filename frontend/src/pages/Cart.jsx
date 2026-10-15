import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';

export default function Cart({ user, openAuthModal }) {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();
  const { currency, shippingRates, formatCurrency } = useLocalization();

  const subtotal = (cartItems || []).reduce((total, item) => total + (item.price * item.quantity), 0);
  // Show a representative shipping estimate; exact rate is calculated at checkout based on PIN code
  const estimatedShippingMethod = currency === 'INR' ? 'south_india' : 'outside_india';
  const shipping = subtotal > 0 ? (shippingRates?.[estimatedShippingMethod] || 0) : 0;
  const gst = currency === 'INR' ? Math.round(subtotal * 0.18) : 0;
  const total = subtotal + shipping + gst;

  const handleProceed = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <SEOHead title="Cart" noIndex={true} />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center transition-colors duration-300">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-3">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="inline-block px-8 py-3.5 bg-[#1A4BDB] hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            
            {/* Left Column - Cart Items */}
            <div className="flex-grow">
              <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 flex items-center justify-between">
                <span>Your Cart</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold lowercase">({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.unitId}`} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 transition-colors duration-300">
                    
                    <div className="flex items-center gap-4 sm:block">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-slate-100 dark:border-slate-700/50">
                        <img 
                          src="/assets/enterokinease-vial.jpeg" 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="sm:hidden flex-grow min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cat: {item.id} · {item.unitLabel}</p>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="hidden sm:flex flex-col gap-1">
                        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Cat. No: {item.id} - {item.unitLabel}</p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
                          <button 
                            onClick={() => updateQuantity(item.id, item.unitId, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-12 h-10 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.unitId, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="hidden sm:block text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id, item.unitId)}
                          className="flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors px-2 py-1"
                        >
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0 lg:pt-0 pt-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-8 transition-colors duration-300 sticky top-24">
                <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  Order Summary
                </h3>
                
                <div className="space-y-3.5 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Shipping (Estimated)</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">GST {currency === 'INR' ? '(18%)' : ''}</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(gst)}</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6 flex justify-between items-center transition-colors duration-300">
                  <span className="font-bold text-slate-900 dark:text-white text-base">Total</span>
                  <span className="font-extrabold text-xl text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                </div>
                
                <div className="space-y-3">
                  <button onClick={handleProceed} className="w-full py-3.5 bg-[#1A4BDB] hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-base shadow-sm active:scale-[0.98]">
                    Proceed to Checkout
                  </button>
                  <Link to="/products" className="w-full flex items-center justify-center py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors font-semibold text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
    </>
  );
}
