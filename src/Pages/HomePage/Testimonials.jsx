import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Samiul Islam",
      role: "Food Blogger",
      rating: 5,
      comment: "The burgers from this app are pure perfection! Delivery was incredibly fast, and the food arrived steaming hot. Easily my go-to app now.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Anika Rahman",
      role: "Software Engineer",
      rating: 5,
      comment: "I am amazed by their hybrid tab navigation. Finding my favorite desserts takes just one click, and the UI is incredibly smooth!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Zayan Ahmed",
      role: "Regular Customer",
      rating: 4.9,
      comment: "Highly impressed with the quality of food and packaging. No spills, no delays. The gradient design elements look super gorgeous too!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
  ];

  // ইনফিনিটি লুপ বা চিরকাল স্লাইডিং ধরে রাখার জন্য ডেটা ডুপ্লিকেট করা হয়েছে
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* --- বাম পাশ: সেন্ট্রাল হেডিং (ব্ল্যাক + গ্রাডিয়েন্ট) --- */}
        <div className="text-left max-w-xl">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.15]">
            What Our <br />
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-400 to-pink-500 mt-5 rounded-full" />
          <p className="text-gray-500 mt-6 text-base font-medium leading-relaxed">
            Don't just take our word for it. Look at this endless stream of love from our regular foodies who order daily!
          </p>
        </div>

        {/* --- ডান পাশ: ইনফিনিটি ভার্টিক্যাল স্লাইডার কন্টেইনার --- */}
        <div className="relative h-[480px] w-full overflow-hidden rounded-[2.5rem]  p-6">
          
          {/* উপর ও নিচের ফেড ইফেক্ট (যাতে স্লাইডারটি কেটে না গিয়ে মসৃণভাবে মিলিয়ে যায়) */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

          {/* ইনফিনিটি মোশন অ্যানিমেশন ট্র্যাক */}
          <motion.div
            className="space-y-6 flex flex-col"
            animate={{
              y: [0, -960], // অনবরত অক্ষ বরাবর উপরের দিকে স্লাইড হবে
            }}
            transition={{
              duration: 22, // স্লাইডিং স্পিড (কম্পোর্ট ফিল দেওয়ার জন্য স্লো রাখা হয়েছে)
              ease: "linear",
              repeat: Infinity, // আজীবন আনলিমিটেড চলতে থাকবে
            }}
          >
            {duplicatedReviews.map((user, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* কোট আইকন */}
                <div className="absolute top-6 right-6 text-orange-100 pointer-events-none">
                  <FaQuoteLeft size={22} />
                </div>

                {/* কাস্টমার কমেন্ট এবং রেটিং */}
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={13} />
                    ))}
                    <span className="text-xs font-bold text-gray-400 ml-1">({user.rating})</span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
                    "{user.comment}"
                  </p>
                </div>

                {/* কাস্টমার প্রোফাইল */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-50">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-50"
                  />
                  <div>
                    <h4 className="text-sm font-black text-gray-800">
                      {user.name}
                    </h4>
                    <p className="text-xs font-semibold text-gray-400">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;