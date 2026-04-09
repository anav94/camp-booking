import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin@camp.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 🌄 BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* 🌑 OVERLAY */}
      <div className="fixed inset-0 bg-black/55 -z-10" />

      {/* 🧾 CONTENT */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 text-white">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-center tracking-wide">
            Admin Login
          </h1>

          {/* EMAIL */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 text-white/70">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">📧</span>
              <input
                type="email"
                placeholder="admin@camp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 p-3 rounded-lg text-black"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col text-sm">
            <label className="mb-1 text-white/70">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">🔒</span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 p-3 rounded-lg text-black"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg border bg-white/20 text-white border-white/30 hover:bg-white/30 transition"
          >
            Login
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminLogin;
