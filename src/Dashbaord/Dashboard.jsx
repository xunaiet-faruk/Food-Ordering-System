// src/Dashboard/Dashboard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaUserShield, FaPizzaSlice, FaShoppingCart, FaCreditCard, 
  FaCheckCircle, FaClipboardList, FaUsers, FaTasks, FaUtensils,
  FaBars, FaChevronLeft, FaBell, FaArrowUp, FaArrowDown, FaEye
} from "react-icons/fa";
import ViewFood from "./Customer/ViewFood";
import PlaceAndOrder from "./Customer/PlaceAndOrder";
import OrderList from "./Customer/OrderList";

const Dashboard = () => {
  const [activeRoute, setActiveRoute] = useState("view-food");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ডাইনামিক ডেটা
  const statsData = [
    { id: 1, title: "Total Revenue", value: "$12,845", change: "+12.5%", isPositive: true, emoji: "💰" },
    { id: 2, title: "Total Orders", value: "1,284", change: "+8.2%", isPositive: true, emoji: "🛒" },
    { id: 3, title: "Total Customers", value: "4,567", change: "+15.3%", isPositive: true, emoji: "👥" },
    { id: 4, title: "Avg. Order Value", value: "$42.50", change: "-2.1%", isPositive: false, emoji: "📈" }
  ];

  const recentOrdersData = [
    { id: "#ORD-001", customer: "John Doe", items: "Classic Burger x2", total: "$25.80", status: "Delivered", time: "10 min ago" },
    { id: "#ORD-002", customer: "Jane Smith", items: "Margherita Pizza x1", total: "$18.50", status: "Preparing", time: "25 min ago" },
    { id: "#ORD-003", customer: "Mike Johnson", items: "Chocolate Cake x3", total: "$32.40", status: "On the way", time: "45 min ago" },
    { id: "#ORD-004", customer: "Sarah Wilson", items: "BBQ Burger x2", total: "$28.90", status: "Delivered", time: "1 hour ago" },
    { id: "#ORD-005", customer: "David Brown", items: "Pepperoni Pizza x1", total: "$22.30", status: "Cancelled", time: "2 hours ago" }
  ];

  const topSellingData = [
    { name: "Classic Beef Burger", sales: 245, revenue: "$3,185", trend: "up", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100" },
    { name: "Margherita Pizza", sales: 210, revenue: "$2,730", trend: "up", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=100" },
    { name: "Chocolate Fudge Cake", sales: 180, revenue: "$2,340", trend: "down", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100" },
    { name: "Double Cheese Burger", sales: 160, revenue: "$2,080", trend: "up", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100" }
  ];

  const menuGroups = [
    {
      title: "Customer Console",
      role: "Customer",
      items: [
        { id: "auth-simulation", label: "Register / Login", icon: <FaUser /> },
        { id: "view-food", label: "View Food Items", icon: <FaUtensils /> },
        { id: "place-order", label: "Place an Order", icon: <FaShoppingCart /> },
        { id: "make-payment", label: "PayHere Sandbox", icon: <FaCreditCard /> },
        { id: "order-list", label: "Order Confirmation", icon: <FaCheckCircle /> },
      ]
    },
    {
      title: "Admin Management",
      role: "Admin",
      items: [
        { id: "admin-login", label: "Admin Control Gate", icon: <FaUserShield /> },
        { id: "view-all-orders", label: "View All Orders", icon: <FaClipboardList /> },
        { id: "view-customer-details", label: "Customer Details", icon: <FaUsers /> },
        { id: "view-payment-status", label: "Payment Status", icon: <FaCreditCard /> },
        { id: "manage-food-items", label: "Manage Food Catalog", icon: <FaPizzaSlice /> },
        { id: "update-order-status", label: "Update Order Status", icon: <FaTasks /> },
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      "Delivered": "bg-green-50 text-green-600 border-green-100",
      "Preparing": "bg-amber-50 text-amber-600 border-amber-100",
      "On the way": "bg-blue-50 text-blue-600 border-blue-100",
      "Cancelled": "bg-rose-50 text-rose-600 border-rose-100",
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  return (
    <div className="w-screen h-screen bg-[#FAFAFB] text-[#2D3436] font-sans flex overflow-hidden fixed inset-0 select-none">
      
      {/* ===== SIDEBAR ===== */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? "280px" : "80px" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="h-full bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 z-30 relative shadow-sm"
      >
        <div>
          {/* Header & Requested Logo */}
          <div className="h-20 px-6 border-b border-gray-50 flex items-center justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-2xl font-black text-[#FF6B35] tracking-tight">🍕 Food</span>
                  <span className="text-2xl font-black text-gray-700 tracking-tight">Hub</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="text-2xl mx-auto cursor-pointer"
                >
                  🍕
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-7 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-160px)] scrollbar-none">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {isSidebarOpen && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400/80 mb-2"
                  >
                    {group.title}
                  </motion.p>
                )}
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveRoute(item.id)}
                        className={`w-full flex items-center gap-3.5 px-3.5 h-11 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                          isActive 
                            ? "text-[#FF6B35] bg-orange-50/70 font-extrabold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      >
                        {/* Smooth Sliding Pill Indicator */}
                        {isActive && (
                          <motion.div 
                            layoutId="sidebarActivePill"
                            className="absolute left-0 w-1 h-5 rounded-r-full bg-[#FF6B35]"
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          />
                        )}

                        <div className={`text-base shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#FF6B35]" : "text-gray-400"}`}>
                          {item.icon}
                        </div>

                        {isSidebarOpen && (
                          <motion.span 
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}

                        {!isSidebarOpen && (
                          <div className="absolute left-16 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 transition-all whitespace-nowrap z-50 shadow-md">
                            {item.label}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Expansion Toggle */}
        <div className="p-4 border-t border-gray-50 h-16 flex items-center justify-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 hover:bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <FaChevronLeft size={11} /> : <FaBars size={11} />}
          </button>
        </div>
      </motion.aside>

      {/* ===== MAIN CANVASES ===== */}
      <div className="flex-grow h-full flex flex-col overflow-hidden relative">
        
        {/* Navigation Bar */}
        <header className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-wider text-gray-800 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              {activeRoute.replace(/-/g, " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl hover:bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-all relative cursor-pointer">
              <FaBell size={13} />
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full absolute top-2.5 right-2.5 ring-4 ring-white" />
            </button>
            <div className="h-6 w-[1px] bg-gray-100" />
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-black text-xs text-[#FF6B35]">
              A
            </div>
          </div>
        </header>

        {/* ===== WORKSPACE CONTENT ===== */}
        <main className="flex-grow w-full overflow-y-auto overflow-x-hidden p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoute}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full space-y-6"
            >
              
              {activeRoute === "view-food" && <ViewFood />}
              {activeRoute === "place-order" && <PlaceAndOrder />}
              {activeRoute === "order-list" && <OrderList />}


              {/* Other Routes Placeholder Container */}
              {activeRoute !== "view-food" && (
                <div className="w-full h-full border border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center p-8 bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF6B35] flex items-center justify-center mb-4 shadow-sm">
                    <span className="text-lg">📦</span>
                  </div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Routing Terminal Target
                  </h3>
                  <h2 className="text-lg font-black text-gray-800 mt-0.5 capitalize">
                    {activeRoute.replace(/-/g, " ")} Module
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium mt-1.5 max-w-xs text-center leading-relaxed">
                    আপনার এই কাস্টম কম্পোনেন্ট সাব-মডিউল ফাইলটি ইম্পোর্ট করে এখানে ডক করে দিন।
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;