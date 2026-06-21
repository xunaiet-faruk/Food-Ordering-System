import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaRegClock, FaStar, FaEye, FaShoppingBag, 
  FaTimes, FaFire, FaUtensils
} from 'react-icons/fa';
import Useaxios from '../../Hooks/Useaxios';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='400' viewBox='0 0 500 400'%3E%3Crect width='500' height='400' fill='%23f3f4f6'/%3E%3Ctext x='250' y='190' font-family='Arial' font-size='20' fill='%239ca3af' text-anchor='middle'%3E🍽️ Food Image%3C/text%3E%3Ctext x='250' y='220' font-family='Arial' font-size='14' fill='%23d1d5db' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const ViewFood = () => {
  const navigate = useNavigate();
  const axiosPublic = Useaxios();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Flavors");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  // ✅ API থেকে ডাটা লোড
  useEffect(() => {
    console.log("🔄 Fetching foods from API...");
    
    axiosPublic.get('/foods')
      .then((response) => {
        console.log("✅ API Response:", response.data);
        
        const data = response.data?.data || response.data || [];
        
        const formattedData = data.map(item => ({
          ...item,
          _id: item._id || item.id,
          category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "Unknown",
          rating: item.rating || (4 + Math.random() * 0.9).toFixed(1),
          prepTime: item.prepTime || `${Math.floor(5 + Math.random() * 25)} mins`,
          calories: item.calories || `${Math.floor(200 + Math.random() * 600)} kcal`,
          tags: item.tags || (item.category === "burger" ? ["Best Seller", "Spicy"] :
                 item.category === "pizza" ? ["Trending", "Cheesy"] :
                 item.category === "cake" ? ["Sweet Tooth", "Dessert"] :
                 ["Healthy", "Fresh"])
        }));
        
        setFoodItems(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading foods:", err);
        setFoodItems([]);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All Flavors",
    ...new Set(foodItems.map(item => 
      item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : ""
    ).filter(Boolean))
  ];

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === "All Flavors" || 
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.onerror = null;
  };

  // ✅ Place Order পেজে নেভিগেট
  const goToPlaceOrder = () => {
    navigate('/dashboard/place-order');
  };

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading delicious meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full container mx-auto flex relative overflow-hidden">
      
      <div className="flex-1 space-y-8 pr-1">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              Welcome to the Food Lounge <span className="animate-bounce">✨</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {foodItems.length} premium items waiting for you
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="What are you craving today?..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            </div>
            
            {/* ✅ Place Order বাটন */}
            <button
              onClick={goToPlaceOrder}
              className="px-4 py-2.5 bg-[#FF6B35] text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 whitespace-nowrap"
            >
              <FaShoppingBag size={14} /> Place Order
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 h-9 rounded-xl text-xs font-black transition-all whitespace-nowrap border cursor-pointer ${
                  isSelected
                    ? "bg-[#FF6B35] border-[#FF6B35] text-white shadow-md shadow-orange-500/10"
                    : "bg-white border-gray-100 text-gray-500 hover:text-gray-800 hover:border-gray-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 ? (
          <div className="w-full h-80 border border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-white">
            <span className="text-3xl mb-3">🍽️</span>
            <p className="text-gray-400 font-bold text-xs">We couldn't find anything matching your preference.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden relative border border-gray-50 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {item.tags && item.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase rounded-md tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-[9px] font-black text-gray-800 flex items-center gap-1 shadow-sm">
                      <FaStar className="text-amber-400" size={9} /> {item.rating || 4.5}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-wide">
                      <span>{item.category}</span>
                      <span className="flex items-center gap-1 font-bold text-gray-400 normal-case">
                        <FaRegClock size={9} /> {item.prepTime || "15 mins"}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-gray-800 tracking-tight line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed pt-0.5">{item.recipe}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Price</p>
                    <h4 className="text-base font-black text-[#2D3436]">${(item.price || 0).toFixed(2)}</h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedFood(item)}
                      className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50/50 hover:border-orange-100 transition-all cursor-pointer"
                      title="View Details"
                    >
                      <FaEye size={12} />
                    </button>
                    
                    {/* ✅ Place Order বাটন */}
                    <button
                      onClick={goToPlaceOrder}
                      className="h-9 px-4 rounded-xl bg-[#FF6B35] hover:bg-orange-600 text-white flex items-center gap-1.5 text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      <FaShoppingBag size={10} /> Order Now
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedFood && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFood(null)}
              className="absolute inset-0 bg-black z-40 cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[380px] bg-white border-l border-gray-100 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    <FaUtensils size={10} className="text-[#FF6B35]" /> Recipe Insights
                  </span>
                  <button 
                    onClick={() => setSelectedFood(null)}
                    className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-rose-50 border border-gray-100 hover:border-rose-100 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm mt-5 relative bg-gray-50">
                  <img 
                    src={selectedFood.image} 
                    alt={selectedFood.name} 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-black text-gray-800 flex items-center gap-1 shadow-sm">
                    <FaStar className="text-amber-400" size={11} /> {selectedFood.rating || 4.5}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">{selectedFood.category}</span>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight mt-1.5">{selectedFood.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50/60 border border-gray-100 p-3 rounded-xl flex items-center gap-2">
                      <FaRegClock className="text-gray-400" size={12} />
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Cook Time</p>
                        <p className="text-xs font-black text-gray-700">{selectedFood.prepTime || "15 mins"}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50/60 border border-gray-100 p-3 rounded-xl flex items-center gap-2">
                      <FaFire className="text-gray-400" size={12} />
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Energy</p>
                        <p className="text-xs font-black text-gray-700">{selectedFood.calories || "400 kcal"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Ingredients & Profile</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed bg-gray-50/40 border border-gray-50 p-3 rounded-xl">
                      {selectedFood.recipe}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Price</p>
                  <h3 className="text-xl font-black text-gray-900">${(selectedFood.price || 0).toFixed(2)}</h3>
                </div>
                <button 
                  onClick={() => {
                    setSelectedFood(null);
                    goToPlaceOrder();
                  }}
                  className="h-11 px-6 rounded-xl bg-[#FF6B35] hover:bg-orange-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
                >
                  <FaShoppingBag size={11} /> Order Now
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ViewFood;