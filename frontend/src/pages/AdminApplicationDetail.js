// import { useState, useEffect } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import useAuth from '../context/useAuth';
// import axios from 'axios';
// import {
//   ArrowLeft,
//   FileText,
//   User,
//   Phone,
//   MapPin,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   ExternalLink,
// } from 'lucide-react';

// const AdminApplicationDetail = () => {
//   const { id } = useParams();
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [application, setApplication] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);

//   // Modal state
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [comments, setComments] = useState('');
//   const [rejectionReason, setRejectionReason] = useState('');
  

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   // Fetch application details
//   useEffect(() => {
//     const fetchApplication = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/applications/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setApplication(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching application:', err);
//         setError('Failed to load application details');
//         setLoading(false);
//       }
//     };

//     if (token && id) {
//       fetchApplication();
//     } else {
//       setLoading(false);
//       if (!token) setError('Not authenticated');
//     }
//   }, [token, id, API_URL]);

//   // Handle approve
//   const handleApprove = async () => {
//     setActionLoading(true);
//     try {
//       await axios.put(
//         `${API_URL}/api/applications/${id}/approve`,
//         { comments },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert('Application approved successfully!');
//       navigate('/admin/applications');
//     } catch (err) {
//       console.error('Error approving application:', err);
//       alert('Failed to approve application');
//     }
//     setActionLoading(false);
//   };

//   // Handle reject
//   const handleReject = async () => {
//     if (!rejectionReason.trim()) {
//       alert('Please provide a reason for rejection');
//       return;
//     }

//     setActionLoading(true);
//     try {
//       await axios.put(
//         `${API_URL}/api/applications/${id}/reject`,
//         { reason: rejectionReason, comments },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert('Application rejected');
//       navigate('/admin/applications');
//     } catch (err) {
//       console.error('Error rejecting application:', err);
//       alert('Failed to reject application');
//     }
//     setActionLoading(false);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading application...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !application) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
//           {error || 'Application not found'}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate('/admin/applications')}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               <ArrowLeft size={24} />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-800">Application Review</h1>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Application Header */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 {application.fullName || 'N/A'}
//               </h2>
//               <p className="text-gray-600">
//                 Application ID: {(application._id || '').slice(-8)}
//               </p>
//             </div>
//             <span
//               className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                 application.status === 'pending'
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : application.status === 'approved'
//                   ? 'bg-green-100 text-green-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {String(application.status || 'N/A').toUpperCase()}
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Personal Information */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <User size={20} className="text-gray-500 mr-3 mt-1" />
//                   <div>
//                     <p className="text-sm text-gray-600">Full Name</p>
//                     <p className="font-semibold text-gray-800">{application.fullName || 'N/A'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <FileText size={20} className="text-gray-500 mr-3 mt-1" />
//                   <div>
//                     <p className="text-sm text-gray-600">Category</p>
//                     <p className="font-semibold text-gray-800 capitalize">
//                       {(application.category || '').replace('_', ' ')}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <Phone size={20} className="text-gray-500 mr-3 mt-1" />
//                   <div>
//                     <p className="text-sm text-gray-600">Phone Number</p>
//                     <p className="font-semibold text-gray-800">{application.phone || 'N/A'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <MapPin size={20} className="text-gray-500 mr-3 mt-1" />
//                   <div>
//                     <p className="text-sm text-gray-600">Address</p>
//                     <p className="font-semibold text-gray-800">{application.address || 'N/A'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <Calendar size={20} className="text-gray-500 mr-3 mt-1" />
//                   <div>
//                     <p className="text-sm text-gray-600">Applied On</p>
//                     <p className="font-semibold text-gray-800">
//                       {application.createdAt
//                         ? new Date(application.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric',
//                           })
//                         : 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Uploaded Documents */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Uploaded Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Aadhaar Card */}
//                 {application.documents?.aadhaarCard && (
//                   <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center">
//                         <FileText size={24} className="text-blue-600 mr-2" />
//                         <div>
//                           <p className="font-semibold text-gray-800">Aadhaar Card</p>
//                           <p className="text-xs text-gray-500">Required</p>
//                         </div>
//                       </div>
//                     </div>

//                     <a
//                       href={application.documents.aadhaarCard.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
//                     >
//                       <ExternalLink size={16} className="mr-2" />
//                       View Document
//                     </a>
//                   </div>
//                 )}

//                 {/* Ration Card */}
//                 {application.documents?.rationCard && (
//                   <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center">
//                         <FileText size={24} className="text-green-600 mr-2" />
//                         <div>
//                           <p className="font-semibold text-gray-800">Ration Card</p>
//                           <p className="text-xs text-gray-500">Required</p>
//                         </div>
//                       </div>
//                     </div>

//                     <a
//                       href={application.documents.rationCard.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
//                     >
//                       <ExternalLink size={16} className="mr-2" />
//                       View Document
//                     </a>
//                   </div>
//                 )}

//                 {/* Income Certificate */}
//                 {application.documents?.incomeCertificate && (
//                   <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center">
//                         <FileText size={24} className="text-purple-600 mr-2" />
//                         <div>
//                           <p className="font-semibold text-gray-800">Income Certificate</p>
//                           <p className="text-xs text-gray-500">Optional</p>
//                         </div>
//                       </div>
//                     </div>

//                     <a
//                       href={application.documents.incomeCertificate.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
//                     >
//                       <ExternalLink size={16} className="mr-2" />
//                       View Document
//                     </a>
//                   </div>
//                 )}

//                 {/* Medical Certificate */}
//                 {application.documents?.medicalCertificate && (
//                   <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-500 transition">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center">
//                         <FileText size={24} className="text-red-600 mr-2" />
//                         <div>
//                           <p className="font-semibold text-gray-800">Medical Certificate</p>
//                           <p className="text-xs text-gray-500">Optional</p>
//                         </div>
//                       </div>
//                     </div>

//                     <a
//                       href={application.documents.medicalCertificate.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
//                     >
//                       <ExternalLink size={16} className="mr-2" />
//                       View Document
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Review History (if reviewed) */}
//             {application.status !== 'pending' && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Review Details</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-gray-600">Reviewed By</p>
//                     <p className="font-semibold text-gray-800">
//                       {application.reviewedBy?.name || 'N/A'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Review Date</p>
//                     <p className="font-semibold text-gray-800">
//                       {application.reviewDate
//                         ? new Date(application.reviewDate).toLocaleDateString()
//                         : 'N/A'}
//                     </p>
//                   </div>
//                   {application.rejectionReason && (
//                     <div>
//                       <p className="text-sm text-gray-600">Rejection Reason</p>
//                       <p className="font-semibold text-red-700">{application.rejectionReason}</p>
//                     </div>
//                   )}
//                   {application.reviewComments && (
//                     <div>
//                       <p className="text-sm text-gray-600">Comments</p>
//                       <p className="font-semibold text-gray-800">{application.reviewComments}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Actions */}
//           <div className="space-y-6">
//             {/* Action Buttons (only for pending applications) */}
//             {application.status === 'pending' && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Review Actions</h3>
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => setShowApproveModal(true)}
//                     className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
//                   >
//                     <CheckCircle size={20} className="mr-2" />
//                     Approve Application
//                   </button>
//                   <button
//                     onClick={() => setShowRejectModal(true)}
//                     className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
//                   >
//                     <XCircle size={20} className="mr-2" />
//                     Reject Application
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-4">
//                   Note: This action cannot be undone. Please review all documents carefully before making a decision.
//                 </p>
//               </div>
//             )}

//             {/* Applicant Info */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Applicant Details</h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600">Email</p>
//                   <p className="font-semibold text-gray-800">{application.beneficiary?.email || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">User ID</p>
//                   <p className="font-mono text-sm text-gray-700">{application.beneficiary?._id || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Documents Submitted</p>
//                   <p className="font-semibold text-gray-800">
//                     {Object.keys(application.documents || {}).filter((key) => application.documents[key]).length}{' '}
//                     documents
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Tips */}
//             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
//               <p className="text-sm font-semibold text-blue-800 mb-2">Verification Tips:</p>
//               <ul className="text-xs text-blue-700 space-y-1">
//                 <li>• Check if documents are clear and readable</li>
//                 <li>• Verify personal details match across documents</li>
//                 <li>• Ensure documents are not expired</li>
//                 <li>• Look for any signs of tampering</li>
//                 <li>• Cross-check phone number and address</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Approve Modal */}
//       {showApproveModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Approve Application</h3>
//             <p className="text-gray-600 mb-4">Are you sure you want to approve this application? The beneficiary will be notified.</p>
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Comments (Optional)</label>
//               <textarea
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 rows="3"
//                 placeholder="Add any comments for the beneficiary..."
//               ></textarea>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowApproveModal(false)}
//                 disabled={actionLoading}
//                 className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApprove}
//                 disabled={actionLoading}
//                 className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
//               >
//                 {actionLoading ? 'Approving...' : 'Approve'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reject Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Application</h3>
//             <p className="text-gray-600 mb-4">Please provide a reason for rejecting this application.</p>
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Rejection Reason <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 rows="3"
//                 placeholder="Provide a clear reason for rejection..."
//                 required
//               ></textarea>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Comments (Optional)</label>
//               <textarea
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//                 rows="2"
//                 placeholder="Add any additional comments..."
//               ></textarea>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectionReason('');
//                   setComments('');
//                 }}
//                 disabled={actionLoading}
//                 className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReject}
//                 disabled={actionLoading}
//                 className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300"
//               >
//                 {actionLoading ? 'Rejecting...' : 'Reject'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminApplicationDetail;






import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  ArrowLeft,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  ExternalLink,
  
} from 'lucide-react';

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ADD THESE NEW STATES:
  const [aiVerifying, setAiVerifying] = useState(false);
//   const [aiResults, setAiResults] = useState(null);
  const [showAiResults, setShowAiResults] = useState(false);

  // Modal state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplication(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load application details');
        setLoading(false);
      }
    };

    if (token && id) {
      fetchApplication();
    } else {
      setLoading(false);
      if (!token) setError('Not authenticated');
    }
  }, [token, id, API_URL]);

  // Handle approve
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/applications/${id}/approve`,
        { comments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Application approved successfully!');
      navigate('/admin/applications');
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application');
    }
    setActionLoading(false);
  };

  // Handle reject
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/applications/${id}/reject`,
        { reason: rejectionReason, comments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Application rejected');
      navigate('/admin/applications');
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application');
    }
    setActionLoading(false);
  };

  // Handle AI Verification
 // Handle AI Verification
  const handleAIVerification = async () => {
    setAiVerifying(true);
    try {
      await axios.post(
        `${API_URL}/api/ai-verification/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowAiResults(true);

      // Refresh application data to show updated AI verification
      const appResponse = await axios.get(`${API_URL}/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplication(appResponse.data.data);

      alert('AI Verification completed successfully!');
    } catch (err) {
      console.error('AI Verification Error:', err);
      alert('AI Verification failed. Please try again.');
    }
    setAiVerifying(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          {error || 'Application not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
<nav className="w-full backdrop-blur-xl bg-white/30 shadow-lg border border-white/40 rounded-2xl p-4 flex items-center justify-between mb-6">
  <div className="flex items-center space-x-4">
    
    {/* Back Button */}
    <button
      onClick={() => navigate('/admin/applications')}
      className="text-gray-700 hover:text-gray-900 transition"
    >
      <ArrowLeft size={26} />
    </button>

    {/* Logo + Title */}
  <div className="flex items-center gap-4">
    <img
      src="/hero1.jpg"          
      alt="Logo"
      className="w-12 h-12 rounded-full object-cover shadow-md border"
    />

    <h1 className="text-2xl font-bold text-gray-800">
      Application Review
    </h1>
  </div>
  </div>
</nav>


      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Application Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {application.fullName || 'N/A'}
              </h2>
              <p className="text-gray-600">
                Application ID: {(application._id || '').slice(-8)}
              </p>

              {/* AI Verification Badge */}
              {application.aiVerification?.isVerified && (
                <div className="mt-3 flex items-center">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    🤖 AI Verified - Score: {application.aiVerification?.confidenceScore ?? 'N/A'}%
                  </span>
                </div>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                application.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : application.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {String(application.status || 'N/A').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Verification Results (if available) */}
            {application.aiVerification?.isVerified && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">🤖 AI Verification Results</h3>
                  <button
                    onClick={() => setShowAiResults(!showAiResults)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                  >
                    {showAiResults ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Confidence Score</span>
                    <span className="text-lg font-bold text-purple-700">
                      {application.aiVerification?.confidenceScore ?? 'N/A'}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        (application.aiVerification?.confidenceScore ?? 0) >= 75
                          ? 'bg-green-500'
                          : (application.aiVerification?.confidenceScore ?? 0) >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${application.aiVerification?.confidenceScore ?? 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Quick Results */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Name Match</p>
                    <p className="font-semibold">
                      {application.aiVerification?.verificationResults?.nameMatch ? (
                        <span className="text-green-600">✓ Verified</span>
                      ) : (
                        <span className="text-red-600">✗ Mismatch</span>
                      )}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Documents Consistent</p>
                    <p className="font-semibold">
                      {application.aiVerification?.verificationResults?.documentsConsistent ? (
                        <span className="text-green-600">✓ Consistent</span>
                      ) : (
                        <span className="text-orange-600">⚠ Check Required</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Suspicious Flags */}
                {application.aiVerification?.verificationResults?.suspiciousFlags?.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Suspicious Flags:</p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {application.aiVerification.verificationResults.suspiciousFlags.map((flag, index) => (
                        <li key={index}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Extracted Data */}
                {showAiResults && (
                  <div className="mt-4 space-y-3">
                    <div className="border-t pt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Extracted Data:</p>

                      {/* Aadhaar Data */}
                      {application.aiVerification?.extractedData?.aadhaarCard && (
                        <div className="bg-white rounded p-3 mb-2">
                          <p className="text-xs font-semibold text-blue-700 mb-2">Aadhaar Card:</p>
                          <div className="text-xs space-y-1">
                            {application.aiVerification.extractedData.aadhaarCard.name && (
                              <p>
                                <span className="text-gray-600">Name:</span>{' '}
                                {application.aiVerification.extractedData.aadhaarCard.name}
                              </p>
                            )}
                            {application.aiVerification.extractedData.aadhaarCard.aadhaarNumber && (
                              <p>
                                <span className="text-gray-600">Aadhaar:</span>{' '}
                                {application.aiVerification.extractedData.aadhaarCard.aadhaarNumber}
                              </p>
                            )}
                            {application.aiVerification.extractedData.aadhaarCard.dob && (
                              <p>
                                <span className="text-gray-600">DOB:</span>{' '}
                                {application.aiVerification.extractedData.aadhaarCard.dob}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Ration Card Data */}
                      {application.aiVerification?.extractedData?.rationCard && (
                        <div className="bg-white rounded p-3 mb-2">
                          <p className="text-xs font-semibold text-green-700 mb-2">Ration Card:</p>
                          <div className="text-xs space-y-1">
                            {application.aiVerification.extractedData.rationCard.name && (
                              <p>
                                <span className="text-gray-600">Name:</span>{' '}
                                {application.aiVerification.extractedData.rationCard.name}
                              </p>
                            )}
                            {application.aiVerification.extractedData.rationCard.cardNumber && (
                              <p>
                                <span className="text-gray-600">Card Number:</span>{' '}
                                {application.aiVerification.extractedData.rationCard.cardNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Verified on:{' '}
                  {application.aiVerification?.verifiedAt
                    ? new Date(application.aiVerification.verifiedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-800">{application.fullName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {(application.category || '').replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-800">{application.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-800">{application.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-semibold text-gray-800">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Card */}
                {application.documents?.aadhaarCard && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileText size={24} className="text-blue-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-800">Aadhaar Card</p>
                          <p className="text-xs text-gray-500">Required</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={application.documents.aadhaarCard.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Document
                    </a>
                  </div>
                )}

                {/* Ration Card */}
                {application.documents?.rationCard && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileText size={24} className="text-green-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-800">Ration Card</p>
                          <p className="text-xs text-gray-500">Required</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={application.documents.rationCard.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Document
                    </a>
                  </div>
                )}

                {/* Income Certificate */}
                {application.documents?.incomeCertificate && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileText size={24} className="text-purple-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-800">Income Certificate</p>
                          <p className="text-xs text-gray-500">Optional</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={application.documents.incomeCertificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Document
                    </a>
                  </div>
                )}

                {/* Medical Certificate */}
                {application.documents?.medicalCertificate && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-500 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <FileText size={24} className="text-red-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-800">Medical Certificate</p>
                          <p className="text-xs text-gray-500">Optional</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={application.documents.medicalCertificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Review History (if reviewed) */}
            {application.status !== 'pending' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Review Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Reviewed By</p>
                    <p className="font-semibold text-gray-800">
                      {application.reviewedBy?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Review Date</p>
                    <p className="font-semibold text-gray-800">
                      {application.reviewDate ? new Date(application.reviewDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {application.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-600">Rejection Reason</p>
                      <p className="font-semibold text-red-700">{application.rejectionReason}</p>
                    </div>
                  )}
                  {application.reviewComments && (
                    <div>
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="font-semibold text-gray-800">{application.reviewComments}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* AI Verification Button */}
            {!application.aiVerification?.isVerified && application.status === 'pending' && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🤖 AI Verification</h3>
                <p className="text-sm text-gray-600 mb-4">Use AI to automatically verify documents and detect fraud.</p>
                <button
                  onClick={handleAIVerification}
                  disabled={aiVerifying}
                  className="w-full flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-purple-300"
                >
                  {aiVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>🤖 Run AI Verification</>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-3">⚡ This may take 30-60 seconds to complete</p>
              </div>
            )}

            {/* Action Buttons (only for pending applications) */}
            {application.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Review Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <CheckCircle size={20} className="mr-2" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    <XCircle size={20} className="mr-2" />
                    Reject Application
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Note: This action cannot be undone. Please review all documents carefully before making a decision.
                </p>
              </div>
            )}

            {/* Applicant Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Applicant Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{application.beneficiary?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-mono text-sm text-gray-700">{application.beneficiary?._id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents Submitted</p>
                  <p className="font-semibold text-gray-800">
                    {Object.keys(application.documents || {}).filter((key) => application.documents[key]).length}{' '}
                    documents
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm font-semibold text-blue-800 mb-2">Verification Tips:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Run AI verification first for quick analysis</li>
                <li>• Check if documents are clear and readable</li>
                <li>• Verify personal details match across documents</li>
                <li>• Ensure documents are not expired</li>
                <li>• Look for any signs of tampering</li>
                <li>• Cross-check phone number and address</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Approve Application</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to approve this application? The beneficiary will be notified.</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comments (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Add any comments for the beneficiary..."
              ></textarea>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this application.</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason <span className="text-red-500">*</span></label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Provide a clear reason for rejection..."
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Comments (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="2"
                placeholder="Add any additional comments..."
              ></textarea>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setComments('');
                }}
                disabled={actionLoading}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationDetail;
