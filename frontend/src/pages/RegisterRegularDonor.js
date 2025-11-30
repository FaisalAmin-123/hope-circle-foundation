// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Heart,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Calendar,
//   DollarSign,
//   Bell,
//   ArrowLeft,
//   CheckCircle,
//   AlertCircle,
// } from 'lucide-react';

// const RegisterRegularDonor = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     monthlyAmount: '500',
//     donationDay: '1',
//     emailNotifications: true,
//     smsNotifications: true,
//     whatsappNotifications: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const predefinedAmounts = [500, 1000, 2000, 5000];
//   const donationDays = [
//     { value: '1', label: '1st of month' },
//     { value: '15', label: '15th of month' },
//     { value: '30', label: 'Last day of month' },
//   ];

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setLoading(true);

//   // Validation
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

//   if (formData.monthlyAmount < 100) {
//     setError('Minimum monthly amount is ₹100');
//     setLoading(false);
//     return;
//   }

//   try {
//     // ✅ Send as regular JSON (no files)
//     const response = await axios.post(`${API_URL}/api/auth/register`, {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       password: formData.password,
//       role: 'donor',
//       isRegularDonor: true,
//       monthlyAmount: formData.monthlyAmount,
//       donationDay: formData.donationDay,
//       emailNotifications: formData.emailNotifications,
//       smsNotifications: formData.smsNotifications,
//       whatsappNotifications: formData.whatsappNotifications,
//     });
//     if (response.data.success) {
//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || 'Registration failed');
//     setLoading(false);
//   }
// };


//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
//         <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
//           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">
//             Welcome to Hope Circle! 🎉
//           </h2>
//           <p className="text-gray-600 mb-6">
//             You're now a Regular Donor! You'll receive monthly reminders on the{' '}
//             {donationDays.find((d) => d.value === formData.donationDay)?.label}.
//           </p>
//           <div className="bg-blue-50 rounded-lg p-4 mb-6">
//             <p className="text-sm text-blue-800">
//               Monthly Commitment: <span className="font-bold">₹{formData.monthlyAmount}</span>
//             </p>
//           </div>
//           <p className="text-sm text-gray-500">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-12">
//       <div className="max-w-3xl mx-auto px-4">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
//         >
//           <ArrowLeft size={20} className="mr-2" />
//           Back to Home
//         </button>

//         {/* Header */}
//         <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl p-8 mb-8 text-center shadow-xl">
//           <Heart size={64} className="mx-auto mb-4 animate-pulse" />
//           <h1 className="text-4xl font-bold mb-2">Become a Regular Donor</h1>
//           <p className="text-xl text-yellow-50">
//             Commit to monthly giving & earn exclusive badges!
//           </p>
//           <div className="mt-6 bg-white text-orange-600 px-4 py-2 rounded-full inline-block font-bold">
//             ⭐ MOST POPULAR CHOICE
//           </div>
//         </div>

//         {/* Benefits */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h3 className="text-xl font-bold text-gray-800 mb-4">
//             Why Become a Regular Donor?
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-start">
//               <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
//               <div>
//                 <p className="font-semibold text-gray-800">Monthly Reminders</p>
//                 <p className="text-sm text-gray-600">Never forget to donate</p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
//               <div>
//                 <p className="font-semibold text-gray-800">Exclusive Badges</p>
//                 <p className="text-sm text-gray-600">Bronze, Silver, Gold & more</p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
//               <div>
//                 <p className="font-semibold text-gray-800">Impact Tracking</p>
//                 <p className="text-sm text-gray-600">See exactly who you helped</p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <CheckCircle className="text-green-500 mr-3 mt-1" size={20} />
//               <div>
//                 <p className="font-semibold text-gray-800">Donation Streak</p>
//                 <p className="text-sm text-gray-600">Build your helping streak</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Registration Form */}
//         <div className="bg-white rounded-xl shadow-xl p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Registration Details
//           </h2>

//           {error && (
//             <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <AlertCircle className="text-red-600 mr-3" size={20} />
//                 <p className="text-red-800">{error}</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Personal Details */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
              
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     placeholder="John Doe"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     <Mail className="inline mr-2" size={18} />
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     placeholder="john@example.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     <Phone className="inline mr-2" size={18} />
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     placeholder="+91 9876543210"
//                     required
//                   />
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
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       placeholder="Min 6 characters"
//                       required
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
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       placeholder="Repeat password"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Monthly Commitment */}
//             <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">
//                 <DollarSign className="inline mr-2" size={20} />
//                 Monthly Commitment
//               </h3>

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-semibold mb-3">
//                   Select Monthly Amount
//                 </label>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//                   {predefinedAmounts.map((amt) => (
//                     <button
//                       key={amt}
//                       type="button"
//                       onClick={() => setFormData({ ...formData, monthlyAmount: amt.toString() })}
//                       className={`py-3 rounded-lg font-semibold transition ${
//                         formData.monthlyAmount === amt.toString()
//                           ? 'bg-orange-600 text-white'
//                           : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-400'
//                       }`}
//                     >
//                       ₹{amt}
//                     </button>
//                   ))}
//                 </div>

//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Or Enter Custom Amount
//                 </label>
//                 <input
//                   type="number"
//                   name="monthlyAmount"
//                   value={formData.monthlyAmount}
//                   onChange={handleChange}
//                   min="100"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   placeholder="Enter amount"
//                   required
//                 />
//                 <p className="text-sm text-gray-600 mt-2">Minimum: ₹100</p>
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <Calendar className="inline mr-2" size={18} />
//                   Preferred Donation Day
//                 </label>
//                 <select
//                   name="donationDay"
//                   value={formData.donationDay}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   required
//                 >
//                   {donationDays.map((day) => (
//                     <option key={day.value} value={day.value}>
//                       {day.label}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-sm text-gray-600 mt-2">
//                   You'll receive reminders on this day each month
//                 </p>
//               </div>
//             </div>

//             {/* Notification Preferences */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">
//                 <Bell className="inline mr-2" size={20} />
//                 Notification Preferences
//               </h3>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="emailNotifications"
//                     checked={formData.emailNotifications}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <span className="ml-3 text-gray-700">
//                     📧 Email Reminders (Recommended)
//                   </span>
//                 </label>

//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="smsNotifications"
//                     checked={formData.smsNotifications}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <span className="ml-3 text-gray-700">📱 SMS Reminders</span>
//                 </label>

//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="whatsappNotifications"
//                     checked={formData.whatsappNotifications}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <span className="ml-3 text-gray-700">
//                     💬 WhatsApp Reminders (Coming Soon)
//                   </span>
//                 </label>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Registering...' : '🌟 Register as Regular Donor'}
//             </button>

//             <p className="text-center text-sm text-gray-600 mt-4">
//               Already have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="text-orange-600 font-semibold hover:underline"
//               >
//                 Login here
//               </button>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterRegularDonor;

// // this file is register-regular donor
// //RegisterRegularDonor.js
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Heart,

//   CheckCircle,
//   AlertCircle,
// } from 'lucide-react';

// /**
//  * RegisterRegularDonor — simplified and spaced layout per request
//  * - Left: full registration form (prominent)
//  * - Right: three compact boxes (Quick summary, Impact points, Recommended)
//  * - Footer: single wide card split into two columns (How it works | Benefits)
//  */
// const RegisterRegularDonor = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     monthlyAmount: '500',
//     donationDay: '1',
//     emailNotifications: true,
//     smsNotifications: true,
//     whatsappNotifications: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const PREDEFINED_AMOUNTS = [500, 1000, 2000, 5000];
//   const DONATION_DAYS = [
//     { value: '1', label: '1st of month' },
//     { value: '15', label: '15th of month' },
//     { value: '30', label: 'Last day of month' },
//   ];

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // basic validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       setLoading(false);
//       return;
//     }
//     if (Number(formData.monthlyAmount) < 100) {
//       setError('Minimum monthly amount is ₹100');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post(`${API_URL}/api/auth/register`, {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role: 'donor',
//         isRegularDonor: true,
//         monthlyAmount: Number(formData.monthlyAmount),
//         donationDay: formData.donationDay,
//         emailNotifications: formData.emailNotifications,
//         smsNotifications: formData.smsNotifications,
//         whatsappNotifications: formData.whatsappNotifications,
//       });

//       if (res.data?.success) {
//         setSuccess(true);
//         setLoading(false);
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         setError(res.data?.message || 'Registration failed');
//         setLoading(false);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 p-6">
//         <div className="max-w-lg w-full bg-white/95 rounded-2xl shadow-2xl p-8 text-center ring-1 ring-amber-50">
//           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanks — you’re signed up!</h2>
//           <p className="text-gray-700 mb-4">We’ll charge ₹{formData.monthlyAmount} on the {DONATION_DAYS.find(d => d.value === formData.donationDay).label} each month.</p>
//           <p className="text-sm text-gray-500">Redirecting to login…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen p-6"
//       style={{
//         background: 'linear-gradient(135deg, rgba(99,179,237,0.06), rgba(167,243,208,0.06))',
//         backdropFilter: 'blur(6px)'
//       }}
//     >
//       {/* NAV */}
//       <nav className="w-full backdrop-blur-xl from-amber-500/40 shadow-lg rounded-2xl border border-white/40 p-5 flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <Heart className="text-red-500" size={28} />
//           <h1 className="text-2xl font-bold text-gray-800">🌱 Hope Circle Foundation</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl bg-white/70 text-gray-800 border border-white/30 shadow-sm hover:shadow-md transition">Home</button>
//           <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition">Login</button>
//         </div>
//       </nav>

//       <div className="max-w-6xl mx-auto">
//         {/* MAIN ROW: left form (2/3) and right stacked boxes (1/3) */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* LEFT: full registration form card */}
//           <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-6 ring-1 ring-amber-50">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">Register as a Regular Donor</h2>
//                 <p className="text-gray-600 mt-1">Complete the form and join our regular donors community.</p>
//               </div>
//             </div>

//             <form onSubmit={submit} className="space-y-4">
//               {error && (
//                 <div className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
//                   <AlertCircle className="text-red-600 mt-1" />
//                   <div className="text-sm text-red-700">{error}</div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
//                   <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="John Doe" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
//                   <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="you@example.com" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
//                   <input name="phone" value={formData.phone} onChange={handleChange} type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="+91 0123456789" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
//                   <input name="password" value={formData.password} onChange={handleChange} type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Min 6 characters" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm password</label>
//                   <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Repeat password" />
//                 </div>
//               </div>

//               {/* amounts and date row */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly commitment</label>
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {PREDEFINED_AMOUNTS.map((amt) => (
//                       <label key={amt} className={`cursor-pointer px-4 py-2 rounded-lg border ${String(formData.monthlyAmount) === String(amt) ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-gray-700 border-gray-200 hover:border-amber-200'}`}>
//                         <input type="radio" name="monthlyAmount" value={amt} checked={String(formData.monthlyAmount) === String(amt)} onChange={handleChange} className="sr-only" />
//                         ₹{amt}
//                       </label>
//                     ))}
//                     <input name="monthlyAmount" type="number" min={100} value={formData.monthlyAmount} onChange={handleChange} className="px-3 py-2 border border-gray-200 rounded-lg w-32" placeholder="Custom" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred donation day</label>
//                   <select name="donationDay" value={formData.donationDay} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200">
//                     {DONATION_DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
//                   </select>
//                 </div>
//               </div>

//               {/* notification row */}
//               <div className="flex flex-wrap gap-4 items-center">
//                 <label className="flex items-center gap-2"><input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} className="w-5 h-5 text-amber-500"/> <span className="text-sm">Email</span></label>
//                 <label className="flex items-center gap-2"><input type="checkbox" name="smsNotifications" checked={formData.smsNotifications} onChange={handleChange} className="w-5 h-5 text-amber-500"/> <span className="text-sm">SMS</span></label>
//                 <label className="flex items-center gap-2"><input type="checkbox" name="whatsappNotifications" checked={formData.whatsappNotifications} onChange={handleChange} className="w-5 h-5 text-amber-500"/> <span className="text-sm">WhatsApp</span></label>
//               </div>

//               {/* action buttons */}
//               <div className="flex gap-3 mt-2 items-center">
//                 <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-2xl font-semibold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50">{loading ? 'Registering…' : '🌟 Register as Regular Donor'}</button>
//                 <button type="button" onClick={() => navigate('/login')} className="py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:shadow-sm">Already have an account? Login</button>
//               </div>
//             </form>
//           </div>

//           {/* RIGHT: stacked three boxes */}
//           <div className="space-y-4">
//             <div className="p-4 bg-amber-50 rounded-2xl shadow-md border border-amber-100">
//               <div className="flex items-center gap-3">
//                 <Heart className="text-red-500" />
//                 <div>
//                   <div className="font-semibold text-gray-800">Quick summary</div>
//                   <div className="text-sm text-gray-600">Start small — change or pause anytime.</div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 bg-white/95 rounded-2xl shadow-md border">
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <CheckCircle className="text-green-500 mt-1" />
//                   <div>
//                     <div className="font-semibold text-gray-800">Flexible</div>
//                     <div className="text-sm text-gray-600">Update amount any time</div>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <CheckCircle className="text-green-500 mt-1" />
//                   <div>
//                     <div className="font-semibold text-gray-800">Track impact</div>
//                     <div className="text-sm text-gray-600">Get reports & badges</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl shadow-md border border-amber-100 text-center">
//               <div className="font-semibold text-amber-700">Recommended</div>
//               <div className="text-sm text-gray-600 mt-2">₹500/month unlocks first badge</div>
//               <button onClick={() => setFormData(prev => ({ ...prev, monthlyAmount: '500' }))} className="mt-3 w-full py-2 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">Choose ₹500</button>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER: single wide card split into two parts */}
//         <div className="bg-white/95 rounded-2xl shadow-md p-6 border grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800 mb-3">How it works</h3>
//             <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
//               <li>Sign up & set your monthly amount.</li>
//               <li>We process donations on your chosen day.</li>
//               <li>You receive impact updates and badges.</li>
//             </ol>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold text-gray-800 mb-3">Benefits</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//               <div className="flex items-start gap-3"><CheckCircle className="text-green-500 mt-1" /><div><div className="font-semibold">Auto reminders</div><div className="text-gray-600">Never miss a gift</div></div></div>
//               <div className="flex items-start gap-3"><CheckCircle className="text-green-500 mt-1" /><div><div className="font-semibold">Exclusive badges</div><div className="text-gray-600">Recognition for your impact</div></div></div>
//               <div className="flex items-start gap-3"><CheckCircle className="text-green-500 mt-1" /><div><div className="font-semibold">Pause anytime</div><div className="text-gray-600">No lock-ins</div></div></div>
//               <div className="flex items-start gap-3"><CheckCircle className="text-green-500 mt-1" /><div><div className="font-semibold">Transparent impact</div><div className="text-gray-600">See where funds went</div></div></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterRegularDonor;



// FINAL MERGED VERSION — PREMIUM UI + COMPLETE BACKEND LOGIC

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Heart,
  CheckCircle,
  AlertCircle,
  Shield,
  Award,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const RegisterRegularDonor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    monthlyAmount: '500',
    donationDay: '1',
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const PREDEFINED_AMOUNTS = [500, 1000, 2000, 5000];
  const DONATION_DAYS = [
    { value: '1', label: '1st of month' },
    { value: '15', label: '15th of month' },
    { value: '30', label: 'Last day of month' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (Number(formData.monthlyAmount) < 100) {
      setError('Minimum monthly amount is ₹100');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'donor',
        isRegularDonor: true,
        monthlyAmount: Number(formData.monthlyAmount),
        donationDay: formData.donationDay,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        whatsappNotifications: formData.whatsappNotifications,
      });

      if (res.data?.success) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data?.message || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  // SUCCESS SCREEN unchanged
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Our Family! 🎉</h2>
          <p className="text-lg text-gray-600 mb-2">
            Your monthly contribution of ₹{formData.monthlyAmount} will create lasting impact
          </p>
          <p className="text-sm text-gray-500 mt-4">Account created successfully!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
 {/* NAVBAR WITH FIXED LOGIC BUTTONS */}
<nav className="bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl border-b border-white/10">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">

      {/* LEFT LOGO + TITLE */}
      <div className="flex items-center gap-4">
        
        {/* CIRCLE LOGO IMAGE — JUST LIKE LOGIN PAGE */}
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-white/30">
          <img
            src="/hero1.jpg"
            alt="Hope Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Hope Circle Foundation
          </h1>
          <p className="text-sm text-white/80">
            Transforming Lives Together
          </p>
        </div>
      </div>

      {/* RIGHT — SAME BUTTONS NO CHANGE */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-white/20 text-white border border-white/30 
                     hover:bg-white/30 backdrop-blur-xl font-medium transition-all"
        >
          Home
        </button>

        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl bg-white text-purple-700 font-semibold
                     shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
        >
          Login
        </button>

      </div>

    </div>
  </div>
</nav>



      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HERO SECTION */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white mb-4">
            <Sparkles size={16} />
            <span>Join 2,500+ Monthly Champions</span>
          </div>

          <h2 className="text-5xl font-bold text-white mb-3">Become a Monthly Hero</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Small monthly gifts create big lasting change.
          </p>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* BIG FORM CARD */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Start Your Monthly Impact</h3>
                <p className="text-gray-600">Join our community of compassionate givers</p>
              </div>
            </div>

            <div className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-500 flex gap-3">
                  <AlertCircle className="text-red-600 mt-0.5" />
                  <div className="text-red-700 font-medium">{error}</div>
                </div>
              )}

            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="font-bold text-gray-700">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                    placeholder="John Doe"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="font-bold text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                    placeholder="you@example.com"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="font-bold text-gray-700">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                    placeholder="9876543210"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="font-bold text-gray-700">Create Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="md:col-span-2">
                  <label className="font-bold text-gray-700">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              {/* MONTHLY AMOUNT UI — unchanged */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <label className="font-bold flex gap-2 text-gray-800">
                  <TrendingUp className="text-purple-600" />
                  Monthly Contribution
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
                  {PREDEFINED_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, monthlyAmount: String(amt) }))
                      }
                      className={`px-4 py-4 rounded-xl font-bold ${
                        String(formData.monthlyAmount) === String(amt)
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <input
                  name="monthlyAmount"
                  type="number"
                  min={100}
                  value={formData.monthlyAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border-2 border-purple-200 rounded-xl"
                />
              </div>

              {/* DONATION DAY */}
              <div>
                <label className="font-bold text-gray-700">Donation Day</label>
                <select
                  name="donationDay"
                  value={formData.donationDay}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl"
                >
                  {DONATION_DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOTIFICATION TOGGLE */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-bold">Notifications</p>

                <div className="flex gap-4 mt-2">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                    />
                    Email
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleChange}
                    />
                    SMS
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      name="whatsappNotifications"
                      checked={formData.whatsappNotifications}
                      onChange={handleChange}
                    />
                    WhatsApp
                  </label>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-xl"
              >
                {loading ? 'Creating account...' : 'Join as Monthly Donor'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl border-2 border-gray-200 bg-white"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>

          {/* SIDEBAR — unchanged */}
          <div className="space-y-5">
            {/* Impact */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-purple-500 mb-8">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Award size={24} className="text-white" />
              </div>
              <h4 className="font-bold">Your Impact</h4>
              <p className="text-gray-600">
                Small monthly donations change lives.
              </p>
              <div className="bg-purple-50 p-3 mt-3 rounded-lg">
                <p className="text-purple-700 font-semibold text-xs">
                  ₹500/month = 6 meals per day for a child
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-green-500 mb-8">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} className="text-white" />
              </div>
              <h4 className="font-bold">Safe & Secure</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex gap-2">
                  <CheckCircle className="text-green-500" /> 256-bit encryption
                </p>
                <p className="flex gap-2">
                  <CheckCircle className="text-green-500" /> Cancel anytime
                </p>
                <p className="flex gap-2">
                  <CheckCircle className="text-green-500" /> Fully transparent
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white mb-8">
              <h4 className="font-bold flex items-center gap-2 mb-3">
                <Sparkles /> Monthly Donor Benefits
              </h4>
              <ul className="space-y-2 text-sm">
                <li>✓ Exclusive impact reports</li>
                <li>✓ Recognition badges</li>
                <li>✓ Priority event invites</li>
                <li>✓ Tax benefits</li>
              </ul>
            </div>

            {/* Fourth Box - Why Monthly Giving */}
<div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-xl p-5 border border-white/30 mt-4">
  <h3 className="text-lg font-semibold text-purple-700 mb-3">
    Why Monthly Giving?
  </h3>

  <ul className="text-sm text-gray-700 space-y-2">
    <li className="flex items-start gap-2">
      <span className="text-purple-600 mt-1">✔</span>
      Consistent support helps us plan long-term programs.
    </li>

    <li className="flex items-start gap-2">
      <span className="text-purple-600 mt-1">✔</span>
      Enables rapid response during emergencies.
    </li>

    <li className="flex items-start gap-2">
      <span className="text-purple-600 mt-1">✔</span>
      Makes your impact 3× stronger over time.
    </li>
  </ul>
</div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterRegularDonor;
