



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Heart,
//   Users,
//   DollarSign,
//   AlertCircle,
//   ArrowLeft,
//   Gift,
// } from "lucide-react";

// const GuestDonation = () => {
//   const navigate = useNavigate();

//   const [donorName, setDonorName] = useState("");
//   const [donorPhone, setDonorPhone] = useState("");
//   const [donorEmail, setDonorEmail] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
//   const predefinedAmounts = [500, 1000, 2000, 5000];

//   /* ---------------------------------------------------
//         Razorpay Logic (unchanged)
//      --------------------------------------------------- */

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleDonate = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (!amount || parseFloat(amount) < 1) {
//         setError("Please enter a valid amount");
//         setLoading(false);
//         return;
//       }

//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         setError("Failed to load payment gateway. Please try again.");
//         setLoading(false);
//         return;
//       }

//       const orderResponse = await axios.post(
//         `${API_URL}/api/guest-donations/create-order`,
//         { amount: parseFloat(amount) }
//       );

//       const { order } = orderResponse.data;

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Hope Circle Foundation",
//         description: "Support those in need",
//         order_id: order.id,

//         handler: async (response) => {
//           try {
//             const verifyResponse = await axios.post(
//               `${API_URL}/api/guest-donations/verify`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 amount: order.amount,
//                 donorName: donorName || "Anonymous",
//                 donorPhone: donorPhone || null,
//                 donorEmail: donorEmail || null,
//                 message: message || "Guest donation",
//               }
//             );

//             if (verifyResponse.data.success) {
//               navigate("/donation-success", {
//                 state: { donation: verifyResponse.data.donation },
//               });
//             } else {
//               setError("Payment verification failed.");
//               setLoading(false);
//             }
//           } catch (err) {
//             setError(
//               err.response?.data?.message ||
//                 "Payment verification failed. Please contact support."
//             );
//             setLoading(false);
//           }
//         },

//         prefill: {
//           name: donorName,
//           email: donorEmail,
//           contact: donorPhone,
//         },

//         theme: { color: "#6d28d9" },

//         modal: {
//           ondismiss: () => setLoading(false),
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to process donation");
//       setLoading(false);
//     }
//   };

//   /* ---------------------------------------------------
//         UI STARTS HERE — FULLY IMPROVED
//      --------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

//       {/* ---------------------------------------------------
//           TOP NAVBAR
//       --------------------------------------------------- */}
//       <nav className="bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-100 py-4">
//         <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img
//               src="/hero1.jpg"
//               alt="Logo"
//               className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
//             />
//             <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
//               Guest Donation
//             </h2>
//           </div>

//           <button
//             onClick={() => navigate("/")}
//             className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition shadow-sm"
//           >
//             Home
//           </button>
//         </div>
//       </nav>

//       {/* ---------------------------------------------------
//           HEADER
//       --------------------------------------------------- */}
//       <div className="py-10 text-center relative">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute left-4 top-4 bg-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition"
//         >
//           <ArrowLeft size={18} /> Back
//         </button>

//         <Heart size={58} className="mx-auto mb-3 text-purple-600 animate-pulse" />
//         <h1 className="text-4xl font-bold text-gray-800">
//           Make a Difference Today
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Your contribution helps transform lives with dignity.
//         </p>
//       </div>

//       {/* ---------------------------------------------------
//           MAIN CONTENT
//       --------------------------------------------------- */}
//       <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10">


//         {/* ---------------------------------------------------
//             LEFT — PAYMENT FORM (NOW WIDER)
//         --------------------------------------------------- */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 h-fit border border-gray-200 
//                         w-full">

//           <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//             Donate as Guest
//           </h2>

//           {error && (
//             <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4 flex items-start gap-2">
//               <AlertCircle className="text-red-600 mt-1" size={18} />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleDonate} className="space-y-5">

//             {/* NAME */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Your Name (Optional)
//               </label>
//               <input
//                 value={donorName}
//                 onChange={(e) => setDonorName(e.target.value)}
//                 className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
//                            focus:ring-2 focus:ring-purple-600"
//                 placeholder="Anonymous"
//                 type="text"
//               />
//             </div>

//             {/* PHONE */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Phone (Optional)
//               </label>
//               <input
//                 value={donorPhone}
//                 onChange={(e) => setDonorPhone(e.target.value)}
//                 className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
//                            focus:ring-2 focus:ring-purple-600"
//                 placeholder="+91 9876543210"
//                 type="tel"
//               />
//             </div>

//             {/* EMAIL */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Email (Optional)
//               </label>
//               <input
//                 value={donorEmail}
//                 onChange={(e) => setDonorEmail(e.target.value)}
//                 className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
//                            focus:ring-2 focus:ring-purple-600"
//                 placeholder="you@email.com"
//                 type="email"
//               />
//             </div>

//             {/* SELECT AMOUNT */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Select Amount
//               </label>

//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 {predefinedAmounts.map((amt) => (
//                   <button
//                     key={amt}
//                     type="button"
//                     onClick={() => setAmount(amt.toString())}
//                     className={`py-3 rounded-xl font-semibold transition 
//                                 ${
//                                   amount === amt.toString()
//                                     ? "bg-purple-600 text-white"
//                                     : "bg-gray-100 hover:bg-gray-200 text-gray-700"
//                                 }`}
//                   >
//                     ₹{amt}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* CUSTOM AMOUNT */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Or Enter Custom Amount *
//               </label>

//               <div className="relative mt-1">
//                 <DollarSign
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   required
//                   min="1"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 
//                              focus:ring-2 focus:ring-purple-600"
//                   placeholder="Enter amount"
//                 />
//               </div>
//             </div>

//             {/* MESSAGE */}
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Message (Optional)
//               </label>
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows={3}
//                 className="w-full mt-1 px-4 py-3 border rounded-xl bg-gray-50 
//                            focus:ring-2 focus:ring-purple-600"
//                 placeholder="Leave a message of hope..."
//               ></textarea>
//             </div>

//             {/* DONATE BUTTON */}
//             <button
//               disabled={loading}
//               type="submit"
//               className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 
//                          text-white py-4 rounded-xl text-lg font-bold 
//                          hover:scale-[1.02] shadow-xl transition flex items-center 
//                          justify-center"
//             >
//               {loading ? (
//                 <>
//                   <div className="h-5 w-5 border-b-2 border-white rounded-full animate-spin mr-2"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Heart size={22} className="mr-2" />
//                   Donate ₹{amount || "0"}
//                 </>
//               )}
//             </button>

//             <p className="text-center text-xs text-gray-500">
//               🔒 Secure Payment via Razorpay
//             </p>
//           </form>
//         </div>

//         {/* ---------------------------------------------------
//             RIGHT — INFORMATION BOXES (SMALLER + COLORED)
//         --------------------------------------------------- */}
//         <div className="space-y-6 w-full">

//           {/* Box 1 */}
//           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 
//                           rounded-2xl shadow-md p-6 border border-gray-200">
//             <h2 className="text-xl font-bold text-gray-800 mb-3">
//               Where Your Donation Helps
//             </h2>

//             <div className="space-y-5">
//               <div className="flex items-start gap-4">
//                 <Users className="text-purple-600" size={22} />
//                 <div>
//                   <h3 className="font-semibold text-gray-800">Support Families</h3>
//                   <p className="text-gray-600 text-sm">
//                     Providing food and essential care to low-income families.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <Heart className="text-red-500" size={26} />
//                 <div>
//                   <h3 className="font-semibold text-gray-800">Care for Orphans</h3>
//                   <p className="text-gray-600 text-sm">
//                     Education, meals, and shelter for orphaned children.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <Gift className="text-green-600" size={26} />
//                 <div>
//                   <h3 className="font-semibold text-gray-800">Help Differently-Abled</h3>
//                   <p className="text-gray-600 text-sm">
//                     Medical & mobility assistance to differently-abled people.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Box 2 */}
//           <div className="bg-gray-800 text-white rounded-2xl shadow-md p-6">
//             <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
//             <p className="text-sm text-gray-200">
//               Every donation is recorded and visible on our public dashboard.
//             </p>
//           </div>

//           {/* Box 3 */}
//           <div className="bg-gradient-to-r from-gray-100 to-gray-200 
//                           rounded-2xl shadow-md p-6 border border-gray-200">
//             <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Facts</h3>
//             <ul className="space-y-2 text-gray-700 text-sm">
//               <li>✔ No registration required</li>
//               <li>✔ Instant SMS & Email Receipt</li>
//               <li>✔ 100% secure payment</li>
//               <li>✔ Eligible for tax benefits</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default GuestDonation;
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
  QrCode,
  Building2,
  Copy,
  CheckCircle,
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
  const [copiedField, setCopiedField] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const predefinedAmounts = [500, 1000, 2000, 5000];

  // Bank Details
  const bankDetails = {
    accountName: "Hope Circle Foundation",
    accountNumber: "1234567890123456",
    ifscCode: "JAKA0SAMBOR",
    bankName: "JAMMU & KASHMIR BANK",
    branch: "Main Branch, PULWAMA",
    upiId: "hopecircle@axis",
  };

  // Copy to clipboard function
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* TOP NAVBAR */}
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

      {/* HEADER */}
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

      {/* MAIN CONTENT - TWO EQUAL COLUMNS */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT — ONLINE PAYMENT FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 h-fit lg:h-full flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💳 Pay Online (Razorpay)
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4 flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-1" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleDonate} className="space-y-5 flex-1 flex flex-col">
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

            <div className="flex-1">
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

            <div className="mt-auto space-y-3">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 
                           text-white py-4 rounded-xl text-lg font-bold 
                           hover:scale-[1.02] shadow-xl transition flex items-center 
                           justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </form>
        </div>

        {/* RIGHT — BANK TRANSFER & QR CODE */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 h-fit lg:h-full flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              🏦 Direct Bank Transfer
            </h2>
          </div>

          <div className="space-y-6 flex-1">
            {/* Bank Details */}
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-4">Bank Account Details</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Account Name</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm break-all">{bankDetails.accountName}</p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountName, "accountName")}
                      className="text-purple-600 hover:text-purple-700 flex-shrink-0"
                    >
                      {copiedField === "accountName" ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Account Number</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 font-mono text-sm">{bankDetails.accountNumber}</p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber, "accountNumber")}
                      className="text-purple-600 hover:text-purple-700 flex-shrink-0"
                    >
                      {copiedField === "accountNumber" ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">IFSC Code</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 font-mono">{bankDetails.ifscCode}</p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.ifscCode, "ifscCode")}
                      className="text-purple-600 hover:text-purple-700 flex-shrink-0"
                    >
                      {copiedField === "ifscCode" ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Bank & Branch</p>
                  <p className="font-semibold text-gray-800 text-sm">{bankDetails.bankName}</p>
                  <p className="text-gray-600 text-xs">{bankDetails.branch}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border-2 border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">UPI ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-purple-700 font-mono text-sm">{bankDetails.upiId}</p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.upiId, "upiId")}
                      className="text-purple-600 hover:text-purple-700 flex-shrink-0"
                    >
                      {copiedField === "upiId" ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-2xl shadow-lg">
                <QrCode className="text-purple-600 mb-3 mx-auto" size={32} />
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <img
                    src="/QR.jpg"
                    alt="UPI QR Code"
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%236b7280'%3EQR Code Here%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <p className="text-center mt-4 text-sm font-semibold text-gray-700">
                  Scan to Pay via UPI
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  Use any UPI app to scan
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After making a bank transfer, please email your payment screenshot to{" "}
                <span className="font-mono">hopecirclefoundation@.org</span> for record keeping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION - INFORMATION BOXES */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1 - Where Donation Helps */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 
                          rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Where Your Donation Helps
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="text-purple-600 flex-shrink-0" size={22} />
                <div>
                  <h3 className="font-semibold text-gray-800">Support Families</h3>
                  <p className="text-gray-600 text-sm">
                    Providing food and essential care to low-income families.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="text-red-500 flex-shrink-0" size={22} />
                <div>
                  <h3 className="font-semibold text-gray-800">Care for Orphans</h3>
                  <p className="text-gray-600 text-sm">
                    Education, meals, and shelter for orphaned children.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="text-green-600 flex-shrink-0" size={22} />
                <div>
                  <h3 className="font-semibold text-gray-800">Help Differently-Abled</h3>
                  <p className="text-gray-600 text-sm">
                    Medical & mobility assistance to differently-abled people.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2 - Transparency */}
          <div className="bg-gray-800 text-white rounded-2xl shadow-md p-6 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
            <p className="text-sm text-gray-200">
              Every donation is recorded and visible on our public dashboard.
            </p>
          </div>

          {/* Box 3 - Quick Facts */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 
                          rounded-2xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Facts</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✔ No registration required</li>
              <li>✔ Multiple payment options</li>
              <li>✔ Instant receipt via email</li>
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