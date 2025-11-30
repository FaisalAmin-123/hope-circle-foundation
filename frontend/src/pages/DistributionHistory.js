// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   TrendingDown,
//   Users,
//   Calendar,
//   DollarSign,
//   ArrowLeft,
//   Search,
//   Download,
//   MessageSquare,
// } from 'lucide-react';

// const DistributionHistory = () => {
//   const { token, logout } = useAuth();
//   const navigate = useNavigate();

//   // State
//   const [distributions, setDistributions] = useState([]);
//   const [filteredDistributions, setFilteredDistributions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [stats, setStats] = useState({
//     totalDistributed: 0,
//     count: 0,
//   });

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // Fetch distributions
//   useEffect(() => {
//     const fetchDistributions = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/distributions`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setDistributions(response.data.data);
//         setFilteredDistributions(response.data.data);
//         setStats({
//           totalDistributed: response.data.totalDistributed,
//           count: response.data.count,
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching distributions:', err);
//         setError('Failed to load distribution history');
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchDistributions();
//     }
//   }, [token, API_URL]);

//   // Search filter
//   useEffect(() => {
//     if (searchTerm === '') {
//       setFilteredDistributions(distributions);
//     } else {
//       const filtered = distributions.filter((dist) =>
//         dist.beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         dist.beneficiary.phone.includes(searchTerm) ||
//         dist.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredDistributions(filtered);
//     }
//   }, [searchTerm, distributions]);

//   // Export to CSV
//   const exportToCSV = () => {
//     const csvContent = [
//       ['Date', 'Beneficiary', 'Phone', 'Category', 'Amount', 'Approved By', 'Description'],
//       ...filteredDistributions.map((dist) => [
//         new Date(dist.createdAt).toLocaleDateString(),
//         dist.beneficiary.name,
//         dist.beneficiary.phone,
//         dist.beneficiary.beneficiaryCategory || 'N/A',
//         dist.amount,
//         dist.approvedBy?.name || 'N/A',
//         dist.description,
//       ]),
//     ]
//       .map((row) => row.join(','))
//       .join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `distribution_history_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading distribution history...</p>
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
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate('/admin/dashboard')}
//                 className="text-gray-600 hover:text-gray-800"
//               >
//                 <ArrowLeft size={24} />
//               </button>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Distribution History
//               </h1>
//             </div>
//             <button
//               onClick={() => {
//                 logout();
//                 navigate('/PublicDashboard');
//               }}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* Total Distributed */}
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100 text-sm font-medium">
//                   Total Distributed
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   ₹{stats.totalDistributed.toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
//                 <TrendingDown size={32} />
//               </div>
//             </div>
//           </div>

//           {/* Total Distributions */}
//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100 text-sm font-medium">
//                   Total Distributions
//                 </p>
//                 <p className="text-3xl font-bold mt-2">{stats.count}</p>
//               </div>
//               <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
//                 <Users size={32} />
//               </div>
//             </div>
//           </div>

//           {/* Average Distribution */}
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100 text-sm font-medium">
//                   Average Distribution
//                 </p>
//                 <p className="text-3xl font-bold mt-2">
//                   ₹{stats.count > 0 ? Math.round(stats.totalDistributed / stats.count).toLocaleString() : 0}
//                 </p>
//               </div>
//               <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
//                 <DollarSign size={32} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Actions Bar */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//             {/* Search */}
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by name, phone, or description..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 onClick={exportToCSV}
//                 className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 <Download size={20} className="mr-2" />
//                 Export CSV
//               </button>
//               <button
//                 onClick={() => navigate('/admin/distribute')}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <TrendingDown size={20} className="mr-2" />
//                 Distribute Funds
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
//             <p className="text-red-800 font-medium">{error}</p>
//           </div>
//         )}

//         {/* Distributions Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date & Time
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Beneficiary
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Transaction Ref
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Approved By
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     SMS Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredDistributions.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <Users className="mx-auto text-gray-400 mb-4" size={48} />
//                       <p className="text-gray-600 font-medium">
//                         No distributions found
//                       </p>
//                       <p className="text-gray-500 text-sm mt-2">
//                         {searchTerm
//                           ? 'Try adjusting your search criteria'
//                           : 'Start distributing funds to beneficiaries'}
//                       </p>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredDistributions.map((dist) => (
//                     <tr key={dist._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Calendar className="text-gray-400 mr-2" size={16} />
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {new Date(dist.createdAt).toLocaleDateString()}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {new Date(dist.createdAt).toLocaleTimeString()}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {dist.beneficiary.name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {dist.description}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {dist.beneficiary.phone}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {dist.beneficiary.beneficiaryCategory
//                             ? dist.beneficiary.beneficiaryCategory.replace('_', ' ').toUpperCase()
//                             : 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-bold text-green-600">
//                           ₹{dist.amount.toLocaleString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
//                           {dist.transactionReference || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {dist.approvedBy?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <MessageSquare className="text-green-500 mr-2" size={16} />
//                           <span className="text-xs font-semibold text-green-600">
//                             SMS Sent
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Summary Footer */}
//         {filteredDistributions.length > 0 && (
//           <div className="mt-6 bg-gray-100 rounded-lg p-4">
//             <div className="flex justify-between items-center text-sm text-gray-700">
//               <span>
//                 Showing <span className="font-semibold">{filteredDistributions.length}</span> of{' '}
//                 <span className="font-semibold">{distributions.length}</span> distributions
//               </span>
//               <span className="font-semibold">
//                 Total: ₹
//                 {filteredDistributions
//                   .reduce((sum, dist) => sum + dist.amount, 0)
//                   .toLocaleString()}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DistributionHistory;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  TrendingDown,


  ArrowLeft,
  Search,
  Download,
  MessageSquare,
} from 'lucide-react';

const DistributionHistory = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [distributions, setDistributions] = useState([]);
  const [filteredDistributions, setFilteredDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalDistributed: 0,
    count: 0,
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch distributions
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/distributions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDistributions(response.data.data);
        setFilteredDistributions(response.data.data);
        setStats({
          totalDistributed: response.data.totalDistributed,
          count: response.data.count,
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load distribution history');
        setLoading(false);
      }
    };

    if (token) fetchDistributions();
  }, [token, API_URL]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDistributions(distributions);
    } else {
      const filtered = distributions.filter((dist) =>
        dist.beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.beneficiary.phone.includes(searchTerm) ||
        dist.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDistributions(filtered);
    }
  }, [searchTerm, distributions]);

  // Export CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Beneficiary', 'Phone', 'Category', 'Amount', 'Approved By', 'Description'],
      ...filteredDistributions.map((dist) => [
        new Date(dist.createdAt).toLocaleDateString(),
        dist.beneficiary.name,
        dist.beneficiary.phone,
        dist.beneficiary.beneficiaryCategory || 'N/A',
        dist.amount,
        dist.approvedBy?.name || 'N/A',
        dist.description,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distribution_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading distribution history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={26} />
            </button>

            <img
              src="/hero1.jpg"
              alt="logo"
              className="h-10 w-10 rounded-full shadow-md border"
            />

            <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
              Distribution History
            </h1>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate('/PublicDashboard');
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Distributed */}
          <div className="p-6 rounded-2xl shadow-xl text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:scale-[1.02] transition">
            <p className="text-blue-100 text-sm">Total Distributed</p>
            <p className="text-3xl font-bold mt-2">₹{stats.totalDistributed.toLocaleString()}</p>
          </div>

          {/* Count */}
          <div className="p-6 rounded-2xl shadow-xl text-white bg-gradient-to-br from-green-600 to-green-700 hover:scale-[1.02] transition">
            <p className="text-green-100 text-sm">Total Distributions</p>
            <p className="text-3xl font-bold mt-2">{stats.count}</p>
          </div>

          {/* Average */}
          <div className="p-6 rounded-2xl shadow-xl text-white bg-gradient-to-br from-purple-600 to-purple-700 hover:scale-[1.02] transition">
            <p className="text-purple-100 text-sm">Average Distribution</p>
            <p className="text-3xl font-bold mt-2">
              ₹{stats.count > 0 ? Math.round(stats.totalDistributed / stats.count).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* ACTIONS BAR */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* SEARCH */}
          <div className="w-full md:w-1/3 relative">
            <Search size={20} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search beneficiary, phone or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition flex items-center gap-2"
            >
              <Download size={18} /> Export CSV
            </button>

            <button
              onClick={() => navigate('/admin/distribute')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition flex items-center gap-2"
            >
              <TrendingDown size={18} /> Distribute Funds
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="mt-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {[
                    'Date & Time',
                    'Beneficiary',
                    'Phone',
                    'Category',
                    'Amount',
                    'Transaction Ref',
                    'Approved By',
                    'SMS Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredDistributions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      No matching distributions found
                    </td>
                  </tr>
                ) : (
                  filteredDistributions.map((dist) => (
                    <tr key={dist._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {new Date(dist.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(dist.createdAt).toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold">{dist.beneficiary.name}</div>
                        <div className="text-xs text-gray-500">{dist.description}</div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {dist.beneficiary.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {dist.beneficiary.beneficiaryCategory?.toUpperCase() || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-green-600 font-bold">
                        ₹{dist.amount.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-xs font-mono bg-gray-100 rounded ">
                        {dist.transactionReference || 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {dist.approvedBy?.name || 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-green-600 flex items-center gap-2">
                        <MessageSquare size={16} /> SMS Sent
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER SUMMARY */}
        {filteredDistributions.length > 0 && (
          <div className="mt-6 bg-gray-200/70 rounded-xl p-4 flex justify-between items-center text-sm">
            <span>
              Showing <strong>{filteredDistributions.length}</strong> of{' '}
              <strong>{distributions.length}</strong>
            </span>

            <span className="font-bold text-gray-800">
              Total: ₹
              {filteredDistributions
                .reduce((sum, dist) => sum + dist.amount, 0)
                .toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionHistory;
