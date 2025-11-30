import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  DollarSign,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  FileText,
} from 'lucide-react';

const DistributeFunds = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [approvedBeneficiaries, setApprovedBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingBeneficiaries, setFetchingBeneficiaries] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch approved beneficiaries and current balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats for current balance
        const statsResponse = await axios.get(
          `${API_URL}/api/analytics/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentBalance(statsResponse.data.data.financial.currentBalance || 0);

        // Fetch all applications
        const appsResponse = await axios.get(`${API_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter approved applications
        const approved = appsResponse.data.data.filter((app) => app.status === 'approved');
        setApprovedBeneficiaries(approved);
        setFetchingBeneficiaries(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load beneficiaries');
        setFetchingBeneficiaries(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, API_URL]);

  // Handle fund distribution
  const handleDistribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate
      if (!selectedBeneficiary) {
        setError('Please select a beneficiary');
        setLoading(false);
        return;
      }

      if (!amount || parseFloat(amount) < 1) {
        setError('Please enter a valid amount');
        setLoading(false);
        return;
      }

      if (parseFloat(amount) > currentBalance) {
        setError('Insufficient balance in fund');
        setLoading(false);
        return;
      }

      // Validate transaction reference
      if (!transactionReference || transactionReference.trim() === '') {
        setError('Please enter transaction reference number');
        setLoading(false);
        return;
      }

      // Get selected beneficiary details
      const beneficiary = approvedBeneficiaries.find((b) => b.beneficiary._id === selectedBeneficiary);

      // Send distribution request
      await axios.post(
        `${API_URL}/api/distributions`,
        {
          beneficiaryId: selectedBeneficiary,
          amount: parseFloat(amount),
          description: description || 'Financial assistance from Hope Circle Foundation',
          transactionReference: transactionReference.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(
        `₹${amount} distributed successfully to ${beneficiary.beneficiary.name}! SMS notification sent with transaction reference.`
      );

      // Update balance
      setCurrentBalance((prev) => prev - parseFloat(amount));

      // Reset form
      setSelectedBeneficiary('');
      setAmount('');
      setDescription('');
      setTransactionReference('');

      // Refresh beneficiaries list shortly (keeps UX smooth)
      setTimeout(() => {
        window.location.reload();
      }, 1600);
    } catch (err) {
      console.error('Distribution error:', err);
      setError(err.response?.data?.message || 'Failed to distribute funds');
    } finally {
      setLoading(false);
    }
  };

  // Get selected beneficiary details
  const getSelectedBeneficiary = () => {
    return approvedBeneficiaries.find((b) => b.beneficiary._id === selectedBeneficiary);
  };

  const selectedBeneficiaryData = getSelectedBeneficiary();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Premium Navbar */}
      <nav className="w-full backdrop-blur-xl bg-white/70 shadow-md border border-white/30 rounded-2xl p-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Back"
            >
              <ArrowLeft size={22} className="text-gray-700" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/hero1.jpg"
                alt="Hope Circle logo"
                className="w-12 h-12 rounded-full object-cover shadow-sm border"
              />
              <div>
                <div className="text-lg font-semibold text-gray-800">Hope Circle Foundation</div>
                <div className="text-xs text-gray-500">Admin • Distribute Funds</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <div className="text-xs text-gray-500">Available Balance</div>
              <div className="text-lg font-bold text-gray-800">₹{Number(currentBalance || 0).toLocaleString()}</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/PublicDashboard');
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: summary cards */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Balance card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-90">Available Fund</div>
                  <div className="text-3xl font-extrabold mt-2">₹{Number(currentBalance || 0).toLocaleString()}</div>
                  <div className="text-sm mt-2 opacity-90">Ready for distribution to approved beneficiaries</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <DollarSign size={30} className="text-white" />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate('/admin/distributions')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 font-semibold transition"
                >
                  View History
                </button>
                <button
                  onClick={() => navigate('/admin/applications')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 font-semibold transition"
                >
                  Review Applications
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Approved beneficiaries</div>
                    <div className="text-lg font-semibold text-gray-900">{approvedBeneficiaries.length}</div>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 p-2 rounded-md">
                    <Users size={20} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Pending distributions</div>
                    <div className="text-lg font-semibold text-gray-900">—</div>
                  </div>
                  <div className="bg-green-50 text-green-700 p-2 rounded-md">
                    <CheckCircle size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Info / Notes */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Always confirm bank UTR before marking as distributed.</li>
                <li>• SMS notification is sent automatically after distribution.</li>
                <li>• Use transaction reference field for reconciliation.</li>
              </ul>
            </div>
          </aside>

          {/* Main column: distribution form */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Send className="text-indigo-600" size={26} />
                  <h2 className="text-xl font-semibold text-gray-800">Distribute Financial Aid</h2>
                </div>
                <div className="text-sm text-gray-500">Make sure to copy beneficiary bank details before transfer</div>
              </div>

              {success && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-green-800">{success}</div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-red-800">{error}</div>
                  </div>
                </div>
              )}

              {fetchingBeneficiaries ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading beneficiaries...</p>
                </div>
              ) : (
                <form onSubmit={handleDistribute} className="space-y-6">
                  {/* select + quick detail */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Beneficiary *</label>
                      <select
                        value={selectedBeneficiary}
                        onChange={(e) => setSelectedBeneficiary(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        required
                      >
                        <option value="">— Choose approved beneficiary —</option>
                        {approvedBeneficiaries.map((app) => (
                          <option key={app._id} value={app.beneficiary._id}>
                            {app.beneficiary.name} — {String(app.category || '').replace('_', ' ')} — {app.beneficiary.phone}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 text-sm">
                        <div className="text-xs text-gray-500">Selected</div>
                        <div className="font-semibold text-gray-800 mt-1">
                          {selectedBeneficiaryData ? selectedBeneficiaryData.beneficiary.name : '—'}
                        </div>
                        <div className="text-xs text-gray-500">{selectedBeneficiaryData?.beneficiary?.phone || ''}</div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary & Bank details */}
                  {selectedBeneficiaryData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="text-sm text-gray-600">Beneficiary</div>
                        <div className="font-semibold text-gray-800">{selectedBeneficiaryData.fullName}</div>
                        <div className="mt-2 text-sm text-gray-600">Category</div>
                        <div className="font-medium text-gray-800">{String(selectedBeneficiaryData.category || '').replace('_', ' ')}</div>
                      </div>

                      {selectedBeneficiaryData.bankDetails ? (
                        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-600">Bank Account</div>
                              <div className="font-semibold text-gray-800">{selectedBeneficiaryData.bankDetails.accountHolderName}</div>
                              <div className="text-sm text-gray-700 mt-1">{selectedBeneficiaryData.bankDetails.accountNumber}</div>
                              <div className="text-xs text-gray-500 mt-1">IFSC: {selectedBeneficiaryData.bankDetails.ifscCode}</div>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-md text-purple-700">
                              <CreditCard size={22} />
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">Note: Transfer via NEFT/RTGS/IMPS/UPI and paste the transaction reference below.</div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-sm">
                          Bank details not available for this beneficiary.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Amount + transaction */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        max={currentBalance}
                        placeholder="e.g. 5000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Max available: ₹{Number(currentBalance || 0).toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference *</label>
                      <input
                        type="text"
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        placeholder="NEFT2025XXXXX or UPI1234..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Use the bank/UPI reference for reconciliation</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Short note about this transfer"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  {/* Process & action */}
                  <div className="bg-white/80 border border-gray-100 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className="text-yellow-600" />
                      <div>
                        <div className="text-sm font-semibold text-gray-700">Distribution Process</div>
                        <div className="text-xs text-gray-500">Transfer funds, copy reference, then mark as distributed.</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/distributions')}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        View History
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle />
                            Mark as Distributed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow p-4 flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-md">
                  <Users className="text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Approved beneficiaries</div>
                  <div className="text-xl font-semibold text-gray-800">{approvedBeneficiaries.length}</div>
                  <div className="text-xs text-gray-500 mt-1">Beneficiaries ready for support</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 flex items-start gap-4">
                <div className="bg-green-50 p-3 rounded-md">
                  <Send className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Quick actions</div>
                  <div className="text-xl font-semibold text-gray-800">Review & Distribute</div>
                  <div className="text-xs text-gray-500 mt-1">Use this panel to reconcile and notify beneficiaries</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DistributeFunds;
