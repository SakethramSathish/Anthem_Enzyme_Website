import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Sun, Moon, Settings, ExternalLink } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

function NavBar({ user, userData, openAuthModal }) {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const products = [
    { id: 'enterokinase-a', name: 'Recombinant Enterokinase A', url: '/product/a' },
    { id: 'enterokinase-b', name: 'Recombinant Enterokinase B', url: '/product/b' }
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductSelect = (url) => {
    navigate(url);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" role="banner">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/anthem-logo.png" alt="Anthem Biosciences" className="h-8 object-contain dark:hidden" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32'%3E%3Crect width='120' height='32' fill='%23f1f5f9' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2364748b'%3ELogo Area%3C/text%3E%3C/svg%3E"; }} />
          <img src="/assets/anthem-logo-light.png" alt="Anthem Biosciences" className="h-8 object-contain hidden dark:block" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32'%3E%3Crect width='120' height='32' fill='%231e293b' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ELogo Area%3C/text%3E%3C/svg%3E"; }} />
        </Link>
        
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden py-2 z-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleProductSelect(p.url)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    {p.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  Nothing here!
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="https://www.anthembio.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>Anthem Bio</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
          </a>
          <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Products</Link>
          
          {user && (
            <Link to="/cart" className="relative flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md text-sm font-semibold transition-colors">
              <ShoppingCart className="w-4 h-4" /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Account
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
                      {userData?.fullName || user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Dashboard
                  </Link>

                  {userData?.role?.toLowerCase() === 'admin' && (
                    <Link to="/admin/pricing" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Manage Pricing
                    </Link>
                  )}
                  {userData?.role === 'Customer' && (
                    <Link to="/shipment-tracking" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Shipment Tracking
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => { signOut(auth); setIsDropdownOpen(false); }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-200 dark:border-slate-800"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => openAuthModal('login')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Login</button>
              <button onClick={() => openAuthModal('signup')} className="px-5 py-2.5 bg-[#111318] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">Sign Up</button>
            </>
          )}
          <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border-r border-slate-200 dark:border-slate-700 pr-6">Contact</Link>

          <button 
            onClick={toggleTheme} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
