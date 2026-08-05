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
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE}/api/admin/pricing`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPricingData(data);
        } else {
          setMessage({ type: 'error', text: 'Failed to load pricing data.' });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <SEOHead title="Manage Pricing" noIndex={true} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Pricing</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Update product prices and shipping rates for INR and USD.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !pricingData}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-slate-900"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {pricingData && (
          <div className="space-y-8">
            {/* Prices Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Product Prices</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* INR Prices */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-6 h-4 bg-orange-500 rounded-sm inline-block"></span> INR (₹)
                  </h3>
                  {Object.keys(pricingData.prices.INR).map(qty => (
                    <div key={`inr-${qty}`}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{qty} Units</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <input
                          type="number"
                          value={pricingData.prices.INR[qty]}
                          onChange={(e) => handlePriceChange('INR', 'prices', qty, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* USD Prices */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-6 h-4 bg-blue-600 rounded-sm inline-block"></span> USD ($)
                  </h3>
                  {Object.keys(pricingData.prices.USD).map(qty => (
                    <div key={`usd-${qty}`}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{qty} Units</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={pricingData.prices.USD[qty]}
                          onChange={(e) => handlePriceChange('USD', 'prices', qty, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Rates Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Rates</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* INR Shipping */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">INR (₹)</h3>
                  {Object.keys(pricingData.shipping.INR).map(method => (
                    <div key={`inr-ship-${method}`}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{method.replace('_', ' ')}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                        <input
                          type="number"
                          value={pricingData.shipping.INR[method]}
                          onChange={(e) => handlePriceChange('INR', 'shipping', method, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* USD Shipping */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">USD ($)</h3>
                  {Object.keys(pricingData.shipping.USD).map(method => (
                    <div key={`usd-ship-${method}`}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{method.replace('_', ' ')}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={pricingData.shipping.USD[method]}
                          onChange={(e) => handlePriceChange('USD', 'shipping', method, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
