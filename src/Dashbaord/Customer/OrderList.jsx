import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingBag, FaClock, FaCreditCard, 
  FaTrashAlt, FaCheckCircle
} from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
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
  const [cartItems, setCartItems] = useState([]);

  const userEmail = user?.email;

  const fetchData = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      const [ordersResponse, cartResponse] = await Promise.all([
        axiosPublic.get(`/orders/${userEmail}`),
        axiosPublic.get(`/cart/${userEmail}`)
      ]);
      
      let orders = ordersResponse.data?.data || ordersResponse.data || [];
      if (!Array.isArray(orders)) orders = [];
      
      const cartData = cartResponse.data?.data;
      const cartItemsData = cartData?.items || [];
      
      setCartItems(cartItemsData);
      
      
      const pendingOrders = orders.filter(o => 
        o.status === 'Pending' || 
        o.status === 'pending'
      );
      
      setOrdersData(pendingOrders);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOrdersData([]);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userEmail]);

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


  const updateCart = async (updatedItems) => {
    try {
      await axiosPublic.post('/cart', { email: userEmail, items: updatedItems });
      setCartItems(updatedItems);
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const handleDeleteItem = (order, item) => {
    const orderId = extractOrderId(order);
    const itemId = extractItemId(item);
    const hasMoreThanOne = item.quantity > 1;

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
      }).then(async (result) => {
        if (result.isConfirmed) {
          let updatedItems;
          if (hasMoreThanOne) {
            updatedItems = cartItems.map(i => 
              extractItemId(i) === itemId ? { ...i, quantity: i.quantity - 1 } : i
            ).filter(i => i.quantity > 0);
          } else {
            updatedItems = cartItems.filter(i => extractItemId(i) !== itemId);
          }
          
          const success = await updateCart(updatedItems);
          if (success) {
            Swal.fire({ icon: 'success', title: 'Updated!', timer: 1000, showConfirmButton: false });
          }
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

  const handlePayOrder = async (order, amount) => {
    try {
      if (!amount || isNaN(parseFloat(amount))) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Invalid Amount', 
          text: 'Payment amount is not valid!' 
        });
        return;
      }

      Swal.fire({
        title: 'Processing Payment...',
        text: 'Please wait while we redirect you to PayHere',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      let realOrderId;

      if (order.isCartOrder) {
        console.log('📝 Creating real order from cart...');
        const newOrder = {
          email: user?.email,
          customerName: user?.displayName || 'Customer',
          phone: user?.phone || 'N/A',
          address: 'N/A',
          items: order.items,
          subtotal: order.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          deliveryFee: 2,
          total: amount,
          status: 'Pending',
          paymentMethod: 'PayHere',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          const res = await axiosPublic.post('/orders', newOrder);
          realOrderId = res.data?.data?.insertedId;
          
          if (!realOrderId) {
            throw new Error('Order creation failed - no ID returned');
          }
          
          console.log('✅ Real order created with ID:', realOrderId);
     
          await updateCart([]);
          await fetchData();
          
        } catch (createError) {
          console.error('❌ Order creation error:', createError);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Order Creation Failed',
            text: 'Could not create order. Please try again.',
            confirmButtonColor: '#FF6B35'
          });
          return;
        }
      } else {
        realOrderId = extractOrderId(order);
        if (!realOrderId) {
          throw new Error('Invalid order ID');
        }
      }

      const orderIdParam = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem('pending_order_id', orderIdParam);
      localStorage.setItem('pending_real_order_id', realOrderId);

      const paymentData = {
        orderId: orderIdParam,
        realOrderId: realOrderId,
        amount: parseFloat(amount),
        customerName: user?.displayName || 'Customer User',
        customerEmail: user?.email || 'customer@example.com',
        customerPhone: user?.phone || '0771234567'
      };

      console.log('📤 Sending payment data:', paymentData);

      const response = await fetch('https://food-ordering-system-server-five.vercel.app/create-payment-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Swal.close();

      if (data.success && data.params) {
        const oldForm = document.getElementById('payhere-payment-form');
        if (oldForm) oldForm.remove();

        const form = document.createElement('form');
        form.id = 'payhere-payment-form';
        form.method = 'POST';
        form.action = data.payhereUrl;
        form.target = '_self';

        Object.keys(data.params).forEach(key => {
          if (data.params[key] !== undefined && data.params[key] !== null) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data.params[key].toString();
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      localStorage.removeItem('pending_order_id');
      localStorage.removeItem('pending_real_order_id');
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: error.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#FF6B35'
      });
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/100?text=Food";
  };

  const renderCartItems = () => {
    if (cartItems.length === 0) return null;
    
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-amber-200 border-l-4 border-l-amber-500 overflow-hidden mb-6"
      >
        <div className="bg-amber-50/60 px-5 py-4 border-b border-amber-100 flex justify-between items-center">
          <div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">🛒 Current Cart</span>
            <p className="text-sm font-black text-gray-800">Items in your cart</p>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-md text-xs font-bold">
            {cartItems.length} items
          </span>
        </div>

        <div className="px-5 divide-y divide-gray-50">
          {cartItems.map((item, idx) => {
            const itemId = extractItemId(item);
            
            return (
              <div key={idx} className="flex items-center gap-4 py-4">
                <img src={item.image} alt={item.name} onError={handleImageError} className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-2xs" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">{item.category} • ${item.price?.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">x{item.quantity}</span>
                  <button
                    onClick={() => {
                      const cartOrder = {
                        _id: 'cart-order-temp',
                        isCartOrder: true,
                        items: cartItems
                      };
                      handleDeleteItem(cartOrder, item);
                    }}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50/30 px-5 py-4 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Cart Total</span>
            <p className="text-xl font-black text-gray-900">${cartTotal.toFixed(2)}</p>
          </div>
          
          <button
            onClick={() => {
              const cartOrder = {
                _id: 'cart-order-temp',
                isCartOrder: true,
                items: cartItems,
                total: cartTotal,
                status: 'Pending'
              };
              handlePayOrder(cartOrder, cartTotal);
            }}
            className="flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e85e2b] text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(255,107,53,0.2)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.35)]"
          >
            <FaCreditCard /> Pay Now for Cart
          </button>
        </div>
      </motion.div>
    );
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
    <div className='container mx-auto px-4 py-8 md:py-6 max-w-4xl'>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          My <span className="text-[#FF6B35]">Orders</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">View and manage your pending orders.</p>
      </div>

      {renderCartItems()}

      {ordersData.length === 0 && cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaShoppingBag className="text-5xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No Orders Available</h3>
          <p className="text-gray-400 text-sm mt-2">Add items to your cart and place an order!</p>
        </div>
      ) : ordersData.length === 0 && cartItems.length > 0 ? (
        <div className="">
        
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {ordersData.map((order, index) => {
              const orderId = extractOrderId(order) || `order-${index}`;
              const orderTotal = order.total || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={orderId.toString()}
                  className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-amber-200 border-l-4 border-l-amber-500 overflow-hidden"
                >
                  <div className="bg-amber-50/60 px-5 py-4 border-b border-amber-100 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Reference</span>
                      <p className="text-sm font-black text-gray-800">
                        #{orderId.toString().slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold">
                      <FaClock /> Pending
                    </div>
                  </div>

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

                  <div className="bg-amber-50/30 px-5 py-4 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-gray-400 font-medium block">Total Payable</span>
                      <p className="text-xl font-black text-gray-900">${orderTotal.toFixed(2)}</p>
                    </div>
                    
                    <button
                      onClick={() => handlePayOrder(order, orderTotal)}
                      className="flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e85e2b] text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(255,107,53,0.2)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.35)]"
                    >
                      <FaCreditCard /> Pay Now
                    </button>
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