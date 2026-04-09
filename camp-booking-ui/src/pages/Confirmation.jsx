import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.bookingReference) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-lg">No booking found</p>
      </div>
    );
  }

  const {
    bookingReference,
    campName,
    checkInDate,
    checkOutDate,
    guests,
    totalAmount,
    billingAddress,
    state: userState,
    country,
    zipCode,
    cellPhone,
  } = state;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const days = Math.max(
    1,
    Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
  );

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
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl text-white max-w-4xl w-full space-y-6">
          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center">
            🎉 Booking Confirmed!
          </h1>

          {/* REFERENCE */}
          <div className="bg-white/20 border border-white/20 p-4 rounded-lg text-center space-y-2 max-w-md mx-auto">
            <p className="text-sm text-white/70">Booking Reference</p>

            <p className="text-xl font-bold tracking-widest">
              {bookingReference}
            </p>

            <button
              onClick={() => navigator.clipboard.writeText(bookingReference)}
              className="text-xs text-white/70 hover:text-white underline"
            >
              Copy
            </button>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* CAMP DETAILS */}
            <div className="bg-white/10 border border-white/20 p-5 rounded-lg space-y-3">
              <h2 className="font-semibold text-lg border-b border-white/20 pb-2">
                Camp Details
              </h2>

              <div className="flex justify-between">
                <span className="text-white/70">Camp</span>
                <span>{campName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Dates</span>
                <span className="text-right text-sm">
                  {checkIn.toDateString()} → {checkOut.toDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Duration</span>
                <span>{days} nights</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Guests</span>
                <span>{guests}</span>
              </div>

              <div className="flex justify-between text-green-300 font-semibold text-lg pt-2 border-t border-white/20">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* BILLING DETAILS */}
            <div className="bg-white/10 border border-white/20 p-5 rounded-lg space-y-3">
              <h2 className="font-semibold text-lg border-b border-white/20 pb-2">
                Billing Details
              </h2>

              <p>{billingAddress}</p>
              <p>
                {userState}, {country}
              </p>
              <p>ZIP: {zipCode}</p>
              <p>📞 {cellPhone}</p>
            </div>
          </div>

          {/* NOTE */}
          <p className="text-yellow-300 text-sm text-center">
            ⚠️ Save your booking reference for future use
          </p>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 rounded-lg border bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Confirmation;
