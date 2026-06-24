import { FaCheckCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from "react-router-dom";
import Useaxios from "../../Hooks/Useaxios";
import useAuth from "../../Hooks/Useauth";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const axiosPublic = Useaxios();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const statusCode = searchParams.get('status_code');
        const transactionId = searchParams.get('transaction_id');
        const realOrderId = searchParams.get('real_order_id');
        const orderIdParam = searchParams.get('order_id');
        const amount = searchParams.get('amount');
        const paymentMethod = searchParams.get('payment_method');

        console.log('📥 Payment Response:', {
          statusCode,
          transactionId,
          realOrderId,
          orderIdParam,
          amount,
          paymentMethod
        });

        let targetId = realOrderId;
        
        if (targetId === 'cart-order-temp' || !targetId || targetId === 'null' || targetId === 'undefined') {
          console.log('⚠️ realOrderId is cart-order-temp or invalid, finding pending order...');
          
          try {
            const ordersResponse = await axiosPublic.get(`/orders/${user?.email}`);
            const orders = ordersResponse.data?.data || [];
            
            const pendingOrder = orders.find(o => 
              o.status === 'Pending' || 
              o.status === 'pending' || 
              o.status === 'PENDING'
            );
            
            if (pendingOrder) {
              targetId = pendingOrder._id;
              console.log(`✅ Found pending order: ${targetId}`);
            }
          } catch (findError) {
            console.error('❌ Error finding pending order:', findError);
          }
        }

        if (!targetId || targetId === 'cart-order-temp') {
          targetId = orderIdParam;
          console.log(`ℹ️ Using orderIdParam as fallback: ${targetId}`);
        }

        const isSuccess = statusCode === '2' || statusCode === null;
        
        console.log(`🔍 Status check: isSuccess=${isSuccess}, targetId=${targetId}`);

        if (isSuccess && targetId && targetId !== 'cart-order-temp' && targetId !== 'null') {
          setOrderId(targetId);

          try {
            let orderExists = false;
            try {
              const checkResponse = await axiosPublic.get(`/orders/check/${targetId}`);
              if (checkResponse.data?.success && checkResponse.data?.data) {
                orderExists = true;
                console.log('✅ Order exists:', checkResponse.data.data);
              }
            } catch (checkError) {
              console.log('ℹ️ Order not found, will create new one if needed');
            }

            if (orderExists) {
              await axiosPublic.put(`/orders/status/${targetId}`, {
                status: 'Paid',
                transactionId: transactionId || 'sandbox-payment-' + Date.now(),
                paymentStatus: 'success',
                paymentMethod: paymentMethod || 'PayHere',
                paidAt: new Date().toISOString()
              });
              console.log('✅ Order updated to PAID');
            } else {
              console.log('📝 Creating new order from cart...');
              const cartResponse = await axiosPublic.get(`/cart/${user?.email}`);
              const cartData = cartResponse.data?.data;
              
              if (cartData?.items?.length > 0) {
                const newOrder = {
                  email: user?.email,
                  customerName: user?.displayName || 'Customer',
                  phone: user?.phone || 'N/A',
                  address: 'N/A',
                  items: cartData.items,
                  subtotal: cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                  deliveryFee: 2.00,
                  total: cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2,
                  status: 'Paid',
                  paymentMethod: paymentMethod || 'PayHere',
                  transactionId: transactionId || 'sandbox-payment-' + Date.now(),
                  paidAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                
                const createResponse = await axiosPublic.post('/orders', newOrder);
                console.log('✅ New order created');
                setOrderId(createResponse.data?.data?.insertedId);
              }
            }

            if (user?.email) {
              try {
                await axiosPublic.delete(`/cart/${user.email}`);
                console.log('✅ Cart cleared successfully');
              } catch (cartError) {
                console.error('❌ Error clearing cart:', cartError);
              }
            }

            setPaymentStatus('success');
            
            await Swal.fire({
              icon: 'success',
              title: '🎉 Payment Successful!',
              text: 'Your order has been confirmed.',
              timer: 1500,
              showConfirmButton: false
            });

          } catch (updateError) {
            console.error('⚠️ Order update error:', updateError);
            setPaymentStatus('success');
            
            await Swal.fire({
              icon: 'success',
              title: '🎉 Payment Successful!',
              text: 'Your order has been confirmed.',
              timer: 1500,
              showConfirmButton: false
            });
          }

          setTimeout(() => {
            navigate('/dashboard/payment-history');
            window.location.reload();
          }, 2000);

        } else if (statusCode === '0' || statusCode === '-1' || statusCode === '-2') {
          setPaymentStatus('failed');
          await Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Your payment was not completed. Please try again.',
            confirmButtonColor: '#FF6B35'
          });
          
          setTimeout(() => {
            navigate('/foods');
          }, 2000);
          
        } else {
          console.log('ℹ️ Treating as success (sandbox fallback)');
          setPaymentStatus('success');
          
          if (targetId && targetId !== 'cart-order-temp' && targetId !== 'null') {
            try {
              await axiosPublic.put(`/orders/status/${targetId}`, {
                status: 'Paid',
                transactionId: 'sandbox-payment-' + Date.now(),
                paymentStatus: 'success',
                paymentMethod: 'PayHere',
                paidAt: new Date().toISOString()
              });
              if (user?.email) {
                await axiosPublic.delete(`/cart/${user.email}`);
              }
            } catch (e) {
              console.warn('Could not update order:', e);
            }
          }
          
          await Swal.fire({
            icon: 'success',
            title: '🎉 Payment Successful!',
            text: 'Your order has been confirmed.',
            timer: 1500,
            showConfirmButton: false
          });
          
          setTimeout(() => {
            navigate('/dashboard/payment-history');
            window.location.reload();
          }, 2000);
        }

      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setPaymentStatus('failed');
        await Swal.fire({
          icon: 'error',
          title: 'Verification Error',
          text: error.message || 'Something went wrong. Please check your orders.',
          confirmButtonColor: '#FF6B35'
        });
        
        setTimeout(() => {
          navigate('/dashboard/orders');
        }, 2000);
        
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, axiosPublic, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-green-500 text-5xl" />
          </motion.div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>

          {orderId && orderId !== 'null' && orderId !== 'cart-order-temp' && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-gray-900">#{orderId.toString().slice(-10).toUpperCase()}</p>
            </div>
          )}

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate('/dashboard/payment-history');
                window.location.reload();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 hover:shadow-xl"
            >
              <FaShoppingBag /> View Payment History
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <FaHome /> Continue Shopping
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">❌</span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Payment Failed!
        </h1>
        <p className="text-gray-500 mb-6">
          Your payment was not completed. Please try again.
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
            <FaHome /> Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;