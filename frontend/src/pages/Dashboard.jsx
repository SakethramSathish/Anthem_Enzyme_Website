import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, deleteField, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AlertCircle, X, Search, Trash2, Package, User, MapPin, Truck, ArrowLeft, FileSpreadsheet } from 'lucide-react';

export default function Dashboard({ user, userData }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Admin Dashboard States
  const [adminSubTab, setAdminSubTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
  const [customerPage, setCustomerPage] = useState(1);

  // Admin Orders States
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderPage, setOrderPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const uniqueCountries = [...new Set(customers.map(c => c.country).filter(Boolean))].sort();

  useEffect(() => {
    if (userData?.role === 'Admin' && activeTab === 'admin') {
      fetchCustomers();
      fetchOrders();
    }
  }, [userData, activeTab]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const custs = [];
      querySnapshot.forEach((docSnap) => {
        custs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCustomers(custs);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, 'orders'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = [];
      querySnapshot.forEach((docSnap) => {
        fetchedOrders.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort by newest first
      fetchedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(fetchedOrders);
      
      // Update selected order if it's currently open
      if (selectedOrder) {
        const updated = fetchedOrders.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const executeStatusChange = async () => {
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        const updatedOrders = orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order);
        setOrders(updatedOrders);
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Failed to update status. Please check your connection.");
      }
    };

    if (newStatus === 'Cancelled') {
      setConfirmModal({
        isOpen: true,
        title: 'Cancel Shipment',
        message: 'WARNING: Are you sure you want to cancel this shipment? This action will halt delivery.',
        type: 'warning',
        onConfirm: executeStatusChange
      });
      return;
    }
    
    executeStatusChange();
  };

  const STATUS_OPTIONS = [
    "Order Placed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const getDisplayStatus = (status) => {
    if (!status || status === 'paid' || status === 'pending') return 'Order Placed';
    return status;
  };

  const handleUpdateRole = (userId, userEmail, newRole) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Role Change',
      message: `Are you sure you want to change ${userEmail}'s role to ${newRole}?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          // 1. Update Firestore user document
          await updateDoc(doc(db, 'users', userId), { role: newRole });

          // 2. Synchronize Firebase Auth custom claims via backend API
          try {
            if (user) {
              const token = await user.getIdToken();
              const claimRole = newRole.toLowerCase() === 'admin' ? 'admin' : 'user';
              const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
              await fetch(`${API_BASE}/api/admin/set-claim`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  target_uid: userId,
                  role: claimRole
                })
              });
            }
          } catch (claimErr) {
            console.warn("Could not sync custom claim via API:", claimErr);
          }

          // 3. If updating current logged in user, refresh token immediately
          if (user && user.uid === userId) {
            try {
              await user.getIdToken(true);
            } catch (refErr) {
              console.warn("Could not force-refresh token for updated user:", refErr);
            }
          }

          setCustomers(customers.map(c => c.id === userId ? { ...c, role: newRole } : c));
        } catch (err) {
          console.error("Error updating user role:", err);
          alert(`Failed to change role to ${newRole}.`);
        }
      }
    });
  };

  const handleDeleteUser = (userId, userEmail) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: `WARNING: Are you sure you want to permanently delete the user ${userEmail}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'users', userId));
          setCustomers(customers.filter(c => c.id !== userId));
        } catch (err) {
          console.error("Error deleting user:", err);
          alert(`Failed to delete user ${userEmail}.`);
        }
      }
    });
  };

  const handleDeleteOrder = (orderId, invoiceId) => {
    const executeDelete = async () => {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        setOrders(orders.filter(o => o.id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
        setConfirmModal({
          isOpen: true,
          title: 'Error',
          message: `Failed to delete order ${invoiceId || orderId.slice(0, 8)}. Please try again.`,
          type: 'danger',
          onConfirm: null
        });
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Order',
      message: `WARNING: Are you sure you want to permanently delete order ${invoiceId || orderId.slice(0, 8)}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        // Short delay to allow the first modal to transition out smoothly before showing the second
        setTimeout(() => {
          setConfirmModal({
            isOpen: true,
            title: 'Final Confirmation',
            message: 'Are you absolutely sure?',
            type: 'danger',
            onConfirm: executeDelete
          });
        }, 100);
      }
    });
  };

  const exportCustomersToExcel = () => {
    if (customers.length === 0) return;
    
    const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Organization', 'Phone', 'Country'];
    const rows = customers.map(c => [
      c.id || '',
      `"${c.fullName || ''}"`,
      `"${c.email || ''}"`,
      c.role || 'Customer',
      `"${c.organization || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.country || ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Customers_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOrdersToExcel = () => {
    if (orders.length === 0) return;
    
    const headers = ['Order ID', 'Invoice ID', 'Customer Name', 'Customer Email', 'Status', 'Payment ID', 'Shipping Method', 'Date Created', 'Total Amount'];
    const rows = orders.map(o => [
      `"${o.id || ''}"`,
      `"${o.invoiceId || o.shipmentId || ''}"`,
      `"${o.customerName || o.shippingDetails?.fullName || ''}"`,
      `"${o.customerEmail || o.shippingDetails?.email || ''}"`,
      `"${o.status || 'Order Placed'}"`,
      `"${o.paymentId || ''}"`,
      `"${o.shippingMethod || ''}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.totals?.total || o.totalAmount || ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = (c.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (c.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'All' ? true : (c.role || 'Customer') === roleFilter;
    const matchesCountry = countryFilter === 'All' ? true : c.country === countryFilter;
    return matchesSearch && matchesRole && matchesCountry;
  });

  useEffect(() => {
    setCustomerPage(1);
  }, [searchQuery, roleFilter, countryFilter]);

  const totalCustomerPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((customerPage - 1) * itemsPerPage, customerPage * itemsPerPage);

  const totalOrderPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((orderPage - 1) * itemsPerPage, orderPage * itemsPerPage);

  const renderPagination = (currentPage, totalPages, onPageChange) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return (
      <div className="flex justify-end items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-b-lg border-t border-slate-200 dark:border-slate-800 gap-1 sm:gap-2">
        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2 hidden sm:inline">
          Page {currentPage} of {totalPages}
        </span>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1.5 min-w-[32px] text-sm font-medium rounded-md transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : page === '...'
                ? 'text-slate-400 cursor-default'
                : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {page === totalPages && totalPages > 5 ? 'End' : page}
          </button>
        ))}
      </div>
    );
  };

  const handleEditClick = () => {
    setEditForm({
      fullName: userData?.fullName || user.displayName || '',
      organization: userData?.organization || '',
      phone: userData?.phone || '',
      country: userData?.country || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), editForm);
      window.location.reload(); // Reload to fetch fresh user data
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSavingProfile(false);
      setIsEditing(false);
    }
  };

  // If the user is not logged in, redirect them to the home page
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <SEOHead title="Dashboard" noIndex={true} />
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[#F8F9FA] dark:bg-slate-950 transition-colors duration-300 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white mb-4 sm:mb-8 tracking-tight transition-colors duration-300">
          Dashboard
        </h1>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300 overflow-hidden">
          
          {/* Tabs for Admins */}
          {userData?.role === 'Admin' && (
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex-1 sm:flex-initial px-4 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.05em] uppercase transition-colors text-center ${activeTab === 'account' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                My Account
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`flex-1 sm:flex-initial px-4 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.05em] uppercase transition-colors text-center ${activeTab === 'admin' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Admin Portal
              </button>
            </div>
          )}

          <div className="p-4 sm:p-8">
            {activeTab === 'account' ? (
              <>
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl sm:text-2xl font-bold uppercase shadow-sm">
                    {user.email ? user.email.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{userData?.fullName || user.displayName || 'User'}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    {userData?.role && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-md border border-blue-200 dark:border-blue-800">
                        {userData.role}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs sm:text-sm font-bold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase">Account Details</h3>
                      {!isEditing ? (
                        <button onClick={handleEditClick} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
                          Edit Details
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => setIsEditing(false)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleSaveProfile} disabled={savingProfile} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                            {savingProfile ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Full Name</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{userData?.fullName || user.displayName || 'Not specified'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Email</p>
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">User ID</p>
                          <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white truncate">{userData?.customUserId || user.uid}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Organization</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{userData?.organization || 'Not specified'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Phone Number</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{userData?.phone || 'Not specified'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Country</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{userData?.country || 'Not specified'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                          <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Cannot be changed)</label>
                          <input type="text" value={user.email} disabled className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-500 dark:text-slate-500 cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization</label>
                          <input type="text" value={editForm.organization} onChange={(e) => setEditForm({...editForm, organization: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                          <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                          <input type="text" value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Admin Sub-tabs */}
                <div className="flex gap-2 sm:gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <button
                    onClick={() => setAdminSubTab('customers')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-[0.05em] uppercase transition-colors ${adminSubTab === 'customers' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    Customers
                  </button>
                  <button
                    onClick={() => { setAdminSubTab('orders'); setSelectedOrder(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-[0.05em] uppercase transition-colors ${adminSubTab === 'orders' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    Orders
                  </button>
                </div>

                {adminSubTab === 'customers' && (
                  <div>
                    {/* Customer Toolbar */}
                    <div className="space-y-3 mb-6">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <h3 className="text-xs sm:text-sm font-bold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">Customer Directory</h3>
                          <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCustomerPage(1); setOrderPage(1); }}
                            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                          </select>
                        </div>
                        <button
                          onClick={exportCustomersToExcel}
                          title="Export to Excel"
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800/50 rounded-xl text-sm font-bold transition-colors shadow-sm"
                        >
                          <FileSpreadsheet size={16} />
                          <span>Export Excel</span>
                        </button>
                      </div>

                      {/* Filters and Search Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="relative sm:col-span-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder="Search customer..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <select
                          value={countryFilter}
                          onChange={(e) => setCountryFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="All">All Countries</option>
                          {uniqueCountries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="All">All Roles</option>
                          <option value="Customer">Customers</option>
                          <option value="Admin">Admins</option>
                        </select>
                      </div>
                    </div>

                    {loadingCustomers ? (
                      <div className="flex justify-center py-12 text-slate-500 dark:text-slate-400">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : filteredCustomers.length === 0 ? (
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 sm:p-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No customers found.</p>
                      </div>
                    ) : (
                      <>
                        {/* Mobile Customer Cards (< md) */}
                        <div className="block md:hidden space-y-3">
                          {paginatedCustomers.map(c => (
                            <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{c.fullName || 'Unknown'}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{c.email}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md flex-shrink-0 ${c.role === 'Admin' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'}`}>
                                  {c.role || 'Customer'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                                <div>
                                  <span className="text-slate-400 block">Org:</span>
                                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{c.organization || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">Country:</span>
                                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{c.country || '—'}</span>
                                </div>
                                {c.phone && (
                                  <div className="col-span-2">
                                    <span className="text-slate-400 block">Phone:</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.phone}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                {c.role === 'Admin' ? (
                                  <button
                                    onClick={() => handleUpdateRole(c.id, c.email, 'Customer')}
                                    disabled={c.id === user.uid}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors text-center ${c.id === user.uid ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'}`}
                                  >
                                    Make Customer
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateRole(c.id, c.email, 'Admin')}
                                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-blue-200 dark:border-blue-800/40 text-center"
                                  >
                                    Make Admin
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUser(c.id, c.email)}
                                  disabled={c.id === user.uid}
                                  title="Delete User"
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${c.id === user.uid ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/40'}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop Customer Table (>= md) */}
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                              <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Organization</th>
                                <th className="px-6 py-4 font-semibold">Phone</th>
                                <th className="px-6 py-4 font-semibold">Country</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                              {paginatedCustomers.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.fullName || 'Unknown'}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${c.role === 'Admin' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                                      {c.role || 'Customer'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">{c.email}</td>
                                  <td className="px-6 py-4">{c.organization || '-'}</td>
                                  <td className="px-6 py-4">{c.phone || '-'}</td>
                                  <td className="px-6 py-4">{c.country || '-'}</td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {c.role === 'Admin' ? (
                                        <button
                                          onClick={() => handleUpdateRole(c.id, c.email, 'Customer')}
                                          disabled={c.id === user.uid}
                                          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${c.id === user.uid ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400'}`}
                                        >
                                          Make Customer
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleUpdateRole(c.id, c.email, 'Admin')}
                                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                                        >
                                          Make Admin
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteUser(c.id, c.email)}
                                        disabled={c.id === user.uid}
                                        title="Delete User"
                                        className={`p-1.5 rounded transition-colors ${c.id === user.uid ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {renderPagination(customerPage, totalCustomerPages, setCustomerPage)}
                      </>
                    )}
                  </div>
                )}

                {adminSubTab === 'orders' && (
                  <div>
                    {selectedOrder ? (
                      /* Detailed View */
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300 overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                          <button 
                            onClick={() => setSelectedOrder(null)}
                            className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Orders
                          </button>
                          <div className="text-right">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Invoice ID</p>
                            <p className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{selectedOrder.invoiceId || selectedOrder.shipmentId || selectedOrder.id.slice(0,8)}</p>
                          </div>
                        </div>

                        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Customer Details */}
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-3 mb-3">
                                <User size={18} className="text-teal-600 dark:text-teal-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Customer Details</h3>
                              </div>
                              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                <p><span className="font-semibold text-slate-900 dark:text-white">Name:</span> {selectedOrder.shippingDetails?.fullName || selectedOrder.customerName || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-900 dark:text-white">Email:</span> {selectedOrder.shippingDetails?.email || selectedOrder.customerEmail || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-900 dark:text-white">Phone:</span> {selectedOrder.shippingDetails?.phone || 'N/A'}</p>
                                {selectedOrder.shippingDetails?.organization && (
                                  <p><span className="font-semibold text-slate-900 dark:text-white">Organization:</span> {selectedOrder.shippingDetails.organization}</p>
                                )}
                              </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-3 mb-3">
                                <MapPin size={18} className="text-teal-600 dark:text-teal-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Shipping Address</h3>
                              </div>
                              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                <p>{selectedOrder.shippingDetails?.address || 'N/A'}</p>
                                <p>{selectedOrder.shippingDetails?.city || 'N/A'} - {selectedOrder.shippingDetails?.pinCode || 'N/A'}</p>
                                <p>{selectedOrder.shippingDetails?.country || 'N/A'}</p>
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                  <p><span className="font-semibold text-slate-900 dark:text-white">Delivery Option:</span> {selectedOrder.shippingMethod || 'Standard Delivery'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contents */}
                          <div className="bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                              <Package size={18} className="text-teal-600 dark:text-teal-400" />
                              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Order Contents</h3>
                            </div>
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                              {selectedOrder.products?.map((p, i) => (
                                <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-1">
                                      <img 
                                        src="/assets/enterokinease-vial.jpeg" 
                                        alt="Product" 
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                                      {p.unitLabel && (
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.unitLabel}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    Qty: {p.quantity}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Update */}
                          {selectedOrder.status !== 'Cancelled' ? (
                            <div className="bg-teal-50 dark:bg-teal-900/10 p-4 sm:p-6 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                              <div className="flex items-center gap-3 mb-3">
                                <Truck size={18} className="text-teal-600 dark:text-teal-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Update Delivery Status</h3>
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="flex-grow">
                                  <label className="sr-only">Delivery Status</label>
                                  <select
                                    value={getDisplayStatus(selectedOrder.status)}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 shadow-sm cursor-pointer transition-colors"
                                  >
                                    {STATUS_OPTIONS.map(status => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                                  Changes save automatically.
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 sm:p-6 rounded-2xl border border-red-200 dark:border-red-900/30">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                  <X size={20} className="text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                  <h3 className="text-sm sm:text-base font-bold text-red-800 dark:text-red-300">Order: Cancelled</h3>
                                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-0.5">This shipment has been cancelled by the customer. No further delivery actions are required.</p>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ) : (
                      /* List View */
                      <div>
                        <div className="py-2">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3">
                            <div className="flex items-center justify-between sm:justify-start gap-3">
                              <h3 className="text-xs sm:text-sm font-bold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">Orders Directory</h3>
                              <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCustomerPage(1); setOrderPage(1); }}
                                className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={exportOrdersToExcel}
                                title="Export to Excel"
                                className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800/50 rounded-xl text-sm font-bold transition-colors shadow-sm"
                              >
                                <FileSpreadsheet size={16} />
                                <span>Export Excel</span>
                              </button>
                              <button onClick={fetchOrders} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium">
                                Refresh
                              </button>
                            </div>
                          </div>

                          {loadingOrders ? (
                            <div className="flex justify-center py-12 text-slate-500 dark:text-slate-400">
                              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                          ) : orders.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 sm:p-12 text-center">
                              <p className="text-slate-500 dark:text-slate-400 font-medium">No active orders found.</p>
                              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">When customers place orders, they will appear here.</p>
                            </div>
                          ) : (
                            <>
                              {/* Mobile Orders Card Stack (< md) */}
                              <div className="block md:hidden space-y-3">
                                {paginatedOrders.map(order => {
                                  const displayStatus = getDisplayStatus(order.status);
                                  const isCancelled = displayStatus === 'Cancelled';
                                  const isDelivered = displayStatus === 'Delivered';
                                  const colorClass = isCancelled 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : isDelivered
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
                                  const canDelete = displayStatus === 'Order Placed' || displayStatus === 'Cancelled';

                                  return (
                                    <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                            {order.invoiceId || order.shipmentId || order.id.slice(0, 8)}
                                          </div>
                                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                          </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                                          {displayStatus}
                                        </span>
                                      </div>

                                      <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-slate-400">Customer: </span>
                                        <span className="font-medium text-slate-900 dark:text-white">{order.customerName || 'Unknown'}</span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                          onClick={() => setSelectedOrder(order)}
                                          className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-xl transition-colors shadow-sm text-center"
                                        >
                                          Shipment
                                        </button>
                                        <button
                                          onClick={() => navigate('/invoice', { state: { orderData: order, paymentId: order.paymentId || 'N/A' } })}
                                          className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-colors shadow-sm text-center"
                                        >
                                          Invoice
                                        </button>
                                      </div>

                                      {canDelete && (
                                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                                          <button
                                            onClick={() => handleDeleteOrder(order.id, order.invoiceId)}
                                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium py-1"
                                          >
                                            <Trash2 size={14} />
                                            <span>Delete Order Record</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Desktop Orders Table (>= md) */}
                              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                      <th className="px-6 py-4 font-semibold">Invoice ID</th>
                                      <th className="px-6 py-4 font-semibold">Customer</th>
                                      <th className="px-6 py-4 font-semibold">Current Status</th>
                                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {paginatedOrders.map(order => (
                                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                          <div className="font-mono font-medium text-slate-900 dark:text-white">{order.invoiceId || order.shipmentId || order.id.slice(0, 8)}</div>
                                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="font-medium text-slate-900 dark:text-white">{order.customerName || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                          {(() => {
                                            const displayStatus = getDisplayStatus(order.status);
                                            const isCancelled = displayStatus === 'Cancelled';
                                            const isDelivered = displayStatus === 'Delivered';
                                            const colorClass = isCancelled 
                                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                              : isDelivered
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
                                            
                                            return (
                                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                                                {displayStatus}
                                              </span>
                                            );
                                          })()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                            <button
                                              onClick={() => setSelectedOrder(order)}
                                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg transition-colors shadow-sm"
                                            >
                                              View Shipment
                                            </button>
                                            <button
                                              onClick={() => navigate('/invoice', { state: { orderData: order, paymentId: order.paymentId || 'N/A' } })}
                                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
                                            >
                                              View Invoice
                                            </button>
                                            {(() => {
                                              const displayStatus = getDisplayStatus(order.status);
                                              const canDelete = displayStatus === 'Order Placed' || displayStatus === 'Cancelled';
                                              return (
                                                <button
                                                  onClick={() => canDelete && handleDeleteOrder(order.id, order.invoiceId)}
                                                  disabled={!canDelete}
                                                  title={canDelete ? "Delete Order" : "Cannot delete active shipments"}
                                                  className={`p-1.5 ml-2 rounded transition-colors ${!canDelete ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                                                >
                                                  <Trash2 size={16} />
                                                </button>
                                              );
                                            })()}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {renderPagination(orderPage, totalOrderPages, setOrderPage)}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{confirmModal.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {confirmModal.message}
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                  }}
                  className={`flex-1 py-3 text-white font-bold rounded-lg transition-colors shadow-sm ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}
