import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Activity,
  
  Eye,
  Shield,
} from 'lucide-react';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch public statistics
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/public/statistics`);
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching public data:', err);
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [API_URL]);

  // Category colors
  const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  // Format category data for pie chart
  const getCategoryData = () => {
    if (!stats) return [];
    return [
      { name: 'Poor', value: stats.categoryBreakdown.poor },
      { name: 'Orphan', value: stats.categoryBreakdown.orphan },
      {
        name: 'Physically Challenged',
        value: stats.categoryBreakdown.physically_challenged,
      },
    ];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading transparency data...</p>
        </div>
      </div>
    );
  }

  // Error state
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart size={64} className="animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Hope Circle Foundation</h1>
            <p className="text-xl text-blue-100 mb-8">
              Transparency Dashboard - Building Trust Through Openness
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/donate')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition duration-200 shadow-lg transform hover:scale-105 flex items-center"
              >
                <Heart className="mr-2 animate-pulse" size={24} />
                DONATE NOW
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition duration-200 border-2 border-white shadow-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Badge */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Shield className="text-green-600 mr-4" size={48} />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                100% Transparent Operations
              </h3>
              <p className="text-gray-600 mt-1">
                All statistics are updated in real-time. No personal information is
                displayed to protect privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Collected</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{stats.overview.totalDonations.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp size={32} className="text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              From {stats.overview.totalDonors} generous donors
            </p>
          </div>

          {/* Total Distributed */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Distributed</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ₹{stats.overview.totalDistributions.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <DollarSign size={32} className="text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {stats.overview.totalDistributionsCount} distributions made
            </p>
          </div>

          {/* Lives Impacted */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Lives Impacted</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.overview.totalBeneficiaries}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Users size={32} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Beneficiaries helped so far
            </p>
          </div>

          {/* Fund Utilization */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Fund Utilization</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats.impactMetrics.fundsUtilized}%
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Activity size={32} className="text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Of collected funds distributed
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={24} />
              Monthly Financial Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Donations"
                />
                <Line
                  type="monotone"
                  dataKey="distributions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Distributions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2" size={24} />
              Beneficiaries by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2" size={24} />
            Monthly Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#10b981" name="Donations" />
              <Bar dataKey="distributions" fill="#3b82f6" name="Distributions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Metrics */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-8 text-white mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">
                {stats.overview.totalBeneficiaries}
              </p>
              <p className="text-xl">Lives Changed</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">
                ₹{Math.round(stats.averages.avgDistribution).toLocaleString()}
              </p>
              <p className="text-xl">Average Aid per Person</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">
                {stats.impactMetrics.transparencyScore}%
              </p>
              <p className="text-xl">Transparency Score</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Eye size={64} className="mx-auto text-blue-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Want to Make a Difference?
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Join us in our mission to help those in need. Your contribution makes a
            real impact.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center"
            >
              <Heart className="mr-2" size={20} />
              Become a Donor
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center"
            >
              <Users className="mr-2" size={20} />
              Apply for Aid
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2025 Hope Circle Foundation. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Transparency. Trust. Impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;