import { useNavigate } from "react-router-dom";

function CampCard({ camp, checkIn, checkOut, capacity, index }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full max-w-sm hover:-translate-y-2"
      style={{
        animation: `fadeUp 0.6s ease forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      {/* 🖼 IMAGE */}
      <div className="relative">
        <img
          src={
            camp.imageUrl ||
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop"
          }
          alt="camp"
          className="h-52 w-full object-cover"
        />

        {/* 🔥 DISCOUNT BADGE */}
        <span className="absolute top-3 left-3 bg-green-500/90 text-white text-xs px-2 py-1 rounded-lg shadow">
          20% OFF
        </span>
      </div>

      {/* 📦 CONTENT */}
      <div className="p-5 text-white">
        <h3 className="text-lg font-semibold mb-1">{camp.name}</h3>

        <p className="text-white/70 text-sm mb-2">Capacity: {camp.capacity}</p>

        {/* 💰 PRICE */}
        <div className="mb-3">
          <p className="text-white/40 line-through text-sm">
            ₹{camp.ratePerNight}
          </p>

          <p className="text-green-400 font-semibold text-lg">
            ₹{Math.round(camp.ratePerNight * 0.8)} / night
          </p>
        </div>

        {/* ⭐ RATING (IMPROVED) */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                camp.averageRating >= star ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-white/70 text-sm ml-1">
            ({camp.ratingCount})
          </span>
        </div>

        {/* 🚀 BUTTON */}
        <button
          onClick={() =>
            navigate(`/book/${camp.id}`, {
              state: {
                campName: camp.name,
                campImage: camp.imageUrl,
                checkIn,
                checkOut,
                guests: capacity,
              },
            })
          }
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white py-2 rounded-lg transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CampCard;
