import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { id: 1, icon: <FaFacebookF size={16} />, link: "#", color: "hover:bg-blue-600" },
    { id: 2, icon: <FaTwitter size={16} />, link: "#", color: "hover:bg-sky-500" },
    { id: 3, icon: <FaInstagram size={16} />, link: "#", color: "hover:bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600" },
    { id: 4, icon: <FaLinkedinIn size={16} />, link: "#", color: "hover:bg-blue-700" },
  ];

  return (
    <footer className="bg-white container mx-auto border-t border-gray-100 px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative overflow-hidden">
      
      <div className="container mx-auto">
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12  text-left">
            <div className="space-y-5">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Food<span className="text-[#ff6b35]">Express</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Bringing premium quality, fresh, and hygienic meals from your favourite restaurants directly to your comfort zone.
            </p>
          
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.link}
                  whileHover={{ y: -4 }}
                  className={`w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white ${social.color} hover:border-transparent hover:shadow-md transition-all duration-300`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-extrabold text-base tracking-tight mb-5">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
              {["About Our Journey", "Browse Menu", "Trending Dishes", "Our Premium Chefs", "Latest Food Blogs"].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-[#ff6b35] transition-colors duration-200 block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-extrabold text-base tracking-tight mb-5">Support</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
              {["Track Your Rider", "FAQs & Help Center", "Privacy Policy", "Terms of Service", "Refund & Return"].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-[#ff6b35] transition-colors duration-200 block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-extrabold text-base tracking-tight mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm font-semibold text-gray-500">
              <li className="flex items-start gap-3">
                <span className="text-[#ff6b35] mt-1"><FaMapMarkerAlt size={14} /></span>
                <span>House 45, Road 12, Dhanmondi,<br /> Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#ff6b35]"><FaPhoneAlt size={13} /></span>
                <span>+880 1882239828</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#ff6b35]"><FaEnvelope size={13} /></span>
                <span>support@foodexpress.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between text-sm font-semibold text-gray-400 gap-4">
          <p>© {currentYear} FoodExpress. All rights reserved.</p>
          <p>
            Designed with ❤️ by{" "}
            <a href="#" className="text-gray-700 hover:text-[#ff6b35] transition duration-200">
              Xunaiet Faruk
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;