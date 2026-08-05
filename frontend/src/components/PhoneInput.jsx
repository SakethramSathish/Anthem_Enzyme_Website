import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES } from '../utils/countries';

/**
 * PhoneInput – reusable phone field with flag + dial-code selector.
 *
 * Props:
 *   value        – controlled string (full number e.g. "+91 98765 43210")
 *   onChange     – setter receiving the new full string
 *   required     – bool
 *   inputClass   – extra Tailwind classes for the text input
 *   triggerClass – extra Tailwind classes for the dropdown trigger button
 */
export default function PhoneInput({
  value = '',
  onChange,
  required = false,
  inputClass = '',
  triggerClass = '',
}) {
  const [selected, setSelected] = useState(COUNTRIES[0]); // default India
  const [digits, setDigits]     = useState('');
  const [open, setOpen]         = useState(false);
  const [search, setSearch]     = useState('');
  const dropdownRef = useRef(null);

  // Parse an incoming value string so the component stays controlled
  useEffect(() => {
    const currentFull = digits ? `${selected.dial} ${digits}` : '';
    if (value === currentFull) return;

    if (!value) {
      setDigits('');
      return;
    }
    // Try to match a known dial code at the start
    const match = COUNTRIES.find(c => value.startsWith(c.dial));
    if (match) {
      setSelected(match);
      setDigits(value.slice(match.dial.length).trimStart());
    } else {
      setDigits(value);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notify = (country, rawDigits) => {
    const full = rawDigits ? `${country.dial} ${rawDigits}` : '';
    onChange?.(full);
  };

  const handleCountrySelect = (country) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
    notify(country, digits);
  };

  const handleDigitsChange = (e) => {
    // Allow only digits, spaces, hyphens
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    setDigits(raw);
    notify(selected, raw);
  };

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  const baseInput = 'bg-[#F8F9FA] dark:bg-slate-800 border border-[#E9ECEF] dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500';

  return (
    <div className="flex w-full" ref={dropdownRef}>
      {/* Flag + dial code trigger */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setSearch(''); }}
          className={`flex items-center gap-1.5 h-full px-3 py-3 ${baseInput} rounded-l-lg border-r-0 text-[15px] hover:bg-slate-100 dark:hover:bg-slate-700 ${triggerClass}`}
        >
          <span className="text-[18px] leading-none">{selected.flag}</span>
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 min-w-[36px]">{selected.dial}</span>
          <svg className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-[13px] bg-[#F8F9FA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none text-black dark:text-white placeholder:text-slate-400"
              />
            </div>
            {/* List */}
            <ul className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-[13px] text-slate-400">No results</li>
              ) : (
                filtered.map(c => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${selected.code === c.code ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : ''}`}
                    >
                      <span className="text-[18px]">{c.flag}</span>
                      <span className="flex-1 text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[13px]">{c.dial}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Number input */}
      <input
        type="tel"
        value={digits}
        onChange={handleDigitsChange}
        required={required}
        placeholder="98765 43210"
        className={`flex-1 px-4 py-3 ${baseInput} rounded-r-lg text-[15px] ${inputClass}`}
      />
    </div>
  );
}
