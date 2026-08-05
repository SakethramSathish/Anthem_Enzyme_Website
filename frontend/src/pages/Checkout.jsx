import React, { useState, useEffect, useRef } from 'react';
import SEOHead from '../components/SEOHead';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { apiRequest } from '../utils/apiClient';
import useOnlineStatus from '../hooks/useOnlineStatus';
import PhoneInput from '../components/PhoneInput';
import CountrySelect from '../components/CountrySelect';

export default function Checkout({ user, openAuthModal }) {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { currency, shippingRates, sessionToken, formatCurrency } = useLocalization();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const paymentLockRef = useRef(false); // useRef lock for double-submit prevention
  const { isOnline } = useOnlineStatus();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [country, setCountry] = useState('India');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.fullName) setFullName(data.fullName);
            if (data.email) setEmail(data.email);
            if (data.phone) setPhone(data.phone);
            if (data.organization) setOrganization(data.organization);
            if (data.country) setCountry(data.country);
            if (data.address) setAddress(data.address);
            if (data.city) setCity(data.city);
            if (data.pinCode) setPinCode(data.pinCode);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const subtotal = (cartItems || []).reduce((total, item) => total + (item.price * item.quantity), 0);
  
  let shippingCost = 0;
  if (subtotal > 0) {
    shippingCost = shippingRates?.[shippingMethod] || 0;
  }

  const gst = currency === 'INR' ? Math.round(subtotal * 0.18) : 0;
  const total = subtotal + shippingCost + gst;

  const handlePaymentClick = async () => {
    // Guard: not logged in
    if (!user) {
      openAuthModal('login');
      return;
    }

    // Guard: offline
    if (!isOnline) {
      setErrorMessage('You appear to be offline. Please check your internet connection and try again.');
      return;
    }

    // Guard: form validation
    if (!fullName || !email || !phone || !address || !city || !pinCode) {
      setErrorMessage('Please fill out all required shipping details including your phone number.');
      return;
    }

    if (pinCode.length !== 6) {
      setErrorMessage('PIN Code must be exactly 6 digits.');
      return;
    }

    // Guard: useRef lock for double-submit (catches rapid clicks before React state updates)
    if (paymentLockRef.current) return;
    paymentLockRef.current = true;
    setIsPlacingOrder(true);
    setErrorMessage('');

    // Generate idempotency key for this checkout session
    const idempotencyKey = crypto.randomUUID();

    try {
      // 1. Create order on Python backend via apiClient (with timeout + stale-token retry)
      const orderData = await apiRequest('/api/create-order', {
        method: 'POST',
        body: JSON.stringify({ cartItems, shippingMethod, currency }),
        headers: { 'Idempotency-Key': idempotencyKey, 'X-Session-Token': sessionToken },
        timeout: 20000
      });

      if (!orderData.id) {
        throw { code: 'ORDER_MISSING_ID', message: 'Server returned an order without an ID. Please try again.' };
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Anthem Enzyme",
        description: "Order Checkout",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const firestoreOrderData = {
              userId: user.uid,
              customerName: fullName,
              customerEmail: email,
              invoiceId: "INV-" + Math.floor(100000 + Math.random() * 900000),
              shippingDetails: { fullName, email, phone, organization, address, city, pinCode, country },
              shippingMethod,
              currency,
              products: cartItems, // tracking pages expect 'products', not 'items'
              totals: { subtotal, shippingCost, gst, total },
              createdAt: new Date().toISOString()
            };

            // 3. Verify Payment & Save to DB via Backend
            const verifyData = await apiRequest('/api/verify-payment', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_data: firestoreOrderData
              }),
              timeout: 20000
            });

            if (verifyData.success) {
              try {
                await updateDoc(doc(db, 'users', user.uid), {
                  address,
                  city,
                  pinCode,
                  phone,
                  organization,
                  country
                });
              } catch (e) {
                console.error("Failed to update user profile with latest shipping details:", e);
              }
              clearCart();
              setTimeout(() => {
                navigate('/invoice', { 
                  state: { 
                    orderData: firestoreOrderData, 
                    paymentId: response.razorpay_payment_id 
                  } 
                });
              }, 600);
            } else {
              throw { code: 'VERIFY_FAILED', message: 'Payment verification failed. Please contact support.' };
            }
          } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage(error.message || 'An error occurred during payment verification. Contact support with your payment ID.');
          } finally {
            setIsPlacingOrder(false);
            paymentLockRef.current = false;
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone
        },
        theme: {
          color: "#1A4BDB"
        },
        modal: {
          ondismiss: function() {
            setIsPlacingOrder(false);
            paymentLockRef.current = false;
            setErrorMessage('Payment was cancelled. You can try again when ready.');
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        const errorDesc = response.error?.description || 'Payment failed.';
        const errorCode = response.error?.code || 'UNKNOWN';
        
        // Distinguish network failures from card declines
        if (errorCode === 'BAD_REQUEST_ERROR') {
          setErrorMessage(`Payment could not be processed: ${errorDesc}`);
        } else if (errorCode === 'GATEWAY_ERROR') {
          setErrorMessage('The payment gateway is experiencing issues. Please try again in a few minutes.');
        } else {
          setErrorMessage(`Payment failed: ${errorDesc}`);
        }
        
        setIsPlacingOrder(false);
        paymentLockRef.current = false;
      });
      rzp1.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      
      // Map structured errors from apiClient to user-friendly messages
      if (err.code === 'TIMEOUT') {
        setErrorMessage('The server is taking too long. Please wait a moment and try again.');
      } else if (err.code === 'NETWORK_ERROR') {
        setErrorMessage(`Cannot reach the server. Please check your internet connection. Details: ${err.message}`);
      } else {
        setErrorMessage(err.message || 'There was an error processing your payment. Please try again.');
      }
      
      setIsPlacingOrder(false);
      paymentLockRef.current = false;
    }
  };

  return (
    <>
      <SEOHead title="Checkout" noIndex={true} />
    <div className="min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Offline Banner */}
        {!isOnline && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠</span>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              You are currently offline. Payment processing requires an active internet connection.
            </p>
          </div>
        )}

        {/* Error Message Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-red-100 dark:border-red-900/30 max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notice</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[15px] mb-6">
                {errorMessage}
              </p>
              <button 
                onClick={() => setErrorMessage('')} 
                className="w-full py-3 bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium rounded-lg transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        )}

        {/* Success Message Modal */}
        {successMessage && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-green-100 dark:border-green-900/30 max-w-md w-full p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 text-xl font-bold">✓</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Success</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[15px] mb-6">
                {successMessage}
              </p>
              <button 
                onClick={() => {
                  setSuccessMessage('');
                  navigate('/');
                }} 
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isPlacingOrder && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-center">Processing your payment...</p>
              <p className="text-xs text-slate-400 text-center">Please do not close this window.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column - Forms */}
          <div className="flex-grow space-y-8">
            
            {/* Shipping Details */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 transition-colors duration-300">
              <h2 className="text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-8">
                Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dr. Jane Smith" className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@org.com" className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Phone</label>
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Organization</label>
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Lab / Institution" className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, building, floor" className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">PIN Code</label>
                  <input 
                    type="text" 
                    value={pinCode} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 6) setPinCode(val);
                    }} 
                    placeholder="560001" 
                    className="w-full px-4 py-3 bg-[#f8f9fa] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-2">Country</label>
                  <CountrySelect value={country} onChange={setCountry} />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 transition-colors duration-300">
              <h2 className="text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-8">
                Shipping Method
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-blue-500 bg-[#EDF2FE] dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Standard (3-5 days)</div>
                    <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(shippingRates?.standard || 0)} · Regular cold-chain delivery</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-blue-500 bg-[#EDF2FE] dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Express (1-2 days)</div>
                    <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(shippingRates?.express || 0)} · Priority cold-chain delivery</div>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${shippingMethod === 'dry_ice' ? 'border-blue-500 bg-[#EDF2FE] dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="dry_ice"
                    checked={shippingMethod === 'dry_ice'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Dry Ice (Frozen Enzymes)</div>
                    <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(shippingRates?.dry_ice || 0)} · For temperature-sensitive products</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/cart" className="w-1/3 flex items-center justify-center py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-[15px]">
                &larr; Back to Cart
              </Link>
              <button onClick={handlePaymentClick} disabled={isPlacingOrder} className="flex-grow py-4 bg-[#1A4BDB] text-white rounded-sm hover:bg-blue-700 transition-colors font-medium text-[15px] shadow-sm disabled:opacity-70">
                {isPlacingOrder ? 'Processing...' : 'Place Order \u2192'}
              </button>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0 lg:pt-0 pt-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 transition-colors duration-300 sticky top-24">
              <h3 className="text-[13px] font-bold tracking-[0.1em] text-slate-900 dark:text-white uppercase mb-6">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-8">
                {(cartItems || []).map((item) => (
                  <div key={`${item.id}-${item.unitId}`} className="flex gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4 last:border-0 transition-colors duration-300">
                    <div className="w-16 h-16 bg-[#f8f9fa] dark:bg-slate-800 rounded-md flex items-center justify-center p-1 flex-shrink-0">
                      <img src="/assets/enterokinease-vial.jpeg" alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-grow flex justify-between">
                      <div>
                        <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{item.unitLabel} · Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-[14px] text-slate-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                  <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600 dark:text-slate-400">GST {currency === 'INR' ? '(18%)' : ''}</span>
                  <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(gst)}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center transition-colors duration-300">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="font-bold text-[18px] text-slate-900 dark:text-white">{formatCurrency(total)}</span>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}
