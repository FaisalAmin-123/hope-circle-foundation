import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Award } from 'lucide-react';

const DonationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { amount, isMonthlyDonation, newStreak } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Thank You! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          Your donation of <span className="font-bold text-green-600">₹{amount?.toLocaleString()}</span> has been received successfully!
        </p>

        {isMonthlyDonation && newStreak && (
          <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl p-6 mb-6">
            <Award size={48} className="mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-2">Streak Updated! 🔥</h3>
            <p className="text-lg">You're now at <span className="font-bold text-3xl">{newStreak}</span> consecutive months!</p>
            <p className="text-sm opacity-90 mt-2">Keep up the amazing work!</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Your contribution will help families in need. A receipt has been sent to your email.
          </p>
        </div>

        <button
          onClick={() => navigate('/donor/dashboard')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DonationSuccess;