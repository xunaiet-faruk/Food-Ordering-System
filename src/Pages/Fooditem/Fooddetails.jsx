import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaStar, FaShoppingBag, FaArrowLeft, FaMinus, FaPlus, FaClock, FaFire, FaLeaf } from "react-icons/fa";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [activeImage, setActiveImage] = useState(""); // মেইন ডিসপ্লে ছবির স্টেট
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // 3D Card Effect Variables
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(200);
  }

  useEffect(() => {
    fetch("/Menu.json")
      .then((res) => res.json())
      .then((data) => {
        const foundFood = data.find((item) => item._id === id || item.id === id);
        if (foundFood) {
          setFood(foundFood);
          setActiveImage(foundFood.image); // প্রাথমিক মেইন ইমেজ সেট
        } else {
          // Fallback Default ডাটা গ্যালারিসহ
          const defaultFood = {
            _id: id,
            name: "Premium Chef's Special",
            category: "Gourmet",
            price: 15.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
            gallery: [
              "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500",
              "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=500"
            ],
            recipe: "This premium dish is prepared with fresh, organically sourced ingredients, handpicked herbs, and our secret house-blend spices to deliver an authentic culinary experience."
          };
          setFood(defaultFood);
          setActiveImage(defaultFood.image);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading item details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <p className="text-gray-500 font-bold">Food item not found!</p>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-black flex items-center gap-2">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // থাম্বনেইল লিস্ট ট্রিগার করার অ্যারে রেডি করা
  const imageGallery = [food.image, ...(food.gallery || [])];

  return (
    <div className="bg-white min-h-screen pb-24 text-left overflow-x-hidden">
      {/* Top Navigation Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-orange-500 transition-colors bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 shadow-sm cursor-pointer"
        >
          <FaArrowLeft size={12} /> Back to Menu
        </motion.button>
      </div>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Canvas 3D + Multi Image Gallery Grid */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouse}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="w-full h-[380px] sm:h-[480px] rounded-[3rem] overflow-hidden bg-gray-50 shadow-2xl border border-gray-100 relative cursor-grab active:cursor-grabbing"
            >
              {/* মেইন অ্যাক্টিভ ইমেজ ট্রানজিশন */}
              <motion.img
                key={activeImage}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={activeImage}
                alt={food.name}
                className="w-full h-full object-cover pointer-events-none"
              />
              
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-gray-800 shadow-lg flex items-center gap-1.5">
                <FaStar className="text-amber-500" size={13} /> 4.9
              </div>
            </motion.div>

            {/* থাম্বনেইল গ্যালারি সেকশন (Thumbnail List Grid) */}
            <div className="grid grid-cols-3 gap-4 px-2">
              {imageGallery.map((imgUrl, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`h-24 sm:h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-md bg-gray-50 ${
                    activeImage === imgUrl ? "border-orange-500 ring-4 ring-orange-100" : "border-gray-100 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="food gallery" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Spec Sheet & Staggered Actions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-xs uppercase font-black text-orange-600 tracking-widest bg-orange-50 px-4 py-1.5 rounded-full inline-block border border-orange-100">
                {food.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
                {food.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-gray-500 pt-2 text-xs font-bold">
                <span className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 shadow-sm"><FaClock className="text-orange-500" /> 15-20 Min</span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 shadow-sm"><FaFire className="text-red-500" /> 320 Cal</span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 shadow-sm"><FaLeaf className="text-green-500" /> 100% Fresh</span>
              </div>
            </motion.div>

            <hr className="border-gray-100" />

            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">The Story / Recipe</h3>
              <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed">
                {food.recipe}
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 bg-gray-50/80 p-6 rounded-[2.5rem] border border-gray-100"
            >
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unit Price</p>
                <p className="text-3xl font-black text-gray-950 tracking-tight">${food.price}</p>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity</p>
                <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    <FaMinus size={10} />
                  </motion.button>
                  <motion.span 
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-4 font-black text-sm text-gray-800 inline-block"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    <FaPlus size={10} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between gap-6 pt-2"
            >
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Cart Value</p>
                <motion.p 
                  key={quantity}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-black text-orange-500 tracking-tight"
                >
                  ${(food.price * quantity).toFixed(2)}
                </motion.p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert(`Successfully added ${quantity}x ${food.name} to your tray!`)}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black text-sm px-8 py-5 rounded-2xl shadow-xl shadow-orange-500/20 cursor-pointer flex-grow sm:flex-none"
              >
                <FaShoppingBag size={14} /> Add To Cart Tray
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FoodDetails;