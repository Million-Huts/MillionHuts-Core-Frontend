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

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />


            <Route path="/pgs" element={<Properties />} />
            <Route path="/pgs/:pgId" element={<PGLayout />}>
              <Route path="basic" element={<PGBasic />} />
              <Route path="details" element={<PGDetails />} />
              <Route path="images" element={<PGImages />} />
              <Route path="rules" element={<PGRules />} />
              <Route path="amenities" element={<PGAmenities />} />
            </Route>
            <Route path="/floors" element={<Floors />} />
            <Route path="/floor/:floorId" element={<FloorDetails />} />

            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:roomId" element={<RoomDetails />} />

            <Route path="tenants" element={<Tenants />} />
            <Route path="tenants/:tenantId" element={<Tenants />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  );
}

export default App;