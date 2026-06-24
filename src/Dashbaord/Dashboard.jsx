import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaUserShield, FaPizzaSlice, FaShoppingCart, FaCreditCard, 
  FaCheckCircle, FaClipboardList, FaUsers, FaTasks, FaUtensils,
  FaBars, FaChevronLeft, FaBell
} from "react-icons/fa";
import ViewFood from "./Customer/ViewFood";
import PlaceAndOrder from "./Customer/PlaceAndOrder";
import OrderList from "./Customer/OrderList";
import ViewAlOrders from "./Admin/ViewAlOrders";
import CustomerDetails from "./Admin/CustomerDetails";
import ViewPaymentStatus from "./Admin/ViewPaymentStatus";
import ManageFood from "./Admin/ManageFood";
import Useaxios from "../Hooks/Useaxios";
import useAuth from "../hooks/useAuth";
import AddFoodModal from "./Admin/AddFoodModal";
import PayMentHistory from "./Customer/PayMentHistory";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = Useaxios();
  const { user } = useAuth();
  
  const [userRole, setUserRole] = useState("Customer");
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState("view-food");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userEmail = user?.email;

  useEffect(() => {
    if (userEmail) {
      setIsRoleLoading(true);
      axiosPublic.get(`/users/email/${userEmail}`)
        .then(res => {
          console.log("📡 ইউজার ডাটা:", res.data);
          
          const userData = res.data?.data || res.data;
          const role = userData?.role;
          
          if (role) {
            const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            setUserRole(normalizedRole);
            console.log("✅ সেট করা রোল:", normalizedRole);
          } else {
            setUserRole("Customer");
          }
          setIsRoleLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching role:", err);
          setUserRole("Customer");
          setIsRoleLoading(false);
        });
    } else {
      setUserRole("Customer");
      setIsRoleLoading(false);
    }
  }, [userEmail, axiosPublic]);

  useEffect(() => {
    const path = location.pathname;
    const route = path.split("/dashboard/")[1] || "view-food";
    setActiveRoute(route);
  }, [location.pathname]);

  const handleRouteChange = (routeId) => {
    const isAdminRoute = ["all-orders", "customer-details", "view-payment-status", "manage-food", "add-food"].includes(routeId);
    
    if (isAdminRoute && userRole?.toLowerCase() !== "admin") {
      setActiveRoute("view-food");
      navigate("/dashboard/view-food", { replace: true });
      return;
    }

    setActiveRoute(routeId);
    navigate(`/dashboard/${routeId}`, { replace: true });
  };


  const isAdmin = userRole?.toLowerCase() === "admin";

  const getMenuGroups = () => {
    if (isAdmin) {
      return [
        {
          title: "Admin Management",
          role: "Admin",
          items: [
            { id: "all-orders", label: "View All Orders", icon: <FaClipboardList /> },
            { id: "customer-details", label: "Customer Details", icon: <FaUsers /> },
            { id: "view-payment-status", label: "Payment Status", icon: <FaCreditCard /> },
            { id: "manage-food", label: "Manage Food Catalog", icon: <FaPizzaSlice /> },
          ]
        }
      ];
    } else {
      return [
        {
          title: "Customer Console",
          role: "Customer",
          items: [
            { id: "view-food", label: "View Food Items", icon: <FaUtensils /> },
            { id: "place-order", label: "Place an Order", icon: <FaShoppingCart /> },
            { id: "payment-history", label: "Pay History", icon: <FaCreditCard /> },
            { id: "order-list", label: "My Orders", icon: <FaCheckCircle /> },
          ]
        }
      ];
    }
  };

  const menuGroups = getMenuGroups();

  useEffect(() => {
    if (!isRoleLoading && menuGroups.length > 0) {
      const firstItem = menuGroups[0]?.items[0]?.id;
      if (firstItem && activeRoute !== firstItem) {
        const isCurrentRouteValid = menuGroups.some(group => 
          group.items.some(item => item.id === activeRoute)
        );
        if (!isCurrentRouteValid) {
          setActiveRoute(firstItem);
          navigate(`/dashboard/${firstItem}`, { replace: true });
        }
      }
    }
  }, [isRoleLoading, menuGroups, activeRoute, navigate]);

  if (isRoleLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#FAFAFB] text-[#2D3436] font-sans flex overflow-hidden fixed inset-0 select-none">

      <motion.aside 
        animate={{ width: isSidebarOpen ? "280px" : "80px" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="h-full bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 z-30 relative shadow-sm"
      >
        <div>
          <div className="h-20 px-6 border-b border-gray-50 flex items-center justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => navigate("/dashboard")}
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
                  onClick={() => navigate("/dashboard")}
                >
                  🍕
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                        onClick={() => handleRouteChange(item.id)}
                        className={`w-full flex items-center gap-3.5 px-3.5 h-11 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                          isActive 
                            ? "text-[#FF6B35] bg-orange-50/70 font-extrabold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      >
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

        <div className="p-4 border-t border-gray-50 h-16 flex items-center justify-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 hover:bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <FaChevronLeft size={11} /> : <FaBars size={11} />}
          </button>
        </div>
      </motion.aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow h-full flex flex-col overflow-hidden relative">
        
        <header className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-wider text-gray-800 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              {activeRoute.replace(/-/g, " ")}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded tracking-widest ${
              isAdmin ? "bg-orange-50 border border-orange-100 text-[#FF6B35]" : "bg-orange-50 border border-orange-100 text-[#FF6B35]"
            }`}>
              {userRole || "Customer"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl hover:bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-all relative cursor-pointer">
              <FaBell size={13} />
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full absolute top-2.5 right-2.5 ring-4 ring-white" />
            </button>
            <div className="h-6 w-[1px] bg-gray-100" />
            
      
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User Avatar" 
                className="w-9 h-9 rounded-xl border border-orange-100 object-cover shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-black text-xs text-[#FF6B35] uppercase">
                {user?.displayName ? user.displayName.charAt(0) : user?.email ? user.email.charAt(0) : "U"}
              </div>
            )}
          </div>
        </header>

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
              
              {/* ===== Customer Routes ===== */}
              {activeRoute === "view-food" && <ViewFood />}
              {activeRoute === "place-order" && <PlaceAndOrder />}
              {activeRoute === "order-list" && <OrderList />}
  
              {activeRoute === "payment-history" && <PayMentHistory />}
              
              {/* ===== Admin Routes ==== */}
              {isAdmin && (
                <>
                  {activeRoute === "all-orders" && <ViewAlOrders />}
                  {activeRoute === "customer-details" && <CustomerDetails />}
                  {activeRoute === "view-payment-status" && <ViewPaymentStatus />}
                  {activeRoute === "manage-food" && <ManageFood />}
                  {activeRoute === "add-food" && <AddFoodModal />}
                </>
              )}

              {/* ===== Fallback ===== */}
              {activeRoute !== "view-food" && 
               activeRoute !== "place-order" && 
               activeRoute !== "order-list" && 
               activeRoute !== "all-orders" && 
               activeRoute !== "customer-details" && 
               activeRoute !== "view-payment-status" && 
               activeRoute !== "manage-food" && 
               activeRoute !== "add-food" && (
               <div>
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