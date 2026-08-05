import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const LocalizationContext = createContext();

export const useLocalization = () => useContext(LocalizationContext);

export const LocalizationProvider = ({ children }) => {
  const { userData } = useAuth();
  
  const [currency, setCurrency] = useState(null);
  const [prices, setPrices] = useState(null);
  const [shippingRates, setShippingRates] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocalization = async () => {
      const fallbackCountry = userData?.country || '';
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      try {
        const response = await fetch(`${API_BASE}/api/init-session?fallback_country=${encodeURIComponent(fallbackCountry)}`);
        if (response.ok) {
          const data = await response.json();
          setCurrency(data.currency);
          setPrices(data.prices);
          setShippingRates(data.shipping);
          setSessionToken(data.sessionToken);
        } else {
          // Fallback based on user country if API fails entirely
          const isIndia = fallbackCountry.toLowerCase() === 'india';
          setCurrency(isIndia ? 'INR' : 'USD');
          setPrices(isIndia ? { "50": 180000, "100": 2700, "500": 6300, "5000": 40500 } : { "50": 2000, "100": 30, "500": 70, "5000": 450 });
          setShippingRates(isIndia ? { "standard": 500, "express": 1200, "dry_ice": 1500 } : { "standard": 10, "express": 30, "dry_ice": 40 });
        }
      } catch (error) {
        console.error("Failed to init session:", error);
        const isIndia = fallbackCountry.toLowerCase() === 'india';
        setCurrency(isIndia ? 'INR' : 'USD');
        setPrices(isIndia ? { "50": 180000, "100": 2700, "500": 6300, "5000": 40500 } : { "50": 2000, "100": 30, "500": 70, "5000": 450 });
        setShippingRates(isIndia ? { "standard": 500, "express": 1200, "dry_ice": 1500 } : { "standard": 10, "express": 30, "dry_ice": 40 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalization();
  }, [userData]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'number') return value; // e.g. "Contact Us"
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <LocalizationContext.Provider value={{ currency, prices, shippingRates, sessionToken, formatCurrency }}>
      {children}
    </LocalizationContext.Provider>
  );
};
