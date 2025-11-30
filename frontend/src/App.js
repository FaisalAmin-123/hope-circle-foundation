import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminApplicationDetail from './pages/AdminApplicationDetail';
import DistributeFunds from './pages/DistributeFunds';
import DistributionHistory from './pages/DistributionHistory';
import SubmitApplication from './pages/SubmitApplication';
import DonorDashboard from './pages/DonorDashboard';
import DonationHistory from './pages/DonationHistory';
import MyApplication from './pages/MyApplication';
import ProtectedRoute from './components/ProtectedRoute';
// import PublicDashboard from './pages/PublicDashboard';
import GuestDonation from './pages/GuestDonation'; 
import DonationSuccess from './pages/DonationSuccess';
import Homepage from './pages/Homepage';
import RegisterRegularDonor from './pages/RegisterRegularDonor';
import RegisterBeneficiary from './pages/RegisterBeneficiary';
import AdminWorkUpdates from './pages/AdminWorkUpdates';
import MonthlyDonation from './pages/MonthlyDonation';
import AdminRegularDonors from './pages/AdminRegularDonors';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/donate" element={<GuestDonation />} />
        <Route path="/donation-success" element={<DonationSuccess />} />
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />

        <Route path="/register-regular-donor" element={<RegisterRegularDonor />} />
        <Route path="/register-beneficiary" element={<RegisterBeneficiary />} />
      


        {/* Protected Routes */}
        <Route
  path="/donor/monthly-donation"
  element={
    <ProtectedRoute allowedRoles={['donor']}>
      <MonthlyDonation />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/regular-donors"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminRegularDonors />
    </ProtectedRoute>
  }
/>
        <Route 
           path="/admin/work-updates" 
           element={
          <ProtectedRoute>
           <AdminWorkUpdates />
         </ProtectedRoute>
        } 
       />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApplicationDetail />
            </ProtectedRoute>
          }
        />

        {/* NEW: Distribution Routes */}
        <Route
          path="/admin/distribute"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DistributeFunds />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/distributions"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DistributionHistory />
            </ProtectedRoute>
          }
        />

        {/* Donor Routes */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['donor', 'admin']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/donations"
          element={
            <ProtectedRoute allowedRoles={['donor', 'admin']}>
              <DonationHistory />
            </ProtectedRoute>
          }
        />

        {/* Beneficiary Routes */}
        <Route
          path="/submit-application"
          element={
            <ProtectedRoute allowedRoles={['beneficiary']}>
              <SubmitApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-application"
          element={
            <ProtectedRoute allowedRoles={['beneficiary']}>
              <MyApplication />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
      
      </Routes>
    </Router>
  );
}

export default App;