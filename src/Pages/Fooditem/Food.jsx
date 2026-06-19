import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaShoppingBag, FaSearch, FaSlidersH, FaUtensils, FaPizzaSlice, FaHamburger, FaBirthdayCake } from "react-icons/fa";

const Food = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("/Menu.json") 
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => {
        console.error("Error loading Menu.json, using local fallback", err);
        setMenuItems([
          { _id: "1", name: "Classic Beef Burger", category: "burger", price: 12.5, rating: 4.8, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500", recipe: "Juicy grilled beef patty with cheddar cheese, lettuce, tomato, and secret sauce." },
          { _id: "8", name: "Margherita Pizza", category: "pizza", price: 10.9, rating: 4.9, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500", recipe: "Classic tomato sauce, fresh mozzarella, basil, and olive oil." },
          { _id: "21", name: "Chocolate Fudge Cake", category: "cake", price: 6.5, rating: 4.7, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500", recipe: "Rich chocolate cake with fudge icing and chocolate shavings." }
        ]);
      });
  }, []);

  const categoryButtons = [
    { name: "All", icon: <FaUtensils size={14} /> },
    { name: "Pizza", icon: <FaPizzaSlice size={14} /> },
    { name: "Burger", icon: <FaHamburger size={14} /> },
    { name: "Cake", icon: <FaBirthdayCake size={14} /> },
  ];

  const filteredItems = menuItems
    .filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "low-to-high") return a.price - b.price;
      if (sortBy === "high-to-low") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 4.7) - (a.rating || 4.7);
      return 0;
    });

  return (
    <div className="bg-white container mx-auto pb-24 text-left">
      
      <section className="py-20 bg-gray-50/50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/20 to-pink-50/10 pointer-events-none" />
        <div className="container mx-auto text-center relative z-10 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight"
          >
            Discover Our{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Delicious Menu
            </span>
          </motion.h1>
          <p className="text-gray-500 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            From sizzling hot slices to heavenly sweet crumbles, select your desired meals and experience food delivery like never before.
          </p>

          <div className="pt-4 max-w-md mx-auto relative flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 focus-within:border-orange-200 transition-colors">
            <span className="text-gray-400 pl-3"><FaSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search your craving..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent pl-3 pr-4 py-2 w-full text-sm font-semibold text-gray-800 focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-100">
          
          <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 p-1.5 rounded-full w-fit">
            {categoryButtons.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs sm:text-sm transition-all duration-300 z-10 ${
                    isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="menuActiveTabRoundedTwo"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full -z-10 shadow-lg shadow-orange-500/20"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full border border-gray-100 w-fit">
            <span className="text-gray-400"><FaSlidersH size={14} /></span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-black text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col justify-between group hover:border-[#ff6b35]/20 transition-all duration-300"
              >
                <div className="relative w-full h-60 rounded-[1.5rem] overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white/90 text-xs font-semibold leading-relaxed line-clamp-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 defer-100">
                      {item.recipe || "Prepared with fresh, premium and authentic handpicked ingredients."}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black text-gray-800 shadow-sm flex items-center gap-1">
                    <FaStar className="text-amber-500" size={11} /> {item.rating || 4.8}
                  </div>
                </div>

                <div className="pt-5 px-1 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-[#ff6b35] tracking-widest block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#ff6b35] transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight">${item.price}</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => alert(`${item.name} added to cart!`)}
                      className="flex items-center gap-2 bg-gray-950 text-white font-black text-xs px-5 py-3.5 rounded-xl shadow-sm group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300"
                    >
                      <FaShoppingBag size={12} /> Buy Now
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
            className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 mt-6"
          >
            <p className="text-gray-400 font-extrabold text-base">No food items found matching your filter.</p>
          </motion.div>
        )}
      </section>

    </div>
  );
};

export default Food;