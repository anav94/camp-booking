import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";

function Coupons() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin");
  }, []);

  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
  });

  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch {
      toast.error("Error fetching coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code") {
      setCoupon({ ...coupon, code: value.toUpperCase() });
    } else {
      setCoupon({ ...coupon, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!coupon.code || !coupon.discountPercentage) {
        toast.error("All fields required");
        return;
      }

      if (editingId) {
        await api.put(`/coupons/${editingId}`, {
          code: coupon.code,
          discountPercentage: parseInt(coupon.discountPercentage),
          minNights: 0,
        });

        toast.success("Coupon updated");
        setEditingId(null);
      } else {
        await api.post("/coupons", {
          code: coupon.code,
          discountPercentage: parseInt(coupon.discountPercentage),
          minNights: 0,
        });

        toast.success("Coupon created");
      }

      setCoupon({ code: "", discountPercentage: "" });
      fetchCoupons();
    } catch {
      toast.error("Error saving coupon");
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setCoupon({
      code: c.code,
      discountPercentage: c.discountPercentage,
    });
  };

  const deleteCoupon = async (id) => {
    try {
      if (!window.confirm("Delete this coupon?")) return;
      await api.delete(`/coupons/${id}`);
      toast.success("Deleted");
      fetchCoupons();
    } catch {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/55 -z-10" />

      {/* CONTENT */}
      <div className="flex-grow py-10 px-4 max-w-6xl mx-auto">
        <div className="text-white mb-6">
          <h1 className="text-3xl font-bold">Coupons Dashboard</h1>
          <p className="text-white/70 text-sm">
            Create and manage discount coupons
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* LEFT */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </h2>

            <input
              name="code"
              placeholder="Coupon Code"
              value={coupon.code}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <input
              name="discountPercentage"
              type="number"
              placeholder="Discount %"
              value={coupon.discountPercentage}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                {editingId ? "Update" : "Add"}
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setCoupon({ code: "", discountPercentage: "" });
                }}
                className="flex-1 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white font-medium transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white space-y-4">
            <h2 className="text-xl font-semibold">All Coupons</h2>

            {coupons.length === 0 ? (
              <p className="text-white/60">No coupons yet</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/10 p-3 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{c.code}</p>
                      <p className="text-sm text-white/70">
                        {c.discountPercentage}% off
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="px-3 py-1.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Coupons;
