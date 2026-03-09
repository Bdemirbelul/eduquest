import { Bell, ChevronDown, Coins, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center gap-4 rounded-3xl bg-white/5 px-4 py-3 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.55)] sm:gap-5 xl:px-5 2xl:px-6 2xl:py-4">
      <div className="flex-1">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-sky-400/70 focus:bg-white/10 focus:ring-1 focus:ring-sky-400/70"
            placeholder="Oyun veya arkadaş ara..."
          />
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.6)]">
          <Coins className="h-4 w-4 text-amber-300" />
          <span>2.450</span>
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 shadow-inner shadow-black/50 transition-all duration-200 hover:border-sky-400/70 hover:bg-white/10 hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[10px] font-semibold leading-none text-white shadow-[0_0_15px_rgba(244,63,94,0.8)]">
            3
          </span>
        </button>

        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white/80 shadow-[0_0_25px_rgba(15,23,42,0.8)] transition-all duration-200 hover:border-sky-400/60 hover:bg-white/10">
          <div className="relative h-9 w-9 overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-[0_0_25px_rgba(56,189,248,0.8)]">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.3),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.4),transparent_55%)]" />
            <span className="relative flex h-full w-full items-center justify-center text-xs font-semibold tracking-tight">
              AS
            </span>
          </div>
          <div className="hidden flex-col items-start leading-tight sm:flex">
            <span className="text-[13px] font-semibold">Alex Storm</span>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/40">
              En iyi %5
            </span>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-white/50 sm:block" />
        </button>
      </div>
    </header>
  );
}

