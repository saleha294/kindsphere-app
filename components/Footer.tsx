"use client";

/**
 * Footer — shared across Dashboard, Dashboard/[id], Drop, Digest, and Globe.
 * Extracted directly from app/page.tsx's FOOTER section.
 */

export default function Footer() {
  return (
    <footer
      className="w-full relative overflow-hidden border-t border-black/10 rounded-t-[40px] pt-10 pb-6 mt-auto"
      style={{
        background: "radial-gradient(circle at 50% 50%, #e0e7ff66 0%, transparent 70%)",
      }}
    >
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 relative z-10">

        {/* ── Links grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 mb-10 -ml-5">

          {/* About */}
          <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
            <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
              About
            </h4>
            <p className="text-[14px] text-black/70 leading-relaxed max-w-[220px]">
              KindSphere is a safe haven built to inspire daily kindness, one anonymous drop at a time.
            </p>
          </div>

          {/* Mission */}
          <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
            <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
              Our Mission
            </h4>
            <ul className="space-y-2">
              {[
                "Anonymous by Design",
                "Built on Kindness",
                "Meaningful Connections",
                "Safe & Respectful Community",
                "Honest Conversations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-purple-500 text-[9px] mt-[7px]">◆</span>
                  <span className="text-[14px] text-black/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="w-full px-6 py-8 border-b md:border-b-0 md:border-r border-violet-100/70 hover:bg-violet-900/30 transition-colors duration-300">
            <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              {["Home", "Shore", "Drop a Bottle", "My Drift", "The Sphere"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[14px] text-black hover:text-purple-600 transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Creator */}
          <div className="w-full px-6 py-8 hover:bg-violet-900/30 transition-colors duration-300">
            <h4 className="text-[15px] font-bold text-black uppercase tracking-widest mb-3">
              Creator
            </h4>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] text-black/80 font-medium">Saleha Zeeshan</p>
              <a
                href="https://github.com/saleha294"
                target="_blank"
                rel="noreferrer"
                className="text-[14px] text-black hover:text-purple-600 transition"
              >
                GitHub
              </a>
              <a
                href="mailto:salehacorner@gmail.com"
                className="text-[14px] text-black hover:text-purple-600 transition"
              >
                Gmail
              </a>
            </div>
          </div>
        </div>

        {/* ── Branding ── */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center -mt-4 mb-2">
          <h2 className="font-serif text-4xl md:text-5xl tracking-wide">
            <span className="text-black">Kind</span>
            <span className="text-purple-600 italic">Sphere</span>
          </h2>
          <p className="mt-1 text-sm text-black/70">A kinder world starts with you.</p>
        </div>

        {/* ── Copyright ── */}
        <div className="pt-4 border-t border-black/10 flex flex-col items-start md:items-center gap-2 text-left md:text-center">
          <p className="text-[10px] text-black/60 uppercase tracking-widest">
            © {new Date().getFullYear()} KindSphere. All rights reserved ♥
          </p>
        </div>

      </div>
    </footer>
  );
}
