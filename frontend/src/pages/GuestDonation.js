// this file is guest donation 
// GuestDonation.js

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Heart,
//   Users,
//   DollarSign,
 
//   AlertCircle,
//   ArrowLeft,
//   Gift,
// } from 'lucide-react';

// const GuestDonation = () => {
//   const navigate = useNavigate();

//   // Form state
//   const [donorName, setDonorName] = useState('');
//   const [donorPhone, setDonorPhone] = useState('');
//   const [donorEmail, setDonorEmail] = useState('');
//   const [amount, setAmount] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // Predefined amounts
//   const predefinedAmounts = [500, 1000, 2000, 5000];

//   // Load Razorpay script
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // Handle donation
//   const handleDonate = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Validate amount
//       if (!amount || parseFloat(amount) < 1) {
//         setError('Please enter a valid amount');
//         setLoading(false);
//         return;
//       }

//       // Load Razorpay script
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         setError('Failed to load payment gateway. Please try again.');
//         setLoading(false);
//         return;
//       }

//       // Create order
//       const orderResponse = await axios.post(
//         `${API_URL}/api/guest-donations/create-order`,
//         { amount: parseFloat(amount) }
//       );

//       const { order } = orderResponse.data;

//       // Razorpay options
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: 'Hope Circle Foundation',
//         description: 'Support those in need',
//         order_id: order.id,
//         handler: async (response) => {
//           try {
//             console.log('Payment successful, verifying...', response);
            
//             // Verify payment
//             const verifyResponse = await axios.post(
//               `${API_URL}/api/guest-donations/verify`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 amount: order.amount,
//                 donorName: donorName || 'Anonymous',
//                 donorPhone: donorPhone || null,
//                 donorEmail: donorEmail || null,
//                 message: message || 'Guest donation',
//               }
//             );

//             console.log('Verification response:', verifyResponse.data);

//             // Success - Navigate to thank you page
//             if (verifyResponse.data.success) {
//               navigate('/donation-success', {
//                 state: {
//                   donation: verifyResponse.data.donation,
//                 },
//               });
//             } else {
//               setError('Payment verification failed. Please contact support.');
//               setLoading(false);
//             }
//           } catch (err) {
//             console.error('Verification error:', err);
//             setError(
//               err.response?.data?.message || 'Payment verification failed. Please contact support.'
//             );
//             setLoading(false);
//           }
//         },
//         prefill: {
//           name: donorName || '',
//           email: donorEmail || '',
//           contact: donorPhone || '',
//         },
//         theme: {
//           color: '#2563eb',
//         },
//         modal: {
//           ondismiss: () => {
//             setLoading(false);
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       console.error('Donation error:', err);
//       setError(err.response?.data?.message || 'Failed to process donation');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
//         <div className="max-w-4xl mx-auto px-4">
//           <button
//             onClick={() => navigate('/')}
//             className="flex items-center text-white hover:text-blue-100 mb-4"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Back to Home
//           </button>
//           <div className="text-center">
//             <Heart size={64} className="mx-auto mb-4 animate-pulse" />
//             <h1 className="text-4xl font-bold mb-2">Make a Difference Today</h1>
//             <p className="text-xl text-blue-100">
//               Your generosity changes lives
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left Side - Impact Info */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-3">
//                 Why Your Donation Matters
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <Users className="text-blue-600 mr-3 mt-1" size={24} />
//                   <div>
//                     <h3 className="font-semibold text-gray-800">Help Families</h3>
//                     <p className="text-gray-600 text-sm">
//                       Support poor families with essential needs
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Heart className="text-red-500 mr-3 mt-1" size={24} />
//                   <div>
//                     <h3 className="font-semibold text-gray-800">Support Orphans</h3>
//                     <p className="text-gray-600 text-sm">
//                       Provide care and education to orphaned children
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Gift className="text-green-600 mr-3 mt-1" size={24} />
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       Aid Differently-Abled
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Assist physically challenged individuals
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
//               <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
//               <p className="text-sm">
//                 Every rupee is tracked and shown on our public dashboard. Your
//                 donation directly helps those in need.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-3">
//                 Quick Facts
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <p className="text-gray-600">✅ No registration required</p>
//                 <p className="text-gray-600">✅ Instant SMS receipt</p>
//                 <p className="text-gray-600">✅ 100% secure payment</p>
//                 <p className="text-gray-600">✅ Tax exemption available</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Donation Form */}
//           <div className="bg-white rounded-lg shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//               Donate Now
//             </h2>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-4 rounded">
//                 <div className="flex items-center">
//                   <AlertCircle className="text-red-600 mr-3" size={20} />
//                   <p className="text-red-800 text-sm">{error}</p>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleDonate}>
//               {/* Name (Optional) */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Your Name (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   value={donorName}
//                   onChange={(e) => setDonorName(e.target.value)}
//                   placeholder="Anonymous"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Leave blank to donate anonymously
//                 </p>
//               </div>

//               {/* Phone (Optional) */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Phone Number (Optional)
//                 </label>
//                 <input
//                   type="tel"
//                   value={donorPhone}
//                   onChange={(e) => setDonorPhone(e.target.value)}
//                   placeholder="+91 9876543210"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   For SMS donation receipt
//                 </p>
//               </div>

//               {/* Email (Optional) */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Email (Optional)
//                 </label>
//                 <input
//                   type="email"
//                   value={donorEmail}
//                   onChange={(e) => setDonorEmail(e.target.value)}
//                   placeholder="your@email.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   For email receipt
//                 </p>
//               </div>

//               {/* Predefined Amounts */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Select Amount
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {predefinedAmounts.map((amt) => (
//                     <button
//                       key={amt}
//                       type="button"
//                       onClick={() => setAmount(amt.toString())}
//                       className={`py-3 rounded-lg font-semibold transition duration-200 ${
//                         amount === amt.toString()
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       ₹{amt.toLocaleString()}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Custom Amount */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Or Enter Custom Amount *
//                 </label>
//                 <div className="relative">
//                   <DollarSign
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                     size={20}
//                   />
//                   <input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="Enter amount"
//                     min="1"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Message (Optional) */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-semibold mb-2">
//                   Message (Optional)
//                 </label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Leave a message of hope..."
//                   rows="3"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 ></textarea>
//               </div>

//               {/* Donate Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Heart className="mr-2" size={24} />
//                     Donate ₹{amount || '0'}
//                   </>
//                 )}
//               </button>

//               <p className="text-center text-xs text-gray-500 mt-4">
//                 🔒 Secure payment powered by Razorpay
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDonation;


/* ---------------------------------------------------
   FINAL POLISHED + ELEGANT UI
   --------------------------------------------------- */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Users,
  DollarSign,
  AlertCircle,
  ArrowLeft,
  Gift,
} from "lucide-react";

const GuestDonation = () => {
  const navigate = useNavigate();

  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const predefinedAmounts = [500, 1000, 2000, 5000];

  /* ---------------------------------------------------
        Razorpay Logic (unchanged)
     --------------------------------------------------- */

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!amount || parseFloat(amount) < 1) {
        setError("Please enter a valid amount");
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const orderResponse = await axios.post(
        `${API_URL}/api/guest-donations/create-order`,
        { amount: parseFloat(amount) }
      );

      const { order } = orderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Hope Circle Foundation",
        description: "Support those in need",
        order_id: order.id,

        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/api/guest-donations/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                donorName: donorName || "Anonymous",
                donorPhone: donorPhone || null,
                donorEmail: donorEmail || null,
                message: message || "Guest donation",
              }
            );

            if (verifyResponse.data.success) {
              navigate("/donation-success", {
                state: { donation: verifyResponse.data.donation },
              });
            } else {
              setError("Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
            setLoading(false);
          }
        },

        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone,
        },

        theme: { color: "#6d28d9" },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process donation");
      setLoading(false);
    }
  };

  /* ---------------------------------------------------
        UI STARTS HERE — FULLY IMPROVED
     --------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* ---------------------------------------------------
          TOP NAVBAR
      --------------------------------------------------- */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/hero1.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
            />
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
              Guest Donation
            </h2>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition shadow-sm"
          >
            Home
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------
          HEADER
      --------------------------------------------------- */}
      <div className="py-10 text-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 bg-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <Heart size={58} className="mx-auto mb-3 text-purple-600 animate-pulse" />
        <h1 className="text-4xl font-bold text-gray-800">
          Make a Difference Today
        </h1>
        <p className="text-gray-600 mt-2">
          Your contribution helps transform lives with dignity.
        </p>
      </div>

      {/* ---------------------------------------------------
          MAIN CONTENT
      --------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10">


        {/* ---------------------------------------------------
            LEFT — PAYMENT FORM (NOW WIDER)
        --------------------------------------------------- */}
        <div className="bg-white rounded-2xl shadow-xl p-8 h-fit border border-gray-200 
                        w-full">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Donate as Guest
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4 flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-1" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleDonate} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Your Name (Optional)
              </label>
              <input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
                           focus:ring-2 focus:ring-purple-600"
                placeholder="Anonymous"
                type="text"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone (Optional)
              </label>
              <input
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
                           focus:ring-2 focus:ring-purple-600"
                placeholder="+91 9876543210"
                type="tel"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email (Optional)
              </label>
              <input
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
                           focus:ring-2 focus:ring-purple-600"
                placeholder="you@email.com"
                type="email"
              />
            </div>

            {/* SELECT AMOUNT */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Select Amount
              </label>

              <div className="grid grid-cols-2 gap-4 mt-2">
                {predefinedAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`py-3 rounded-xl font-semibold transition 
                                ${
                                  amount === amt.toString()
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM AMOUNT */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Or Enter Custom Amount *
              </label>

              <div className="relative mt-1">
                <DollarSign
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  required
                  min="1"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 
                             focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
                           focus:ring-2 focus:ring-purple-600"
                placeholder="Leave a message of hope..."
              ></textarea>
            </div>

            {/* DONATE BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 
                         text-white py-4 rounded-xl text-lg font-bold 
                         hover:scale-[1.02] shadow-xl transition flex items-center 
                         justify-center"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart size={22} className="mr-2" />
                  Donate ₹{amount || "0"}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              🔒 Secure Payment via Razorpay
            </p>
          </form>
        </div>

        {/* ---------------------------------------------------
            RIGHT — INFORMATION BOXES (SMALLER + COLORED)
        --------------------------------------------------- */}
        <div className="space-y-6 w-full">

          {/* Box 1 */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 
                          rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Where Your Donation Helps
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Users className="text-purple-600" size={22} />
                <div>
                  <h3 className="font-semibold text-gray-800">Support Families</h3>
                  <p className="text-gray-600 text-sm">
                    Providing food and essential care to low-income families.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Heart className="text-red-500" size={26} />
                <div>
                  <h3 className="font-semibold text-gray-800">Care for Orphans</h3>
                  <p className="text-gray-600 text-sm">
                    Education, meals, and shelter for orphaned children.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Gift className="text-green-600" size={26} />
                <div>
                  <h3 className="font-semibold text-gray-800">Help Differently-Abled</h3>
                  <p className="text-gray-600 text-sm">
                    Medical & mobility assistance to differently-abled people.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-gray-800 text-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
            <p className="text-sm text-gray-200">
              Every donation is recorded and visible on our public dashboard.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 
                          rounded-2xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Facts</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✔ No registration required</li>
              <li>✔ Instant SMS & Email Receipt</li>
              <li>✔ 100% secure payment</li>
              <li>✔ Eligible for tax benefits</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GuestDonation;

