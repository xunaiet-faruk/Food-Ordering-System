import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaShoppingCart, FaPlus, FaMinus, FaTrash, FaCreditCard,
  FaMapMarkerAlt, FaPhone, FaUser, FaClock, FaCheckCircle,
  FaUtensils, FaArrowRight, FaStar, FaEye
} from 'react-icons/fa';
import Useaxios from '../../Hooks/Useaxios';
import useAuth from '../../Hooks/Useauth';

const PlaceAndOrder = () => {
  const navigate = useNavigate();
  const axiosPublic = Useaxios();
  const { user } = useAuth();
  
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(true);
  const [orderStep, setOrderStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryNote: "",
    paymentMethod: "cash"
  });

  const userEmail = user?.email;

  useEffect(() => {
    axiosPublic.get('/foods')
      .then((response) => {
        const data = response.data?.data || response.data || [];
        const formattedData = data.map(item => ({
          ...item,
          _id: item._id || item.id,
          category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "Unknown",
          rating: item.rating || (4 + Math.random() * 0.9).toFixed(1),
          prepTime: item.prepTime || `${Math.floor(5 + Math.random() * 25)} mins`,
          quantity: 0
        }));
        setFoodItems(formattedData);
        setLoading(false);
      })
      .catch(() => {
        setFoodItems([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userEmail) {
      axiosPublic.get(`/cart/${userEmail}`)
        .then((response) => {
          const cartData = response.data?.data;
          if (cartData && cartData.items && cartData.items.length > 0) {
            // Ensure cart items have _id
            const itemsWithId = cartData.items.map(item => ({
              ...item,
              _id: item._id || item.id || `item-${Math.random().toString(36).substr(2, 9)}`
            }));
            setCart(itemsWithId);
          }
        })
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [userEmail]);

  const saveCartToDB = async (updatedCart) => {
    if (!userEmail) return;
    try {
      await axiosPublic.post('/cart', {
        email: userEmail,
        items: updatedCart
      });
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      let updatedCart;
      if (existing) {
        updatedCart = prev.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Ensure item has _id
        const itemWithId = {
          ...item,
          _id: item._id || `item-${Math.random().toString(36).substr(2, 9)}`
        };
        updatedCart = [...prev, { ...itemWithId, quantity: 1 }];
      }
      saveCartToDB(updatedCart);
      
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${item.name} added to your cart.`,
        timer: 1500,
        showConfirmButton: false
      });
      
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === itemId);
      let updatedCart;
      if (existing && existing.quantity > 1) {
        updatedCart = prev.map(i => 
          i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        updatedCart = prev.filter(i => i._id !== itemId);
      }
      saveCartToDB(updatedCart);
      return updatedCart;
    });
  };

  const deleteFromCart = (itemId) => {
    setCart(prev => {
      const updatedCart = prev.filter(i => i._id !== itemId);
      saveCartToDB(updatedCart);
      return updatedCart;
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is Empty!',
        text: 'Please add items to your cart first.',
        confirmButtonColor: '#FF6B35'
      });
      return;
    }
    if (!formData.name || !formData.phone || !formData.address) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields!',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#FF6B35'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure each item in cart has a proper _id
      const itemsWithId = cart.map(item => ({
        ...item,
        _id: item._id || `item-${Math.random().toString(36).substr(2, 9)}`,
        // Ensure other required fields exist
        price: item.price || 0,
        quantity: item.quantity || 1,
        name: item.name || 'Unknown Item',
        image: item.image || 'https://via.placeholder.com/100?text=Food'
      }));

      const orderData = {
        email: userEmail,
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        deliveryNote: formData.deliveryNote,
        paymentMethod: formData.paymentMethod,
        items: itemsWithId,
        subtotal: cartTotal,
        deliveryFee: 2.00,
        total: cartTotal + 2,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      console.log("📦 Sending order data:", JSON.stringify(orderData, null, 2));

      const response = await axiosPublic.post('/orders', orderData);
      console.log("✅ Order response:", response.data);

      if (response.data.success) {
        // Clear cart after successful order
        await saveCartToDB([]);
        setCart([]);
        setOrderStep(3);
        
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been placed successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data?.message || 'Order placement failed');
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed!',
        text: error.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setOrderStep(1);
    setFormData({
      name: "",
      phone: "",
      address: "",
      deliveryNote: "",
      paymentMethod: "cash"
    });
  };

  const categories = ["All", "Burger", "Pizza", "Cake", "Sides"];
  const filteredItems = foodItems.filter(item => {
    return selectedCategory === "All" || (item.category && item.category === selectedCategory);
  });

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400' viewBox='0 0 500 400'%3E%3Crect width='500' height='400' fill='%23f3f4f6'/%3E%3Ctext x='250' y='190' font-family='Arial' font-size='20' fill='%239ca3af' text-anchor='middle'%3E🍽️ Food%3C/text%3E%3Ctext x='250' y='220' font-family='Arial' font-size='14' fill='%23d1d5db' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER;
    e.target.onerror = null;
  };

  const handleViewDetails = (itemId) => {
    navigate(`/food/${itemId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (orderStep === 3) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl border border-gray-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-green-500 text-4xl" />
          </motion.div>
          <h2 className="text-2xl font-black text-gray-900">Order Confirmed! 🎉</h2>
          <p className="text-sm text-gray-400 mt-2">
            Thank you for your order! We'll deliver it to you shortly.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-left space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Summary</p>
            <div className="flex justify-between text-sm font-bold text-gray-700">
              <span>Total Items:</span>
              <span>{cartItemsCount}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#FF6B35]">
              <span>Total Amount:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Delivery to:</span>
              <span>{formData.address}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Order Again
            </button>
            <button
              onClick={resetOrder}
              className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              New Order
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full container mx-auto relative">
      
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FaShoppingCart className="text-[#FF6B35]" />
            Place Your Order
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Select your favorite items and customize your order
          </p>
        </div>
        
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
        >
          <FaShoppingCart size={16} />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-black">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-6">
        
        <div className="lg:col-span-5 space-y-6">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-orange-500/10"
                    : "bg-white border-gray-100 text-gray-500 hover:text-gray-800 hover:border-gray-200"
                }`}
              >
                {cat === "All" ? "🍽️ All" : 
                 cat === "Burger" ? "🍔 Burger" :
                 cat === "Pizza" ? "🍕 Pizza" :
                 cat === "Cake" ? "🎂 Cake" : "🍟 Sides"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex gap-3">
                  <div 
                    className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetails(item._id)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        {item.category}
                      </span>
                      <span className="text-[9px] text-gray-300">•</span>
                      <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
                        <FaStar size={8} /> {item.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{item.recipe}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-black text-[#FF6B35]">${(item.price || 0).toFixed(2)}</span>
                      
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(item._id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold transition-all flex items-center gap-1 border border-blue-100"
                          title="View Details"
                        >
                          <FaEye size={10} /> View
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(item)}
                          className="px-2.5 py-1 rounded-lg bg-[#FF6B35] hover:bg-orange-600 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <FaPlus size={8} /> Add
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl">🍽️</span>
              <p className="text-gray-400 font-bold mt-2">No items in this category</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {orderStep === 2 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderStep(1)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-10 z-50 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl mx-auto overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">Checkout</h2>
                <button
                  onClick={() => setOrderStep(1)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Summary</p>
                <div className="mt-2 space-y-1">
                  {cart.map((item) => (
                    <div key={item._id || item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-bold text-gray-900">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-400">Delivery Fee</span>
                    <span className="font-bold text-gray-900">$2.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-[#FF6B35] pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(cartTotal + 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Phone Number *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+880 1234 567890"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Delivery Address *</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" size={14} />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="House #, Road #, Area, City"
                      rows="2"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Delivery Note (Optional)</label>
                  <input
                    type="text"
                    value={formData.deliveryNote}
                    onChange={(e) => setFormData({...formData, deliveryNote: e.target.value})}
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({...formData, paymentMethod: "cash"})}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        formData.paymentMethod === "cash"
                          ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-orange-500/10"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                    <button
                      onClick={() => setFormData({...formData, paymentMethod: "card"})}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        formData.paymentMethod === "card"
                          ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-orange-500/10"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      💳 Card Payment
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setOrderStep(1)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={placeOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaCheckCircle size={16} /> Place Order
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlaceAndOrder;