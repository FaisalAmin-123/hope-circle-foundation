import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {

  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ArrowLeft,
} from 'lucide-react';

const AdminApplications = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(response.data.data);
        setFilteredApplications(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applications');
        setLoading(false);
      }
    };

    if (token) fetchApplications();
  }, [token, API_URL]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((app) => app.status === filterStatus)
      );
    }
  }, [filterStatus, applications]);

  const handleLogout = () => {
    logout();
    navigate('/PublicDashboard');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
            <CheckCircle size={14} className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
            <XCircle size={14} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const approvedCount = applications.filter((app) => app.status === 'approved').length;
  const rejectedCount = applications.filter((app) => app.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* 🔥 Modern Navbar with Logo */}
      <nav className="w-full backdrop-blur-xl bg-white/30 shadow-lg rounded-2xl border border-white/40 p-5 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/hero1.jpg"
            alt="logo"
            className="w-12 h-12 rounded-full shadow-md border border-white"
          />
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             Hope Circle Foundation – Applications
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm">Total Applications</p>
          <p className="text-3xl font-bold">{applications.length}</p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-700">{pendingCount}</p>
        </div>

        <div className="bg-green-50 rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-3xl font-bold text-green-700">{approvedCount}</p>
        </div>

        <div className="bg-red-50 rounded-xl shadow-md p-6">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-700">{rejectedCount}</p>
        </div>
      </div>

      {/* 🔥 Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <span className="font-semibold">Filter by Status:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: `All (${applications.length})` },
              { key: 'pending', label: `Pending (${pendingCount})` },
              { key: 'approved', label: `Approved (${approvedCount})` },
              { key: 'rejected', label: `Rejected (${rejectedCount})` },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilterStatus(btn.key)}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === btn.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 Applications Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Applicant', 'Category', 'Phone', 'Applied On', 'Status', 'Action'].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr
                  key={application._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {application.fullName}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {application.beneficiary?.email}
                    </div>
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {application.category.replace('_', ' ')}
                  </td>

                  <td className="px-6 py-4">{application.phone}</td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">{getStatusBadge(application.status)}</td>

                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/applications/${application._id}`}
                      className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Eye size={16} className="mr-2" />
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
