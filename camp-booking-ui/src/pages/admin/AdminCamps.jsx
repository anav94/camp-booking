import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";

function AdminCamps() {
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCampId, setSelectedCampId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    rate: "",
    imageUrl: "",
    description: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) navigate("/admin");
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await api.get("/camps/all");
      setCamps(res.data);
    } catch {
      toast.error("Error fetching camps");
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchBookings = async (campId) => {
    try {
      if (selectedCampId === campId) {
        setSelectedCampId(null);
        return;
      }

      const res = await api.get(`/bookings/camp/${campId}`);
      setBookings(res.data);
      setSelectedCampId(campId);
    } catch {
      toast.error("Error fetching bookings");
    }
  };

  const startEdit = (camp) => {
    setEditingId(camp.id);
    setForm({
      name: camp.name,
      capacity: camp.capacity,
      rate: camp.ratePerNight,
      imageUrl: camp.imageUrl,
      description: camp.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      capacity: "",
      rate: "",
      imageUrl: "",
      description: "",
    });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/camps/${editingId}`, {
        name: form.name,
        capacity: parseInt(form.capacity),
        ratePerNight: parseInt(form.rate),
        imageUrl: form.imageUrl,
        description: form.description,
      });

      toast.success("Camp updated");
      cancelEdit();
      fetchCamps();
    } catch {
      toast.error("Error updating camp");
    }
  };

  const deleteCamp = async (id) => {
    try {
      if (!window.confirm("Delete this camp?")) return;
      await api.delete(`/camps/${id}`);
      toast.success("Camp deleted");
      fetchCamps();
    } catch {
      toast.error("Error deleting camp");
    }
  };

  const startIndex = (page - 1) * pageSize;
  const paginated = camps.slice(startIndex, startIndex + pageSize);

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
      <div className="flex-grow py-10 px-4 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl text-white text-center font-bold">
          Manage Camps
        </h1>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {paginated.map((camp) => (
            <div
              key={camp.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden text-white"
            >
              <img src={camp.imageUrl} className="h-40 w-full object-cover" />

              <div className="p-4 space-y-3">
                {editingId === camp.id ? (
                  <>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full p-2 rounded text-black"
                    />
                    <input
                      value={form.capacity}
                      onChange={(e) =>
                        setForm({ ...form, capacity: e.target.value })
                      }
                      className="w-full p-2 rounded text-black"
                    />
                    <input
                      value={form.rate}
                      onChange={(e) =>
                        setForm({ ...form, rate: e.target.value })
                      }
                      className="w-full p-2 rounded text-black"
                    />
                    <input
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                      }
                      className="w-full p-2 rounded text-black"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full p-2 rounded text-black"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 py-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold">{camp.name}</h3>
                    <p className="text-sm text-white/70">
                      ₹{camp.ratePerNight}
                    </p>
                    <p className="text-sm text-white/70">
                      Capacity: {camp.capacity}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(camp)}
                        className="flex-1 py-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCamp(camp.id)}
                        className="flex-1 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white transition"
                      >
                        Delete
                      </button>
                    </div>

                    <button
                      onClick={() => fetchBookings(camp.id)}
                      className="w-full py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white transition"
                    >
                      {selectedCampId === camp.id
                        ? "Hide Bookings"
                        : "View Bookings"}
                    </button>

                    {selectedCampId === camp.id && (
                      <div className="mt-2 space-y-2 text-sm">
                        {bookings.length === 0 ? (
                          <p className="text-white/60">No bookings</p>
                        ) : (
                          bookings.map((b) => (
                            <div key={b.id} className="bg-white/10 p-2 rounded">
                              <p className="font-medium">
                                REF: {b.bookingReference || "N/A"}
                              </p>
                              <p className="text-white/70">
                                Guests: {b.guests}
                              </p>
                              <p className="text-white/70">
                                Check-in:{" "}
                                {new Date(b.checkInDate).toLocaleDateString()}
                              </p>
                              <p className="text-white/70">
                                Check-out:{" "}
                                {new Date(b.checkOutDate).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white transition"
          >
            Prev
          </button>

          <span className="px-4 py-2 rounded-xl bg-white/20 text-white">
            {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={startIndex + pageSize >= camps.length}
            className="px-4 py-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCamps;
