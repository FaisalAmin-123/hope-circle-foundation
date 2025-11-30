// import { useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // Redirect admin to admin dashboard
//   useEffect(() => {
//     if (user?.role === 'admin') {
//       navigate('/admin/dashboard');
//     }
//   }, [user, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navigation Bar */}
//       <nav className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Hope Circle Foundation</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Dashboard Content */}
//       <div className="container mx-auto mt-8 p-4">
//         {/* Welcome Card */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-2xl font-bold mb-4">
//             Welcome, {user?.name}! 👋
//           </h2>
          
//           <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
//             <p className="text-gray-700">
//               <strong>Email:</strong> {user?.email}
//             </p>
//             <p className="text-gray-700 mt-2">
//               <strong>Role:</strong>{' '}
//               <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
//                 {user?.role}
//               </span>
//             </p>
//             {user?.beneficiaryCategory && (
//               <p className="text-gray-700 mt-2">
//                 <strong>Category:</strong>{' '}
//                 <span className="capitalize">
//                   {user.beneficiaryCategory.replace('_', ' ')}
//                 </span>
//               </p>
//             )}
//             {user?.verificationStatus && (
//               <p className="text-gray-700 mt-2">
//                 <strong>Status:</strong>{' '}
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
//                     user.verificationStatus === 'approved'
//                       ? 'bg-green-500 text-white'
//                       : user.verificationStatus === 'pending'
//                       ? 'bg-yellow-500 text-white'
//                       : 'bg-red-500 text-white'
//                   }`}
//                 >
//                   {user.verificationStatus === 'approved' && (
//                     <CheckCircle size={16} className="mr-1" />
//                   )}
//                   {user.verificationStatus === 'pending' && (
//                     <Clock size={16} className="mr-1" />
//                   )}
//                   {user.verificationStatus}
//                 </span>
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Action Cards for Beneficiaries */}
//         {user?.role === 'beneficiary' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Submit Application Card */}
//             {user?.verificationStatus !== 'approved' &&
//               user?.verificationStatus !== 'pending' && (
//                 <Link
//                   to="/submit-application"
//                   className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800 mb-2">
//                         Submit Application
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Upload your documents and submit application for verification
//                       </p>
//                     </div>
//                     <Upload size={48} className="text-blue-600" />
//                   </div>
//                 </Link>
//               )}

//             {/* View Application Card */}
//             {(user?.verificationStatus === 'approved' ||
//               user?.verificationStatus === 'pending' ||
//               user?.verificationStatus === 'rejected') && (
//               <Link
//                 to="/my-application"
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-2">
//                       My Application
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       View your application status and uploaded documents
//                     </p>
//                   </div>
//                   <FileText size={48} className="text-green-600" />
//                 </div>
//               </Link>
//             )}
//           </div>
//         )}

//         {/* Info Card for Donors */}
//         {user?.role === 'donor' && (
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Thank You for Being a Donor! 💝
//             </h3>
//             <p className="text-gray-600">
//               Your generous contributions help us support those in need. Donation
//               features will be available soon!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // Redirect based on role
//   useEffect(() => {
//     if (user) {
//       if (user.role === 'admin') {
//         navigate('/admin/dashboard', { replace: true });
//       } else if (user.role === 'donor') {
//         navigate('/donor/dashboard', { replace: true });
//       } else if (user.role === 'beneficiary') {
//         // Beneficiary stays on this page
//         return;
//       }
//     }
//   }, [user, navigate]);

//   // This component is now only for beneficiaries
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate('/PublicDashboard');
//   };

//   if (!user || user.role === 'admin' || user.role === 'donor') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navigation Bar */}
//       <nav className="bg-blue-600 text-white p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Hope Circle Foundation</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Dashboard Content */}
//       <div className="container mx-auto mt-8 p-4">
//         {/* Welcome Card */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-2xl font-bold mb-4">
//             Welcome, {user?.name}! 👋
//           </h2>
          
//           <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
//             <p className="text-gray-700">
//               <strong>Email:</strong> {user?.email}
//             </p>
//             <p className="text-gray-700 mt-2">
//               <strong>Role:</strong>{' '}
//               <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
//                 {user?.role}
//               </span>
//             </p>
//             {user?.beneficiaryCategory && (
//               <p className="text-gray-700 mt-2">
//                 <strong>Category:</strong>{' '}
//                 <span className="capitalize">
//                   {user.beneficiaryCategory.replace('_', ' ')}
//                 </span>
//               </p>
//             )}
//             {user?.verificationStatus && (
//               <p className="text-gray-700 mt-2">
//                 <strong>Status:</strong>{' '}
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
//                     user.verificationStatus === 'approved'
//                       ? 'bg-green-500 text-white'
//                       : user.verificationStatus === 'pending'
//                       ? 'bg-yellow-500 text-white'
//                       : 'bg-red-500 text-white'
//                   }`}
//                 >
//                   {user.verificationStatus}
//                 </span>
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Action Cards for Beneficiaries */}
//         {user?.role === 'beneficiary' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Submit Application Card */}
//             {user?.verificationStatus !== 'approved' &&
//               user?.verificationStatus !== 'pending' && (
//                 <button
//                   onClick={() => navigate('/submit-application')}
//                   className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1 text-left"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800 mb-2">
//                         Submit Application
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Upload your documents and submit application for verification
//                       </p>
//                     </div>
//                     <span className="text-4xl">📤</span>
//                   </div>
//                 </button>
//               )}

//             {/* View Application Card */}
//             {(user?.verificationStatus === 'approved' ||
//               user?.verificationStatus === 'pending' ||
//               user?.verificationStatus === 'rejected') && (
//               <button
//                 onClick={() => navigate('/my-application')}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1 text-left"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-2">
//                       My Application
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       View your application status and uploaded documents
//                     </p>
//                   </div>
//                   <span className="text-4xl">📄</span>
//                 </div>
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'donor') {
        navigate('/donor/dashboard', { replace: true });
      } else if (user.role === 'beneficiary') {
        return;
      }
    }
  }, [user, navigate]);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/PublicDashboard');
  };

  if (!user || user.role === 'admin' || user.role === 'donor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#f0f9ff]">
{/* Navbar */}
<nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg py-3">
  <div className="max-w-6xl mx-auto flex justify-between items-center px-4">

    {/* Left: Logo + Title */}
    <div className="flex items-center gap-3">
      {/* Circle Logo (same style as registration/login) */}
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-blue-300 bg-white">
        <img
          src="/hero1.jpg"   // same logo you used in login + register
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-wide leading-tight">
          Hope Circle Foundation
        </h1>
        <p className="text-xs text-blue-100 -mt-1">
          Community Support & Aid
        </p>
      </div>
    </div>

    {/* Right: Logout Button */}
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition shadow-md"
    >
      Logout
    </button>
  </div>
</nav>


      {/* Dashboard Content */}
      <div className="container mx-auto mt-10 px-4">
        
        {/* Welcome Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl p-8 rounded-2xl mb-10">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome, {user?.name}! 👋
          </h2>

          <div className="bg-blue-50/60 p-5 rounded-xl border-l-4 border-blue-600 shadow-sm">
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> {user?.email}
            </p>

            <p className="text-gray-700 mt-2 text-lg flex items-center gap-2">
              <strong>Role:</strong>
              <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm tracking-wide shadow">
                {user?.role}
              </span>
            </p>

            {user?.beneficiaryCategory && (
              <p className="text-gray-700 mt-2 text-lg">
                <strong>Category:</strong>{' '}
                <span className="capitalize text-indigo-700 font-semibold">
                  {user.beneficiaryCategory.replace('_', ' ')}
                </span>
              </p>
            )}

            {user?.verificationStatus && (
              <p className="text-gray-700 mt-2 text-lg flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`px-4 py-1 rounded-full text-sm capitalize shadow ${
                    user.verificationStatus === 'approved'
                      ? 'bg-green-600 text-white'
                      : user.verificationStatus === 'pending'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {user.verificationStatus}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Action Cards */}
        {user?.role === 'beneficiary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Submit Application */}
            {user?.verificationStatus !== 'approved' &&
              user?.verificationStatus !== 'pending' && (
                <button
                  onClick={() => navigate('/submit-application')}
                  className="backdrop-blur-lg bg-white/70 p-7 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-left border border-white/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Submit Application</h3>
                      <p className="text-gray-600 mt-1">
                        Upload your documents and apply for verification.
                      </p>
                    </div>
                    <span className="text-5xl">📤</span>
                  </div>
                </button>
              )}

            {/* View Application */}
            {(user?.verificationStatus === 'approved' ||
              user?.verificationStatus === 'pending' ||
              user?.verificationStatus === 'rejected') && (
              <button
                onClick={() => navigate('/my-application')}
                className="backdrop-blur-lg bg-white/70 p-7 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 text-left border border-white/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">My Application</h3>
                    <p className="text-gray-600 mt-1">
                      View your current status and uploaded documents.
                    </p>
                  </div>
                  <span className="text-5xl">📄</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
