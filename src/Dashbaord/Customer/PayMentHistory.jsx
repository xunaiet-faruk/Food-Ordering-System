import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingBag, FaCheckCircle, FaTruck, 
  FaClock, FaTimes, FaCreditCard
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import Useaxios from '../../Hooks/Useaxios';
import useAuth from '../../Hooks/Useauth';

const PayMentHistory = () => {
  const axiosPublic = Useaxios();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  const fetchOrders = async () => {
    try {
      const response = await axiosPublic.get(`/orders/${user?.email}`);
      const allOrders = response.data?.data || [];
 
      const paidOrders = allOrders.filter(o => 
        o.status === 'Paid' || 
        o.status === 'Delivered' || 
        o.status === 'Preparing' || 
        o.status === 'On the way'
      );
      
      setOrders(paidOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      "Paid": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold">
          <GiPayMoney /> Paid
        </span>
      ),
      "Delivered": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
          <FaCheckCircle /> Delivered
        </span>
      ),
      "Preparing": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
          <FaClock /> Preparing
        </span>
      ),
      "On the way": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold">
          <FaTruck /> On the way
        </span>
      ),
      "Cancelled": (
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold">
          <FaTimes /> Cancelled
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

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
  
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Payment <span className="text-[#FF6B35]">History</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">View all your completed orders and payment status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaShoppingBag className="text-5xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No Payment History</h3>
          <p className="text-gray-400 text-sm mt-2">You haven't completed any orders yet.</p>
        </div>
      ) : (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FF6B35]/5 border-b border-[#FF6B35]/10">
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-[#FF6B35] uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const orderId = order._id?.$oid || order._id || order.id;
                  const orderTotal = order.total || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
                  const itemNames = order.items?.map(item => item.name).join(', ') || 'N/A';
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
                          #{orderId?.toString().slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 truncate max-w-[150px] md:max-w-[200px]">
                            {itemNames}
                          </span>
                          {itemCount > 1 && (
                            <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded-full font-semibold">
                              {itemCount} items
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(order.paidAt || order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FaCreditCard className="text-[#FF6B35] text-xs" />
                          <span className="text-sm text-gray-600">
                            {order.paymentMethod || 'PayHere'}
                          </span>
                          {order.transactionId && (
                            <span className="text-xs text-gray-400 ml-1">
                              (TXN: {order.transactionId.slice(-6)})
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        
          <div className="px-6 py-4 bg-[#FF6B35]/5 border-t border-[#FF6B35]/10 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total <span className="font-bold text-[#FF6B35]">{orders.length}</span> orders
            </span>
            <span className="text-sm font-bold text-gray-800">
              Total Amount: <span className="text-[#FF6B35]">${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayMentHistory;