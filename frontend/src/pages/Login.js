// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import useAuth from '../context/useAuth';

// const Login = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Get login function and user from context
//   const { login, user } = useAuth();
//   const navigate = useNavigate();

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       navigate('/dashboard');
//     }
//   }, [user, navigate]);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     setError('');
//     setLoading(true);

//     // Validation
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     // Call login function
//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       // Redirect to dashboard
//       navigate('/dashboard');
//     } else {
//       setError(result.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Welcome Back
//           </h2>
//           <p className="text-gray-600 mt-2">Login to Hope Circle Foundation</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleSubmit}>
//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         {/* Register Link */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-600 text-sm">
//             Don't have an account?{' '}
//             <Link 
//               to="/register" 
//               className="text-blue-600 hover:text-blue-800 font-semibold"
//             >
//               Register here
//             </Link>
//           </p>
//         </div>

//         {/* Info */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <p className="text-xs text-gray-500 text-center">
//             🔒 Your data is secure and encrypted
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Heart,
//   Mail,
//   Lock,
//   ArrowLeft,
//   AlertCircle,
//   LogIn,
//   UserCheck,
// } from 'lucide-react';

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     setError('');
//     setLoading(true);

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/auth/login`, {
//         email: formData.email,
//         password: formData.password,
//       });

//       const { token, user } = response.data;

//       // Store token and user data
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));

//       // Redirect based on role
//       switch (user.role) {
//         case 'admin':
//           navigate('/admin/dashboard');
//           break;
//         case 'donor':
//           navigate('/donor/dashboard');
//           break;
//         case 'beneficiary':
//           navigate('/dashboard');
//           break;
//         default:
//           navigate('/');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password');
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4">
//       <div className="max-w-md w-full">
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center text-white hover:text-blue-100 mb-6"
//         >
//           <ArrowLeft size={20} className="mr-2" />
//           Back to Home
//         </button>

//         <div className="bg-white rounded-2xl shadow-2xl p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="mb-4">
//               <Heart size={64} className="mx-auto text-red-500 animate-pulse" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               Welcome Back!
//             </h1>
//             <p className="text-gray-600">
//               Login to access your dashboard
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <AlertCircle className="text-red-600 mr-3" size={20} />
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Login Form */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">
//                 <Mail className="inline mr-2" size={18} />
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onKeyPress={handleKeyPress}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="your@email.com"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">
//                 <Lock className="inline mr-2" size={18} />
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onKeyPress={handleKeyPress}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your password"
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center text-gray-600">
//                 <input
//                   type="checkbox"
//                   className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                 />
//                 Remember me
//               </label>
//               <button className="text-blue-600 hover:text-blue-800 font-semibold">
//                 Forgot password?
//               </button>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 'Logging in...'
//               ) : (
//                 <>
//                   <LogIn className="mr-2" size={20} />
//                   Login
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="my-8 flex items-center">
//             <div className="flex-1 border-t border-gray-300"></div>
//             <span className="px-4 text-gray-500 text-sm">New here?</span>
//             <div className="flex-1 border-t border-gray-300"></div>
//           </div>

//           {/* Registration Options */}
//           <div className="space-y-3">
//             <button
//               onClick={() => navigate('/register-regular-donor')}
//               className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition flex items-center justify-center"
//             >
//               <UserCheck className="mr-2" size={18} />
//               Register as Regular Donor
//             </button>

//             <button
//               onClick={() => navigate('/register-beneficiary')}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center"
//             >
//               <UserCheck className="mr-2" size={18} />
//               Register as Beneficiary
//             </button>

//             <button
//               onClick={() => navigate('/donate')}
//               className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center"
//             >
//               <Heart className="mr-2" size={18} />
//               Quick Donate (No Registration)
//             </button>
//           </div>

//           {/* Info */}
//           <div className="mt-8 bg-blue-50 rounded-lg p-4">
//             <p className="text-sm text-blue-800 text-center">
//               <strong>📱 Access for All Users</strong>
//             </p>
//             <p className="text-xs text-blue-700 text-center mt-2">
//               Admin • Regular Donors • Beneficiaries
//             </p>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div className="mt-6 text-center text-white text-sm">
//           <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import useAuth from '../context/useAuth';

// const Login = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Get login function and user from context
//   const { login, user } = useAuth();
//   const navigate = useNavigate();

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       // Redirect based on role if already logged in
//       if (user.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else if (user.role === 'donor') {
//         navigate('/donor/dashboard');
//       } else if (user.role === 'beneficiary') {
//         navigate('/dashboard');
//       }
//     }
//   }, [user, navigate]);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     setError('');
//     setLoading(true);

//     // Validation
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     // Call login function
//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       // Get user data from result
//       const loggedInUser = result.user;
      
//       // Redirect based on role
//       if (loggedInUser.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else if (loggedInUser.role === 'donor') {
//         navigate('/donor/dashboard');
//       } else if (loggedInUser.role === 'beneficiary') {
//         navigate('/dashboard');
//       } else {
//         // Fallback
//         navigate('/dashboard');
//       }
//     } else {
//       setError(result.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Welcome Back
//           </h2>
//           <p className="text-gray-600 mt-2">Login to Hope Circle Foundation</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {/* Login Form */}
//         <div>
//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </div>

//         {/* Register Links */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-600 text-sm mb-3">
//             Don't have an account?
//           </p>
//           <div className="space-y-2">
//             <Link 
//               to="/register-regular-donor" 
//               className="block text-orange-600 hover:text-orange-800 font-semibold text-sm"
//             >
//               🌟 Register as Regular Donor
//             </Link>
//             <Link 
//               to="/register-beneficiary" 
//               className="block text-blue-600 hover:text-blue-800 font-semibold text-sm"
//             >
//               🙏 Register as Beneficiary
//             </Link>
//             <Link 
//               to="/donate" 
//               className="block text-green-600 hover:text-green-800 font-semibold text-sm"
//             >
//               💚 Quick Donor Registration
//             </Link>
//           </div>
//         </div>

//         {/* Info */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <p className="text-xs text-gray-500 text-center">
//             🔒 Your data is secure and encrypted
//           </p>
//         </div>

//         {/* Back to Homepage */}
//         <div className="mt-4 text-center">
//           <Link 
//             to="/" 
//             className="text-sm text-gray-600 hover:text-gray-800"
//           >
//             ← Back to Homepage
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "donor") navigate("/donor/dashboard");
      else if (user.role === "beneficiary") navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const loggedInUser = result.user;
      if (loggedInUser.role === "admin") navigate("/admin/dashboard");
      else if (loggedInUser.role === "donor") navigate("/donor/dashboard");
      else if (loggedInUser.role === "beneficiary") navigate("/dashboard");
      else navigate("/dashboard");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center pt-[65px] relative">



      {/* NAVBAR */}
<nav className="absolute top-0 left-0 w-full z-20">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between
      bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-sm rounded-b-2xl">

    {/* Logo + Tagline */}
    <div className="flex items-center gap-3">
      <img
        src="/hero1.jpg"
        alt="Hope Circle Logo"
        className="h-12 w-12 rounded-full shadow-md"
      />

      <div>
        <h1 className="text-xl font-bold text-gray-800">Hope Circle Foundation</h1>
        <p className="text-sm text-gray-700 -mt-1 italic">
          “Spreading hope, one act of kindness at a time.”
        </p>
      </div>
    </div>

    {/* Back to Home */}
    <Link
      to="/"
      className="px-5 py-2 rounded-xl font-medium text-white bg-red-600 shadow
                 hover:bg-red-700 transition-all"
    >
      ⬅ Back to Home
    </Link>
  </div>
</nav>


      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-red-500/30 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-pink-400/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-100/40 backdrop-blur-md"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-4 md:px-10 z-10">

        {/* Left Content */}
        <div className="hidden md:flex flex-col justify-center px-4 animate-fadeIn scale-[0.95]">

          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight drop-shadow">
            Welcome Back to
            <span className="text-red-600 block mt-2">Hope Circle Foundation</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Every login empowers us to reach more people in need.  
            Your actions help save lives and spread kindness.
          </p>

          <div className="mt-8 flex items-center gap-5">
            <div className="px-6 py-3 bg-white/40 rounded-xl backdrop-blur-lg shadow-lg border border-white/20">
              ⭐ Trusted by <b>5,200+ donors</b>
            </div>
            <div className="px-6 py-3 bg-white/40 rounded-xl backdrop-blur-lg shadow-lg border border-white/20">
              🔐 Secure & Encrypted
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="h-full flex items-center justify-center">
          <div className="
            w-full max-w-md p-6 
            bg-white/30 backdrop-blur-xl 
            rounded-3xl shadow-2xl border border-white/20
            animate-slideUp relative overflow-hidden
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

            {/* Logo */}
            <div className="flex justify-center mb-3">
              <img
                src="/hero1.jpg"
                alt="Logo"
                  className="h-12 w-12 rounded-full shadow-md"
              />
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800">
              Login to Continue
            </h2>
            <p className="text-center text-gray-600 -mt-1 mb-4">
              Access your dashboard
            </p>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="font-medium text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="mb-6">
                <label className="font-medium text-gray-700 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register Buttons */}
            <div className="mt-8 space-y-3">

              <Link
                to="/register-regular-donor"
                className="block w-full py-2 text-center font-medium text-white rounded-xl 
                   bg-gradient-to-r from-orange-500 to-orange-600 shadow hover:scale-[1.02] transition"
              >
                🌟 Register as Regular Donor
              </Link>

              <Link
                to="/register-beneficiary"
                className="block w-full py-2 text-center font-medium text-white rounded-xl 
                   bg-gradient-to-r from-blue-500 to-blue-600 shadow hover:scale-[1.02] transition"
              >
                🙏 Register as Beneficiary
              </Link>

              <Link
                to="/donate"
                className="block w-full py-2 text-center font-medium text-white rounded-xl 
                   bg-gradient-to-r from-green-500 to-green-600 shadow hover:scale-[1.02] transition"
              >
                💚 Quick Donor Registration
              </Link>

              {/* <Link
                to="/"
                className="block w-full py-2 text-center mt-2 font-medium text-gray-700 rounded-xl 
                   bg-white shadow hover:bg-gray-50 border border-gray-200"
              >
                ← Back to Homepage
              </Link> */}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
