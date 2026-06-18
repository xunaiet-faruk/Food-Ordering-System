import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPizzaSlice, FaHamburger, FaBirthdayCake, FaIceCream, FaStar, FaShoppingBag } from "react-icons/fa";

const Categories = () => {
  // ১. ক্যাটাগরি বাটন লিস্ট
  const categories = [
    { id: "pizza", name: "Pizza", icon: <FaPizzaSlice size={20} /> },
    { id: "burger", name: "Burger", icon: <FaHamburger size={20} /> },
    { id: "cake", name: "Cake", icon: <FaBirthdayCake size={20} /> },
    { id: "dessert", name: "Dessert", icon: <FaIceCream size={20} /> },
  ];

  // ২. একদম স্পেসিফিক রিয়েল ফুড ইমেজ ডেটাবেস (Unsplash Source - ১০০% ওয়ার্কিং)
  const foodProducts = [
    { 
      id: 1, 
      category: "pizza", 
      name: "Cheesy Pepperoni Pizza", 
      price: "$12.99", 
      rating: 4.8, 
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 2, 
      category: "pizza", 
      name: "Margherita Supreme", 
      price: "$10.50", 
      rating: 4.6, 
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 3, 
      category: "burger", 
      name: "Double Beef Cheeseburger", 
      price: "$8.99", 
      rating: 4.9, 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 4, 
      category: "burger", 
      name: "Crispy Chicken Zinger", 
      price: "$7.49", 
      rating: 4.7, 
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 5, 
      category: "cake", 
      name: "Strawberry Lava Cake", 
      price: "$15.00", 
      rating: 4.9, 
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 6, 
      category: "cake", 
      name: "Premium Chocolate Fudge", 
      price: "$18.50", 
      rating: 4.8, 
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop" 
    },
    { 
      id: 7, 
      category: "dessert", 
      name: "Vanilla Ice Cream Scoop", 
      price: "$4.99", 
      rating: 4.5, 
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=500&auto=format&fit=crop" 
    },
  ];

  const [activeTab, setActiveTab] = useState("pizza");

  // ক্যাটাগরি অনুযায়ী ফিল্টার করা
  const filteredFoods = foodProducts.filter(food => food.category === activeTab);

  return (
    <section className="py-20  px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- ১. সেন্ট্রাল হেডিং সেকশন (Our Food ব্ল্যাক এবং Categories গ্রাডিয়েন্ট) --- */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight pb-2 text-gray-900">
            Our Food{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 text-sm sm:text-base font-medium">
            What are you desiring to eat today? Tap a category to browse your favourite meals instantly!
          </p>
        </div>

        {/* --- ২. অ্যানিমেটেড ট্যাব বাটন রিল --- */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          {categories.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 z-10 ${
                  isActive 
                    ? "text-white shadow-lg shadow-orange-500/20" 
                    : "bg-white text-gray-600 hover:bg-orange-50/50 border border-gray-100"
                }`}
              >
                {/* বাটন ব্যাকগ্রাউন্ড অ্যানিমেশন */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-[#ff6b35] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {tab.icon}
                </span>
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* --- ৩. অ্যানিমেটেড প্রোডাক্ট গ্রিড (রিয়াল ফুড কার্ড) --- */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {filteredFoods.map((food) => (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 border border-gray-100/80 flex flex-col justify-between group cursor-pointer"
              >
                {/* রিয়াল ফুড ইমেজ বক্স */}
                <div className="rounded-[1.5rem] overflow-hidden h-48 relative bg-gray-100">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    loading="lazy"
                  />
                </div>

                {/* ইনফরমেশন এবং রেটিং */}
                <div className="mt-5 space-y-2 flex-grow px-1">
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                    <FaStar size={14} /> {food.rating}
                  </div>
                  <h3 className="text-lg font-black text-gray-800 line-clamp-1 group-hover:text-[#ff6b35] transition duration-300">
                    {food.name}
                  </h3>
                </div>

                {/* প্রাইস এবং কার্ট বাটন */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50 px-1">
                  <span className="text-xl font-black text-gray-900">{food.price}</span>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3.5 rounded-xl bg-gray-900 hover:bg-[#ff6b35] text-white transition-colors duration-300 shadow-md"
                  >
                    <FaShoppingBag size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Categories;