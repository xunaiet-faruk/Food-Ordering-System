import { motion } from "framer-motion";
import { FaShippingFast, FaUtensils, FaHeadset, FaWallet } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Super Fast Delivery",
      desc: "Your food delivered hot and fresh to your doorstep within 30 minutes, anywhere, anytime.",
      icon: <FaShippingFast size={32} />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-500",
    },
    {
      id: 2,
      title: "Best Quality Food",
      desc: "We maintain 100% hygiene and source our ingredients from local organic farms daily.",
      icon: <FaUtensils size={30} />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-500",
    },
    {
      id: 3,
      title: "24/7 Customer Support",
      desc: "Got a question? Our dedicated support team is available around the clock to help you out.",
      icon: <FaHeadset size={30} />,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-500",
    },
    {
      id: 4,
      title: "Affordable Pricing",
      desc: "Enjoy your favourite meals with exciting daily discounts, cashback offers, and zero hidden fees.",
      icon: <FaWallet size={28} />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="py-24  px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-pink-100/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight pb-2 text-gray-900">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-5 text-sm sm:text-base font-medium leading-relaxed">
            We don't just deliver food; we deliver an exceptional experience tailored with speed, hygiene, and premium taste.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                boxShadow: "0px 25px 50px -12px rgba(255, 107, 53, 0.12)"
              }}
              className="bg-white border border-gray-100/80 rounded-[2.5rem] p-8 transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className={`w-16 h-16 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-gradient-to-br ${item.color} group-hover:text-white group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                {item.icon}
              </div>

              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight transition-colors duration-300 group-hover:text-[#ff6b35]">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-3 text-sm font-medium leading-relaxed">
                {item.desc}
              </p>

              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gray-50 rounded-full transition-all duration-500 group-hover:bg-orange-100/50 group-hover:scale-150 pointer-events-none -z-10" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;