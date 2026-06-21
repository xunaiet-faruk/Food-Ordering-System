import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaClock, FaCheckCircle, 
  FaTimes, FaTruck, FaEye, FaStar, FaShoppingBag,
  FaChevronDown, FaCalendarAlt, FaReceipt, FaPrint,
  FaDownload, FaShare, FaEllipsisV, FaCircle,
  FaUser, FaPhone, FaMapMarkerAlt, FaEdit,
  FaTrash, FaCheck, FaSpinner, FaSync
} from 'react-icons/fa';

const ViewAllOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // ===== হার্ডকোডেড অর্ডার ডেটা =====
  const ordersData = [
    {
      id: "ORD-001",
      date: "2026-06-20",
      time: "10:30 AM",
      customer: {
        name: "John Doe",
        phone: "+880 1234 567890",
        address: "House #12, Road #5, Gulshan, Dhaka",
        email: "john@email.com"
      },
      items: [
        { name: "Classic Beef Burger", quantity: 2, price: 12.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100" },
        { name: "Margherita Pizza", quantity: 1, price: 10.9, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=100" }
      ],
      total: 35.9,
      deliveryFee: 2.0,
      grandTotal: 37.9,
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
      deliveryNote: "Please call before delivery",
      rating: 5,
      review: "Great food! Loved the burger.",
      estimatedDelivery: "2026-06-20 11:00 AM"
    },
    {
      id: "ORD-002",
      date: "2026-06-20",
      time: "12:15 PM",
      customer: {
        name: "Jane Smith",
        phone: "+880 1987 654321",
        address: "House #45, Road #3, Banani, Dhaka",
        email: "jane@email.com"
      },
      items: [
        { name: "Chocolate Fudge Cake", quantity: 3, price: 8.0, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=100" },
        { name: "Classic Beef Burger", quantity: 1, price: 12.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100" }
      ],
      total: 36.5,
      deliveryFee: 2.0,
      grandTotal: 38.5,
      status: "Preparing",
      paymentMethod: "Card Payment",
      deliveryNote: "Leave at the security desk",
      rating: null,
      review: null,
      estimatedDelivery: "2026-06-20 01:00 PM"
    },
    {
      id: "ORD-003",
      date: "2026-06-19",
      time: "06:45 PM",
      customer: {
        name: "Mike Johnson",
        phone: "+880 1756 789012",
        address: "House #8, Road #12, Dhanmondi, Dhaka",
        email: "mike@email.com"
      },
      items: [
        { name: "Pepperoni Pizza", quantity: 2, price: 14.9, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100" },
        { name: "Crispy Honey Wings", quantity: 1, price: 10.0, image: "https://images.unsplash.com/photo-1567622417610-85093b134f59?q=80&w=100" }
      ],
      total: 39.8,
      deliveryFee: 2.0,
      grandTotal: 41.8,
      status: "On the way",
      paymentMethod: "Cash on Delivery",
      deliveryNote: "",
      rating: 4,
      review: "Pizza was amazing!",
      estimatedDelivery: "2026-06-19 07:30 PM"
    },
    {
      id: "ORD-004",
      date: "2026-06-19",
      time: "02:20 PM",
      customer: {
        name: "Sarah Wilson",
        phone: "+880 1678 901234",
        address: "House #22, Road #8, Uttara, Dhaka",
        email: "sarah@email.com"
      },
      items: [
        { name: "BBQ Chicken Pizza", quantity: 1, price: 13.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=100" },
        { name: "Chocolate Fudge Cake", quantity: 2, price: 8.0, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=100" },
        { name: "Classic Beef Burger", quantity: 1, price: 12.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100" }
      ],
      total: 42.0,
      deliveryFee: 2.0,
      grandTotal: 44.0,
      status: "Delivered",
      paymentMethod: "Card Payment",
      deliveryNote: "Ring the doorbell twice",
      rating: 5,
      review: "Excellent food and quick delivery!",
      estimatedDelivery: "2026-06-19 03:00 PM"
    },
    {
      id: "ORD-005",
      date: "2026-06-18",
      time: "08:10 PM",
      customer: {
        name: "David Brown",
        phone: "+880 1890 123456",
        address: "House #56, Road #2, Mirpur, Dhaka",
        email: "david@email.com"
      },
      items: [
        { name: "Margherita Pizza", quantity: 2, price: 10.9, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=100" },
        { name: "Crispy Honey Wings", quantity: 2, price: 10.0, image: "https://images.unsplash.com/photo-1567622417610-85093b134f59?q=80&w=100" }
      ],
      total: 41.8,
      deliveryFee: 2.0,
      grandTotal: 43.8,
      status: "Cancelled",
      paymentMethod: "Cash on Delivery",
      deliveryNote: "",
      rating: null,
      review: null,
      estimatedDelivery: "2026-06-18 09:00 PM"
    },
    {
      id: "ORD-006",
      date: "2026-06-18",
      time: "04:30 PM",
      customer: {
        name: "Emily Taylor",
        phone: "+880 1567 890123",
        address: "House #10, Road #15, Baridhara, Dhaka",
        email: "emily@email.com"
      },
      items: [
        { name: "Classic Beef Burger", quantity: 3, price: 12.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100" },
        { name: "Chocolate Fudge Cake", quantity: 1, price: 8.0, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=100" }
      ],
      total: 45.5,
      deliveryFee: 2.0,
      grandTotal: 47.5,
      status: "Preparing",
      paymentMethod: "Card Payment",
      deliveryNote: "Call upon arrival",
      rating: null,
      review: null,
      estimatedDelivery: "2026-06-18 05:30 PM"
    }
  ];

  // ===== স্ট্যাটাস ফিল্টার =====
  const statusFilters = [
    { label: "All", value: "All", icon: <FaCircle size={8} />, count: ordersData.length },
    { label: "Delivered", value: "Delivered", icon: <FaCheckCircle size={10} className="text-green-500" />, count: ordersData.filter(o => o.status === "Delivered").length },
    { label: "Preparing", value: "Preparing", icon: <FaClock size={10} className="text-amber-500" />, count: ordersData.filter(o => o.status === "Preparing").length },
    { label: "On the way", value: "On the way", icon: <FaTruck size={10} className="text-blue-500" />, count: ordersData.filter(o => o.status === "On the way").length },
    { label: "Cancelled", value: "Cancelled", icon: <FaTimes size={10} className="text-red-500" />, count: ordersData.filter(o => o.status === "Cancelled").length }
  ];

  // ===== স্ট্যাটাস অপশন (আপডেটের জন্য) =====
  const statusOptions = ["Preparing", "On the way", "Delivered", "Cancelled"];

  // ===== ফিল্টার এবং সার্চ =====
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.phone.includes(searchQuery) ||
                         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ===== স্ট্যাটাসের জন্য রং =====
  const getStatusColor = (status) => {
    const colors = {
      "Delivered": "bg-green-50 text-green-700 border-green-200",
      "Preparing": "bg-amber-50 text-amber-700 border-amber-200",
      "On the way": "bg-blue-50 text-blue-700 border-blue-200",
      "Cancelled": "bg-rose-50 text-rose-700 border-rose-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Delivered": <FaCheckCircle className="text-green-500" />,
      "Preparing": <FaClock className="text-amber-500" />,
      "On the way": <FaTruck className="text-blue-500" />,
      "Cancelled": <FaTimes className="text-red-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  // ===== স্ট্যাটাস আপডেট =====
  const handleStatusUpdate = (orderId, newStatus) => {
    // এখানে API কল হবে
    console.log(`Order ${orderId} status updated to ${newStatus}`);
    setShowStatusModal(false);
    alert(`Order ${orderId} status updated to ${newStatus}!`);
  };

  // ===== ডিটেইলস ভিউ =====
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // ===== স্ট্যাটাস চেঞ্জ মোডাল =====
  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowStatusModal(true);
  };

  return (
    <div className="w-full min-h-full">
      
      {/* ===== হেডার ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaReceipt className="text-[#FF6B35]" />
            All Orders
            <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {ordersData.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage and track all customer orders
          </p>
        </div>
 
      </div>


      {/* ===== অর্ডার লিস্ট ===== */}
      <div className="mt-6 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl">📦</span>
            <p className="text-gray-400 font-bold mt-3">No orders found</p>
            <p className="text-xs text-gray-300">Try adjusting your search or filter</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* ===== অর্ডার আইডি & ডেট ===== */}
                <div className="md:col-span-2">
                  <p className="text-sm font-black text-gray-900">{order.id}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt size={9} /> {order.date}
                  </p>
                </div>

                {/* ===== কাস্টমার ===== */}
                <div className="md:col-span-3">
                  <p className="text-sm font-bold text-gray-800">{order.customer.name}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <FaPhone size={8} /> {order.customer.phone}
                  </p>
                </div>

                {/* ===== আইটেম ===== */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[9px] font-bold text-gray-400 ml-1">+{order.items.length - 3}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </p>
                </div>

                {/* ===== স্ট্যাটাস ===== */}
                <div className="md:col-span-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} flex items-center gap-1.5 w-fit`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                {/* ===== টোটাল ===== */}
                <div className="md:col-span-1 text-right">
                  <p className="text-sm font-black text-[#FF6B35]">${order.grandTotal.toFixed(2)}</p>
                  <p className="text-[9px] text-gray-400">{order.paymentMethod}</p>
                </div>

                {/* ===== অ্যাকশন ===== */}
                <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(order)}
                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50/50 hover:border-orange-100 transition-all"
                    title="View Details"
                  >
                    <FaEye size={12} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(order)}
                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                    title="Update Status"
                  >
                    <FaEdit size={12} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50/50 hover:border-rose-100 transition-all"
                    title="Delete Order"
                  >
                    <FaTrash size={12} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ===== অর্ডার ডিটেইলস মোডাল ===== */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-10 z-50 bg-white rounded-3xl shadow-2xl max-w-3xl mx-auto overflow-y-auto p-6 sm:p-8"
            >
              {/* মোডাল হেডার */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Order Details</h2>
                  <p className="text-xs text-gray-400">{selectedOrder.id} • {selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-xl"
                >
                  ×
                </button>
              </div>

              {/* স্ট্যাটাস */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)} flex items-center gap-2`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <FaTruck size={10} /> Est. Delivery: {selectedOrder.estimatedDelivery}
                </span>
                {selectedOrder.rating && (
                  <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <FaStar size={12} /> {selectedOrder.rating}/5
                  </span>
                )}
              </div>

              {/* কাস্টমার ইনফো */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-[10px] text-gray-400">Name</p>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      <FaUser size={10} className="text-gray-400" /> {selectedOrder.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Phone</p>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      <FaPhone size={10} className="text-gray-400" /> {selectedOrder.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.customer.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-gray-400">Delivery Address</p>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      <FaMapMarkerAlt size={10} className="text-gray-400" /> {selectedOrder.customer.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* অর্ডার আইটেম */}
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-black text-[#FF6B35]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* প্রাইস ব্রেকডাউন */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="font-bold text-gray-900">${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-bold text-gray-900">{selectedOrder.paymentMethod}</span>
                  </div>
                  {selectedOrder.deliveryNote && (
                    <div className="flex justify-between text-sm pt-2 border-t border-orange-100">
                      <span className="text-gray-500">Delivery Note</span>
                      <span className="font-medium text-gray-700 text-right max-w-[60%]">{selectedOrder.deliveryNote}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black text-[#FF6B35] pt-2 border-t border-orange-200">
                    <span>Grand Total</span>
                    <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* রিভিউ */}
              {selectedOrder.rating && (
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-amber-500 font-black">
                      <FaStar size={14} /> {selectedOrder.rating}
                    </span>
                    <span className="text-xs font-bold text-gray-400">/ 5</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">"{selectedOrder.review}"</p>
                </div>
              )}

              {/* অ্যাকশন বাটন */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <FaShoppingBag size={14} /> View All Orders
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== স্ট্যাটাস আপডেট মোডাল ===== */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-black text-gray-900">Update Order Status</h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Order: <span className="font-bold">{selectedOrder.id}</span></p>
                  <p className="text-xs text-gray-400 mb-4">Current Status: <span className="font-bold">{selectedOrder.status}</span></p>
                  
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                          selectedStatus === status
                            ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-orange-500/10"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {status === "Preparing" && <FaClock size={16} />}
                        {status === "On the way" && <FaTruck size={16} />}
                        {status === "Delivered" && <FaCheckCircle size={16} />}
                        {status === "Cancelled" && <FaTimes size={16} />}
                        {status}
                        {selectedStatus === status && <FaCheck className="ml-auto" size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, selectedStatus)}
                    className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheck size={14} /> Update Status
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ViewAllOrders;