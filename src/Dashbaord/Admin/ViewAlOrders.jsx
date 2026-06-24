import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, FaReceipt, FaUser, FaTrash, FaCalendarAlt, FaTimes,
  FaSpinner, FaClock, FaCheckCircle, FaShoppingBag, FaTruck,
  FaEdit, FaSave, FaTimesCircle
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
  const [updatingId, setUpdatingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const axiosInstance = Useaxios();

  const getOrderId = (id) => {
    if (!id) return null;
    if (typeof id === 'object' && id.$oid) return id.$oid;
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && id.toString) return id.toString();
    return String(id);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/orders');
      
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!orderId) {
      Swal.fire('Error', 'No order ID found', 'error');
      return;
    }

    setUpdatingId(orderId);
    
    try {
      const response = await axiosInstance.put(`/orders/status-update/${orderId}`, {
        status: newStatus
      });
      
      if (response.data?.success) {
        setOrders(prev => prev.map(order => {
          const orderIdStr = getOrderId(order._id);
          if (orderIdStr === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        }));
        
        if (selectedOrder) {
          const selectedId = getOrderId(selectedOrder._id);
          if (selectedId === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
          }
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Order status changed to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update status',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setUpdatingId(null);
      setEditStatus('');
    }
  };

  const handleDeleteOrder = async (order) => {
    const orderId = getOrderId(order._id);
    if (!orderId) {
      Swal.fire('Error', 'No order ID found', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Order?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to delete this order?</p>
          <p class="text-sm text-gray-500">Order ID: #${orderId.slice(-8).toUpperCase()}</p>
          <p class="text-sm text-gray-500">Customer: ${order.email}</p>
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
      setDeletingId(orderId);
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const response = await axiosInstance.delete(`/orders/${orderId}`);
        if (response.data?.success || response.status === 200) {
          setOrders(prev => prev.filter(o => getOrderId(o._id) !== orderId));
          if (selectedOrder && getOrderId(selectedOrder._id) === orderId) {
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

  const getStatusBadge = (status) => {
    const badges = {
      "Pending": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
          <FaClock /> Pending
        </span>
      ),
      "Paid": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold">
          <FaCheckCircle /> Paid
        </span>
      ),
      "Delivered": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
          <FaTruck /> Delivered
        </span>
      ),
      "Preparing": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold">
          <FaClock /> Preparing
        </span>
      ),
      "On the way": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold">
          <FaTruck /> On the way
        </span>
      ),
      "Cancelled": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold">
          <FaTimesCircle /> Cancelled
        </span>
      )
    };
    return badges[status] || (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold">
        <FaClock /> {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const statusOptions = ['On the way', 'Delivered', 'Cancelled'];

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
            All <span className="text-[#FF6B35]">Orders</span>
            <span className="text-sm font-bold bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full">
              {orders.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">View and manage all customer orders</p>
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
            <p className="text-gray-400 font-bold mt-3">No Orders Found</p>
            <p className="text-xs text-gray-300 mt-1">Orders will appear here</p>
          </div>
        ) : (
          orders.map((order, index) => {
            const orderId = getOrderId(order._id) || `order-${index}`;
            const grandTotal = calculateTotal(order.items);
            const isDeleting = deletingId === orderId;
            const isUpdating = updatingId === orderId;

            return (
              <motion.div
                key={orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-black text-[#FF6B35]">
                      #{orderId.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaCalendarAlt size={9} /> 
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {order.customerName || order.email?.split('@')[0] || 'Guest'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{order.email || 'No email'}</p>
                  </div>

                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2">
                    {isUpdating ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(orderId, editStatus)}
                          className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                          <FaSave size={10} />
                        </button>
                        <button
                          onClick={() => {
                            setUpdatingId(null);
                            setEditStatus('');
                          }}
                          className="p-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <button
                          onClick={() => {
                            setUpdatingId(orderId);
                            setEditStatus(order.status || 'On the way');
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-all"
                          title="Update Status"
                        >
                          <FaEdit size={10} />
                        </button>
                      </div>
                    )}
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

      <AnimatePresence>
        {showDetails && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            
            <div className="fixed inset-0 z-50 mt-14 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative mx-auto my-auto"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center text-xl shadow-lg transition-all"
                >
                  <FaTimes />
                </button>

                <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 p-6 pr-16">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <FaReceipt className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Order Details</h2>
                      <p className="text-white/80 text-sm">
                        #{getOrderId(selectedOrder._id)?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FaClock size={10} />
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>

                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FaUser size={12} /> Customer Email
                  </h3>
                  <p className="text-sm font-medium text-gray-800">{selectedOrder.email || 'No email provided'}</p>
                </div>

                <div className="p-6 border-b border-gray-100 max-h-60 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaShoppingBag size={12} /> Items Ordered ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
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
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex justify-between text-xl font-black text-[#FF6B35]">
                    <span>Total Amount</span>
                    <span>${(calculateTotal(selectedOrder.items) + (selectedOrder.deliveryFee || 2)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-all"
                  >
                    Close
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