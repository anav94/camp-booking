function Footer() {
  return (
    <footer className="mt-auto w-full backdrop-blur-md bg-black/40 border-t border-white/10">
      <div className="w-full px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-white/80 text-sm">
        {/* 🔥 Left */}
        <p className="text-center md:text-left">© 2026 CampFire🔥</p>

        {/* ⚡ Center (optional branding) */}
        <p className="text-white/60 text-center">Explore • Book • Relax</p>

        {/* 👨‍💻 Right */}
        <p className="text-center md:text-right">
          Built by <span className="text-white font-medium">Anav Lamba</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
