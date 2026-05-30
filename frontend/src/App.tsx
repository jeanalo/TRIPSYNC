import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProviders } from './context/AppProviders';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AuthSelector from './pages/Auth/AuthSelector';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminRegister from './pages/AdminRegister/AdminRegister';
import Dashboard from './pages/Dashboard/Dashboard';
import Budget from './pages/Budget/Budget';
import AddExpense from './pages/AddExpense/AddExpense';
import Schedule from './pages/Schedule/Schedule';
import AddActivity from './pages/AddActivity/AddActivity';
import EditActivity from './pages/EditActivity/EditActivity';
import Experiences from './pages/Experiences/Experiences';
import ExperienceDetail from './pages/ExperienceDetail/ExperienceDetail';
import TripSetup from './pages/TripSetup/TripSetup';
import JetLag from './pages/JetLag/JetLag';
import Profile from './pages/Profile/Profile';

import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminExperiences from './pages/AdminExperiences/AdminExperiences';
import AdminTrips from './pages/AdminTrips/AdminTrips';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics/AdminAnalytics';
import AdminProfile from './pages/AdminProfile/AdminProfile';
import JoinTrip from './pages/JoinTrip/JoinTrip';

function App() {
  return (
    <AppProviders>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<AuthSelector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join-trip" element={<JoinTrip />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="setup" element={<TripSetup />} />
            <Route path="jet-lag" element={<JetLag />} />
            <Route path="budget" element={<Budget />} />
            <Route path="budget/add" element={<AddExpense />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedule/add" element={<AddActivity />} />
            <Route path="schedule/edit/:id" element={<EditActivity />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="experiences/:id" element={<ExperienceDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute redirectTo="/admin/login" requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="experiences" element={<AdminExperiences />} />
            <Route path="experiences/:id" element={<ExperienceDetail />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;
