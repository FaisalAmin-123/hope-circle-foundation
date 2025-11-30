// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Users,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   MapPin,
//   FileText,
//   Upload,
//   ArrowLeft,
//   CheckCircle,
//   AlertCircle,
//   IndianRupee,
// } from 'lucide-react';

// const RegisterBeneficiary = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     category: 'poor',
//     needAmount: '',
//     needDescription: '',
//     identityProof: null,
//     addressProof: null,
//     incomeProof: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const categories = [
//     { value: 'poor', label: '💰 Economically Weak', desc: 'Financial assistance needed' },
//     { value: 'orphan', label: '👶 Orphan', desc: 'Support for orphaned children' },
//     { value: 'physically_challenged', label: '♿ Physically Challenged', desc: 'Assistance for disabled individuals' },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files[0]) {
//       if (files[0].size > 5 * 1024 * 1024) {
//         setError(`${name} file size should be less than 5MB`);
//         return;
//       }
//       setFormData({
//         ...formData,
//         [name]: files[0],
//       });
//     }
//   };
// const handleSubmit = async () => {
//   setError('');
//   setLoading(true);

//   if (formData.password !== formData.confirmPassword) {
//     setError('Passwords do not match');
//     setLoading(false);
//     return;
//   }

//   if (formData.password.length < 6) {
//     setError('Password must be at least 6 characters');
//     setLoading(false);
//     return;
//   }

//   try {
//     // ✅ Register with basic info only (NO documents)
//     const response = await axios.post(`${API_URL}/api/auth/register`, {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       password: formData.password,
//       role: 'beneficiary',
//       beneficiaryCategory: formData.category,
//     });

//     if (response.data.success) {
//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/login');
//       }, 4000);
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || 'Registration failed');
//     setLoading(false);
//   }
// };

//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
//           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">
//             Application Submitted! 🙏
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Your application has been received. Our team will review your documents and verify your details within 48-72 hours.
//           </p>
//           <div className="bg-blue-50 rounded-lg p-4 mb-6">
//             <p className="text-sm text-blue-800 mb-2">
//               <strong>What happens next?</strong>
//             </p>
//             <ul className="text-xs text-blue-700 text-left space-y-1">
//               <li>✓ Document verification (24-48 hours)</li>
//               <li>✓ Background check by admin</li>
//               <li>✓ Email notification on approval</li>
//               <li>✓ Access to aid dashboard</li>
//             </ul>
//           </div>
//           <p className="text-sm text-gray-500">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
//       <div className="max-w-4xl mx-auto px-4">
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
//         >
//           <ArrowLeft size={20} className="mr-2" />
//           Back to Home
//         </button>

//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-8 text-center shadow-xl">
//           <Users size={64} className="mx-auto mb-4" />
//           <h1 className="text-4xl font-bold mb-2">Apply for Assistance</h1>
//           <p className="text-xl text-blue-50">
//             We're here to help you in your time of need
//           </p>
//         </div>

//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
//           <div className="flex items-start">
//             <AlertCircle className="text-yellow-600 mr-3 mt-1" size={24} />
//             <div>
//               <h3 className="font-bold text-yellow-800 mb-2">Important Information</h3>
//               <ul className="text-sm text-yellow-700 space-y-1">
//                 <li>• All applications are reviewed within 48-72 hours</li>
//                 <li>• Valid government ID & address proof are mandatory</li>
//                 <li>• Income proof helps us assess your need accurately</li>
//                 <li>• Be honest in your application - we verify all information</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Application Form
//           </h2>

//           {error && (
//             <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <AlertCircle className="text-red-600 mr-3" size={20} />
//                 <p className="text-red-800">{error}</p>
//               </div>
//             </div>
//           )}

//           <div>
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
//                 📋 Personal Information
//               </h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     <User className="inline mr-2" size={18} />
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Your full name"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       <Mail className="inline mr-2" size={18} />
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="your@email.com"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       <Phone className="inline mr-2" size={18} />
//                       Phone Number *
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="+91 9876543210"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       <Lock className="inline mr-2" size={18} />
//                       Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Min 6 characters"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       <Lock className="inline mr-2" size={18} />
//                       Confirm Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Repeat password"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
//                 <MapPin className="inline mr-2" size={20} />
//                 Address Details
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Full Address *
//                   </label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="House/Flat No, Street, Locality"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">City *</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="City"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">State *</label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="State"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">Pincode *</label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="190001"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8 bg-blue-50 p-6 rounded-lg">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">
//                 💙 Your Need
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-3">
//                     Category *
//                   </label>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {categories.map((cat) => (
//                       <label
//                         key={cat.value}
//                         className={`border-2 rounded-lg p-4 cursor-pointer transition ${
//                           formData.category === cat.value
//                             ? 'border-blue-600 bg-blue-100'
//                             : 'border-gray-300 bg-white hover:border-blue-300'
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="category"
//                           value={cat.value}
//                           checked={formData.category === cat.value}
//                           onChange={handleChange}
//                           className="hidden"
//                         />
//                         <div className="text-center">
//                           <p className="text-2xl mb-2">{cat.label.split(' ')[0]}</p>
//                           <p className="font-semibold text-gray-800 mb-1">
//                             {cat.label.split(' ').slice(1).join(' ')}
//                           </p>
//                           <p className="text-xs text-gray-600">{cat.desc}</p>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     <IndianRupee className="inline mr-2" size={18} />
//                     Amount Needed *
//                   </label>
//                   <input
//                     type="number"
//                     name="needAmount"
//                     value={formData.needAmount}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter amount in ₹"
//                   />
//                   <p className="text-xs text-gray-600 mt-1">Be realistic about your financial need</p>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     <FileText className="inline mr-2" size={18} />
//                     Describe Your Situation *
//                   </label>
//                   <textarea
//                     name="needDescription"
//                     value={formData.needDescription}
//                     onChange={handleChange}
//                     rows="5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Please explain your current situation and why you need assistance. Be honest and detailed."
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">
//                 <Upload className="inline mr-2" size={20} />
//                 Document Upload
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Identity Proof * (Aadhaar, PAN, Voter ID)
//                   </label>
//                   <input
//                     type="file"
//                     name="identityProof"
//                     onChange={handleFileChange}
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {formData.identityProof && (
//                     <p className="text-sm text-green-600 mt-2">✓ {formData.identityProof.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Address Proof * (Utility Bill, Rent Agreement)
//                   </label>
//                   <input
//                     type="file"
//                     name="addressProof"
//                     onChange={handleFileChange}
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {formData.addressProof && (
//                     <p className="text-sm text-green-600 mt-2">✓ {formData.addressProof.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Income Proof (Optional - Bank Statement, Salary Slip)
//                   </label>
//                   <input
//                     type="file"
//                     name="incomeProof"
//                     onChange={handleFileChange}
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {formData.incomeProof && (
//                     <p className="text-sm text-green-600 mt-2">✓ {formData.incomeProof.name}</p>
//                   )}
//                   <p className="text-xs text-gray-600 mt-1">Helps us assess your eligibility better</p>
//                 </div>

//                 <p className="text-xs text-gray-600 mt-2">
//                   Max file size: 5MB | Formats: PDF, JPG, PNG
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Submitting Application...' : '🙏 Submit Application'}
//             </button>

//             <p className="text-center text-sm text-gray-600 mt-4">
//               Already registered?{' '}
//               <button
//                 onClick={() => navigate('/login')}
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Login here
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterBeneficiary;

// this is register beneficiary file
// RegisterBeneficiary.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,

  CheckCircle,
  AlertCircle,
 
} from "lucide-react";

const RegisterBeneficiary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    category: "poor",
    needAmount: "",
    needDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const categories = [
    { value: "poor", label: "Economically Weak", desc: "Financial assistance" },
    { value: "orphan", label: "Orphan", desc: "Support for children" },
    { value: "physically_challenged", label: "Physically Challenged", desc: "Disability support" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (!formData.needAmount || Number(formData.needAmount) <= 0) {
      setError("Enter a valid amount needed");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "beneficiary",
        beneficiaryCategory: formData.category,
        needAmount: Number(formData.needAmount) || 0,
        needDescription: formData.needDescription,
      });

      if (res.data?.success) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate("/login"), 2200);
      } else {
        setError(res.data?.message || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application submitted</h2>
          <p className="text-gray-600 mb-4">Thanks — we received your application and will review it within 48–72 hours.</p>
          <p className="text-sm text-gray-500">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Single navbar */}
     <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
  <div className="flex items-center gap-3">

    {/* CIRCLE LOGO IMAGE — same branding as login page */}
    <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-purple-300">
      <img
        src="/hero1.jpg"   // <-- same logo you used in login page
        alt="Logo"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Title */}
    <div>
      <div className="text-xl font-bold text-gray-800">Hope Circle Foundation</div>
      <div className="text-xs text-gray-600">Community Support & Aid</div>
    </div>
  </div>

  <button
    onClick={() => navigate("/")}
    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 border hover:bg-gray-200"
  >
    Home
  </button>
</header>


      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: form (7 columns) */}
          <section className="lg:col-span-7 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Apply for Assistance</h1>
                <p className="text-sm text-gray-600">Fill the short form below — it's quick and secure.</p>
              </div>
              <div className="text-sm text-amber-600 font-semibold">Priority review</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
                  <AlertCircle className="text-red-600" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="+91 98xxxx"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Confirm password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Repeat password"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="House, street, locality"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-gray-800">Category</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, category: c.value }))}
                      className={`px-3 py-2 rounded-lg text-sm ${formData.category === c.value ? "bg-amber-200 font-semibold" : "bg-white border"}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Amount needed (₹)</label>
                <input
                  name="needAmount"
                  type="number"
                  value={formData.needAmount}
                  onChange={handleChange}
                  className="mt-1 w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Amount"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Short description</label>
                <textarea
                  name="needDescription"
                  rows={4}
                  value={formData.needDescription}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Briefly explain your need"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-2xl font-semibold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Application"}
                </button>
                <button type="button" onClick={() => navigate("/login")} className="py-3 px-4 rounded-2xl border border-gray-200 bg-white">
                  Already registered? Login
                </button>
              </div>
            </form>
          </section>
{/* RIGHT: info (5 columns) */}
<aside className="lg:col-span-5 space-y-5">

  {/* BOX 1: Quick summary */}
  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center border border-blue-100">
        <Users className="text-blue-700" />
      </div>
      <div>
        <div className="font-semibold text-blue-800 text-lg">Quick summary</div>
        <div className="text-sm text-blue-700/80">
          Fill the form — review takes 48–72 hours.
        </div>
      </div>
    </div>
  </div>

  {/* BOX 2: What we look for */}
  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 shadow-sm">
    <div className="font-semibold text-amber-800 text-lg mb-2">What we look for</div>
    <ul className="text-sm text-amber-700/80 list-disc list-inside space-y-1">
      <li>Severity of need</li>
      <li>Household vulnerability</li>
      <li>Ability to verify</li>
    </ul>
  </div>

  {/* BOX 3: Recommended */}
  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm">
    <div className="font-semibold text-emerald-800 text-lg">Recommended</div>
    <div className="text-sm text-emerald-700/80 mt-1">
      Be specific about amount & family details.
    </div>
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="mt-3 px-4 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-800 shadow-sm hover:bg-emerald-50"
    >
      Start form
    </button>
  </div>

  {/* BOX 4: How it works */}
  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 shadow-sm">
    <h4 className="font-semibold text-purple-800 text-lg mb-2">How it works</h4>
    <ol className="text-sm text-purple-700/80 list-decimal list-inside space-y-1">
      <li>Submit application truthfully.</li>
      <li>We verify and may call for clarification.</li>
      <li>Once approved, you will be notified.</li>
    </ol>
  </div>

  {/* BOX 5: Tips for a good application */}
  <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 shadow-sm">
    <h4 className="font-semibold text-rose-800 text-lg mb-2">Tips for a good application</h4>
    <ul className="text-sm text-rose-700/80 space-y-1 list-disc list-inside">
      <li>State exact amount needed.</li>
      <li>Mention dependents & vulnerabilities.</li>
      <li>Write clear, short descriptions.</li>
    </ul>
  </div>

</aside>

        </div>

        
      </main>
    </div>
  );
};

export default RegisterBeneficiary;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Users,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// const RegisterBeneficiary = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     category: "poor",
//     needAmount: "",
//     needDescription: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

//   const categories = [
//     { value: "poor", label: "Economically Weak" },
//     { value: "orphan", label: "Orphan" },
//     { value: "physically_challenged", label: "Physically Challenged" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     if (!formData.needAmount || Number(formData.needAmount) <= 0) {
//       setError("Enter a valid amount needed");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post(`${API_URL}/api/auth/register`, {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role: "beneficiary",
//         beneficiaryCategory: formData.category,
//         needAmount: Number(formData.needAmount) || 0,
//         needDescription: formData.needDescription,
//       });

//       if (res.data?.success) {
//         setSuccess(true);
//         setLoading(false);
//         setTimeout(() => navigate("/login"), 2200);
//       } else {
//         setError(res.data?.message || "Registration failed");
//         setLoading(false);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//       setLoading(false);
//     }
//   };

//   // SUCCESS SCREEN
//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-100 p-6">
//         <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
//           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Application submitted</h2>
//           <p className="text-gray-600 mb-4">We received your application. Our team will review it soon.</p>
//           <p className="text-sm text-gray-500">Redirecting to login…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-amber-100">
//    <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
//   <div className="flex items-center gap-3">

  
//     <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-purple-300">
//       <img
//         src="/hero1.jpg"  
//         alt="Logo"
//         className="w-full h-full object-cover"
//       />
//     </div>

//     {/* Title */}
//     <div>
//       <div className="text-xl font-bold text-gray-800">Hope Circle Foundation</div>
//       <div className="text-xs text-gray-600">Community Support & Aid</div>
//     </div>
//   </div>

//   <button
//     onClick={() => navigate("/")}
//     className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 border hover:bg-gray-200"
//   >
//     Home
//   </button>
// </header>


//       {/* MAIN CONTENT */}
//       <main className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
//           {/* LEFT */}
//           <section className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
//             <h1 className="text-3xl font-bold text-gray-800 mb-1">Apply for Assistance</h1>
//             <p className="text-sm text-gray-600 mb-6">
//               Fill the form — we review applications in 48–72 hours.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-4">

//               {error && (
//                 <div className="p-3 rounded-md bg-red-50 border-l-4 border-red-500 flex gap-3">
//                   <AlertCircle className="text-red-600" />
//                   <div className="text-sm text-red-700">{error}</div>
//                 </div>
//               )}

//               {/* INPUT GRID */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {/* SAME INPUTS — NO LOGIC CHANGED */}
//                 <inputField label="Full Name" name="name" value={formData} onChange={handleChange} />
//               </div>

//               {/* CATEGORY */}
//               <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
//                 <label className="text-sm font-medium text-gray-800">Category</label>
//                 <div className="mt-2 grid grid-cols-3 gap-2">
//                   {categories.map((c) => (
//                     <button
//                       key={c.value}
//                       type="button"
//                       onClick={() => setFormData((p) => ({ ...p, category: c.value }))}
//                       className={`px-3 py-2 rounded-lg text-sm transition ${
//                         formData.category === c.value
//                           ? "bg-purple-200 font-semibold"
//                           : "bg-white border"
//                       }`}
//                     >
//                       {c.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* AMOUNT */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Amount needed (₹)</label>
//                 <input
//                   name="needAmount"
//                   type="number"
//                   value={formData.needAmount}
//                   onChange={handleChange}
//                   className="mt-1 w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
//                   placeholder="Amount"
//                 />
//               </div>

//               {/* DESCRIPTION */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Short description</label>
//                 <textarea
//                   name="needDescription"
//                   rows={4}
//                   value={formData.needDescription}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
//                   placeholder="Briefly explain your need"
//                 />
//               </div>

//               {/* BUTTONS */}
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-purple-700 transition"
//                 >
//                   {loading ? "Submitting…" : "Submit Application"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate("/login")}
//                   className="py-3 px-4 rounded-xl bg-white border"
//                 >
//                   Login
//                 </button>
//               </div>
//             </form>
//           </section>

//           {/* RIGHT — 4 MATCHING BOXES */}
//           <aside className="lg:col-span-5 space-y-4">

//             {/* BOX 1 */}
//             <div className="p-5 rounded-xl bg-white/80 shadow border border-gray-100 flex gap-3">
//               <div className="w-10 h-10 rounded-md bg-purple-200 flex items-center justify-center">
//                 <Users className="text-purple-800" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800">Quick summary</h3>
//                 <p className="text-sm text-gray-600">We review all applications manually.</p>
//               </div>
//             </div>

//             {/* BOX 2 */}
//             <div className="p-5 rounded-xl bg-white shadow border">
//               <h3 className="font-semibold text-gray-800 mb-2">What we check</h3>
//               <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
//                 <li>Severity of need</li>
//                 <li>Household condition</li>
//                 <li>Verification possibility</li>
//               </ul>
//             </div>

//             {/* BOX 3 */}
//             <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 shadow border text-center">
//               <h3 className="font-semibold text-purple-700">Recommended</h3>
//               <p className="text-sm text-gray-600 mt-1">Be specific for faster approval.</p>
//             </div>

//             {/* BOX 4 — NEW FOR ALIGNMENT */}
//             <div className="p-5 rounded-xl bg-white/70 shadow border">
//               <h3 className="font-semibold text-gray-800 mb-2">Why apply?</h3>
//               <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
//                 <li>Fast response process</li>
//                 <li>Support for genuine cases</li>
//                 <li>Confidential & respectful</li>
//               </ul>
//             </div>

//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RegisterBeneficiary;
