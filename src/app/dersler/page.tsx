"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";
import { dersler } from "@/constants/subjects";

export default function DerslerPage() {
  const searchParams = useSearchParams();
  const secSlug = searchParams.get("sec");

  useEffect(() => {
    if (!secSlug) return;
    const el = document.getElementById(`ders-${secSlug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [secSlug]);

  const seciliDers =
    dersler.find((d) => d.slug === secSlug) ??
    (secSlug ? null : null);

  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />

          <section className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[1.7rem] lg:leading-[1.1]">
                Dersler
              </h1>
              <p className="max-w-2xl text-sm text-white/70 sm:text-[15px]">
                Bir ders seç ve oyun modlarını keşfet.
              </p>
            </div>
          </section>

          {seciliDers && secSlug !== "matematik" && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 shadow-[0_0_40px_rgba(15,23,42,0.9)] sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Seçili Ders
              </p>
              <h2 className="mt-1 text-base font-semibold text-white sm:text-lg">
                {seciliDers.baslik}
              </h2>
              <p className="mt-1 text-[13px] text-white/70">
                Bu ders için özel oyun modları yakında eklenecek. Şimdilik
                diğer modları denemeye devam edebilirsin.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100 ring-1 ring-amber-400/60">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
                Yakında
              </p>
            </section>
          )}

          <section className="space-y-3 sm:space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dersler.map((ders) => {
                const Icon = ders.ikon;
                const secili = secSlug === ders.slug;
                const math = ders.slug === "matematik";
                const href = math
                  ? "/dersler/matematik"
                  : `/dersler?sec=${ders.slug}`;

                return (
                  <Link
                    key={ders.id}
                    id={`ders-${ders.slug}`}
                    href={href}
                    className={`group flex flex-col justify-between rounded-3xl border bg-white/5 p-4 text-left shadow-[0_0_35px_rgba(15,23,42,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/70 hover:shadow-[0_22px_60px_rgba(37,99,235,0.9)] ${
                      secili
                        ? "border-sky-400/80 ring-2 ring-sky-300/80"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/20">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-semibold text-white sm:text-[15px]">
                          {ders.baslik}
                        </h3>
                        <p className="text-xs text-white/70">
                          {ders.altBaslik}
                        </p>
                      </div>
                      {ders.etiket && (
                        <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 ring-1 ring-emerald-400/60">
                          {ders.etiket}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                      <span>
                        {math
                          ? "Halat çekme matematik modu hazır."
                          : "Özel oyun modları yakında."}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                        {math ? "Başla" : secili ? "Seçili" : "İncele"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

