

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
  
// } from 'recharts';
// import {
//   DollarSign,
//   Users,
//   TrendingUp,
//   TrendingDown,
//   Clock,
//   CheckCircle,
//   Send,
//   History,
//   Image, 
//   Video, 
// } from 'lucide-react';

// const AdminDashboard = () => {
//   const { user, logout, token } = useAuth();
//   const navigate = useNavigate();

//   // State
//   const [stats, setStats] = useState(null);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch dashboard stats
//         const statsResponse = await axios.get(
//           `${API_URL}/api/analytics/dashboard`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // Fetch monthly stats
//         const monthlyResponse = await axios.get(
//           `${API_URL}/api/analytics/monthly`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setStats(statsResponse.data.data);
//         setMonthlyData(monthlyResponse.data.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError('Failed to load dashboard data');
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchDashboardData();
//     }
//   }, [token, API_URL]);

//   // Handle logout
//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-800">
//                 🏛️ Hope Circle Foundation
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">
//                 Welcome, <span className="font-semibold">{user?.name}</span>
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Donations Card */}
//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100 text-sm font-medium">
//                   Total Collections
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   ₹{stats?.financial?.totalDonations?.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
//                 <TrendingUp size={32} />
//               </div>
//             </div>
//             <div className="mt-4 flex items-center text-green-100 text-sm">
//               <DollarSign size={16} className="mr-1" />
//               From {stats?.users?.totalDonors} donors
//             </div>
//           </div>

//           {/* Total Distributions Card */}
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100 text-sm font-medium">
//                   Total Distributions
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   ₹{stats?.financial?.totalDistributions?.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
//                 <TrendingDown size={32} />
//               </div>
//             </div>
//             <div className="mt-4 flex items-center text-blue-100 text-sm">
//               <Users size={16} className="mr-1" />
//               To {stats?.users?.approvedBeneficiaries} beneficiaries
//             </div>
//           </div>

//           {/* Current Balance Card */}
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100 text-sm font-medium">
//                   Current Balance
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   ₹{stats?.financial?.currentBalance?.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
//                 <DollarSign size={32} />
//               </div>
//             </div>
//             <div className="mt-4 text-purple-100 text-sm">
//               Available for distribution
//             </div>
//           </div>

//           {/* Pending Beneficiaries Card */}
//           <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-orange-100 text-sm font-medium">
//                   Pending Verifications
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   {stats?.users?.pendingBeneficiaries}
//                 </p>
//               </div>
//               <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
//                 <Clock size={32} />
//               </div>
//             </div>
//             <div className="mt-4 flex items-center text-orange-100 text-sm">
//               <CheckCircle size={16} className="mr-1" />
//               {stats?.users?.approvedBeneficiaries} approved
//             </div>
//           </div>
//         </div>
// {/* Quick Actions - UPDATED SECTION */}
// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//   {/* Pending Applications Banner */}
//   {stats?.users?.pendingBeneficiaries > 0 && (
//     <div className="bg-orange-100 border-l-4 border-orange-500 p-6 rounded-lg flex items-center justify-between">
//       <div className="flex items-center">
//         <Clock size={28} className="text-orange-600 mr-4" />
//         <div>
//           <p className="font-semibold text-orange-800 text-lg">
//             {stats.users.pendingBeneficiaries} Application(s) Pending Review
//           </p>
//           <p className="text-sm text-orange-700">
//             Review and approve beneficiary applications
//           </p>
//         </div>
//       </div>
//       <button
//         onClick={() => navigate('/admin/applications')}
//         className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
//       >
//         Review Now
//       </button>
//     </div>
//   )}

//   {/* Distribution Actions */}
//   <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg">
//     <div className="flex items-center mb-4">
//       <Send size={28} className="text-blue-600 mr-3" />
//       <h3 className="text-lg font-bold text-gray-800">Fund Distribution</h3>
//     </div>
//     <p className="text-sm text-gray-600 mb-4">
//       Distribute financial aid to approved beneficiaries
//     </p>
//     <div className="flex space-x-3">
//       <button
//         onClick={() => navigate('/admin/distribute')}
//         className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
//       >
//         <Send size={18} className="mr-2" />
//         Distribute Funds
//       </button>
//       <button
//         onClick={() => navigate('/admin/distributions')}
//         className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold flex items-center justify-center"
//       >
//         <History size={18} className="mr-2" />
//         View History
//       </button>
//     </div>
//   </div>

//   {/* NEW: Work Updates Management */}
//   <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg">
//     <div className="flex items-center mb-4">
//       <svg className="w-7 h-7 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//       </svg>
//       <h3 className="text-lg font-bold text-gray-800">Work Updates</h3>
//     </div>
//     <p className="text-sm text-gray-600 mb-4">
//       Share your impact stories with photos and videos
//     </p>
//     <button
//       onClick={() => navigate('/admin/work-updates')}
//       className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center"
//     >
//       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//       </svg>
//       Manage Updates
//     </button>
//   </div>
// </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Line Chart - Monthly Trend */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">
//               Monthly Financial Trend
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="donations"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   name="Donations"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="distributions"
//                   stroke="#3b82f6"
//                   strokeWidth={2}
//                   name="Distributions"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Bar Chart - Monthly Comparison */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">
//               Monthly Comparison
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="donations" fill="#10b981" name="Donations" />
//                 <Bar dataKey="distributions" fill="#3b82f6" name="Distributions" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Transactions */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4">
//             Recent Transactions
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {stats?.recentTransactions?.map((transaction) => (
//                   <tr key={transaction._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           transaction.type === 'donation'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-blue-100 text-blue-800'
//                         }`}
//                       >
//                         {transaction.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       ₹{transaction.amount.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {transaction.donor?.name || transaction.beneficiary?.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(transaction.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                         {transaction.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
 
} from "recharts";

import {
  DollarSign,

  TrendingUp,
  TrendingDown,
  Clock,
 
  Send,
  History,
   Award,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecent, setShowRecent] = useState(false); 

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}/api/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monthlyRes = await axios.get(`${API_URL}/api/analytics/monthly`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data.data);
        setMonthlyData(monthlyRes.data.data);
      } catch (e) {
        console.log("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token, API_URL]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(99,179,237,0.25), rgba(167,243,208,0.25))",
        backdropFilter: "blur(6px)",
      }}
    >
     {/* NAVBAR */}
<nav className="w-full backdrop-blur-xl bg-white/30 shadow-lg rounded-2xl border border-white/40 p-5 flex items-center justify-between mb-8">

  <div className="flex items-center gap-4">
    <img
      src="/hero1.jpg"          
      alt="Logo"
      className="w-12 h-12 rounded-full object-cover shadow-md border"
    />

    <h1 className="text-2xl font-bold text-gray-800">
      Hope Circle Foundation – Admin
    </h1>
  </div>

  {/* RIGHT — USER + LOGOUT */}
  <div className="flex items-center gap-5">
    <p className="text-gray-700 font-medium">
      Welcome, <span className="font-bold">{user?.name}</span>
    </p>

    <button
      onClick={handleLogout}
      className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>

</nav>


      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* CARD */}
        <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Total Collections</p>
              <h2 className="text-3xl font-bold mt-2">
                ₹{stats?.financial?.totalDonations?.toLocaleString()}
              </h2>
            </div>
            <TrendingUp size={40} className="text-green-600" />
          </div>
        </div>

        <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Total Distributions</p>
              <h2 className="text-3xl font-bold mt-2">
                ₹{stats?.financial?.totalDistributions?.toLocaleString()}
              </h2>
            </div>
            <TrendingDown size={40} className="text-blue-600" />
          </div>
        </div>

        <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Current Balance</p>
              <h2 className="text-3xl font-bold mt-2">
                ₹{stats?.financial?.currentBalance?.toLocaleString()}
              </h2>
            </div>
            <DollarSign size={40} className="text-purple-600" />
          </div>
        </div>

        <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Pending Beneficiaries</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats?.users?.pendingBeneficiaries}
              </h2>
            </div>
            <Clock size={40} className="text-orange-600" />
          </div>
        </div>
      </div>
{/* QUICK ACTIONS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

  {/* Pending Applications */}
  {stats?.users?.pendingBeneficiaries > 0 && (
    <div className="p-6 rounded-2xl bg-orange-100 border-l-4 border-orange-500 shadow-md">
      <h3 className="text-xl font-bold text-orange-800 mb-2">
        {stats.users.pendingBeneficiaries} Applications Pending
      </h3>
      <p className="text-orange-700 mb-4">
        Review beneficiary verification requests
      </p>
      <button
        onClick={() => navigate("/admin/applications")}
        className="w-full bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 transition"
      >
        Review Now
      </button>
    </div>
  )}

  {/* Distribute Funds */}
  <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-md">
    <div className="flex items-center mb-4">
      <Send className="text-blue-600 mr-3" size={28} />
      <h3 className="text-lg font-bold text-gray-800">Fund Distribution</h3>
    </div>
    <p className="text-gray-600 mb-4">
      Distribute help to verified beneficiaries
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => navigate("/admin/distribute")}
        className="flex-1 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
      >
        Distribute
      </button>
      <button
        onClick={() => navigate("/admin/distributions")}
        className="flex-1 bg-gray-700 text-white p-3 rounded-xl hover:bg-gray-800 transition"
      >
        History
      </button>
    </div>
  </div>

  {/* Work Updates */}
  <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-3">Work Updates</h3>
    <p className="text-gray-600 mb-4">
      Upload photos & videos of NGO work
    </p>
    <button
      onClick={() => navigate("/admin/work-updates")}
      className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition"
    >
      Manage Updates
    </button>
  </div>

  {/* ⭐ NEW BUTTON — REGULAR DONORS */}
  <div className="p-6 backdrop-blur-xl bg-white/40 border border-white/50 rounded-2xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
      <Award size={22} className="text-yellow-600" />
      Regular Donors
    </h3>
    <p className="text-gray-600 mb-4">
      Manage donors who contribute frequently
    </p>

    <button
      onClick={() => navigate('/admin/regular-donors')}
      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 
                 text-white px-6 py-3 rounded-xl font-bold 
                 hover:from-orange-600 hover:to-yellow-600 transition"
    >
      <Award className="inline mr-2" size={20} />
      Manage Regular Donors
    </button>
  </div>

</div>


      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Line Chart */}
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="donations" stroke="#10b981" />
              <Line type="monotone" dataKey="distributions" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Monthly Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#10b981" />
              <Bar dataKey="distributions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTIONS TABLE (now collapsible) */}
      <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md">
        <button
          onClick={() => setShowRecent((s) => !s)}
          className="w-full flex items-center justify-between mb-4"
          aria-expanded={showRecent}
        >
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <History size={18} />
            Recent Transactions
          </h3>
          <span className="text-sm text-gray-600">
            {showRecent ? "Collapse" : "Expand"}
          </span>
        </button>

        {showRecent ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100/60 backdrop-blur-xl">
                <tr>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {stats?.recentTransactions?.map((t) => (
                  <tr key={t._id} className="border-b border-gray-200">
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          t.type === "donation"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium">₹{t.amount}</td>
                    <td className="p-4 text-gray-600">
                      {t.donor?.name || t.beneficiary?.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-600 text-sm">Click to expand recent transactions</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
