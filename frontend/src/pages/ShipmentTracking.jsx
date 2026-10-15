import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Check, ArrowLeft, Package, Truck, Home, X } from 'lucide-react';

export default function ShipmentTracking({ user }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [animatedHeight, setAnimatedHeight] = useState(0);

  useEffect(() => {
    if (selectedOrder) {
      setAnimatedHeight(0);
      const targetHeight = getStatusIndex(selectedOrder.status) === STATUS_STAGES.length - 1 
        ? 100 
        : ((getStatusIndex(selectedOrder.status) + 1) / (STATUS_STAGES.length - 1)) * 100;
        
      const timer = setTimeout(() => {
        setAnimatedHeight(targetHeight);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOrder]);

  // Security check: only logged-in users can view this page
  if (!user) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Query orders belonging to the logged-in user
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = [];
      querySnapshot.forEach((docSnap) => {
        fetchedOrders.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by newest first
      fetchedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };



  const STATUS_STAGES = [
    { label: "Order Placed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Out for Delivery", icon: Truck },
    { label: "Delivered", icon: Home }
  ];

  const getDisplayStatus = (status) => {
    if (!status || status === 'paid' || status === 'pending') return 'Order Placed';
    return status;
  };

  const getStatusIndex = (status) => {
    const index = STATUS_STAGES.findIndex(stage => stage.label === getDisplayStatus(status));
    return Math.max(0, index);
  };

  return (
    <>
      <SEOHead title="Shipment Tracking" noIndex={true} />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-300 mb-4 sm:mb-8">
          Shipment Tracking
        </h1>

        {selectedOrder ? (
          /* Timeline View */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={() => {
                  setSelectedOrder(null);
                  setAnimatedHeight(0);
                }}
                className="flex items-center text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Back to Orders
              </button>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Invoice ID</p>
                <p className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{selectedOrder.invoiceId || selectedOrder.shipmentId || selectedOrder.id.slice(0,8)}</p>
              </div>
            </div>

            <div className="p-5 sm:p-8 md:p-12">
              <div className="mb-8 sm:mb-12">
                <h2 className={`text-xl sm:text-2xl font-bold ${selectedOrder.status === 'Cancelled' ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400'}`}>
                  {selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : selectedOrder.status === 'Delivered' ? 'Delivered' : `Arriving soon`}
                </h2>
                <div className="mt-4 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden p-1">
                    <img 
                      src="/assets/enterokinease-vial.jpeg" 
                      alt="Product" 
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex flex-col justify-center py-0.5">
                    {selectedOrder.products?.map((p, i) => (
                      <div key={i} className="mb-1.5 last:mb-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{p.quantity}x {p.name}</p>
                        {p.unitLabel && (
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.unitLabel}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'Cancelled' ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 sm:p-8 text-center mt-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <X size={28} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Shipment Cancelled</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">This order has been cancelled and will not be delivered. If you have been charged, a refund will be initiated.</p>
                </div>
              ) : (
                <>
                  {/* Visual Timeline */}
                  <div className="relative pl-2 sm:pl-8">
                    {/* Vertical Line Track */}
                    <div className="absolute left-[0.9rem] sm:left-[2.4rem] top-2 bottom-6 w-1 bg-slate-200 dark:bg-slate-800 z-0 overflow-hidden rounded-full">
                      <div 
                        className="absolute left-0 top-0 w-full bg-teal-500 transition-all duration-1000 ease-out"
                        style={{ height: `${animatedHeight}%` }}
                      ></div>
                    </div>

                    <div className="space-y-8 sm:space-y-12 relative z-10">
                      {STATUS_STAGES.map((stage, index) => {
                        const currentIndex = getStatusIndex(selectedOrder.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div key={stage.label} className="flex items-start gap-4 sm:gap-6 group">
                            <div className={`w-6 h-6 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                              isCompleted 
                                ? 'bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.15)]' 
                                : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700'
                            }`}>
                              {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div>
                              <p className={`font-bold transition-colors duration-300 text-sm sm:text-base ${isCurrent ? 'text-slate-900 dark:text-white text-base sm:text-lg' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                {stage.label}
                              </p>
                              {index === 0 && (
                                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                                  {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Cancel Button */}
                  {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                      <Link 
                        to="/contact"
                        state={{ subject: 'Request for Cancellation' }}
                        className="w-full sm:w-auto text-center px-6 py-3 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
                      >
                        Request for Cancellation
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Order List View */
          <div>
            <div className="py-2">
              {loading ? (
                <div className="flex justify-center py-12 text-slate-500 dark:text-slate-400">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-900 dark:text-white font-bold text-lg mb-2">No orders found</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                            Order {order.invoiceId || order.shipmentId || order.id.slice(0, 8)}
                          </p>
                          <div className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base mb-1">
                            {order.products?.map((p, i) => (
                              <span key={i}>
                                {p.quantity}x {p.name}
                                {i < order.products.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Status: <span className="font-bold text-teal-600 dark:text-teal-400">{getDisplayStatus(order.status)}</span>
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all whitespace-nowrap shadow-sm w-full sm:w-auto text-center"
                          >
                            View Shipment
                          </button>
                          <button 
                            onClick={() => navigate('/invoice', { state: { orderData: order, paymentId: order.paymentId || 'N/A' } })}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all whitespace-nowrap shadow-sm w-full sm:w-auto text-center"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
