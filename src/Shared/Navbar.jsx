import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaHome, FaPizzaSlice, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("customer"); // বা "admin" অথবা null (লগআউট)

  // টগল ফাংশন
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // অ্যাক্টিভ স্টাইল - আন্ডারলাইন ইফেক্ট সহ
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#ff6b35" : "",
    borderBottom: isActive ? "2px solid #ff6b35" : "none",
    paddingBottom: "4px",
    transition: "all 0.3s ease",
  });

  // নেভ লিংকস
  const navLinks = [
    { path: "/", name: "Home", icon: <FaHome /> },
    { path: "/foods", name: "Foods", icon: <FaPizzaSlice /> },
    { path: "/cart", name: "Cart", icon: <FaShoppingCart /> },
    { path: "/profile", name: "Profile", icon: <FaUser /> },
  ];

  // অ্যাডমিন লিংকস (শুধু অ্যাডমিন দেখবে)
  const adminLinks = [
    { path: "/admin/dashboard", name: "Dashboard" },
    { path: "/admin/orders", name: "Orders" },
    { path: "/admin/foods", name: "Manage Foods" },
  ];

  return (
    <nav className="bg-gradient-to-br from-orange-50 via-white to-pink-50 container mx-auto sticky top-0 z-50">
      <div className="  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl font-bold text-orange-500">🍕 Food</span>
            <span className="text-2xl font-bold text-gray-700">Hub</span>
          </Link>

          {/* --- Desktop Menu --- */}
          <div className="hidden md:flex items-center space-x-8">
            {/* কাস্টমার লিংকস */}
            {userRole === "customer" &&
              navLinks.map((link) => (
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

            {/* অ্যাডমিন লিংকস */}
            {userRole === "admin" &&
              adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={activeStyle}
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-300"
                >
                  {link.name}
                </NavLink>
              ))}
          </div>

          {/* --- Desktop Right Side (Auth Buttons) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {userRole ? (
              // লগআউট বাটন
              <button
                onClick={() => setUserRole(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              // লগইন / রেজিস্টার
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* --- Mobile Hamburger Icon --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu (Dropdown) --- */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          {/* কাস্টমার মোবাইল লিংকস */}
          {userRole === "customer" &&
            navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                style={({ isActive }) => ({
                  color: isActive ? "#ff6b35" : "",
                  borderLeft: isActive ? "4px solid #ff6b35" : "none",
                  paddingLeft: isActive ? "8px" : "0",
                })}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-500 font-medium py-2 transition duration-300"
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}

          {/* অ্যাডমিন মোবাইল লিংকস */}
          {userRole === "admin" &&
            adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                style={({ isActive }) => ({
                  color: isActive ? "#ff6b35" : "",
                  borderLeft: isActive ? "4px solid #ff6b35" : "none",
                  paddingLeft: isActive ? "8px" : "0",
                })}
                className="block text-gray-700 hover:text-orange-500 font-medium py-2 transition duration-300"
              >
                {link.name}
              </NavLink>
            ))}

          {/* মোবাইলে Auth বাটনস */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            {userRole ? (
              <button
                onClick={() => {
                  setUserRole(null);
                  closeMenu();
                }}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-center text-gray-700 hover:text-orange-500 font-medium py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block text-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;