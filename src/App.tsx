import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { Toaster } from 'react-hot-toast';
import ProtectedLayout from './components/ProtectedLayout';
import Profile from './pages/Profile/ProfilePage';
import Properties from './pages/Property/PropertyList';
import PGLayout from './components/PGLayout';
import PGBasic from './pages/Property/Details/PGBasic';
import PGDetails from './pages/Property/Details/PGDetails';
import PGImages from './pages/Property/Details/PGImages';
import PGRules from './pages/Property/Details/PGRules';
import PGAmenities from './pages/Property/Details/PGAmenities';
import Floors from './pages/Floor/Floors';
import FloorDetails from './pages/Floor/FloorDetails';
import Rooms from './pages/Room/Rooms';
import RoomDetails from './pages/Room/RoomDetails';
import Tenants from './pages/Tenant/Tenants';
import TenantDetails from './pages/Tenant/TenantDetails';
import ExpenseReportPage from './pages/Expense/ExpenseReportPage';
import ExpensesPage from './pages/Expense/ExpensesPage';
import ComplaintsPage from './pages/Complaints/ComplaintsPage';
import ComplaintDetailsPage from './pages/Complaints/ComplaintDetailsPage';
import Notifications from './pages/Notifications';
import UsersPage from './pages/Users/UsersPage';
import UserDetailsPage from './pages/Users/UserDetailsPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Overview from './pages/Overview';
import EntryLogsPage from './pages/Entry/EntryLogsPage';
import SettingsLayout from './components/SettingsLayout';
import Account from './pages/Settings/Account';
import Security from './pages/Settings/Security';
import SubscriptionPage from './pages/Subscription/SubscriptionPage';
import UpgradePage from './pages/Subscription/UpgradePage';
import { ProtectedFeatureRoute } from './components/ProtectedFeatureRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Password recovery */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/overview" element={<Overview />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/pgs" element={<Properties />} />

            <Route path="/pgs/:pgId">

              <Route path='' element={<PGLayout />}>
                {/* PG Information Module*/}
                <Route path="basic" element={<PGBasic />} />
                <Route path="details" element={<PGDetails />} />
                <Route path="images" element={<PGImages />} />
                <Route path="rules" element={<PGRules />} />
                <Route path="amenities" element={<PGAmenities />} />
              </Route>

              {/* Floors Module*/}
              <Route path="floors" element={<Floors />} />
              <Route path="floors/:floorId" element={<FloorDetails />} />

              {/* Rooms Module */}
              <Route path="rooms" element={<Rooms />} />
              <Route path="rooms/:roomId" element={<RoomDetails />} />

              {/* Tenants Module */}
              <Route path="tenants" element={<Tenants />} />
              <Route path="tenants/:tenantId" element={<TenantDetails />} />

              <Route element={
                <ProtectedFeatureRoute
                  type="module"
                  featureKey="expense"
                  featureName="Expense Management"
                />
              }>
                {/* Expenses Module  */}
                <Route path="expense" element={<ExpensesPage />} />
                <Route path="expense/report" element={<ExpenseReportPage />} />
              </Route>

              {/* Complaints Module */}
              <Route element={
                <ProtectedFeatureRoute
                  type="module"
                  featureKey="complaints"
                  featureName="Complaints"
                />
              }>
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="complaints/:complaintId" element={<ComplaintDetailsPage />} />
              </Route>

              {/* Notifications Module  */}
              <Route path="notifications" element={<Notifications />} />

              {/* Users Module  */}
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:userId" element={<UserDetailsPage />} />

              {/* Security Entry Logs */}
              <Route element={
                <ProtectedFeatureRoute
                  type="module"
                  featureKey="entryLogs"
                  featureName="Entry Logs"
                />
              }>
                <Route path="entries" element={<EntryLogsPage />} />
              </Route>

              {/* Settings Module */}

              <Route path='settings' element={<SettingsLayout />}>
                <Route path='account' element={<Account />} />
                <Route path='security' element={<Security />} />
                <Route path="billing" element={<SubscriptionPage isBillingPage={true} />} />
              </Route>
            </Route>

            <Route path="/subscription" element={<SubscriptionPage isBillingPage={false} />} />
            <Route path="/subscription/upgrade" element={<UpgradePage />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes >
      <Toaster position='top-center' reverseOrder={false} />
    </>
  );
}

export default App;