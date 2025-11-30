import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import {
  Heart,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  AlertCircle,
  Zap,
} from 'lucide-react';

const MonthlyDonation = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [extraAmount, setExtraAmount] = useState(0);
  const [showExtraInput, setShowExtraInput] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Check if user is regular donor
  useEffect(() => {
    if (!user?.isRegularDonor || !user?.recurringDonation?.active) {
      navigate('/donor/dashboard');
    }
  }, [user, navigate]);

  const baseAmount = user?.recurringDonation?.amount || 0;
  const totalAmount = baseAmount + (extraAmount || 0);

  // Check if already donated this month
  const [alreadyDonated, setAlreadyDonated] = useState(false);

  useEffect(() => {
    const checkMonthlyDonation = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/donors/check-monthly-donation`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlreadyDonated(response.data.alreadyDonated);
      } catch (error) {
        console.error('Error checking monthly donation:', error);
      }
    };

    if (token) {
      checkMonthlyDonation();
    }
  }, [token, API_URL]);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/api/donations/create-monthly-order`,
        {
          amount: totalAmount,
          isMonthlyDonation: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Hope Circle Foundation',
        description: 'Monthly Regular Donation',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${API_URL}/api/donations/verify-monthly-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                baseAmount: baseAmount,
                extraAmount: extraAmount || 0,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              navigate('/donation-success', {
                state: {
                  amount: totalAmount,
                  isMonthlyDonation: true,
                  newStreak: verifyResponse.data.newStreak,
                },
              });
            }
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!user?.isRegularDonor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Award size={64} className="animate-pulse" />
              <div>
                <h1 className="text-4xl font-bold mb-2">Monthly Donation</h1>
                <p className="text-xl opacity-90">Complete Your Regular Commitment</p>
              </div>
            </div>

            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold">{user.recurringDonation.consecutiveMonths || 0}</div>
              <div className="text-sm">Month Streak 🔥</div>
            </div>
          </div>
        </div>

        {/* Already Donated Alert */}
        {alreadyDonated && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <p className="font-bold text-green-800">You've already donated this month!</p>
                <p className="text-sm text-green-700">Your streak is safe. Come back next month!</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Payment Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-600 mr-3" size={20} />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Amount Breakdown</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">Monthly Commitment</p>
                      <p className="text-sm text-gray-600">Your regular contribution</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">₹{baseAmount.toLocaleString()}</p>
                  </div>

                  {/* Extra Donation Option */}
                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">Add Extra Donation (Optional)</p>
                        <p className="text-sm text-gray-600">Donate more this month</p>
                      </div>
                      <button
                        onClick={() => setShowExtraInput(!showExtraInput)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        {showExtraInput ? 'Remove' : '+ Add Extra'}
                      </button>
                    </div>

                    {showExtraInput && (
                      <div className="mt-3">
                        <input
                          type="number"
                          value={extraAmount || ''}
                          onChange={(e) => setExtraAmount(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter extra amount"
                          min="0"
                        />
                        {extraAmount > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            +₹{extraAmount.toLocaleString()} extra donation
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg">
                    <div>
                      <p className="font-bold text-lg">Total Amount</p>
                      <p className="text-sm opacity-90">To be paid today</p>
                    </div>
                    <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="mr-3 text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-800">Razorpay</p>
                      <p className="text-sm text-gray-600">Card, UPI, Netbanking, Wallets</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading || alreadyDonated}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : alreadyDonated ? (
                  '✓ Already Donated This Month'
                ) : (
                  <>
                    <Heart className="mr-2" size={20} />
                    Pay ₹{totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Streak Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Zap className="mr-2 text-yellow-500" size={20} />
                Your Streak
              </h3>

              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-orange-600">
                  {user.recurringDonation.consecutiveMonths || 0}
                </div>
                <p className="text-gray-600 mt-2">Consecutive Months</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center">
                  {user.recurringDonation.consecutiveMonths === 0
                    ? 'Start your streak today! 🚀'
                    : user.recurringDonation.consecutiveMonths === 1
                    ? 'Great start! Keep it going! 💪'
                    : user.recurringDonation.consecutiveMonths < 6
                    ? 'You\'re building consistency! 🔥'
                    : user.recurringDonation.consecutiveMonths < 12
                    ? 'Amazing commitment! 🌟'
                    : 'You\'re a legend! 🏆'}
                </p>
              </div>

              {!alreadyDonated && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 text-center font-semibold">
                    Complete this donation to reach{' '}
                    {(user.recurringDonation.consecutiveMonths || 0) + 1} months! 🎯
                  </p>
                </div>
              )}
            </div>

            {/* Impact Preview */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold mb-4">Your Impact This Month</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Heart className="mr-3" size={20} />
                  <div>
                    <p className="font-semibold">Support Families</p>
                    <p className="text-sm opacity-90">Provide essential aid</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <TrendingUp className="mr-3" size={20} />
                  <div>
                    <p className="font-semibold">Create Opportunities</p>
                    <p className="text-sm opacity-90">Enable education & growth</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="mr-3" size={20} />
                  <div>
                    <p className="font-semibold">Build Trust</p>
                    <p className="text-sm opacity-90">Consistent monthly support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Schedule */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Schedule</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation Day:</span>
                  <span className="font-semibold">
                    {user.recurringDonation.donationDay}
                    {user.recurringDonation.donationDay === 1
                      ? 'st'
                      : user.recurringDonation.donationDay === 2
                      ? 'nd'
                      : user.recurringDonation.donationDay === 3
                      ? 'rd'
                      : 'th'}{' '}
                    of every month
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold capitalize">{user.recurringDonation.frequency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Notifications:</span>
                  <span className="font-semibold">
                    {user.recurringDonation.emailNotifications ? '📧 Email' : ''}
                    {user.recurringDonation.smsNotifications ? ' 📱 SMS' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDonation;