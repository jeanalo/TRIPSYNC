import { Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Budget from './pages/Budget/Budget';
import Schedule from './pages/Schedule/Schedule';
import Experiences from './pages/Experiences/Experiences';
import TripSetup from './pages/TripSetup/TripSetup';
import JetLag from './pages/JetLag/JetLag';
import Profile from './pages/Profile/Profile';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
  return (
    <TravelProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="setup" element={<TripSetup />} />
          <Route path="jet-lag" element={<JetLag />} />
          <Route path="budget" element={<Budget />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </TravelProvider>
  );
}

export default App;
