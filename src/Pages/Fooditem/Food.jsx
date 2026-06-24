import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShoppingBag, FaSearch, FaSlidersH, FaUtensils, FaPizzaSlice, FaHamburger, FaBirthdayCake, FaEye } from "react-icons/fa";
import Useaxios from "../../Hooks/Useaxios";

const Food = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axios = Useaxios();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/foods');
        setMenuItems(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setLoading(false);
        setMenuItems([]);
      }
    };
    fetchFoods();
  }, []);

  const categoryButtons = [
    { name: "All", icon: <FaUtensils size={12} /> },
    { name: "Pizza", icon: <FaPizzaSlice size={12} /> },
    { name: "Burger", icon: <FaHamburger size={12} /> },
    { name: "Cake", icon: <FaBirthdayCake size={12} /> },
  ];

  const filteredItems = menuItems
    .filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "low-to-high") return (a.price || 0) - (b.price || 0);
      if (sortBy === "high-to-low") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const handleAddToCart = (item) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-bold">Loading delicious foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white container mx-auto pb-16 sm:pb-24 text-left">
      
      <section className="py-12 sm:py-20 bg-gray-50/50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/20 to-pink-50/10 pointer-events-none" />
        <div className="container mx-auto text-center relative z-10 space-y-3 sm:space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl lg:text-6xl font-black text-gray-900 tracking-tight"
          >
            Discover Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Delicious Menu
            </span>
          </motion.h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed px-2">
            From sizzling hot slices to heavenly sweet crumbles, select your desired meals and experience food delivery like never before.
          </p>

          <div className="pt-2 sm:pt-4 max-w-xs sm:max-w-md mx-auto relative flex items-center bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-1 focus-within:border-orange-200 transition-colors">
            <span className="text-gray-400 pl-2 sm:pl-3"><FaSearch size={14} /></span>
            <input
              type="text"
              placeholder="Search your craving..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent pl-2 sm:pl-3 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-gray-100">
          
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-gray-100/80 p-1 rounded-full w-fit">
            {categoryButtons.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 lg:py-3 cursor-pointer rounded-full font-bold text-[10px] sm:text-xs lg:text-sm transition-all duration-300 z-10 ${
                    isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="menuActiveTabRoundedThree"
                      className="absolute inset-0 bg-gradient-to-r cursor-pointer from-orange-500 to-pink-500 rounded-full -z-10 shadow-lg shadow-orange-500/20"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="hidden sm:inline">{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 px-3 sm:px-5 py-1.5 sm:py-3 rounded-full border border-gray-100 w-fit">
            <span className="text-gray-400"><FaSlidersH size={12} /></span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] sm:text-xs lg:text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -8, rotate: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 flex flex-col justify-between group hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full h-40 sm:h-48 lg:h-56 rounded-xl sm:rounded-[1.5rem] overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/food/${item._id || item.id}`)}
                      className="flex items-center gap-1.5 sm:gap-2 bg-white/95 text-gray-900 font-bold text-[10px] sm:text-xs px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg border border-white hover:bg-orange-500 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      <FaEye size={12} /> View Details
                    </motion.button>
                  </div>

                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-bold text-gray-800 shadow-sm flex items-center gap-0.5 sm:gap-1 group-hover:bg-[#ff6b35] group-hover:text-white transition-colors duration-300">
                    <FaStar className="text-amber-500 group-hover:text-white transition-colors duration-300" size={10} /> {item.rating || 4.8}
                  </div>
                </div>

                <div className="pt-3 sm:pt-5 px-0.5 sm:px-1 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[10px] uppercase font-bold text-[#ff6b35] tracking-widest block transform group-hover:translate-x-1 transition-transform duration-300">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 tracking-tight group-hover:text-[#ff6b35] transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight transform group-hover:scale-105 origin-left transition-transform duration-300">${item.price}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="flex items-center gap-1 sm:gap-2 bg-gray-950 text-white font-bold text-[10px] sm:text-xs px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-3.5 rounded-xl shadow-sm group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300"
                    >
                      <FaShoppingBag size={11} /> Buy Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20 bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-dashed border-gray-200 mt-6"
          >
            <p className="text-sm sm:text-base text-gray-400 font-bold">No food items found matching your filter.</p>
          </motion.div>
        )}
      </section>

    </div>
  );
};

export default Food;