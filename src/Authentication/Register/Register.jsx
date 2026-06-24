import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  FaGoogle, FaEnvelope, FaLock, FaUser, 
  FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import useAuth from '../../Hooks/Useauth';
import { auth } from '../Firebase/Firebase';
import Useaxios from '../../Hooks/Useaxios';

const Register = () => {
  const { createUser, loginUser, updateUserProfile } = useAuth();
  const axiosPublic = Useaxios();
  const navigate = useNavigate(); 

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const { name, email, password } = formData;

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await createUser(email, password);
        await updateUserProfile(name);

       
        const userInfo = {
          name: name,
          email: email,
          role: "Customer"  
        };
        
        const response = await axiosPublic.post('/users', userInfo);
        console.log("✅ User saved to database:", response.data);
      }

      setIsLoading(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/dashboard"); 
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("This email is already registered.");
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage("Wrong email or password. Please try again.");
      } else {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

  
      const userInfo = {
        name: user.displayName,
        email: user.email,
        role: "Customer"  
      };
      
      const response = await axiosPublic.post('/users', userInfo);
      console.log("✅ Google user saved to database:", response.data);
      
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/dashboard"); 
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
        >
          <FaCheckCircle size={18} />
          <span className="font-bold text-sm">
            {isLogin ? "Logged in successfully!" : "Account created successfully!"}
          </span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-gray-100"
      >
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-orange-400 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-orange-500/20">
            🍕
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-3">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-400">
            {isLogin ? "Login to continue" : "Join us and start ordering"}
          </p>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-center"
          >
            <p className="text-xs text-rose-500 font-bold">{errorMessage}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          disabled={isLoading}
          type="button"
          className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <FaGoogle className="text-[#4285F4] text-xl" />
          <span className="text-sm font-bold text-gray-700">
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </span>
        </motion.button>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-bold text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                <FaUser className="inline mr-1.5 text-gray-400" size={11} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              <FaEnvelope className="inline mr-1.5 text-gray-400" size={11} />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              <FaLock className="inline mr-1.5 text-gray-400" size={11} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-orange-400 text-white font-bold text-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Login" : "Create Account"}
                <FaArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => { setIsLogin(false); setErrorMessage(""); }}
                  className="text-[#FF6B35] font-bold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setIsLogin(true); setErrorMessage(""); }}
                  className="text-[#FF6B35] font-bold hover:underline cursor-pointer"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;