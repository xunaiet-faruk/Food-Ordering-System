import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingBag, FaCalendarAlt, 
  FaTruck, FaClock, FaCheckCircle, FaTimes, 
  FaCreditCard, FaTrashAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Useaxios from '../../Hooks/Useaxios';
import useAuth from '../../Hooks/Useauth';

const OrderList = () => {
  const navigate = useNavigate();
  const axiosPublic = Useaxios();
  const { user } = useAuth();
  
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userEmail = user?.email;

  useEffect(() => {
    if (userEmail) {
      axiosPublic.get(`/orders/${userEmail}`)
        .then((response) => {
          let orders = response.data?.data || response.data || [];
          if (!Array.isArray(orders)) orders = [];
          
          if (orders.length === 0) {
            axiosPublic.get(`/cart/${userEmail}`)
              .then((cartResponse) => {
                const cartData = cartResponse.data?.data;
                if (cartData && cartData.items && cartData.items.length > 0) {
                  const cartOrder = {
                    _id: "cart-order-001",
                    email: userEmail,
                    items: cartData.items,
                    total: cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0) + 2,
                    status: "Pending",
                    createdAt: cartData.createdAt || new Date().toISOString(),
                    isCartOrder: true
                  };
                  setOrdersData([cartOrder]);
                } else {
                  setOrdersData([]);
                }
                setLoading(false);
              })
              .catch(() => {
                setOrdersData([]);
                setLoading(false);
              });
          } else {
            setOrdersData(orders);
            setLoading(false);
          }
        })
        .catch(() => {
          setOrdersData([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userEmail, axiosPublic]);

  const extractOrderId = (order) => {
    if (order._id?.$oid) return order._id.$oid;
    if (typeof order._id === 'string') return order._id;
    if (order.id) return order.id;
    return null;
  };

  const extractItemId = (item) => {
    if (item._id?.$oid) return item._id.$oid;
    if (typeof item._id === 'string') return item._id;
    if (item.id) return item.id;
    return null;
  };

  // ১টি করে প্রোডাক্ট কমানো বা ডিলিট করার অপ্টিমাইজড লজিক
  const handleDeleteItem = (order, item) => {
    const orderId = extractOrderId(order);
    const itemId = extractItemId(item);
    const hasMoreThanOne = item.quantity > 1;
    
    // Cart Order এর জন্য ফ্রন্টএন্ড লজিক
    if (order.isCartOrder) {
      Swal.fire({
        title: hasMoreThanOne ? 'Reduce Quantity?' : 'Remove Item?',
        text: hasMoreThanOne ? `Do you want to reduce 1 quantity of ${item.name}?` : `Do you want to remove ${item.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E11D48',
        cancelButtonColor: '#9CA3AF',
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          setOrdersData(prev => 
            prev.map(o => {
              if (o.isCartOrder) {
                let updatedItems;
                if (hasMoreThanOne) {
                  updatedItems = o.items.map(i => extractItemId(i) === itemId ? { ...i, quantity: i.quantity - 1 } : i);
                } else {
                  updatedItems = o.items.filter(i => extractItemId(i) !== itemId);
                }
                const newTotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0) + 2;
                return { ...o, items: updatedItems, total: newTotal };
              }
              return o;
            }).filter(o => o.items.length > 0)
          );
        }
      });
      return;
    }

    if (!orderId || !itemId) return;

    Swal.fire({
      title: hasMoreThanOne ? 'Reduce Quantity?' : 'Remove Item?',
      text: hasMoreThanOne ? `Remove 1 quantity of ${item.name} from this order?` : `Remove ${item.name} from this order?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(itemId);
        
        // ১ এর বেশি থাকলে ব্যাকএন্ডের PUT/PATCH রাউটে রিকোয়েস্ট যাবে কমানোর জন্য, না হলে DELETE রাউটে যাবে
        const apiCall = hasMoreThanOne 
          ? axiosPublic.put(`/orders/${orderId}/item/${itemId}/decrease`) 
          : axiosPublic.delete(`/orders/${orderId}/item/${itemId}`);

        apiCall.then((res) => {
          setDeletingId(null);
          if (res.data?.success || res.status === 200) {
            if (res.data?.orderEmpty) {
              setOrdersData(prev => prev.filter(o => extractOrderId(o) !== orderId));
            } else {
              setOrdersData(prev => 
                prev.map(o => {
                  if (extractOrderId(o) === orderId) {
                    let updatedItems;
                    if (hasMoreThanOne) {
                      updatedItems = o.items.map(i => extractItemId(i) === itemId ? { ...i, quantity: i.quantity - 1 } : i);
                    } else {
                      updatedItems = o.items.filter(i => extractItemId(i) !== itemId);
                    }
                    const newTotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0) + (o.deliveryFee || 0);
                    return { ...o, items: updatedItems, total: newTotal };
                  }
                  return o;
                }).filter(o => o.items && o.items.length > 0)
              );
            }
            
            Swal.fire({ icon: 'success', title: 'Updated!', timer: 1000, showConfirmButton: false });
          }
        }).catch(() => setDeletingId(null));
      }
    });
  };

  const handlePayOrder = (orderId, amount) => {
    Swal.fire({
      icon: 'success',
      title: 'Proceeding to Payment',
      text: `Order #${orderId.slice(-6).toUpperCase()} - Amount: $${amount.toFixed(2)}`,
      confirmButtonColor: '#FF6B35',
      confirmButtonText: 'Pay Now'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      "Delivered": <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold"><FaCheckCircle/> Delivered</div>,
      "Preparing": <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold"><FaClock/> Preparing</div>,
      "On the way": <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold"><FaTruck/> On the way</div>,
      "Cancelled": <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-semibold"><FaTimes/> Cancelled</div>
    };
    return badges[status] || <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold"><FaClock/> {status}</div>;
  };
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/100?text=Food";
  };

 

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 md:py-1 max-w-4xl'>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Order <span className="text-[#FF6B35]">History</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage items and complete your pending payments seamlessly.</p>
      </div>

      {ordersData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaShoppingBag className="text-5xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No Orders Available</h3>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {ordersData.map((order, index) => {
              const orderId = extractOrderId(order) || `order-${index}`;
              const orderStatus = order.status || "Pending";
              const orderTotal = order.total || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={orderId.toString()}
                  className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="bg-gray-50/60 px-5 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Reference</span>
                      <p className="text-sm font-black text-gray-800">#{orderId.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      {orderStatus !== "Pending" && getStatusBadge(orderStatus)}
                      {orderStatus === "Pending" && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-bold">Unpaid</span>
                      )}
                    </div>
                  </div>

                  {/* Card Items */}
                  <div className="px-5 divide-y divide-gray-50">
                    {order.items?.map((item, idx) => {
                      const itemId = extractItemId(item);
                      const isItemDeleting = deletingId === itemId;

                      return (
                        <div key={idx} className={`flex items-center gap-4 py-4 ${isItemDeleting ? 'opacity-40' : ''}`}>
                          <img src={item.image} alt={item.name} onError={handleImageError} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-2xs" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                            <p className="text-xs text-gray-400 font-medium">{item.category} • ${item.price?.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-black text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">x{item.quantity}</span>
                            <button
                              onClick={() => handleDeleteItem(order, item)}
                              disabled={isItemDeleting}
                              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                            >
                              <FaTrashAlt className="text-sm" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer with Awesome Pay Button */}
                  <div className="bg-gray-50/30 px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-gray-400 font-medium block">Total Payable</span>
                      <p className="text-xl font-black text-gray-900">${orderTotal.toFixed(2)}</p>
                    </div>
                    
                    {orderStatus === "Pending" && (
                      <button
                        onClick={() => handlePayOrder(orderId.toString(), orderTotal)}
                        className="flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e85e2b] text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(255,107,53,0.2)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.35)]"
                      >
                        <FaCreditCard /> Pay Now
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderList;