import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin");
  }, []);

  const Card = ({ title, icon, description, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-white cursor-pointer hover:bg-white/20 hover:scale-105 transition duration-300 flex-1 max-w-sm"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-white mb-10 tracking-wide">
          Admin Dashboard
        </h1>

        {/* 🔥 FIXED ROW */}
        <div className="flex justify-center gap-8 w-full max-w-5xl flex-nowrap">
          <Card
            title="Add Camp"
            icon="🏕️"
            description="Create a new camp listing"
            onClick={() => navigate("/admin/add-camp")}
          />

          <Card
            title="Add Coupon"
            icon="🎟"
            description="Create discount coupons"
            onClick={() => navigate("/admin/coupons")}
          />

          <Card
            title="View Camps"
            icon="📋"
            description="Edit, delete and view bookings"
            onClick={() => navigate("/admin/camps")}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
