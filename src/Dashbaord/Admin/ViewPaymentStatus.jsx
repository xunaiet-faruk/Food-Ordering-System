import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReceipt, FaUser, FaCalendarAlt, FaCheckCircle, 
  FaTruck, FaClock, FaTimesCircle, FaShoppingBag,
  FaMoneyBillWave, FaCreditCard
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import Useaxios from '../../Hooks/Useaxios';

const Allpayment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'paid') {
      return order.status === 'Paid' || order.status === 'paid';
    }
    if (filterStatus === 'pending') {
      return order.status === 'Pending' || order.status === 'pending';
    }
    if (filterStatus === 'delivered') {
      return order.status === 'Delivered' || order.status === 'delivered';
    }
    if (filterStatus === 'ontheway') {
      return order.status === 'On the way' || order.status === 'on the way';
    }
    if (filterStatus === 'cancelled') {
      return order.status === 'Cancelled' || order.status === 'cancelled';
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      "Pending": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
          <FaClock /> Pending
        </span>
      ),
      "Paid": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold">
          <FaCheckCircle /> Paid ✅
        </span>
      ),
      "Delivered": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
          <FaTruck /> Delivered
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

  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/100?text=Food";
  };


  const totalOrders = orders.length;
  const paidCount = orders.filter(o => o.status === 'Paid' || o.status === 'paid').length;
  const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered' || o.status === 'delivered').length;
  const onthewayCount = orders.filter(o => o.status === 'On the way' || o.status === 'on the way').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled' || o.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full p-4 sm:p-6 bg-gray-50/50">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <GiPayMoney className="text-[#FF6B35]" />
            All <span className="text-[#FF6B35]">Payments</span>
            <span className="text-sm font-bold bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full">
              {totalOrders}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">View all orders and their payment status</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({totalOrders})
        </button>
        <button
          onClick={() => setFilterStatus('paid')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'paid'
              ? 'bg-green-500 text-white shadow-md shadow-green-200'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          Paid ✅ ({paidCount})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'pending'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
          }`}
        >
          Pending ⏳ ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('ontheway')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'ontheway'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          On the way 🚚 ({onthewayCount})
        </button>
        <button
          onClick={() => setFilterStatus('delivered')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'delivered'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          Delivered 📦 ({deliveredCount})
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterStatus === 'cancelled'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
          }`}
        >
          Cancelled ❌ ({cancelledCount})
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl">📦</span>
            <p className="text-gray-400 font-bold mt-3">No Orders Found</p>
            <p className="text-xs text-gray-300 mt-1">No orders with this status</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FF6B35]/5 border-b border-[#FF6B35]/10">
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Products</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const orderId = getOrderId(order._id);
                    const grandTotal = calculateTotal(order.items);
                    const itemCount = order.items?.length || 0;

                    return (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={orderId}
                        className="hover:bg-[#FF6B35]/5 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <span className="font-bold text-gray-800 text-sm">
                            #{orderId?.slice(-8).toUpperCase()}
                          </span>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <FaReceipt size={8} /> 
                            {order.transactionId ? order.transactionId.slice(-6) : 'N/A'}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                              {order.customerName || order.email?.split('@')[0] || 'Guest'}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">
                              {order.email || 'No email'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
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
                              {itemCount > 3 && (
                                <span className="text-[9px] font-bold text-gray-400 ml-1">+{itemCount - 3}</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                              {order.items?.map(item => item.name).join(', ')}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-[#FF6B35]">
                            ${grandTotal.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <FaCreditCard size={10} className="text-gray-400" />
                              {order.paymentMethod || 'Cash'}
                            </span>
                            <p className="text-[10px] text-gray-400">
                              {order.paidAt ? formatDate(order.paidAt) : 'Not paid yet'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-[#FF6B35]/5 border-t border-[#FF6B35]/10 flex justify-between items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600">
                Showing <span className="font-bold text-[#FF6B35]">{filteredOrders.length}</span> of <span className="font-bold">{totalOrders}</span> orders
              </span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Paid: <span className="font-bold text-green-600">{paidCount}</span>
                </span>
                <span className="text-gray-600">
                  Pending: <span className="font-bold text-amber-600">{pendingCount}</span>
                </span>
                <span className="text-gray-600">
                  Total: <span className="font-bold text-[#FF6B35]">${orders.reduce((sum, o) => sum + (calculateTotal(o.items)), 0).toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allpayment;