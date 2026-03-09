import { BookOpenCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { dersler } from "@/constants/subjects";

export default function SubjectGrid() {
  return (
    <section className="space-y-3 xl:space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40">
            <BookOpenCheck className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-white sm:text-base">
            Dersini Seç
          </h2>
        </div>
        <Link
          href="/dersler"
          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white hover:ring-sky-400/60"
        >
          <span>Tüm Dersler</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:gap-4 2xl:gap-6">
        {dersler.map((subject) => {
          const content = (
            <>
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${subject.temaRengi} opacity-70 mix-blend-screen transition-opacity duration-200 group-hover:opacity-100`}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0,rgba(248,250,252,0.25),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.35),transparent_55%)] opacity-70" />
              <div className="relative flex h-40 flex-col justify-between p-4 xl:p-5 2xl:p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 ring-1 ring-white/25">
                    {subject.etiket ?? "Genel"}
                  </span>
                  <span className="rounded-full bg-black/30 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 ring-1 ring-white/15">
                    Etkileşimli görevler
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black/40 text-white/80 ring-1 ring-white/20">
                    <subject.ikon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-sm font-semibold text-white sm:text-[15px]">
                    {subject.baslik}
                  </h3>
                  <p className="text-xs text-white/70">{subject.altBaslik}</p>
                </div>
              </div>
            </>
          );

          return (
            <Link
              key={subject.id}
              href={`/dersler?sec=${subject.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#050816]/90 p-0 text-left shadow-[0_0_40px_rgba(15,23,42,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/70 hover:shadow-[0_22px_60px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

