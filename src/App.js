import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./Components/Login"; 
import AdminDashboard from "./Components/Admin/Home"; 
import AddSchedule from "./Components/Admin/AddJadwal"; 
import ReviseSchedule from "./Components/Admin/RevisiJadwal"; 
import ActivityReport from "./Components/Admin/Laporan"; 
import UserMenu from "./Components/User/Home";
import LaporanKegiatan from './Components/User/Laporan';
import EditSchedule from './Components/Admin/EditSchedule';  // Corrected path

function App() {
  const isAdminAuthenticated = () => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  };

  const isUserAuthenticated = () => {
    return localStorage.getItem('isUserLoggedIn') === 'true';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAdminAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/add-schedule"
          element={isAdminAuthenticated() ? <AddSchedule /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/revise-schedule"
          element={isAdminAuthenticated() ? <ReviseSchedule /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/edit-schedule/:id_jadwal"
          element={isAdminAuthenticated() ? <EditSchedule /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/reports"
          element={isAdminAuthenticated() ? <ActivityReport /> : <Navigate to="/login" />}
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={isUserAuthenticated() ? <UserMenu /> : <Navigate to="/login" />}
        />
        <Route
          path="/user/laporan-kegiatan"
          element={isUserAuthenticated() ? <LaporanKegiatan /> : <Navigate to="/login" />}
        />

        {/* Redirect unmatched routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
