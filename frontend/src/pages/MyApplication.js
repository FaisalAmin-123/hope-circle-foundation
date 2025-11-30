import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

const MyApplication = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch application
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/applications/my-application`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplication(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application:', err);
        if (err.response?.status === 404) {
          setError('No application found. Please submit an application.');
        } else {
          setError('Failed to load application');
        }
        setLoading(false);
      }
    };

    if (token) {
      fetchApplication();
    } else {
      // If no token, stop loading and show message (optional)
      setLoading(false);
      setError('Not authenticated. Please log in.');
    }
  }, [token, API_URL]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/PublicDashboard');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
            <Clock size={18} className="mr-2" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle size={18} className="mr-2" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <XCircle size={18} className="mr-2" />
            Rejected
          </span>
        );
      default:
        return null;
    }
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

  // No application found or other error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
<nav className="bg-white/90 backdrop-blur-md shadow-md py-4 border-b border-gray-100">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-4">

    {/* Left: Logo + Title */}
    <div className="flex items-center gap-3">
      <img
        src="/hero1.jpg"   
        alt="Hope Circle Logo"
        className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
      />

      <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide">
        My Application
      </h1>
    </div>

    {/* Right: Logout Button */}
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md transition"
    >
      Logout
    </button>
  </div>
</nav>


        <div className="max-w-4xl mx-auto mt-16 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileText size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Application Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/submit-application"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // At this point application should be present
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">My Application</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Application Status
              </h2>
              <p className="text-gray-600 text-sm">
                Submitted on{' '}
                {application?.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            {getStatusBadge(application?.status)}
          </div>

          {/* Status Messages */}
          {application?.status === 'pending' && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-800">
                Your application is being reviewed by our team. You will be notified
                once a decision is made.
              </p>
            </div>
          )}

          {application?.status === 'approved' && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-800 font-semibold">
                Congratulations! Your application has been approved.
              </p>
              {application.reviewComments && (
                <p className="text-sm text-green-700 mt-2">
                  <strong>Admin Comments:</strong> {application.reviewComments}
                </p>
              )}
              {application.reviewDate && (
                <p className="text-xs text-green-600 mt-2">
                  Reviewed on {new Date(application.reviewDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {application?.status === 'rejected' && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-800 font-semibold">
                Your application has been rejected.
              </p>
              {application.rejectionReason && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>Reason:</strong> {application.rejectionReason}
                </p>
              )}
              {application.reviewComments && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>Comments:</strong> {application.reviewComments}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-800">{application?.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-800 capitalize">
                {(application?.category || '').replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-semibold text-gray-800">{application?.phone || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-gray-800">{application?.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Uploaded Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aadhaar Card */}
            {application?.documents?.aadhaarCard && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={24} className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Aadhaar Card</p>
                      <p className="text-xs text-gray-500">Required Document</p>
                    </div>
                  </div>

                  <a
                    href={application.documents.aadhaarCard.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}

            {/* Ration Card */}
            {application?.documents?.rationCard && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={24} className="text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Ration Card</p>
                      <p className="text-xs text-gray-500">Required Document</p>
                    </div>
                  </div>

                  <a
                    href={application.documents.rationCard.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}

            {/* Income Certificate */}
            {application?.documents?.incomeCertificate && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={24} className="text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Income Certificate
                      </p>
                      <p className="text-xs text-gray-500">Optional Document</p>
                    </div>
                  </div>

                  <a
                    href={application.documents.incomeCertificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}

            {/* Medical Certificate */}
            {application?.documents?.medicalCertificate && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={24} className="text-red-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Medical Certificate
                      </p>
                      <p className="text-xs text-gray-500">Optional Document</p>
                    </div>
                  </div>

                  <a
                    href={application.documents.medicalCertificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* No Documents Message */}
          {!application?.documents?.aadhaarCard &&
            !application?.documents?.rationCard &&
            !application?.documents?.incomeCertificate &&
            !application?.documents?.medicalCertificate && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No documents uploaded</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MyApplication;
