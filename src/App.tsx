import { Routes, Route } from 'react-router-dom';
import { TravelProvider } from './context/TravelContext';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Budget from './pages/Budget/Budget';
//import AddExpense from './pages/AddExpense/AddExpense';
// import Schedule from './pages/Schedule/Schedule';
// import AddActivity from './pages/AddActivity/AddActivity';
// import Experiences from './pages/Experiences/Experiences';
import TripSetup from './pages/TripSetup/TripSetup';
// import JetLag from './pages/JetLag/JetLag';
// import Profile from './pages/Profile/Profile';
import Layout from './components/layout/Layout';

function App() {
  return (
    <TravelProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="setup" element={<TripSetup />} />
          {/* <Route path="jet-lag" element={<JetLag />} /> */}
          <Route path="budget" element={<Budget />} />
          {/* <Route path="budget/add" element={<AddExpense />} /> */}
          {/* <Route path="schedule" element={<Schedule />} />
          <Route path="schedule/add" element={<AddActivity />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </TravelProvider>
  );
}

export default App;
