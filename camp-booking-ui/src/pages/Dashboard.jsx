import { useEffect, useState } from "react";
import api from "../services/api";
import CampCard from "../components/CampCard";
import Footer from "../components/Footer";

function Dashboard() {
  const [camps, setCamps] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  const fetchCamps = async () => {
    try {
      setLoading(true);

      const res = await api.get("/camps", {
        params: {
          checkIn,
          checkOut,
          capacity: capacity || undefined,
          page: page,
          pageSize: 3,
        },
      });

      setCamps(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching camps");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DEFAULT DATES
  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];

    setCheckIn(todayDate);
    setCheckOut(tomorrow);
  }, []);

  // 🔥 AUTO FETCH
  useEffect(() => {
    if (checkIn && checkOut) {
      fetchCamps();
    }
  }, [checkIn, checkOut, page]);

  // 🔥 VALIDATION
  const isValid =
    checkIn &&
    checkOut &&
    new Date(checkIn) >= new Date(today) &&
    new Date(checkOut) >= new Date(today) &&
    new Date(checkIn) < new Date(checkOut) &&
    (!capacity || capacity >= 1);

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
      <div className="fixed inset-0 bg-black/55 -z-10" />

      {/* 🧾 CONTENT */}
      <div className="flex-grow">
        {/* 🔥 HERO */}
        <div className="flex flex-col items-center justify-center text-white text-center px-4 pt-16 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Find Your Perfect Camp
          </h1>

          {/* 🔍 MODERN SEARCH BAR */}
          <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex flex-wrap gap-4 justify-center items-end">
            <div className="flex flex-col text-white text-sm">
              <label className="mb-1 text-white/70">Check In</label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-gray-500">
                  📅
                </span>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setPage(1);
                    setCheckIn(e.target.value);
                  }}
                  className="pl-8 p-2 rounded-lg text-black"
                />
              </div>
            </div>

            <div className="flex flex-col text-white text-sm">
              <label className="mb-1 text-white/70">Check Out</label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-gray-500">
                  📅
                </span>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => {
                    setPage(1);
                    setCheckOut(e.target.value);
                  }}
                  className="pl-8 p-2 rounded-lg text-black"
                />
              </div>
            </div>

            <div className="flex flex-col text-white text-sm">
              <label className="mb-1 text-white/70">Guests</label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-gray-500">
                  👥
                </span>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => {
                    setPage(1);
                    setCapacity(e.target.value);
                  }}
                  className="pl-8 p-2 rounded-lg text-black w-24"
                />
              </div>
            </div>

            <button
              disabled={!isValid}
              onClick={() => {
                if (!isValid) return;
                setPage(1);
                fetchCamps();
              }}
              className={`px-6 py-2 rounded-lg border ${
                isValid
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  : "bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
              }`}
            >
              Search
            </button>
          </div>
        </div>

        {/* 🏕 CAMPS SECTION */}
        <div className="py-10 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow">
            Available Camps
          </h2>

          {loading && (
            <p className="text-center text-white/80">Loading camps...</p>
          )}

          {!loading && camps.length === 0 && (
            <p className="text-center text-white/60">No camps available</p>
          )}

          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {camps.map((camp, index) => (
              <CampCard
                key={camp.id}
                camp={camp}
                checkIn={checkIn}
                checkOut={checkOut}
                capacity={capacity}
                index={index}
              />
            ))}
          </div>

          {/* 🔁 PAGINATION */}
          <div className="flex justify-center gap-3 mt-12 mb-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 backdrop-blur-md border border-white/20"
            >
              Prev
            </button>

            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={camps.length < 3}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 backdrop-blur-md border border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default Dashboard;
