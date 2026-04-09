import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-2 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-white/20 text-white border border-white/30"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        {/* 🔥 Logo (FULL LEFT) */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-white hover:text-gray-200 transition"
        >
          CampFire🔥
        </Link>

        {/* 🚀 Right Side (FULL RIGHT) */}
        <div className="flex items-center gap-3">
          {/* 📋 Manage Booking */}
          <Link to="/manage" className={linkStyle("/manage")}>
            Manage Booking
          </Link>

          {/* 🔐 Admin (NOW MATCHES THEME) */}
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              location.pathname === "/admin"
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
