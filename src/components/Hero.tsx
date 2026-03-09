import Link from "next/link";
import { ArrowRight, Play, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/40 via-sky-500/35 to-emerald-400/30 p-[1px] shadow-[0_0_60px_rgba(56,189,248,0.55)]">
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-[1.35rem] bg-[#050816]/90 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:px-9 lg:py-7 2xl:px-10 2xl:py-8">
          <div className="pointer-events-none absolute -right-10 -top-16 aspect-[4/3] w-60 rounded-3xl bg-[radial-gradient(circle_at_0_0,rgba(248,250,252,0.28),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.38),transparent_55%)] blur-3xl sm:w-72 lg:-right-16 lg:-top-20 lg:w-96" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0,rgba(239,246,255,0.5),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(45,212,191,0.5),transparent_55%)]" />
          </div>

          <div className="relative flex-1 space-y-4 lg:space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100 ring-1 ring-sky-300/60 shadow-[0_0_25px_rgba(59,130,246,0.8)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span>Sezon 4 yayında</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.3rem] lg:leading-[1.15]">
              Öğren, oyna ve yarış!
            </h1>

            <p className="text-sm text-white/70 sm:text-[15px]">
              Derslerini oyunlaştırılmış görevlerle geliştir. Gerçek zamanlı çok
              oyunculu mücadelelere katıl, dostlarınla aynı lobide buluş ve
              bilgini arenada kanıtla.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/oyunlar"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(56,189,248,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15">
                  <Play className="h-3.5 w-3.5" />
                </span>
                <span>Oynamaya Başla</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 shadow-[0_0_35px_rgba(15,23,42,0.9)] transition-all duration-200 hover:border-sky-400/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5">
                  <Users className="h-3.5 w-3.5" />
                </span>
                <span>Odaya Katıl</span>
              </button>

              <span className="ml-0.5 text-xs text-white/60">
                Şu anda 1.248 öğrenci lobiye bağlı.
              </span>
            </div>
          </div>

          <div className="relative mt-2 flex w-full flex-none items-center justify-center lg:mt-0 lg:w-[260px]">
            <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 shadow-[0_30px_80px_rgba(15,23,42,0.95)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(251,191,36,0.4),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.6),transparent_55%),radial-gradient(circle_at_0_100%,rgba(129,140,248,0.5),transparent_45%)] opacity-90" />
              <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_50%,rgba(15,23,42,0.3),transparent_40%,rgba(8,47,73,0.85),rgba(15,23,42,0.5),transparent_80%,rgba(15,23,42,0.95))]" />
              <div className="absolute inset-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(248,250,252,0.2),transparent_55%)] mix-blend-screen" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

