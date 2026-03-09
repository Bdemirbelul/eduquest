"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Flame, Sparkles, Trophy } from "lucide-react";

type Soru = {
  ifade: string;
  dogruMu: boolean;
  aciklama: string;
};

const SORULAR: Soru[] = [
  {
    ifade: "Dünya'nın en büyük okyanusu Pasifik Okyanusu'dur.",
    dogruMu: true,
    aciklama: "Pasifik Okyanusu, yüzölçümü bakımından en büyük okyanustur.",
  },
  {
    ifade: "Türkiye'nin başkenti İstanbul'dur.",
    dogruMu: false,
    aciklama: "Türkiye'nin başkenti Ankara'dır.",
  },
  {
    ifade: "İnsan vücudundaki en büyük organ deridir.",
    dogruMu: true,
    aciklama: "Deri, yüzey alanı ve ağırlık açısından en büyük organdır.",
  },
  {
    ifade: "Güneş Sistemi'ndeki en büyük gezegen Mars'tır.",
    dogruMu: false,
    aciklama: "En büyük gezegen Jüpiter'dir.",
  },
  {
    ifade: "Bir yıl 365 gündür (artık yıllar hariç).",
    dogruMu: true,
    aciklama: "Artık yıllarda Şubat 29 çeker ve yıl 366 gün olur.",
  },
  {
    ifade: "Amazon Nehri Afrika kıtasındadır.",
    dogruMu: false,
    aciklama: "Amazon Nehri Güney Amerika kıtasındadır.",
  },
  {
    ifade: "Su, 0°C'de donar.",
    dogruMu: true,
    aciklama: "Standart atmosfer basıncında su 0°C'de donar.",
  },
  {
    ifade: "Türkiye'nin para birimi Euro'dur.",
    dogruMu: false,
    aciklama: "Türkiye'nin para birimi Türk Lirası'dır (₺).",
  },
  {
    ifade: "Fotosentez sırasında bitkiler oksijen üretir.",
    dogruMu: true,
    aciklama: "Fotosentez, karbondioksit ve suyu kullanarak oksijen üretir.",
  },
  {
    ifade: "Ekvator, Dünya'yı Kuzey ve Güney yarımkürelere ayırır.",
    dogruMu: true,
    aciklama: "Ekvator çizgisi, Dünya'nın en geniş enlem dairesidir.",
  },
];

const SURE = 10;

export default function DogruYanlisGame() {
  const [index, setIndex] = useState(0);
  const [puan, setPuan] = useState(0);
  const [seri, setSeri] = useState(0);
  const [kalan, setKalan] = useState(SURE);
  const [secim, setSecim] = useState<null | boolean>(null);
  const [sonuc, setSonuc] = useState<"bekle" | "dogru" | "yanlis">("bekle");

  const soru = SORULAR[index % SORULAR.length];

  const carpan = useMemo(() => {
    // 0-2: x1, 3-5: x2, 6-8: x3, 9+: x4
    if (seri >= 9) return 4;
    if (seri >= 6) return 3;
    if (seri >= 3) return 2;
    return 1;
  }, [seri]);

  useEffect(() => {
    if (sonuc !== "bekle") return;
    if (kalan <= 0) return;
    const id = window.setInterval(() => {
      setKalan((p) => Math.max(0, p - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [kalan, sonuc]);

  useEffect(() => {
    if (sonuc !== "bekle") return;
    if (kalan === 0) {
      setSonuc("yanlis");
      setSeri(0);
      setSecim(null);
    }
  }, [kalan, sonuc]);

  const sonraki = () => {
    setIndex((p) => p + 1);
    setKalan(SURE);
    setSecim(null);
    setSonuc("bekle");
  };

  const cevapla = (cevap: boolean) => {
    if (sonuc !== "bekle") return;
    setSecim(cevap);
    const dogru = cevap === soru.dogruMu;
    if (dogru) {
      setSonuc("dogru");
      setSeri((p) => p + 1);
      setPuan((p) => p + 10 * carpan);
    } else {
      setSonuc("yanlis");
      setSeri(0);
    }
  };

  const ilerleme = Math.round(((index + 1) / 10) * 100);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_0_45px_rgba(15,23,42,0.95)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.55),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.45),transparent_55%),radial-gradient(circle_at_40%_0,rgba(52,211,153,0.35),transparent_55%)]" />
        </div>

        {/* Üst */}
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Bilgi • Refleks • Hız
            </div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Doğru mu Yanlış mı?
            </h1>
            <p className="text-sm text-white/70">
              İfadeyi oku ve hızlıca doğru/yanlış karar ver.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              Puan: {puan}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Flame className="h-3.5 w-3.5 text-rose-300" />
              Seri: {seri} (x{carpan})
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
              {kalan} sn
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              Soru: {index + 1}/10
            </span>
          </div>
        </div>

        {/* İlerleme */}
        <div className="relative mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>İlerleme</span>
            <span className="font-semibold text-white/80">%{ilerleme}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-300 transition-all duration-300"
              style={{ width: `${ilerleme}%` }}
            />
          </div>
        </div>

        {/* İfade kartı */}
        <div className="relative mt-6 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
          <div
            className={`rounded-3xl bg-[#050816]/70 p-5 text-center text-lg font-semibold leading-snug shadow-[0_18px_45px_rgba(0,0,0,0.55)] ring-1 transition sm:text-xl ${
              sonuc === "dogru"
                ? "ring-emerald-400/70 shadow-[0_0_35px_rgba(52,211,153,0.35)]"
                : sonuc === "yanlis"
                  ? "shake ring-rose-400/70 shadow-[0_0_35px_rgba(244,63,94,0.35)]"
                  : "ring-white/10"
            }`}
          >
            {soru.ifade}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => cevapla(true)}
              disabled={sonuc !== "bekle"}
              className={`group inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-semibold transition active:scale-[0.98] ${
                sonuc === "bekle"
                  ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/20"
                  : secim === true
                    ? sonuc === "dogru"
                      ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
                      : "border-rose-400/60 bg-rose-500/20 text-rose-100"
                    : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <span className="text-xl">✅</span>
              Doğru
            </button>

            <button
              type="button"
              onClick={() => cevapla(false)}
              disabled={sonuc !== "bekle"}
              className={`group inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-base font-semibold transition active:scale-[0.98] ${
                sonuc === "bekle"
                  ? "border-rose-400/25 bg-rose-500/15 text-rose-100 hover:bg-rose-500/20"
                  : secim === false
                    ? sonuc === "dogru"
                      ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
                      : "border-rose-400/60 bg-rose-500/20 text-rose-100"
                    : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <span className="text-xl">❌</span>
              Yanlış
            </button>
          </div>

          {sonuc !== "bekle" && (
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/75 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Açıklama
              </p>
              <p className="mt-1">{soru.aciklama}</p>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={sonraki}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)]"
                >
                  Sonraki Soru
                </button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-4px);
            }
            75% {
              transform: translateX(4px);
            }
          }
          .shake {
            animation: shake 0.18s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}

