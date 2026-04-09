import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

function ManageBooking() {
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch booking
  const fetchBooking = async () => {
    try {
      const cleanRef = reference.trim();

      if (!cleanRef) {
        toast.error("Enter booking reference");
        return;
      }

      setLoading(true);

      const res = await api.get(`/bookings/${cleanRef}`);
      setBooking(res.data);
    } catch (err) {
      setBooking(null);
      toast.error("Booking not found");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Cancel booking
  const cancelBooking = async (ref) => {
    try {
      if (!ref) {
        toast.error("Invalid reference");
        return;
      }

      const cleanRef = ref.trim();

      if (!window.confirm("Cancel this booking?")) return;

      await api.post(`/bookings/cancel?reference=${cleanRef}`);

      toast.success("Booking cancelled");
      setBooking(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Error cancelling booking");
    }
  };

  // ⭐ Submit rating
  const submitRating = async () => {
    try {
      const cleanRef = booking?.bookingReference?.trim();

      if (!cleanRef) {
        toast.error("No booking selected");
        return;
      }

      if (!rating || rating < 1 || rating > 5) {
        toast.error("Enter rating between 1-5");
        return;
      }

      await api.post("/bookings/rate", {
        bookingReference: cleanRef,
        score: parseInt(rating),
      });

      toast.success("Rating submitted");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Error submitting rating");
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
      <div className="fixed inset-0 bg-black/55 -z-10" />

      {/* 🧾 CONTENT */}
      <div className="flex-grow px-4 py-10 max-w-xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-wide">
          Manage Booking
        </h1>

        {/* 🔍 SEARCH */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex gap-3 shadow-lg mb-6">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter Booking Reference"
            className="flex-1 p-3 rounded-lg text-black"
          />

          <button
            onClick={fetchBooking}
            className="px-5 rounded-lg border bg-white/20 text-white border-white/30 hover:bg-white/30 transition"
          >
            Search
          </button>
        </div>

        {/* ⏳ Loading */}
        {loading && <p className="text-center text-white/80">Loading...</p>}

        {/* ❌ Empty */}
        {!loading && !booking && (
          <p className="text-center text-white/60">
            Enter your booking reference to view details 👆
          </p>
        )}

        {/* 📦 BOOKING CARD */}
        {booking && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl space-y-4 text-white">
            <h2 className="text-xl font-semibold">{booking.campName}</h2>

            <p>
              <strong>Guests:</strong> {booking.guests}
            </p>

            <p>
              <strong>Total:</strong> ₹{booking.totalAmount}
            </p>

            <p className="text-sm text-white/70">
              Reference: {booking.bookingReference}
            </p>

            {/* ❌ CANCEL */}
            <button
              onClick={() => cancelBooking(booking.bookingReference)}
              className="w-full py-2 rounded-lg border bg-white/20 text-white border-white/30 hover:bg-red-500/30 transition"
            >
              Cancel Booking
            </button>

            {/* ⭐ RATING */}
            <div className="pt-4 border-t border-white/30 text-center">
              <p className="mb-2 font-medium">Rate your stay</p>

              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={(hover || rating) >= star ? "#facc15" : "#374151"}
                    className="w-8 h-8 cursor-pointer transition-transform duration-150 hover:scale-110"
                  >
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.857 1.48 8.237L12 18.896l-7.416 4.504 1.48-8.237L0 9.306l8.332-1.151z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-white/70 mb-2">
                {rating > 0 ? `${rating} / 5` : "Tap to rate"}
              </p>

              <button
                onClick={submitRating}
                className="w-full py-2 rounded-lg border bg-white/20 text-white border-white/30 hover:bg-white/30 transition"
              >
                Submit Rating
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default ManageBooking;
