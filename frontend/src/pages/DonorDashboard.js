

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   Heart,
//   TrendingUp,
//   Users,
//   Target,
//   Calendar,
//   Trophy,
//   Star,
//   Zap,
//   Bell,
//   Clock,
//   Award,
//   CheckCircle,
//   Settings,
// } from 'lucide-react';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from 'recharts';

// const DonorDashboard = () => {
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate();

//   const [impact, setImpact] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//   const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const statsRes = await axios.get(`${API_URL}/api/donations/my-donations`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const impactRes = await axios.get(`${API_URL}/api/donors/my-impact`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setImpact(
//           impactRes.data.data || {
//             totalDonated: statsRes.data.totalDonated || 0,
//             totalDonations: statsRes.data.count || 0,
//             livesImpacted: 0,
//             categoryImpact: { poor: 0, orphan: 0, physically_challenged: 0 },
//             beneficiariesHelped: [],
//             achievements: [],
//             badge: {
//               level: 'none',
//               color: '#000',
//               icon: '🏅',
//               nextBadge: '',
//               nextBadgeAmount: 0,
//               progressPercentage: 0,
//             },
//             impactScore: 0,
//           }
//         );

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchDashboardData();
//     } else {
//       setLoading(false);
//     }
//   }, [token, API_URL]);

//   const getBadgeDisplay = () => {
//     if (!impact) return null;
//     const { badge } = impact;

//     return (
//       <div className="text-center">
//         <div className="text-6xl mb-2">{badge.icon}</div>
//         <div className="text-2xl font-bold capitalize" style={{ color: badge.color }}>
//           {badge.level === 'none' ? 'New Donor' : `${badge.level} Donor`}
//         </div>
//         {badge.nextBadgeAmount > 0 && (
//           <div className="mt-4">
//             <div className="text-sm text-gray-600 mb-2">
//               ₹{Math.max(0, (badge.nextBadgeAmount - (impact.totalDonated || 0))).toLocaleString()} to {badge.nextBadge}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
//                 style={{ width: `${badge.progressPercentage || 0}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Calculate days until next donation
//   const getDaysUntilNextDonation = () => {
//     if (!user?.recurringDonation?.nextDonationDate) return null;
//     const nextDate = new Date(user.recurringDonation.nextDonationDate);
//     const today = new Date();
//     const diffTime = nextDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const daysUntil = getDaysUntilNextDonation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
//         <div className="text-center">
//           <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="text-gray-600 mt-4">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       {/* NAVBAR */}
//       <nav className="w-full backdrop-blur-xl bg-white/80 shadow-lg rounded-2xl border border-white/40 p-5 flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <Heart className="text-red-500" size={28} />
//           <h1 className="text-2xl font-bold text-gray-800">
//             {user?.isRegularDonor ? '🌟 Regular Donor Portal kjshdlkjalk;sdhfjsakj' : '💚 Donor Dashboard'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-5">
//           <p className="text-gray-700 font-medium">
//             Welcome, <span className="font-bold">{user?.name}</span>
//           </p>
//           <button
//             onClick={() => {
//               logout();
//               navigate('/');
//             }}
//             className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto">
//         {/* REGULAR DONOR BANNER */}
//         {user?.isRegularDonor && user?.recurringDonation?.active && (
//           <div className="mb-8 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Award size={64} className="animate-pulse" />
//                 <div>
//                   <h2 className="text-3xl font-bold mb-2">⭐ Regular Donor Member</h2>
//                   <p className="text-lg opacity-90">
//                     Monthly Commitment: ₹{user.recurringDonation.amount.toLocaleString()}
//                   </p>
//                   <p className="text-sm opacity-75 mt-1">
//                     Donation Day: {user.recurringDonation.donationDay}
//                     {user.recurringDonation.donationDay === 1 ? 'st' : 
//                      user.recurringDonation.donationDay === 2 ? 'nd' : 
//                      user.recurringDonation.donationDay === 3 ? 'rd' : 'th'} of every month
//                   </p>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
//                   <div className="text-4xl font-bold">
//                     {user.recurringDonation.consecutiveMonths || 0}
//                   </div>
//                   <div className="text-sm opacity-90">Month Streak 🔥</div>
//                 </div>

//                 {daysUntil !== null && daysUntil >= 0 && (
//                   <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
//                     <Clock className="inline mr-2" size={18} />
//                     <span className="font-semibold">
//                       {daysUntil === 0 ? 'Today!' : `${daysUntil} days left`}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* TOP STATS CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="p-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-gray-700 font-medium">Total Donated</p>
//                 <h2 className="text-3xl font-bold mt-2 text-green-600">
//                   ₹{(impact?.totalDonated || 0).toLocaleString()}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-2">Thank you for your generosity 🎉</p>
//               </div>
//               <TrendingUp size={40} className="text-green-600" />
//             </div>
//           </div>

//           <div className="p-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-gray-700 font-medium">Donations Made</p>
//                 <h2 className="text-3xl font-bold mt-2 text-blue-600">
//                   {impact?.totalDonations || 0}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-2">You're making a difference 😊</p>
//               </div>
//               <Heart size={40} className="text-blue-600" />
//             </div>
//           </div>

//           <div className="p-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition">
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-gray-700 font-medium">Lives Impacted</p>
//                 <h2 className="text-3xl font-bold mt-2 text-purple-600">
//                   {impact?.livesImpacted || 0}+
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-2">Estimated beneficiaries 👥</p>
//               </div>
//               <Users size={40} className="text-purple-600" />
//             </div>
//           </div>
//         </div>

//         {/* REGULAR DONOR INFO & SETTINGS */}
//         {user?.isRegularDonor && user?.recurringDonation?.active && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//             {/* Reminder Settings */}
//             <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//               <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                 <Bell className="mr-2 text-blue-600" size={24} />
//                 Notification Settings
//               </h3>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
//                   <div className="flex items-center">
//                     {user.recurringDonation.emailNotifications ? (
//                       <CheckCircle className="text-green-600 mr-3" size={20} />
//                     ) : (
//                       <div className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3"></div>
//                     )}
//                     <div>
//                       <p className="font-semibold text-gray-800">📧 Email Reminders</p>
//                       <p className="text-sm text-gray-600">Get monthly donation reminders via email</p>
//                     </div>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                     user.recurringDonation.emailNotifications ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
//                   }`}>
//                     {user.recurringDonation.emailNotifications ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//                   <div className="flex items-center">
//                     {user.recurringDonation.smsNotifications ? (
//                       <CheckCircle className="text-green-600 mr-3" size={20} />
//                     ) : (
//                       <div className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3"></div>
//                     )}
//                     <div>
//                       <p className="font-semibold text-gray-800">📱 SMS Reminders</p>
//                       <p className="text-sm text-gray-600">Receive text message reminders</p>
//                     </div>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                     user.recurringDonation.smsNotifications ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
//                   }`}>
//                     {user.recurringDonation.smsNotifications ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
//                   <div className="flex items-center">
//                     {user.recurringDonation.whatsappNotifications ? (
//                       <CheckCircle className="text-green-600 mr-3" size={20} />
//                     ) : (
//                       <div className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3"></div>
//                     )}
//                     <div>
//                       <p className="font-semibold text-gray-800">💬 WhatsApp Reminders</p>
//                       <p className="text-sm text-gray-600">Get reminders on WhatsApp (Coming Soon)</p>
//                     </div>
//                   </div>
//                   <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-600">
//                     Coming Soon
//                   </span>
//                 </div>

//                 <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition flex items-center justify-center">
//                   <Settings className="mr-2" size={18} />
//                   Update Preferences
//                 </button>
//               </div>
//             </div>

//             {/* Next Donation Info */}
//             <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
//               <h3 className="text-xl font-bold mb-4 flex items-center">
//                 <Calendar className="mr-2" size={24} />
//                 Next Donation
//               </h3>

//               <div className="text-center py-6">
//                 {daysUntil !== null && daysUntil >= 0 ? (
//                   <>
//                     <div className="text-6xl font-bold mb-4">
//                       {daysUntil === 0 ? '🎯' : daysUntil}
//                     </div>
//                     <p className="text-2xl font-semibold mb-2">
//                       {daysUntil === 0 ? 'Due Today!' : `${daysUntil} Days Left`}
//                     </p>
//                     <p className="text-lg opacity-90 mb-6">
//                       Amount: ₹{user.recurringDonation.amount.toLocaleString()}
//                     </p>
//                     <button
//                       onClick={() => navigate('/donate')}
//                       className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition"
//                     >
//                       Donate Now
//                     </button>
//                   </>
//                 ) : (
//                   <div>
//                     <p className="text-xl">Next donation scheduled for</p>
//                     <p className="text-2xl font-bold mt-2">
//                       {user.recurringDonation.donationDay}
//                       {user.recurringDonation.donationDay === 1 ? 'st' : 
//                        user.recurringDonation.donationDay === 2 ? 'nd' : 
//                        user.recurringDonation.donationDay === 3 ? 'rd' : 'th'} of next month
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Badge & Achievements */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//               <Trophy className="mr-2 text-yellow-500" size={24} />
//               Your Donor Badge
//             </h3>
//             {getBadgeDisplay()}
//             {impact?.badge?.level !== 'platinum' && (
//               <div className="mt-6 bg-blue-50 rounded-lg p-4">
//                 <p className="text-sm text-blue-800 text-center">
//                   🎯 Keep donating to unlock {impact?.badge?.nextBadge} badge!
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//               <Star className="mr-2 text-yellow-500" size={24} />
//               Achievements Unlocked
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               {impact?.achievements?.length > 0 ? (
//                 impact.achievements.map((achievement, index) => (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-center border-2 border-yellow-200"
//                   >
//                     <div className="text-4xl mb-2">{achievement.icon}</div>
//                     <div className="text-sm font-bold text-gray-800">{achievement.name}</div>
//                     <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center text-gray-500 py-8">
//                   <Star size={48} className="mx-auto mb-4 opacity-50" />
//                   <p>Start donating to unlock achievements!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Impact Breakdown */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <Target className="mr-2 text-blue-600" size={24} />
//               Your Impact by Category
//             </h3>
//             {impact?.categoryImpact && (
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={[
//                       { name: 'Poor Families', value: impact.categoryImpact.poor || 0 },
//                       { name: 'Orphans', value: impact.categoryImpact.orphan || 0 },
//                       { name: 'Physically Challenged', value: impact.categoryImpact.physically_challenged || 0 },
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: ₹${(value || 0).toLocaleString()}`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {COLORS.map((color, index) => (
//                       <Cell key={`cell-${index}`} fill={color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}

//             <div className="mt-4 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
//                   Poor Families
//                 </span>
//                 <span className="font-semibold">₹{(impact?.categoryImpact?.poor || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//                   Orphans
//                 </span>
//                 <span className="font-semibold">₹{(impact?.categoryImpact?.orphan || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
//                   Physically Challenged
//                 </span>
//                 <span className="font-semibold">
//                   ₹{(impact?.categoryImpact?.physically_challenged || 0).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <Users className="mr-2 text-purple-600" size={24} />
//               Beneficiaries You Helped
//             </h3>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {impact?.beneficiariesHelped?.length > 0 ? (
//                 impact.beneficiariesHelped.map((beneficiary, index) => (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="font-semibold text-gray-800">{beneficiary.anonymizedName}</div>
//                         <div className="text-sm text-gray-600 capitalize">
//                           {beneficiary.category.replace('_', ' ')}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {new Date(beneficiary.date).toLocaleDateString()}
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className="font-bold text-green-600">₹{beneficiary.amount.toLocaleString()}</div>
//                         <div className="text-xs text-gray-500">Your contribution</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-8">
//                   <Users size={48} className="mx-auto mb-4 opacity-50" />
//                   <p>Your impact will appear here after donations are distributed</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <div className="flex items-center mb-4">
//               <Heart className="text-green-600 mr-3" size={28} />
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">Make a Donation</h3>
//                 <p className="text-sm text-gray-600">Support those in need</p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate('/donate')}
//               className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
//             >
//               Donate Now
//             </button>
//           </div>

//           <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg">
//             <div className="flex items-center mb-4">
//               <Calendar className="text-blue-600 mr-3" size={28} />
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">Donation History</h3>
//                 <p className="text-sm text-gray-600">View all your contributions</p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate('/donor/donations')}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200"
//             >
//               View History
//             </button>
//           </div>
//         </div>

//         {/* IMPACT SCORE */}
//         <div className="p-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl text-white text-center">
//           <Zap size={64} className="mx-auto mb-4" />
//           <h3 className="text-3xl font-bold mb-2">Your Impact Score</h3>
//           <p className="text-6xl font-bold mb-4">{impact?.impactScore || 0}</p>
//           <p className="text-lg opacity-90">Based on your donations and lives changed</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonorDashboard;



// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   Heart,
//   TrendingUp,
//   Users,
//   Target,
//   Calendar,
//   Trophy,
//   Star,
//   Zap,

//   Clock,
//   Award,
  
//   AlertCircle,
// } from 'lucide-react';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from 'recharts';

// const DonorDashboard = () => {
//   const { user, token, logout } = useAuth();
//   const navigate = useNavigate();

//   const [impact, setImpact] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//   const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const statsRes = await axios.get(`${API_URL}/api/donations/my-donations`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const impactRes = await axios.get(`${API_URL}/api/donors/my-impact`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setImpact(
//           impactRes.data.data || {
//             totalDonated: statsRes.data.totalDonated || 0,
//             totalDonations: statsRes.data.count || 0,
//             livesImpacted: 0,
//             categoryImpact: { poor: 0, orphan: 0, physically_challenged: 0 },
//             beneficiariesHelped: [],
//             achievements: [],
//             badge: {
//               level: 'none',
//               color: '#000',
//               icon: '🏅',
//               nextBadge: '',
//               nextBadgeAmount: 0,
//               progressPercentage: 0,
//             },
//             impactScore: 0,
//           }
//         );

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchDashboardData();
//     } else {
//       setLoading(false);
//     }
//   }, [token, API_URL]);

//   const getBadgeDisplay = () => {
//     if (!impact) return null;
//     const { badge } = impact;

//     return (
//       <div className="text-center">
//         <div className="text-6xl mb-2">{badge.icon}</div>
//         <div className="text-2xl font-bold capitalize" style={{ color: badge.color }}>
//           {badge.level === 'none' ? 'New Donor' : `${badge.level} Donor`}
//         </div>
//         {badge.nextBadgeAmount > 0 && (
//           <div className="mt-4">
//             <div className="text-sm text-gray-600 mb-2">
//               ₹{Math.max(0, (badge.nextBadgeAmount - (impact.totalDonated || 0))).toLocaleString()} to {badge.nextBadge}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
//                 style={{ width: `${badge.progressPercentage || 0}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const getDaysUntilNextDonation = () => {
//     if (!user?.recurringDonation?.nextDonationDate) return null;
//     const nextDate = new Date(user.recurringDonation.nextDonationDate);
//     const today = new Date();
//     const diffTime = nextDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const daysUntil = getDaysUntilNextDonation();

//   const handleDonateClick = () => {
//     if (user?.isRegularDonor && user?.recurringDonation?.active) {
//       // For Regular Donors - go to dedicated regular donor payment page
//       navigate('/donor/monthly-donation');
//     } else {
//       // For normal donors - go to guest donation page
//       navigate('/donate');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="text-gray-600 mt-4">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* NAVBAR */}
//       <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Heart className="text-red-500" size={28} />
//             <h1 className="text-2xl font-bold text-gray-800">
//               {user?.isRegularDonor ? '🌟 Regular Donor Portal' : '💚 Donor Dashboard'}
//             </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <p className="text-gray-700">
//               Welcome, <span className="font-semibold">{user?.name}</span>
//             </p>
//             <button
//               onClick={() => {
//                 logout();
//                 navigate('/');
//               }}
//               className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* REGULAR DONOR STATUS BANNER */}
//         {user?.isRegularDonor && user?.recurringDonation?.active && (
//           <div className="mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Award size={56} />
//                 <div>
//                   <h2 className="text-2xl font-bold mb-1">⭐ Regular Donor Member</h2>
//                   <p className="text-lg">
//                     Monthly Commitment: <span className="font-bold">₹{user.recurringDonation.amount.toLocaleString()}</span>
//                   </p>
//                   <p className="text-sm opacity-90 mt-1">
//                     Donation Day: {user.recurringDonation.donationDay}
//                     {user.recurringDonation.donationDay === 1 ? 'st' : 
//                      user.recurringDonation.donationDay === 2 ? 'nd' : 
//                      user.recurringDonation.donationDay === 3 ? 'rd' : 'th'} of every month
//                   </p>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-2">
//                   <div className="text-4xl font-bold">
//                     {user.recurringDonation.consecutiveMonths || 0}
//                   </div>
//                   <div className="text-sm">Month Streak 🔥</div>
//                 </div>

//                 {daysUntil !== null && daysUntil >= 0 && (
//                   <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
//                     <Clock className="inline mr-1" size={16} />
//                     <span className="text-sm font-semibold">
//                       {daysUntil === 0 ? 'Due Today!' : `${daysUntil} days left`}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Next Donation Alert */}
//             {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
//               <div className="mt-4 bg-white/10 border border-white/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <AlertCircle size={24} />
//                   <div>
//                     <p className="font-semibold">
//                       {daysUntil === 0 ? 'Your monthly donation is due today!' : `Your monthly donation is due in ${daysUntil} days`}
//                     </p>
//                     <p className="text-sm opacity-90">Amount: ₹{user.recurringDonation.amount.toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleDonateClick}
//                   className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-orange-50 transition"
//                 >
//                   Donate Now
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* TOP STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-600 text-sm">Total Donated</p>
//                 <h2 className="text-3xl font-bold mt-2 text-green-600">
//                   ₹{(impact?.totalDonated || 0).toLocaleString()}
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-2">Thank you for your generosity 🎉</p>
//               </div>
//               <TrendingUp size={32} className="text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-600 text-sm">Donations Made</p>
//                 <h2 className="text-3xl font-bold mt-2 text-blue-600">
//                   {impact?.totalDonations || 0}
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-2">You're making a difference 😊</p>
//               </div>
//               <Heart size={32} className="text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-600 text-sm">Lives Impacted</p>
//                 <h2 className="text-3xl font-bold mt-2 text-purple-600">
//                   {impact?.livesImpacted || 0}+
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-2">Estimated beneficiaries 👥</p>
//               </div>
//               <Users size={32} className="text-purple-600" />
//             </div>
//           </div>
//         </div>

//         {/* BADGE & ACHIEVEMENTS */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <Trophy className="mr-2 text-yellow-500" size={20} />
//               Your Donor Badge
//             </h3>
//             {getBadgeDisplay()}
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <Star className="mr-2 text-yellow-500" size={20} />
//               Achievements Unlocked
//             </h3>
//             <div className="grid grid-cols-2 gap-3">
//               {impact?.achievements?.length > 0 ? (
//                 impact.achievements.map((achievement, index) => (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 text-center border-2 border-yellow-200"
//                   >
//                     <div className="text-3xl mb-1">{achievement.icon}</div>
//                     <div className="text-xs font-bold text-gray-800">{achievement.name}</div>
//                     <div className="text-xs text-gray-600">{achievement.description}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center text-gray-500 py-6">
//                   <Star size={40} className="mx-auto mb-3 opacity-50" />
//                   <p className="text-sm">Start donating to unlock achievements!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* IMPACT BREAKDOWN */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <Target className="mr-2 text-blue-600" size={20} />
//               Your Impact by Category
//             </h3>
//             {impact?.categoryImpact && (
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={[
//                       { name: 'Poor Families', value: impact.categoryImpact.poor || 0 },
//                       { name: 'Orphans', value: impact.categoryImpact.orphan || 0 },
//                       { name: 'Physically Challenged', value: impact.categoryImpact.physically_challenged || 0 },
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: ₹${(value || 0).toLocaleString()}`}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {COLORS.map((color, index) => (
//                       <Cell key={`cell-${index}`} fill={color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}

//             <div className="mt-3 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
//                   Poor Families
//                 </span>
//                 <span className="font-semibold">₹{(impact?.categoryImpact?.poor || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//                   Orphans
//                 </span>
//                 <span className="font-semibold">₹{(impact?.categoryImpact?.orphan || 0).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="flex items-center">
//                   <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
//                   Physically Challenged
//                 </span>
//                 <span className="font-semibold">
//                   ₹{(impact?.categoryImpact?.physically_challenged || 0).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <Users className="mr-2 text-purple-600" size={20} />
//               Beneficiaries You Helped
//             </h3>
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {impact?.beneficiariesHelped?.length > 0 ? (
//                 impact.beneficiariesHelped.map((beneficiary, index) => (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border-l-4 border-purple-500"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="font-semibold text-sm text-gray-800">{beneficiary.anonymizedName}</div>
//                         <div className="text-xs text-gray-600 capitalize">
//                           {beneficiary.category.replace('_', ' ')}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {new Date(beneficiary.date).toLocaleDateString()}
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className="font-bold text-sm text-green-600">₹{beneficiary.amount.toLocaleString()}</div>
//                         <div className="text-xs text-gray-500">Your share</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-8">
//                   <Users size={40} className="mx-auto mb-3 opacity-50" />
//                   <p className="text-sm">Your impact will appear here after donations are distributed</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center mb-4">
//               <Heart className="text-green-600 mr-3" size={24} />
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">Make a Donation</h3>
//                 <p className="text-sm text-gray-600">
//                   {user?.isRegularDonor ? 'Complete your monthly commitment' : 'Support those in need'}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleDonateClick}
//               className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition"
//             >
//               {user?.isRegularDonor ? 'Pay Monthly Donation' : 'Donate Now'}
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center mb-4">
//               <Calendar className="text-blue-600 mr-3" size={24} />
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">Donation History</h3>
//                 <p className="text-sm text-gray-600">View all your contributions</p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate('/donor/donations')}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
//             >
//               View History
//             </button>
//           </div>
//         </div>

//         {/* IMPACT SCORE */}
//         <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-white text-center">
//           <Zap size={56} className="mx-auto mb-3" />
//           <h3 className="text-2xl font-bold mb-2">Your Impact Score</h3>
//           <p className="text-5xl font-bold mb-3">{impact?.impactScore || 0}</p>
//           <p className="text-base opacity-90">Based on your donations and lives changed</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonorDashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  Heart,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Trophy,
  Star,
  Zap,

  Clock,
  Award,
 
  AlertCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const DonorDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}/api/donations/my-donations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const impactRes = await axios.get(`${API_URL}/api/donors/my-impact`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setImpact(
          impactRes.data.data || {
            totalDonated: statsRes.data.totalDonated || 0,
            totalDonations: statsRes.data.count || 0,
            livesImpacted: 0,
            categoryImpact: { poor: 0, orphan: 0, physically_challenged: 0 },
            beneficiariesHelped: [],
            achievements: [],
            badge: {
              level: 'none',
              color: '#000',
              icon: '🏅',
              nextBadge: '',
              nextBadgeAmount: 0,
              progressPercentage: 0,
            },
            impactScore: 0,
          }
        );

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [token, API_URL]);

  const getBadgeDisplay = () => {
    if (!impact) return null;
    const { badge } = impact;

    return (
      <div className="text-center">
        <div className="text-6xl mb-2">{badge.icon}</div>
        <div className="text-2xl font-bold capitalize" style={{ color: badge.color }}>
          {badge.level === 'none' ? 'New Donor' : `${badge.level} Donor`}
        </div>
        {badge.nextBadgeAmount > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">
              ₹{Math.max(0, (badge.nextBadgeAmount - (impact.totalDonated || 0))).toLocaleString()} to {badge.nextBadge}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${badge.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getDaysUntilNextDonation = () => {
    if (!user?.recurringDonation?.nextDonationDate) return null;
    const nextDate = new Date(user.recurringDonation.nextDonationDate);
    const today = new Date();
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilNextDonation();

  const handleDonateClick = () => {
    if (user?.isRegularDonor && user?.recurringDonation?.active) {
      // For Regular Donors - go to dedicated regular donor payment page
      navigate('/donor/monthly-donation');
    } else {
      // For normal donors - go to guest donation page
      navigate('/donate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* NAVBAR */}
<nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg border-b border-white/10 px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">

    {/* LEFT = LOGO + TITLE */}
    <div className="flex items-center gap-4">

      {/* CIRCLE LOGO IMAGE (same as login page) */}
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white/30">
        <img
          src="/hero1.jpg"     // <-- same logo image you used in login page
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-2xl font-bold text-white">
        {user?.isRegularDonor ? '🌟 Regular Donor Portal' : '💚 Donor Dashboard'}
      </h1>
    </div>

    {/* RIGHT SECTION */}
    <div className="flex items-center gap-4">
      <p className="text-white/90">
        Welcome, <span className="font-semibold">{user?.name}</span>
      </p>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold 
                   shadow-md hover:shadow-lg hover:scale-105 transition"
      >
        Logout
      </button>
    </div>

  </div>
</nav>


      <div className="max-w-7xl mx-auto p-6">
        {/* REGULAR DONOR STATUS BANNER */}
        {user?.isRegularDonor && user?.recurringDonation?.active && (
          <div className="mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award size={56} />
                <div>
                  <h2 className="text-2xl font-bold mb-1">⭐ Regular Donor Member</h2>
                  <p className="text-lg">
                    Monthly Commitment: <span className="font-bold">₹{user.recurringDonation.amount.toLocaleString()}</span>
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    Donation Day: {user.recurringDonation.donationDay}
                    {user.recurringDonation.donationDay === 1 ? 'st' : 
                     user.recurringDonation.donationDay === 2 ? 'nd' : 
                     user.recurringDonation.donationDay === 3 ? 'rd' : 'th'} of every month
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-2">
                  <div className="text-4xl font-bold">
                    {user.recurringDonation.consecutiveMonths || 0}
                  </div>
                  <div className="text-sm">Month Streak 🔥</div>
                </div>

                {daysUntil !== null && daysUntil >= 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <Clock className="inline mr-1" size={16} />
                    <span className="text-sm font-semibold">
                      {daysUntil === 0 ? 'Due Today!' : `${daysUntil} days left`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Donation Alert */}
            {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
              <div className="mt-4 bg-white/10 border border-white/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle size={24} />
                  <div>
                    <p className="font-semibold">
                      {daysUntil === 0 ? 'Your monthly donation is due today!' : `Your monthly donation is due in ${daysUntil} days`}
                    </p>
                    <p className="text-sm opacity-90">Amount: ₹{user.recurringDonation.amount.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={handleDonateClick}
                  className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-orange-50 transition"
                >
                  Donate Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Donated</p>
                <h2 className="text-3xl font-bold mt-2 text-green-600">
                  ₹{(impact?.totalDonated || 0).toLocaleString()}
                </h2>
                <p className="text-xs text-gray-500 mt-2">Thank you for your generosity 🎉</p>
              </div>
              <TrendingUp size={32} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Donations Made</p>
                <h2 className="text-3xl font-bold mt-2 text-blue-600">
                  {impact?.totalDonations || 0}
                </h2>
                <p className="text-xs text-gray-500 mt-2">You're making a difference 😊</p>
              </div>
              <Heart size={32} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Lives Impacted</p>
                <h2 className="text-3xl font-bold mt-2 text-purple-600">
                  {impact?.livesImpacted || 0}+
                </h2>
                <p className="text-xs text-gray-500 mt-2">Estimated beneficiaries 👥</p>
              </div>
              <Users size={32} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* BADGE & ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="mr-2 text-yellow-500" size={20} />
              Your Donor Badge
            </h3>
            {getBadgeDisplay()}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Star className="mr-2 text-yellow-500" size={20} />
              Achievements Unlocked
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {impact?.achievements?.length > 0 ? (
                impact.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 text-center border-2 border-yellow-200"
                  >
                    <div className="text-3xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-bold text-gray-800">{achievement.name}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-6">
                  <Star size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Start donating to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IMPACT BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2 text-blue-600" size={20} />
              Your Impact by Category
            </h3>
            {impact?.categoryImpact && (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Poor Families', value: impact.categoryImpact.poor || 0 },
                      { name: 'Orphans', value: impact.categoryImpact.orphan || 0 },
                      { name: 'Physically Challenged', value: impact.categoryImpact.physically_challenged || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${(value || 0).toLocaleString()}`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}

            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Poor Families
                </span>
                <span className="font-semibold">₹{(impact?.categoryImpact?.poor || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Orphans
                </span>
                <span className="font-semibold">₹{(impact?.categoryImpact?.orphan || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                  Physically Challenged
                </span>
                <span className="font-semibold">
                  ₹{(impact?.categoryImpact?.physically_challenged || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-purple-600" size={20} />
              Beneficiaries You Helped
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {impact?.beneficiariesHelped?.length > 0 ? (
                impact.beneficiariesHelped.map((beneficiary, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border-l-4 border-purple-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{beneficiary.anonymizedName}</div>
                        <div className="text-xs text-gray-600 capitalize">
                          {beneficiary.category.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(beneficiary.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm text-green-600">₹{beneficiary.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Your share</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Users size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Your impact will appear here after donations are distributed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Heart className="text-green-600 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">Make a Donation</h3>
                <p className="text-sm text-gray-600">
                  {user?.isRegularDonor ? 'Complete your monthly commitment' : 'Support those in need'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDonateClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition"
            >
              {user?.isRegularDonor ? 'Pay Monthly Donation' : 'Donate Now'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="text-blue-600 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">Donation History</h3>
                <p className="text-sm text-gray-600">View all your contributions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/donor/donations')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
            >
              View History
            </button>
          </div>
        </div>

        {/* IMPACT SCORE */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-white text-center">
          <Zap size={56} className="mx-auto mb-3" />
          <h3 className="text-2xl font-bold mb-2">Your Impact Score</h3>
          <p className="text-5xl font-bold mb-3">{impact?.impactScore || 0}</p>
          <p className="text-base opacity-90">Based on your donations and lives changed</p>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;