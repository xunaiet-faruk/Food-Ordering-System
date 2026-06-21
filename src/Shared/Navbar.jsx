import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 

import { 
  FaUser, FaShoppingCart, FaHome, FaPizzaSlice, 
  FaBars, FaTimes, FaSignOutAlt, FaThLarge 
} from "react-icons/fa";
import useAuth from "../Hooks/Useauth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // অ্যাক্টিভ স্টাইল - আন্ডারলাইন ইফেক্ট সহ
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#ff6b35" : "",
    borderBottom: isActive ? "2px solid #ff6b35" : "none",
    paddingBottom: "4px",
    transition: "all 0.3s ease",
  });

  const navLinks = [
    { path: "/", name: "Home", icon: <FaHome /> },
    { path: "/foods", name: "Foods", icon: <FaPizzaSlice /> },
  ];

  return (
    <nav className="bg-gradient-to-br from-orange-50 via-white to-pink-50 container mx-auto sticky top-0 z-50 ">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ===== লোগো ===== */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl font-bold text-orange-500">🍕 Food</span>
            <span className="text-2xl font-bold text-gray-700">Hub</span>
          </Link>

          {/* --- Desktop Menu --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={activeStyle}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition duration-300"
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* --- Desktop Right Side (Auth & Avatar Dropdown) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              /* 🟢 ইউজার লগইন থাকলে ড্রপডাউন প্রোফাইল মেনু */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-sm hover:scale-105 transition-transform"
                    />
                  ) : (
                    /* 💫 ইমেজ না থাকলে হালকা পালস অ্যানিমেশন সহ সুন্দর ডিফল্ট আইকন */
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white border border-orange-400 shadow-md"
                    >
                      <FaUser size={16} />
                    </motion.div>
                  )}
                </button>

                {/* ড্রপডাউন বক্স (Framer Motion অ্যানিমেশন সহ) */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                        <p className="text-xs font-black text-gray-700 truncate">{user.displayName || 'User'}</p>
                      </div>

                      <Link
                        to="/dashboard" // আপনার ড্যাশবোর্ডের সঠিক পাথ দেবেন
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35] transition-colors"
                      >
                        <FaThLarge size={13} className="text-gray-400" /> Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          logOut();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-gray-50 mt-1 cursor-pointer"
                      >
                        <FaSignOutAlt size={13} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* 🔴 ইউজার লগআউট থাকলে শুধু লগইন বাটন */
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#FF6B35] to-orange-400 text-white px-5 py-2 rounded-xl text-sm font-black shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* --- Mobile Hamburger Icon --- */}
          <div className="md:hidden flex items-center gap-3">
            {/* মোবাইল মোডেও লগইন থাকলে ইউজারের ছোট্ট অবতার দেখাবে */}
            {user && (
              user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-orange-400 object-cover" />
              ) : (
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs"><FaUser size={12} /></div>
              )
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none cursor-pointer"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu (Dropdown) --- */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              style={({ isActive }) => ({
                color: isActive ? "#ff6b35" : "",
                borderLeft: isActive ? "4px solid #ff6b35" : "none",
                paddingLeft: isActive ? "8px" : "0",
              })}
              className="flex items-center gap-3 text-gray-700 hover:text-orange-500 font-bold py-2 transition duration-300 text-sm"
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}

          {/* মোবাইলে ড্যাশবোর্ড লিঙ্ক (যদি লগইন থাকে) */}
          {user && (
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-3 text-gray-700 hover:text-orange-500 font-bold py-2 text-sm"
            >
              <FaThLarge /> Dashboard
            </Link>
          )}

          {/* মোবাইলে Auth সেকশন */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  logOut();
                  closeMenu();
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-center bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;