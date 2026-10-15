import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import SEOHead from '../components/SEOHead';
import { Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminPricing() {
  const { user } = useAuth();
  const [pricingData, setPricingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        // Force refresh ID token so newly granted admin claims are immediately acquired
        const token = await user.getIdToken(true);
        const response = await fetch(`${API_BASE}/api/admin/pricing`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPricingData(data);
        } else {
          const errData = await response.json().catch(() => null);
          const errMsg = errData?.detail || 'Failed to load pricing data.';
          setMessage({ type: 'error', text: errMsg });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Error connecting to server.' });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchPricing();
    }
  }, [user, API_BASE]);

  const handlePriceChange = (currency, category, key, value) => {
    setPricingData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [currency]: {
          ...prev[category][currency],
          [key]: Number(value)
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE}/api/admin/pricing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pricingData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Pricing saved successfully. It will take effect on next session load.' });
      } else {
        const err = await response.json();
        setMessage({ type: 'error', text: err.detail || 'Failed to save pricing.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving pricing to server.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 transition-colors">
      <SEOHead title="Manage Pricing" noIndex={true} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Pricing</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">Update product prices and shipping rates for INR and USD.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !pricingData}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-slate-900 w-full sm:w-auto"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-xs sm:text-sm font-medium">{message.text}</p>
          </div>
        )}

        {pricingData && (
          <div className="space-y-6 sm:space-y-8">
            {/* Prices Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Product Prices</h2>
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* INR Prices */}
                <div className="space-y-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-2">
                    <span className="w-5 h-3.5 bg-orange-500 rounded-sm inline-block shadow-sm"></span> INR (₹)
                  </h3>
                  {Object.keys(pricingData.prices.INR).map(qty => (
                    <div key={`inr-${qty}`}>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{qty} Units</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                        <input
                          type="number"
                          value={pricingData.prices.INR[qty]}
                          onChange={(e) => handlePriceChange('INR', 'prices', qty, e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* USD Prices */}
                <div className="space-y-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-4 flex items-center gap-2">
                    <span className="w-5 h-3.5 bg-blue-600 rounded-sm inline-block shadow-sm"></span> USD ($)
                  </h3>
                  {Object.keys(pricingData.prices.USD).map(qty => (
                    <div key={`usd-${qty}`}>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{qty} Units</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                        <input
                          type="number"
                          value={pricingData.prices.USD[qty]}
                          onChange={(e) => handlePriceChange('USD', 'prices', qty, e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Rates Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Shipping Rates</h2>
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* INR Shipping */}
                <div className="space-y-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-4">INR (₹)</h3>
                  {Object.keys(pricingData.shipping.INR).map(method => (
                    <div key={`inr-ship-${method}`}>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{method.replace('_', ' ')}</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                        <input
                          type="number"
                          value={pricingData.shipping.INR[method]}
                          onChange={(e) => handlePriceChange('INR', 'shipping', method, e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* USD Shipping */}
                <div className="space-y-3.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 sm:mb-4">USD ($)</h3>
                  {Object.keys(pricingData.shipping.USD).map(method => (
                    <div key={`usd-ship-${method}`}>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{method.replace('_', ' ')}</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                        <input
                          type="number"
                          value={pricingData.shipping.USD[method]}
                          onChange={(e) => handlePriceChange('USD', 'shipping', method, e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
