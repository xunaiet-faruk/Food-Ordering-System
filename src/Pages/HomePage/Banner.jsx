import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPizzaSlice, FaHamburger, FaBirthdayCake, FaStar, FaTruck, FaClock } from "react-icons/fa";

const Banner = () => {
  // ✅ ১০০% ওয়ার্কিং ইমেজ URL
  const foodImages = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [foodImages.length, isHovering]);

  // টেক্সট অ্যানিমেশন
  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } }
  };

  // হালকা স্লাইড অ্যানিমেশন
  const imageAnimation = {
    initial: { opacity: 0, x: 50, scale: 0.8 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.8,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  // ✅ সব ইমেজের জন্য একই রাউন্ডেড স্টাইল
  const sameRoundedStyle = "rounded-[40%_60%_40%_60%_/_60%_40%_60%_40%]";

  // ফ্লোটিং এলিমেন্ট অ্যানিমেশন
  const floatAnimation = {
    y: [0, -15, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  const floatAnimation2 = {
    y: [0, 15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
  };

  return (
    <div className="relative container mx-auto flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
      
      {/* ডেকোরেটিভ শেপ */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-l from-orange-200/30 to-transparent pointer-events-none rounded-l-[100px] hidden md:block" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-orange-300/20 rounded-full filter blur-3xl -mr-48 -mt-48 hidden lg:block" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-pink-300/20 rounded-full filter blur-3xl -ml-48 -mb-48 hidden lg:block" />

      {/* ফ্লোটিং আইকন */}
      <motion.div 
        animate={floatAnimation}
        className="absolute top-20 left-10 text-orange-400/40 hidden xl:block"
      >
        <FaPizzaSlice size={40} />
      </motion.div>
      <motion.div 
        animate={floatAnimation2}
        className="absolute bottom-20 left-1/4 text-orange-400/30 hidden xl:block"
      >
        <FaHamburger size={50} />
      </motion.div>
      <motion.div 
        animate={floatAnimation}
        className="absolute top-1/3 right-1/4 text-orange-400/30 hidden xl:block"
      >
        <FaBirthdayCake size={35} />
      </motion.div>

      {/* রেটিং ব্যাজ */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute top-24 right-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 hidden lg:block border border-orange-100"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1,2,3,4,5].map((star) => (
              <FaStar key={star} className="text-yellow-400" size={16} />
            ))}
          </div>
          <span className="font-bold text-gray-800">4.9</span>
          <span className="text-gray-400 text-sm">(2.3k)</span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full relative z-10">
        
        {/* --- বামপাশ: কন্টেন্ট --- */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={textContainer}
          className="space-y-6 text-center md:text-left"
        >
          <motion.h1 
            variants={textItem}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-800 leading-[1.1] tracking-tight"
          >
            Taste The <br />
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Extraordinary
            </span>
            <br />
            <span className="relative">
              Every Day
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 10">
                <path d="M10,5 Q75,15 150,5 Q225,-5 290,5" stroke="#ff6b35" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            variants={textItem}
            className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed"
          >
            Craving something delicious? From cheesy pizzas to juicy burgers 
            and mouthwatering cakes — we bring the best flavors straight 
            to your door, hot and fresh in just <span className="text-orange-500 font-bold">30 minutes</span>.
          </motion.p>

          {/* স্ট্যাটাস বার */}
          <motion.div 
            variants={textItem}
            className="flex flex-wrap justify-center md:justify-start gap-6 pt-2"
          >
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <FaTruck className="text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaClock className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">30 Min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <FaStar className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">4.9 Rating</span>
            </div>
          </motion.div>

          <motion.div 
            variants={textItem}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4"
          >
            <Link 
              to="/foods" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 transition duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              Order Now <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link 
              to="/foods" 
              className="w-full sm:w-auto flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 font-bold px-10 py-4 rounded-full border-2 border-gray-200 hover:border-orange-300 transition duration-300 transform hover:-translate-y-1"
            >
              View Menu
            </Link>
          </motion.div>
        </motion.div>

        {/* --- ডানপাশ: পুলস অ্যানিমেশন সহ ইমেজ --- */}
        <div 
          className="relative flex justify-center items-center h-[350px] sm:h-[450px] lg:h-[500px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          
          {/* 🎯 পুলসিং রিং ইফেক্ট */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] rounded-full border-4 border-orange-200/30"
          />
          
          <motion.div
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.05, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute w-80 h-80 sm:w-96 sm:h-96 lg:w-[460px] lg:h-[460px] rounded-full border-4 border-orange-200/20"
          />

          {/* ব্যাকগ্রাউন্ড ব্লার */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-[380px] lg:h-[380px] bg-gradient-to-tr from-orange-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />

          {/* ✅ মেইন ইমেজ - সব ইমেজের জন্য একই রাউন্ডেড স্টাইল + পুলস */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentIndex}
                src={foodImages[currentIndex]} 
                alt="Delicious Food"
                variants={imageAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] h-auto object-cover shadow-2xl border-4 border-white/50
                  ${sameRoundedStyle}`}
              />
            </AnimatePresence>
          </motion.div>

          {/* ইন্ডিকেটর */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {foodImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-8 bg-orange-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* ট্যাগ */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 border border-orange-100 z-20 hidden sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍕</span>
              <div>
                <p className="text-xs text-gray-400">Today's Special</p>
                <p className="text-sm font-bold text-gray-800">Italian Pizza</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 border border-orange-100 z-20 hidden sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs text-gray-400">Popular</p>
                <p className="text-sm font-bold text-gray-800">30% OFF</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Banner;