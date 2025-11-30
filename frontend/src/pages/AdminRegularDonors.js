// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   Award,
//   Users,
//   TrendingUp,
//   Calendar,
//   Mail,
//   Phone,
//   CheckCircle,
 
//   Clock,
//   Search,
//   Filter,
//   Download,
//   ArrowLeft,
// } from 'lucide-react';

// const AdminRegularDonors = () => {
//   const { token, logout } = useAuth();
//   const navigate = useNavigate();

//   const [donors, setDonors] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   useEffect(() => {
//     fetchRegularDonors();
//   }, [token, API_URL]);

//   const fetchRegularDonors = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/admin/regular-donors`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setDonors(response.data.donors || []);
//       setStats(response.data.stats || {});
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching regular donors:', error);
//       setLoading(false);
//     }
//   };

//   const toggleDonorStatus = async (donorId, currentStatus) => {
//     if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this donor?`)) {
//       return;
//     }

//     try {
//       await axios.put(
//         `${API_URL}/api/admin/regular-donors/${donorId}/toggle-status`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchRegularDonors();
//       alert('Donor status updated successfully');
//     } catch (error) {
//       console.error('Error toggling donor status:', error);
//       alert('Failed to update donor status');
//     }
//   };

//   const sendManualReminder = async (donorId) => {
//     try {
//       await axios.post(
//         `${API_URL}/api/admin/regular-donors/${donorId}/send-reminder`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Reminder sent successfully!');
//     } catch (error) {
//       console.error('Error sending reminder:', error);
//       alert('Failed to send reminder');
//     }
//   };

//   const exportToCSV = () => {
//     const csv = [
//       ['Name', 'Email', 'Phone', 'Amount', 'Donation Day', 'Streak', 'Status', 'Last Donation'],
//       ...filteredDonors.map(d => [
//         d.name,
//         d.email,
//         d.phone,
//         d.recurringDonation.amount,
//         d.recurringDonation.donationDay,
//         d.recurringDonation.consecutiveMonths || 0,
//         d.recurringDonation.active ? 'Active' : 'Inactive',
//         d.recurringDonation.lastDonationDate 
//           ? new Date(d.recurringDonation.lastDonationDate).toLocaleDateString() 
//           : 'Never'
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `regular-donors-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   const filteredDonors = donors.filter(donor => {
//     const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesFilter = filterStatus === 'all' ||
//                          (filterStatus === 'active' && donor.recurringDonation.active) ||
//                          (filterStatus === 'inactive' && !donor.recurringDonation.active);
    
//     return matchesSearch && matchesFilter;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="text-gray-600 mt-4">Loading regular donors...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/admin/dashboard')}
//               className="flex items-center text-gray-600 hover:text-gray-800"
//             >
//               <ArrowLeft size={20} className="mr-2" />
//               Back
//             </button>
//             <div className="flex items-center gap-3">
//               <Award className="text-orange-500" size={28} />
//               <h1 className="text-2xl font-bold text-gray-800">Regular Donors Management</h1>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               logout();
//               navigate('/');
//             }}
//             className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-xl shadow-lg p-6">
//             <Users size={32} className="mb-3" />
//             <p className="text-sm opacity-90">Total Regular Donors</p>
//             <p className="text-4xl font-bold">{stats?.totalRegularDonors || 0}</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg p-6">
//             <CheckCircle size={32} className="mb-3" />
//             <p className="text-sm opacity-90">Active Donors</p>
//             <p className="text-4xl font-bold">{stats?.activeDonors || 0}</p>
//           </div>

//           <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg p-6">
//             <TrendingUp size={32} className="mb-3" />
//             <p className="text-sm opacity-90">Monthly Commitment</p>
//             <p className="text-4xl font-bold">₹{(stats?.totalMonthlyCommitment || 0).toLocaleString()}</p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
//             <Award size={32} className="mb-3" />
//             <p className="text-sm opacity-90">Avg. Streak</p>
//             <p className="text-4xl font-bold">{Math.round(stats?.avgStreak || 0)} mo</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="flex-1 w-full">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <div className="flex items-center gap-2">
//                 <Filter size={20} className="text-gray-600" />
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>

//               <button
//                 onClick={exportToCSV}
//                 className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 <Download size={20} />
//                 Export CSV
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Donors Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Donor</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Day</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Streak</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Donation</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredDonors.length > 0 ? (
//                   filteredDonors.map((donor) => (
//                     <tr key={donor._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-semibold text-gray-800">{donor.name}</p>
//                           <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
//                             <span className="flex items-center gap-1">
//                               <Mail size={14} />
//                               {donor.email}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Phone size={14} />
//                               {donor.phone}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-bold text-lg text-green-600">
//                           ₹{donor.recurringDonation.amount.toLocaleString()}
//                         </p>
//                         <p className="text-xs text-gray-500">per month</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1">
//                           <Calendar size={16} className="text-blue-600" />
//                           <span className="font-semibold">
//                             {donor.recurringDonation.donationDay}
//                             {donor.recurringDonation.donationDay === 1 ? 'st' :
//                              donor.recurringDonation.donationDay === 2 ? 'nd' :
//                              donor.recurringDonation.donationDay === 3 ? 'rd' : 'th'}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <span className="text-2xl font-bold text-orange-600">
//                             {donor.recurringDonation.consecutiveMonths || 0}
//                           </span>
//                           <span className="text-sm text-gray-600">months 🔥</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1 text-sm text-gray-600">
//                           <Clock size={14} />
//                           {donor.recurringDonation.lastDonationDate
//                             ? new Date(donor.recurringDonation.lastDonationDate).toLocaleDateString()
//                             : 'Never'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                             donor.recurringDonation.active
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {donor.recurringDonation.active ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => toggleDonorStatus(donor._id, donor.recurringDonation.active)}
//                             className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
//                               donor.recurringDonation.active
//                                 ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//                             }`}
//                           >
//                             {donor.recurringDonation.active ? 'Deactivate' : 'Activate'}
//                           </button>
//                           <button
//                             onClick={() => sendManualReminder(donor._id)}
//                             className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
//                           >
//                             Send Reminder
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                       <Users size={48} className="mx-auto mb-4 opacity-50" />
//                       <p className="text-lg">No regular donors found</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminRegularDonors;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';

import {
  Award,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Search,
 
  Download,
  ArrowLeft,
} from 'lucide-react';

const AdminRegularDonors = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchRegularDonors();
  }, []);

  const fetchRegularDonors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/regular-donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(response.data.donors || []);
      setStats(response.data.stats || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setLoading(false);
    }
  };

  const toggleDonorStatus = async (donorId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this donor?`)) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/regular-donors/${donorId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegularDonors();
    } catch {
      alert('Failed to update donor status');
    }
  };

  const sendManualReminder = async (donorId) => {
    try {
      await axios.post(
        `${API_URL}/api/admin/regular-donors/${donorId}/send-reminder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reminder sent!');
    } catch {
      alert('Failed to send reminder');
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && donor.recurringDonation.active) ||
      (filterStatus === 'inactive' && !donor.recurringDonation.active);

    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Amount', 'Day', 'Streak', 'Status', 'Last Donation'],
      ...filteredDonors.map((d) => [
        d.name,
        d.email,
        d.phone,
        d.recurringDonation.amount,
        d.recurringDonation.donationDay,
        d.recurringDonation.consecutiveMonths,
        d.recurringDonation.active ? 'Active' : 'Inactive',
        d.recurringDonation.lastDonationDate
          ? new Date(d.recurringDonation.lastDonationDate).toLocaleDateString()
          : 'Never',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'regular-donors.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-center mt-4">Loading donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* NAVBAR */}
      <nav className="w-full backdrop-blur-xl bg-white/30 shadow-xl border-b border-white/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-full bg-white/70 shadow hover:bg-white transition"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src="/hero1.jpg"
              alt="logo"
              className="w-12 h-12 rounded-full shadow-md border border-white"
            />

            <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">
              Regular Donors Management
            </h1>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-6">
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-2xl shadow-lg p-6">
            <Users size={34} />
            <p className="mt-2 text-sm">Total Donors</p>
            <p className="mt-1 text-4xl font-bold">{stats?.totalRegularDonors || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl shadow-lg p-6">
            <CheckCircle size={34} />
            <p className="mt-2 text-sm">Active Donors</p>
            <p className="mt-1 text-4xl font-bold">{stats?.activeDonors || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6">
            <TrendingUp size={34} />
            <p className="mt-2 text-sm">Monthly Commitment</p>
            <p className="mt-1 text-4xl font-bold">₹{stats?.totalMonthlyCommitment}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-2xl shadow-lg p-6">
            <Award size={34} />
            <p className="mt-2 text-sm">Avg Streak</p>
            <p className="mt-1 text-4xl font-bold">{Math.round(stats?.avgStreak || 0)} mo</p>
          </div>
        </div>

        {/* FILTER BOX */}
        <div className="mt-8 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* SEARCH */}
            <div className="w-full md:w-1/2 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow focus:ring-2 focus:ring-blue-500"
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* FILTERS + CSV */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 shadow"
              >
                <option value="all">All</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <button
                onClick={exportToCSV}
                className="px-4 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download size={20} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {['Donor', 'Amount', 'Day', 'Streak', 'Last Donation', 'Status', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredDonors.map((donor) => (
                <tr key={donor._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{donor.name}</p>
                    <p className="text-sm text-gray-500 flex gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {donor.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} /> {donor.phone}
                      </span>
                    </p>
                  </td>

                  <td className="px-6 py-4 font-bold text-green-600 text-lg">
                    ₹{donor.recurringDonation.amount}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-1">
                    <Calendar size={16} className="text-blue-600" />
                    {donor.recurringDonation.donationDay}
                  </td>

                  <td className="px-6 py-4 text-orange-600 text-xl font-bold">
                    {donor.recurringDonation.consecutiveMonths || 0}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                    <Clock size={14} />
                    {donor.recurringDonation.lastDonationDate
                      ? new Date(
                          donor.recurringDonation.lastDonationDate
                        ).toLocaleDateString()
                      : 'Never'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold shadow ${
                        donor.recurringDonation.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {donor.recurringDonation.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          toggleDonorStatus(donor._id, donor.recurringDonation.active)
                        }
                        className={`px-4 py-1 rounded-lg text-sm font-bold shadow transition ${
                          donor.recurringDonation.active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {donor.recurringDonation.active ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => sendManualReminder(donor._id)}
                        className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 transition shadow"
                      >
                        Send Reminder
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-500">
                    <Users size={50} className="mx-auto opacity-40 mb-3" />
                    No donors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRegularDonors;
