import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";

function AddCamp() {
  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin");
  }, []);

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    rate: "",
    imageUrl: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { name, capacity, rate, imageUrl, description } = form;

      if (!name || !capacity || !rate || !imageUrl || !description) {
        toast.error("All fields are required");
        return;
      }

      await api.post("/camps", {
        name,
        capacity: parseInt(capacity),
        ratePerNight: parseInt(rate),
        imageUrl,
        description,
      });

      toast.success("Camp added successfully");

      // reset form
      setForm({
        name: "",
        capacity: "",
        rate: "",
        imageUrl: "",
        description: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error adding camp");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 🌄 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* 🌑 OVERLAY */}
      <div className="absolute inset-0 bg-black/55 -z-10" />

      {/* 🧾 CONTENT */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl w-full max-w-xl space-y-5 text-white">
          <h1 className="text-2xl font-bold text-center">Add New Camp</h1>

          {/* FORM */}
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Camp Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <input
              name="rate"
              type="number"
              placeholder="Rate Per Night"
              value={form.rate}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <input
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl text-black"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl border bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Add Camp
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 py-3 rounded-xl border bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddCamp;
