import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import Footer from "../components/Footer";

function Booking() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ CAMP DATA
  const campName = state?.campName || "Your Camp";
  const campImage =
    state?.campImage ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop";

  const [form, setForm] = useState({
    checkInDate: state?.checkIn || "",
    checkOutDate: state?.checkOut || "",
    guests: state?.guests || 1,
    billingAddress: "",
    state: "",
    country: "",
    zipCode: "",
    cellPhone: "",
    couponCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [available, setAvailable] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid =
    form.checkInDate &&
    form.checkOutDate &&
    new Date(form.checkInDate) >= new Date(today) &&
    new Date(form.checkOutDate) >= new Date(today) &&
    new Date(form.checkInDate) < new Date(form.checkOutDate) &&
    form.guests >= 1;

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      const res = await api.post("/bookings", {
        campId: parseInt(id),
        ...form,
      });

      navigate("/confirmation", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // 💰 PRICE PREVIEW
  useEffect(() => {
    if (!isValid) return;

    const fetchPrice = async () => {
      try {
        const res = await api.post("/bookings/preview", {
          campId: parseInt(id),
          ...form,
        });

        setPrice(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrice();
  }, [form, id, isValid]);

  // 📦 AVAILABILITY
  useEffect(() => {
    if (!isValid) {
      setAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      try {
        const res = await api.get("/bookings/check-availability", {
          params: {
            campId: id,
            checkIn: form.checkInDate,
            checkOut: form.checkOutDate,
          },
        });

        setAvailable(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    checkAvailability();
  }, [form.checkInDate, form.checkOutDate, id, isValid]);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 🌄 BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url('${campImage}')` }}
      />
      <div className="fixed inset-0 bg-black/55 -z-10" />

      {/* CONTENT */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl w-full max-w-xl space-y-5">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-center text-white">
            Book Your Camp
          </h1>
          <p className="text-center text-white/70 font-medium">{campName}</p>

          {/* 🧾 FORM */}
          <div className="space-y-4">
            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col text-white text-sm">
                <label className="mb-1 text-white/70">Check In</label>
                <div className="relative">
                  <span className="absolute left-2 top-3 text-gray-500">
                    📅
                  </span>
                  <input
                    name="checkInDate"
                    type="date"
                    min={today}
                    value={form.checkInDate}
                    onChange={handleChange}
                    className="pl-8 p-3 rounded-lg text-black w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col text-white text-sm">
                <label className="mb-1 text-white/70">Check Out</label>
                <div className="relative">
                  <span className="absolute left-2 top-3 text-gray-500">
                    📅
                  </span>
                  <input
                    name="checkOutDate"
                    type="date"
                    min={form.checkInDate || today}
                    value={form.checkOutDate}
                    onChange={handleChange}
                    className="pl-8 p-3 rounded-lg text-black w-full"
                  />
                </div>
              </div>
            </div>

            {/* GUESTS */}
            <div className="flex flex-col text-white text-sm">
              <label className="mb-1 text-white/70">Guests</label>
              <div className="relative">
                <span className="absolute left-2 top-3 text-gray-500">👥</span>
                <input
                  name="guests"
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={handleChange}
                  className="pl-8 p-3 rounded-lg text-black w-full"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <input
              name="billingAddress"
              placeholder="Billing Address"
              value={form.billingAddress}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
            />

            {/* LOCATION */}
            <div className="grid md:grid-cols-3 gap-3">
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="p-3 rounded-lg text-black"
              />
              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="p-3 rounded-lg text-black"
              />
              <input
                name="zipCode"
                placeholder="Zip Code"
                value={form.zipCode}
                onChange={handleChange}
                className="p-3 rounded-lg text-black"
              />
            </div>

            {/* PHONE */}
            <input
              name="cellPhone"
              placeholder="Phone Number"
              value={form.cellPhone}
              onChange={handleChange}
              className="p-3 rounded-lg text-black w-full"
            />

            {/* COUPON */}
            <input
              name="couponCode"
              type="text"
              placeholder="Coupon Code (optional)"
              value={form.couponCode}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
            />
          </div>

          {/* 💰 PRICE */}
          {price && (
            <div className="bg-white/20 text-white p-3 rounded text-center space-y-1">
              {price.discountApplied ? (
                <>
                  <div className="text-sm line-through text-white/50">
                    ₹{price.originalPrice}
                  </div>
                  <div className="text-lg text-green-300">
                    ₹{price.finalPrice}
                  </div>
                  <div className="text-xs text-green-400">
                    Coupon Applied ✅
                  </div>
                </>
              ) : (
                <div className="text-lg">₹{price.originalPrice || price}</div>
              )}
            </div>
          )}

          {/* AVAILABILITY */}
          {available === false && (
            <p className="text-red-400 text-center font-semibold">
              ❌ Camp not available
            </p>
          )}
          {available === true && (
            <p className="text-green-400 text-center font-semibold">
              ✅ Camp available
            </p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || available === false}
            className={`w-full py-3 rounded-lg text-lg border transition ${
              isValid && available !== false
                ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                : "bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
            }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Booking;
