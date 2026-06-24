import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/foods');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimes className="text-yellow-500 text-5xl" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 mb-6">
          You cancelled the payment process. You can try again anytime.
        </p>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/foods')}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 hover:shadow-xl"
          >
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;