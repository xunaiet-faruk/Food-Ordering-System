import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaCalendarAlt, FaEye, FaTrash, 
  FaUsers, FaUserShield, FaUserCog, FaSpinner, FaLock
} from 'react-icons/fa';
import Useaxios from '../../Hooks/Useaxios';

const CustomerDetails = () => {
  const axiosPublic = Useaxios();
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [currentUser, setCurrentUser] = useState({
    email: "admin@gmail.com", 
    role: "Admin" 
  });

  useEffect(() => {
    const userRole = currentUser?.role?.toLowerCase();
    if (userRole === 'admin') {
      fetchCustomers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get('/users');
      console.log("API Response:", response.data);
      
      if (response.data && response.data.data) {
        setCustomersData(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCustomersData(response.data);
      } else {
        setCustomersData([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load customers!',
        confirmButtonColor: '#FF6B35'
      });
      setCustomersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (customer) => {
    const customerId = customer._id || customer.id;
    if (!customerId) return;

    const result = await Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${customer.name || 'this user'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        const response = await axiosPublic.delete(`/users/${customerId}`);
        if (response.data.success || response.data.deletedCount > 0) {
          setCustomersData(prev => prev.filter(c => (c._id || c.id) !== customerId));
          setShowDetails(false);
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Delete Failed!', text: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdateRole = async (customer) => {
    const customerId = customer._id || customer.id;
    if (!customerId) return;

    const newRole = customer.role === "Admin" ? "Customer" : "Admin";
    
    const result = await Swal.fire({
      title: 'Update Role?',
      text: `Change ${customer.name || 'User'}'s role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Update!'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        const updatedData = { ...customer, role: newRole };
        const response = await axiosPublic.put(`/users/${customerId}`, updatedData);

        if (response.data.success || response.data.modifiedCount > 0) {
          setCustomersData(prev => prev.map(c => (c._id || c.id) === customerId ? { ...c, role: newRole } : c));
          if (selectedCustomer) setSelectedCustomer({ ...selectedCustomer, role: newRole });
          Swal.fire({ icon: 'success', title: 'Role Updated!', timer: 1500, showConfirmButton: false });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Update Failed!', text: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const userRole = currentUser?.role?.toLowerCase();
  
  if (userRole !== 'admin') {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md text-center shadow-xl flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4 shadow-sm border border-rose-100">
            <FaLock size={28} />
          </div>
          <h2 className="text-xl font-black text-gray-900">Access Denied</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Oops! You do not have permission to view this page. This area is reserved strictly for system Administrators.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-md"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  // কালার হেল্পার
  const getStatusColor = (status) => status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200";
  const getRoleColor = (role) => role === "Admin" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200";

  // লোডিং স্ক্রিন
  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ৫. অ্যাডমিন হলে আসল ড্যাশবোর্ড কন্টেন্ট রেন্ডার হবে
  const stats = {
    total: customersData.length,
    active: customersData.filter(c => c.status === "Active").length,
    inactive: customersData.filter(c => c.status === "Inactive").length,
    admins: customersData.filter(c => c.role === "Admin").length,
  };

  return (
    <div className="w-full min-h-full px-4 max-w-7xl mx-auto mb-10">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaUsers className="text-[#FF6B35]" />
            Customer Details
            <span className="text-xs sm:text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {customersData.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage and view all customer information</p>
        </div>
      </div>

  

      {/* কাস্টমার লিস্ট */}
      <div className="mt-6 space-y-3">
        {customersData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl">👤</span>
            <p className="text-gray-400 font-bold mt-3">No customers found</p>
          </div>
        ) : (
          customersData.map((customer, index) => (
            <div key={customer._id || customer.id || index} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                  {customer.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{customer.name || "Unknown"}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate mt-0.5">
                    <FaEnvelope size={8} /> {customer.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:flex lg:items-center lg:gap-10 text-left">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Phone</p>
                  <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{customer.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Role</p>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleColor(customer.role)}`}>
                      {customer.role || "Customer"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Status</p>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(customer.status)}`}>
                      {customer.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex items-center justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                <button onClick={() => { setSelectedCustomer(customer); setShowDetails(true); }} className="p-2 rounded-xl bg-gray-50 border text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-all">
                  <FaEye size={12} />
                </button>
                <button onClick={() => handleUpdateRole(customer)} className="p-2 rounded-xl bg-gray-50 border text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all">
                  <FaUserCog size={12} />
                </button>
                <button onClick={() => handleDeleteUser(customer)} className="p-2 rounded-xl bg-gray-50 border text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ডিটেইলস মোডাল */}
      <AnimatePresence>
        {showDetails && selectedCustomer && (
          <>
            <div onClick={() => setShowDetails(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center text-white font-black">{selectedCustomer.name?.charAt(0) || "U"}</div>
                    <div>
                      <h2 className="text-base font-black text-gray-900">{selectedCustomer.name || "Unknown"}</h2>
                      <p className="text-[10px] text-gray-400">{selectedCustomer._id || selectedCustomer.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-[#FF6B35] text-xl font-bold">×</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Contact Information</p>
                    <div className="space-y-2.5 text-xs text-gray-700">
                      <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400" size={12} /> <span className="font-semibold">{selectedCustomer.email || "N/A"}</span></p>
                      <p className="flex items-center gap-2"><FaPhone className="text-gray-400" size={12} /> <span className="font-semibold">{selectedCustomer.phone || "N/A"}</span></p>
                      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" size={12} /> <span className="font-semibold">{selectedCustomer.address || "N/A"}</span></p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Account Details</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">System Role</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleColor(selectedCustomer.role)}`}>{selectedCustomer.role || "Customer"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Account Status</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(selectedCustomer.status)}`}>{selectedCustomer.status || "Active"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t bg-gray-50 shrink-0 flex gap-2">
                  <button onClick={() => setShowDetails(false)} className="flex-1 py-2 rounded-xl bg-white border text-gray-600 font-bold text-xs hover:bg-gray-100">Close</button>
                  <button onClick={() => handleUpdateRole(selectedCustomer)} className="flex-1 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-600 flex items-center justify-center gap-1.5"><FaUserCog size={12} /> Change Role</button>
                  <button onClick={() => handleDeleteUser(selectedCustomer)} className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 flex items-center justify-center gap-1.5"><FaTrash size={12} /> Delete User</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDetails;