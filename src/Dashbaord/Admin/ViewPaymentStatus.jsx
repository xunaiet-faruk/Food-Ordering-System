import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCreditCard, FaCheckCircle, FaTimesCircle, 
  FaClock, FaDollarSign, FaUser, FaCalendarAlt,
  FaEye, FaPrint, FaDownload, FaSync
} from 'react-icons/fa';

const ViewPaymentStatus = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ===== হার্ডকোডেড পেমেন্ট ডেটা =====
  const paymentsData = [
    {
      id: "PAY-001",
      orderId: "ORD-001",
      customer: "John Doe",
      amount: 37.90,
      method: "Cash on Delivery",
      status: "Completed",
      date: "2026-06-20",
      time: "10:30 AM",
      transactionId: "TXN-123456789",
      cardType: null,
      bankName: null,
      reference: "REF-001-2026"
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      customer: "Jane Smith",
      amount: 38.50,
      method: "Card Payment",
      status: "Completed",
      date: "2026-06-20",
      time: "12:15 PM",
      transactionId: "TXN-987654321",
      cardType: "Visa",
      bankName: "DBBL",
      reference: "REF-002-2026"
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      customer: "Mike Johnson",
      amount: 41.80,
      method: "Cash on Delivery",
      status: "Pending",
      date: "2026-06-19",
      time: "06:45 PM",
      transactionId: null,
      cardType: null,
      bankName: null,
      reference: "REF-003-2026"
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      customer: "Sarah Wilson",
      amount: 44.00,
      method: "Card Payment",
      status: "Completed",
      date: "2026-06-19",
      time: "02:20 PM",
      transactionId: "TXN-456789123",
      cardType: "Mastercard",
      bankName: "Brac Bank",
      reference: "REF-004-2026"
    },
    {
      id: "PAY-005",
      orderId: "ORD-005",
      customer: "David Brown",
      amount: 43.80,
      method: "Cash on Delivery",
      status: "Failed",
      date: "2026-06-18",
      time: "08:10 PM",
      transactionId: null,
      cardType: null,
      bankName: null,
      reference: "REF-005-2026"
    },
    {
      id: "PAY-006",
      orderId: "ORD-006",
      customer: "Emily Taylor",
      amount: 47.50,
      method: "Card Payment",
      status: "Completed",
      date: "2026-06-18",
      time: "04:30 PM",
      transactionId: "TXN-321654987",
      cardType: "Visa",
      bankName: "City Bank",
      reference: "REF-006-2026"
    },
    {
      id: "PAY-007",
      orderId: "ORD-007",
      customer: "Robert Lee",
      amount: 32.40,
      method: "Cash on Delivery",
      status: "Pending",
      date: "2026-06-17",
      time: "07:20 PM",
      transactionId: null,
      cardType: null,
      bankName: null,
      reference: "REF-007-2026"
    },
    {
      id: "PAY-008",
      orderId: "ORD-008",
      customer: "Lisa Chen",
      amount: 28.50,
      method: "Card Payment",
      status: "Completed",
      date: "2026-06-17",
      time: "02:45 PM",
      transactionId: "TXN-789123456",
      cardType: "Mastercard",
      bankName: "DBBL",
      reference: "REF-008-2026"
    },
    {
      id: "PAY-009",
      orderId: "ORD-009",
      customer: "James Wilson",
      amount: 43.80,
      method: "Card Payment",
      status: "Refunded",
      date: "2026-06-16",
      time: "01:10 PM",
      transactionId: "TXN-654987321",
      cardType: "Visa",
      bankName: "Brac Bank",
      reference: "REF-009-2026"
    },
    {
      id: "PAY-010",
      orderId: "ORD-010",
      customer: "Anna Martinez",
      amount: 22.30,
      method: "Cash on Delivery",
      status: "Completed",
      date: "2026-06-16",
      time: "11:30 AM",
      transactionId: null,
      cardType: null,
      bankName: null,
      reference: "REF-010-2026"
    }
  ];

  // ===== স্ট্যাটাসের জন্য রং =====
  const getStatusColor = (status) => {
    const colors = {
      "Completed": "bg-green-50 text-green-700 border-green-200",
      "Pending": "bg-amber-50 text-amber-700 border-amber-200",
      "Failed": "bg-rose-50 text-rose-700 border-rose-200",
      "Refunded": "bg-purple-50 text-purple-700 border-purple-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Completed": <FaCheckCircle className="text-green-500" />,
      "Pending": <FaClock className="text-amber-500" />,
      "Failed": <FaTimesCircle className="text-rose-500" />,
      "Refunded": <FaCheckCircle className="text-purple-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  // ===== স্ট্যাটিস্টিক্স =====
  const stats = {
    total: paymentsData.length,
    completed: paymentsData.filter(p => p.status === "Completed").length,
    pending: paymentsData.filter(p => p.status === "Pending").length,
    failed: paymentsData.filter(p => p.status === "Failed").length,
    refunded: paymentsData.filter(p => p.status === "Refunded").length,
    totalAmount: paymentsData.reduce((acc, p) => acc + p.amount, 0)
  };

  // ===== ডিটেইলস ভিউ =====
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  return (
    <div className="w-full min-h-full">
      
      {/* ===== হেডার ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaCreditCard className="text-[#FF6B35]" />
            Payment Status
            <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {paymentsData.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track all payment transactions and status
          </p>
        </div>
        
       
      </div>


      {/* ===== পেমেন্ট টেবিল ===== */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Payment ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentsData.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-orange-50/70 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-gray-900">{payment.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700">{payment.orderId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-[#FF6B35] font-bold text-xs">
                        {payment.customer.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-gray-800">{payment.customer}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-black text-[#FF6B35]">${payment.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      {payment.method === "Card Payment" ? "💳" : "💵"}
                      {payment.method}
                    </p>
                    {payment.cardType && (
                      <p className="text-[9px] text-gray-400">{payment.cardType}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(payment.status)} flex items-center gap-1.5 w-fit`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaCalendarAlt size={10} />
                      <span>{payment.date}</span>
                    </div>
                    <div className="text-[10px] text-gray-300 mt-0.5">{payment.time}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(payment)}
                      className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50/50 hover:border-orange-100 transition-all mx-auto"
                      title="View Details"
                    >
                      <FaEye size={12} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== পেমেন্ট ডিটেইলস মোডাল ===== */}
      {showDetails && selectedPayment && (
        <>
          <div
            onClick={() => setShowDetails(false)}
            className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
          />
          <div className="fixed inset-4 sm:inset-10 z-50 bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto overflow-y-auto p-6 sm:p-8">
            
            {/* ===== মোডাল হেডার ===== */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-900">Payment Details</h2>
                <p className="text-xs text-gray-400">{selectedPayment.id}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-xl"
              >
                ×
              </button>
            </div>

            {/* ===== পেমেন্ট ইনফো ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Information</p>
                <div className="mt-2 space-y-2">
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-black text-[#FF6B35]">${selectedPayment.amount.toFixed(2)}</span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Method</span>
                    <span className="font-bold text-gray-800">{selectedPayment.method}</span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(selectedPayment.status)} flex items-center gap-1`}>
                      {getStatusIcon(selectedPayment.status)}
                      {selectedPayment.status}
                    </span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-bold text-gray-800">{selectedPayment.reference}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction Details</p>
                <div className="mt-2 space-y-2">
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-bold text-gray-800">{selectedPayment.orderId}</span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Customer</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <FaUser size={10} className="text-gray-400" /> {selectedPayment.customer}
                    </span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-bold text-gray-800">{selectedPayment.transactionId || "N/A"}</span>
                  </p>
                  {selectedPayment.cardType && (
                    <p className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Card Type</span>
                      <span className="font-bold text-gray-800">{selectedPayment.cardType} • {selectedPayment.bankName}</span>
                    </p>
                  )}
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <FaCalendarAlt size={10} className="text-gray-400" /> {selectedPayment.date}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ===== অ্যাকশন বাটন ===== */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <FaPrint size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ViewPaymentStatus;