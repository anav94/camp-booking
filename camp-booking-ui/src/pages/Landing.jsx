import { useEffect, useState } from "react";

function Landing({ onFinish }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setExit(true); // start exit animation
    }, 2000);

    const timer2 = setTimeout(() => {
      onFinish(); // remove landing (NO navigation)
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden fixed top-0 left-0 z-50">
      {/* 🌄 IMAGE */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          exit ? "animate-slideUp" : "animate-slideDown"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* 🌑 OVERLAY */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <h1
          className={`text-white text-5xl md:text-6xl font-bold tracking-widest ${
            exit ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          CampFire🔥
        </h1>
      </div>
    </div>
  );
}

export default Landing;
