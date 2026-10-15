import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES } from '../utils/countries';
import { ChevronDown } from 'lucide-react';

export default function CountrySelect({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry = COUNTRIES.find(c => c.name === value);
  const filteredCountries = COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-black dark:text-white text-[17px] cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`} width="20" alt={selectedCountry.name} className="flex-shrink-0 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
              <span className="truncate">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Select a country...</span>
          )}
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[16px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(c => (
                <div 
                  key={c.code} 
                  onClick={() => { onChange(c.name); setIsOpen(false); setSearch(''); }}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${value === c.name ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`} width="20" alt={c.name} className="flex-shrink-0 rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                  <span className="text-[16px] truncate">{c.name}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                <span className="text-2xl">🌍</span>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
