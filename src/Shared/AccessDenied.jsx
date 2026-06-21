import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[75vh] flex flex-col items-center justify-center bg-white rounded-[28px] border border-dashed border-gray-200 p-8 shadow-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mb-5 shadow-sm"
      >
        <span className="text-2xl">⚠️</span>
      </motion.div>
      
      <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">
        Restricted Area
      </h3>
      <h2 className="text-xl font-black text-gray-800 mt-1">
        Access Denied
      </h2>
      <p className="text-[12px] text-gray-400 font-medium mt-2 max-w-xs text-center leading-relaxed">
        Sorry, you do not have permission to view this page. This area is restricted based on your current account role.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
      >
        Back to Safety
      </button>
    </div>
  );
};

export default AccessDenied;