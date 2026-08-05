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
  const shipping = subtotal > 0 ? (shippingRates?.standard || 0) : 0;
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
    <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors duration-300">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="inline-block px-8 py-3 bg-[#1A4BDB] text-white rounded-sm hover:bg-blue-700 transition-colors font-medium">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column - Cart Items */}
            <div className="flex-grow">
              <h2 className="text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                Your Cart ({cartCount} Item{cartCount !== 1 ? 's' : ''})
              </h2>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.unitId}`} className="flex gap-6 py-6 border-b border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
                    
                    <div className="w-24 h-24 bg-[#f8f9fa] dark:bg-slate-800 rounded-lg flex items-center justify-center p-2 flex-shrink-0 transition-colors duration-300">
                      <img 
                        src="/assets/enterokinease-vial.jpeg" 
                        alt={item.name} 
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    
                    <div className="flex-grow flex justify-between items-start">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                          <p className="text-[13px] text-slate-500 dark:text-slate-400">Cat. No: {item.id} - {item.unitLabel}</p>
                        </div>
                        
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors duration-300 w-fit">
                          <button 
                            onClick={() => updateQuantity(item.id, item.unitId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-10 h-8 flex items-center justify-center font-medium text-[14px] text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.unitId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col justify-between h-full min-h-[5rem]">
                        <div className="text-[16px] font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.unitId)}
                          className="text-[13px] text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors mt-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[400px] flex-shrink-0 lg:pt-0 pt-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 transition-colors duration-300 sticky top-24">
                <h3 className="text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-6">
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-600 dark:text-slate-400">Shipping (Standard)</span>
                    <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-600 dark:text-slate-400">GST {currency === 'INR' ? '(18%)' : ''}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(gst)}</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-8 flex justify-between items-center transition-colors duration-300">
                  <span className="font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="font-bold text-[18px] text-slate-900 dark:text-white">{formatCurrency(total)}</span>
                </div>
                
                <div className="space-y-3">
                  <button onClick={handleProceed} className="w-full py-4 bg-[#1A4BDB] text-white rounded-sm hover:bg-blue-700 transition-colors font-medium text-[15px] shadow-sm">
                    Proceed to Checkout
                  </button>
                  <Link to="/products" className="w-full flex items-center justify-center py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-[15px]">
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
