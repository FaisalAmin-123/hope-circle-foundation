import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const SubmitApplication = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    category: user?.beneficiaryCategory || 'poor',
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    accountNumber: '',
    accountHolderName: user?.name || '',
    ifscCode: '',
    bankName: '',
  });

  // File state
  const [files, setFiles] = useState({
    aadhaarCard: null,
    rationCard: null,
    incomeCertificate: null,
    medicalCertificate: null,
  });

  // Preview URLs for images
  const [previews, setPreviews] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Handle text input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${name}: File size should be less than 5MB`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError(`${name}: Only JPEG, PNG and PDF files are allowed`);
        return;
      }

      // Set file
      setFiles({
        ...files,
        [name]: file,
      });

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews({
            ...previews,
            [name]: reader.result,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews({
          ...previews,
          [name]: 'PDF',
        });
      }

      setError('');
    }
  };

  // Handle form submission
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // Validation
  if (!formData.fullName || !formData.phone || !formData.address) {
    setError('Please fill in all required fields');
    setLoading(false);
    return;
  }

  // Add bank details validation
  if (!formData.accountNumber || !formData.accountHolderName || !formData.ifscCode || !formData.bankName) {
    setError('Please fill in all bank details');
    setLoading(false);
    return;
  }

  if (!files.aadhaarCard) {
    setError('Please upload Aadhaar Card (required)');
    setLoading(false);
    return;
  }

  if (!files.rationCard) {
    setError('Please upload Ration Card (required)');
    setLoading(false);
    return;
  }

  try {
    // Create FormData (for file upload)
    const submitData = new FormData();
    submitData.append('category', formData.category);
    submitData.append('fullName', formData.fullName);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    
    // ✅ ADD THESE BANK DETAILS
    submitData.append('accountNumber', formData.accountNumber);
    submitData.append('accountHolderName', formData.accountHolderName);
    submitData.append('ifscCode', formData.ifscCode);
    submitData.append('bankName', formData.bankName);

    // Append files
    if (files.aadhaarCard) {
      submitData.append('aadhaarCard', files.aadhaarCard);
    }
    if (files.rationCard) {
      submitData.append('rationCard', files.rationCard);
    }
    if (files.incomeCertificate) {
      submitData.append('incomeCertificate', files.incomeCertificate);
    }
    if (files.medicalCertificate) {
      submitData.append('medicalCertificate', files.medicalCertificate);
    }

    // Submit to API
    const response = await axios.post(
      `${API_URL}/api/applications`,
      submitData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-application');
      }, 2000);
    }
  } catch (err) {
    console.error('Error submitting application:', err);
    setError(err.response?.data?.message || 'Failed to submit application');
  }

  setLoading(false);
};
  // Success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Your application is now under review. You will be notified once it's processed.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
<div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
  <div className="flex items-center gap-4 mb-4">
    {/* Circular Logo */}
    <img
      src="/hero1.jpg"     
      alt="Hope Circle Logo"
      className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover"
    />

    <div>
      <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></span>
        Submit Application
      </h1>

      <p className="text-gray-600 text-lg">
        Please fill in your details and upload the required documents.
      </p>
    </div>
  </div>
</div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                >
                  <option value="poor">Poor</option>
                  <option value="orphan">Orphan</option>
                  <option value="physically_challenged">Physically Challenged</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Category set during registration
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your complete address"
                  required
                ></textarea>
              </div>
            </div>
          </div>
{/* Bank Details Section - */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">
    Bank Account Details
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Account Number */}
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Account Number <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="accountNumber"
        value={formData.accountNumber}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter account number"
        required
      />
    </div>

    {/* Account Holder Name */}
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Account Holder Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="accountHolderName"
        value={formData.accountHolderName}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter account holder name"
        required
      />
    </div>

    {/* IFSC Code */}
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        IFSC Code <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="ifscCode"
        value={formData.ifscCode}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter IFSC code"
        required
      />
    </div>

    {/* Bank Name */}
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Bank Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="bankName"
        value={formData.bankName}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter bank name"
        required
      />
    </div>
  </div>
</div>
          {/* Document Upload */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upload Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhaar Card */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Aadhaar Card <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  {previews.aadhaarCard ? (
                    <div>
                      {previews.aadhaarCard === 'PDF' ? (
                        <FileText size={48} className="mx-auto text-red-500 mb-2" />
                      ) : (
                        <img
                          src={previews.aadhaarCard}
                          alt="Aadhaar preview"
                          className="max-h-32 mx-auto mb-2"
                        />
                      )}
                      <p className="text-sm text-green-600 font-semibold">
                        ✓ {files.aadhaarCard.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="aadhaarCard"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    id="aadhaarCard"
                  />
                  <label
                    htmlFor="aadhaarCard"
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Choose File
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or PDF (Max 5MB)
                </p>
              </div>

              {/* Ration Card */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ration Card <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  {previews.rationCard ? (
                    <div>
                      {previews.rationCard === 'PDF' ? (
                        <FileText size={48} className="mx-auto text-red-500 mb-2" />
                      ) : (
                        <img
                          src={previews.rationCard}
                          alt="Ration Card preview"
                          className="max-h-32 mx-auto mb-2"
                        />
                      )}
                      <p className="text-sm text-green-600 font-semibold">
                        ✓ {files.rationCard.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="rationCard"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    id="rationCard"
                  />
                  <label
                    htmlFor="rationCard"
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Choose File
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or PDF (Max 5MB)
                </p>
              </div>

              {/* Income Certificate */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Income Certificate (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  {previews.incomeCertificate ? (
                    <div>
                      {previews.incomeCertificate === 'PDF' ? (
                        <FileText size={48} className="mx-auto text-red-500 mb-2" />
                      ) : (
                        <img
                          src={previews.incomeCertificate}
                          alt="Income Certificate preview"
                          className="max-h-32 mx-auto mb-2"
                        />
                      )}
                      <p className="text-sm text-green-600 font-semibold">
                        ✓ {files.incomeCertificate.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="incomeCertificate"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    id="incomeCertificate"
                  />
                  <label
                    htmlFor="incomeCertificate"
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Choose File
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or PDF (Max 5MB)
                </p>
              </div>

              {/* Medical Certificate */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Medical Certificate (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                  {previews.medicalCertificate ? (
                    <div>
                      {previews.medicalCertificate === 'PDF' ? (
                        <FileText size={48} className="mx-auto text-red-500 mb-2" />
                      ) : (
                        <img
                          src={previews.medicalCertificate}
                          alt="Medical Certificate preview"
                          className="max-h-32 mx-auto mb-2"
                        />
                      )}
                      <p className="text-sm text-green-600 font-semibold">
                        ✓ {files.medicalCertificate.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="medicalCertificate"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    id="medicalCertificate"
                  />
                  <label
                    htmlFor="medicalCertificate"
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                  >
                    Choose File
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG or PDF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitApplication;