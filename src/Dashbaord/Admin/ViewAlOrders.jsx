import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, FaReceipt, FaUser, FaTrash, FaCalendarAlt, FaTimes,
  FaSpinner, FaSync, FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle,
  FaShoppingBag, FaMoneyBillWave, FaTruck
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import Useaxios from '../../Hooks/Useaxios';

const ViewAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const axiosInstance = Useaxios();

  const getOrderId = (id) => {
    if (!id) return null;
    if (typeof id === 'object' && id.$oid) return id.$oid;
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && id.toString) return id.toString();
    return String(id);
  };

  const getItemId = (item) => {
    if (!item) return null;
    if (item._id) {
      if (typeof item._id === 'object' && item._id.$oid) return item._id.$oid;
      if (typeof item._id === 'string') return item._id;
      if (typeof item._id === 'object' && item._id.toString) return item._id.toString();
    }
    if (item.id) return String(item.id);
    return null;
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching orders from API...");
      const response = await axiosInstance.get('/cart');
      console.log("📦 Full API Response:", response);
      
      let ordersData = [];
      
      if (response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.success && response.data.data) {
          ordersData = response.data.data;
        } else {
          for (let key in response.data) {
            if (Array.isArray(response.data[key])) {
              ordersData = response.data[key];
              break;
            }
          }
        }
      }
      
      ordersData = ordersData.map(order => ({
        ...order,
        _id: typeof order._id === 'object' && order._id.$oid ? order._id.$oid : order._id,
        items: Array.isArray(order.items) ? order.items.map(item => ({
          ...item,
          _id: typeof item._id === 'object' && item._id.$oid ? item._id.$oid : item._id
        })) : []
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError(error.message || "Failed to load orders");
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to load orders',
        confirmButtonColor: '#FF6B35'
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (order) => {
    const email = order.email;
    if (!email) {
      Swal.fire('Error', 'No email found for this order', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Order?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to delete this order?</p>
          <p class="text-sm text-gray-500">Customer: ${email}</p>
          <p class="text-sm text-gray-500">Items: ${order.items?.length || 0}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setDeletingId(email);
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const response = await axiosInstance.delete(`/cart/${encodeURIComponent(email)}`);
        if (response.data?.success || response.status === 200) {
          setOrders(prev => prev.filter(o => o.email !== email));
          if (selectedOrder && selectedOrder.email === email) {
            setShowDetails(false);
          }
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Order deleted successfully',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          throw new Error(response.data?.message || 'Delete failed');
        }
      } catch (error) {
        Swal.close();
        console.error("Delete error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || 'Failed to delete order',
          confirmButtonColor: '#FF6B35'
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteItem = async (order, item) => {
    const email = order.email;
    const itemId = getItemId(item);
    
    if (!email || !itemId) {
      Swal.fire('Error', 'Invalid IDs', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Remove Item?',
      text: `Do you want to remove "${item.name}" from this order?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Removing...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const response = await axiosInstance.delete(
          `/cart/${encodeURIComponent(email)}/item/${itemId}`
        );
        
        if (response.data?.success) {
          if (response.data.cartEmpty || response.data.itemsCount === 0) {
            setOrders(prev => prev.filter(o => o.email !== email));
            setShowDetails(false);
          } else {
            setOrders(prev => prev.map(o => {
              if (o.email === email) {
                return {
                  ...o,
                  items: o.items.filter(i => getItemId(i) !== itemId)
                };
              }
              return o;
            }));
            setSelectedOrder(prev => ({
              ...prev,
              items: prev.items.filter(i => getItemId(i) !== itemId)
            }));
          }
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: 'Item removed successfully',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          throw new Error(response.data?.message || 'Remove failed');
        }
      } catch (error) {
        Swal.close();
        console.error("Item delete error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message || 'Failed to remove item',
          confirmButtonColor: '#FF6B35'
        });
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowDetails(false);
    document.body.style.overflow = 'auto';
  };

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/100?text=Food";
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 sm:p-6 bg-gray-50/50">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaReceipt className="text-[#FF6B35]" />
            All Orders
            <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {orders.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage and track all customer orders</p>
        </div>
       
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl">📦</span>
            <p className="text-gray-400 font-bold mt-3">No orders found in database</p>
            <p className="text-xs text-gray-300 mt-1">Orders will appear here once customers place them</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-6 py-2 bg-[#FF6B35] text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          orders.map((order, index) => {
            const email = order.email || `order-${index}`;
            const grandTotal = calculateTotal(order.items);
            const isDeleting = deletingId === email;

            return (
              <motion.div
                key={email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  <div className="md:col-span-3">
                    <p className="text-sm font-black text-gray-900 truncate">
                      {email.split('@')[0] || 'Guest'}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaCalendarAlt size={9} /> 
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="md:col-span-4">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {order.customerName || email.split('@')[0] || 'Guest'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{email || 'No email'}</p>
                  </div>

                  <div className="md:col-span-3">
                    <div className="flex items-center gap-1">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            onError={handleImageError}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-[9px] font-bold text-gray-400 ml-1">+{order.items.length - 3}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {order.items?.reduce((acc, i) => acc + (i.quantity || 0), 0) || 0} items
                    </p>
                  </div>

                  <div className="md:col-span-1 text-left md:text-right">
                    <p className="text-sm font-black text-[#FF6B35]">${grandTotal.toFixed(2)}</p>
                  </div>

                  <div className="md:col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-all"
                    >
                      <FaEye size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order)}
                      disabled={isDeleting}
                      className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal - Fixed positioning with cancel button */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            
            {/* Modal Container - Centered */}
            <div className="fixed inset-0 z-50 mt-14 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative mx-auto my-auto"
              >
                {/* Close Button - Top Right */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center text-xl shadow-lg transition-all"
                >
                  <FaTimes />
                </button>

                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 p-6 pr-16">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <FaReceipt className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Order Details</h2>
                      <p className="text-white/80 text-sm">
                        {selectedOrder.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Status Badge */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaCheckCircle size={10} /> {selectedOrder.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaClock size={10} />
                    <span>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaUser size={12} /> Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FaUser className="text-gray-400" size={14} />
                      <span className="font-medium text-gray-800">{selectedOrder.customerName || selectedOrder.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-gray-400" size={14} />
                      <span className="text-gray-600">{selectedOrder.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                      <span className="text-gray-600">{selectedOrder.address || 'No address provided'}</span>
                    </div>
                    {selectedOrder.deliveryNote && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <span className="text-gray-400">📝</span>
                        <span className="text-gray-500 text-xs italic">"{selectedOrder.deliveryNote}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 border-b border-gray-100 max-h-60 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaShoppingBag size={12} /> Items Ordered ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => {
                      const itemId = getItemId(item);
                      return (
                        <motion.div
                          key={itemId || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              onError={handleImageError}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity || 0} × ${item.price || 0}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-black text-[#FF6B35]">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </p>
                            <button 
                              onClick={() => handleDeleteItem(selectedOrder, item)}
                              className="text-gray-300 hover:text-rose-500 transition-all p-1 hover:bg-rose-50 rounded-lg"
                              title="Remove item"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-gray-700">${calculateTotal(selectedOrder.items).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <FaTruck size={12} /> Delivery Fee
                      </span>
                      <span className="font-bold text-gray-700">$2.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <FaMoneyBillWave size={12} /> Payment Method
                      </span>
                      <span className="font-bold text-gray-700 capitalize">{selectedOrder.paymentMethod || 'Cash'}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-[#FF6B35] pt-2 border-t border-orange-200">
                      <span>Total Amount</span>
                      <span>${(calculateTotal(selectedOrder.items) + 2).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions - with Cancel button */}
                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      closeModal();
                      handleDeleteOrder(selectedOrder);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FaTrash size={14} /> Delete Order
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ViewAllOrders;