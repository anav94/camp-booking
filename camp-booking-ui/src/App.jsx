import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import ManageBooking from "./pages/ManageBooking";
import Landing from "./pages/Landing";

// 🔥 ADMIN IMPORTS (FIXED PATHS)
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddCamp from "./pages/admin/AddCamp";
import Coupons from "./pages/admin/Coupons";
import AdminCamps from "./pages/admin/AdminCamps";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <BrowserRouter>
      {/* 🔝 Navbar */}
      <Navbar />

      {/* 🔁 Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/manage" element={<ManageBooking />} />

        {/* 🔐 ADMIN */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-camp" element={<AddCamp />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/camps" element={<AdminCamps />} />
      </Routes>

      {/* 🔥 Landing overlay */}
      {showLanding && <Landing onFinish={() => setShowLanding(false)} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
