"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Heart, Sparkles, Trophy } from "lucide-react";

type Kelime = {
  kelime: string; // BÜYÜK HARF
  ipucu: string;
};

const KELIMELER: Kelime[] = [
  { kelime: "BİLGİSAYAR", ipucu: "Teknoloji • Cihaz" },
  { kelime: "MATEMATİK", ipucu: "Ders • Sayılar" },
  { kelime: "COĞRAFYA", ipucu: "Ders • Dünya" },
  { kelime: "KİTAPLIK", ipucu: "Ev • Eşya" },
  { kelime: "BULMACA", ipucu: "Zihin • Oyun" },
  { kelime: "EDEBİYAT", ipucu: "Ders • Metin" },
  { kelime: "ŞİMŞEK", ipucu: "Doğa • Hava" },
  { kelime: "ÖĞRETMEN", ipucu: "Okul • Meslek" },
  { kelime: "ÜNİVERSİTE", ipucu: "Okul • Seviye" },
  { kelime: "DOSTLUK", ipucu: "Duygu • İlişki" },
];

const TURKCE_KLAVYE = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const MAX_YANLIS = 6;
const SURE_SN = 60;

function harfler(kelime: string) {
  return Array.from(kelime);
}

function boslukOlmayanHarfSayisi(kelime: string) {
  return harfler(kelime).filter((c) => c !== " ").length;
}

export default function AdamAsmacaGame() {
  const [index, setIndex] = useState(0);
  const [tahminler, setTahminler] = useState<string[]>([]);
  const [yanlisSayisi, setYanlisSayisi] = useState(0);
  const [puan, setPuan] = useState(0);
  const [zamanModu, setZamanModu] = useState(true);
  const [kalanSure, setKalanSure] = useState(SURE_SN);
  const [durum, setDurum] = useState<"devam" | "kazandi" | "kaybetti">("devam");
  const [sonEylem, setSonEylem] = useState<"dogru" | "yanlis" | null>(null);
  const [konfeti, setKonfeti] = useState(false);
  const kelimeRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  const aktif = useMemo(() => KELIMELER[index % KELIMELER.length], [index]);
  const aktifHarfler = useMemo(() => harfler(aktif.kelime), [aktif.kelime]);

  const dogruTahminSeti = useMemo(() => {
    const s = new Set(tahminler);
    return s;
  }, [tahminler]);

  const acilanHarfSayisi = useMemo(() => {
    return aktifHarfler.filter((c) => c === " " || dogruTahminSeti.has(c))
      .length;
  }, [aktifHarfler, dogruTahminSeti]);

  const hedefHarfSayisi = useMemo(
    () => boslukOlmayanHarfSayisi(aktif.kelime),
    [aktif.kelime],
  );

  const kalanHak = MAX_YANLIS - yanlisSayisi;

  useEffect(() => {
    if (!zamanModu) return;
    if (durum !== "devam") return;
    if (kalanSure <= 0) return;

    const id = window.setInterval(() => {
      setKalanSure((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [zamanModu, durum, kalanSure]);

  useEffect(() => {
    if (!zamanModu) return;
    if (durum !== "devam") return;
    if (kalanSure === 0) {
      setDurum("kaybetti");
      setSonEylem("yanlis");
    }
  }, [zamanModu, durum, kalanSure]);

  useEffect(() => {
    if (durum !== "kazandi") return;
    setKonfeti(true);
    const id = window.setTimeout(() => setKonfeti(false), 1400);
    return () => window.clearTimeout(id);
  }, [durum]);

  const resetKelime = () => {
    setTahminler([]);
    setYanlisSayisi(0);
    setDurum("devam");
    setSonEylem(null);
    setKalanSure(SURE_SN);
  };

  const sonrakiKelime = () => {
    setIndex((prev) => prev + 1);
    resetKelime();
  };

  const harfSec = (harf: string) => {
    if (durum !== "devam") return;
    if (tahminler.includes(harf)) return;

    setTahminler((prev) => [...prev, harf]);

    const dogruMu = aktif.kelime.includes(harf);
    setSonEylem(dogruMu ? "dogru" : "yanlis");

    if (!dogruMu) {
      setYanlisSayisi((prev) => {
        const next = prev + 1;
        if (next >= MAX_YANLIS) {
          setDurum("kaybetti");
        }
        return next;
      });
      return;
    }

    // doğruysa kazandı mı kontrol et
    window.setTimeout(() => {
      const acikMi = harfler(aktif.kelime).every(
        (c) => c === " " || (new Set([...tahminler, harf])).has(c),
      );
      if (acikMi) {
        setDurum("kazandi");
        setPuan((prev) => prev + 10 + Math.max(0, kalanHak) * 2);
      }
    }, 0);
  };

  const parcaGoster = (parca: number) => yanlisSayisi >= parca;

  const ilerlemeYuzde = Math.round(
    (Math.min(acilanHarfSayisi, hedefHarfSayisi) / Math.max(hedefHarfSayisi, 1)) *
      100,
  );

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_0_45px_rgba(15,23,42,0.95)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.55),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(52,211,153,0.55),transparent_55%),radial-gradient(circle_at_55%_0,rgba(129,140,248,0.35),transparent_55%)]" />
        </div>

        {/* Üst */}
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              Kelime • Hafıza • Mantık
            </div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Adam Asmaca
            </h1>
            <p className="max-w-xl text-sm text-white/70">
              Gizli kelimeyi harf harf tahmin et. 6 yanlışta oyun biter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              Puan: {puan}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <span className="text-white/60">Kelime</span>{" "}
              <span className="font-bold text-sky-200">
                {index + 1}/{KELIMELER.length}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setZamanModu((p) => !p)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ring-1 transition ${
                zamanModu
                  ? "bg-sky-500/25 text-sky-100 ring-sky-400/50"
                  : "bg-white/5 text-white/70 ring-white/10 hover:bg-white/10"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Zaman modu {zamanModu ? "Açık" : "Kapalı"}
            </button>
            {zamanModu && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
                <Clock className="h-3.5 w-3.5 text-sky-300" />
                {kalanSure}s
              </span>
            )}
          </div>
        </div>

        {/* İlerleme + hak */}
        <div className="relative mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>İlerleme</span>
            <span className="font-semibold text-white/80">%{ilerlemeYuzde}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-300 transition-all duration-300"
              style={{ width: `${ilerlemeYuzde}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-white/60">Kalan hak</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: MAX_YANLIS }).map((_, i) => {
                const aktifKalp = i < kalanHak;
                return (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    className={`inline-flex items-center justify-center rounded-full p-1 ring-1 transition ${
                      aktifKalp
                        ? "bg-rose-500/15 ring-rose-400/40"
                        : "bg-white/5 ring-white/10 opacity-50"
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        aktifKalp ? "text-rose-300" : "text-white/40"
                      }`}
                      fill={aktifKalp ? "currentColor" : "none"}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orta */}
        <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* Kelime */}
          <div className="rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Gizli Kelime
              </p>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/10">
                İpucu: {aktif.ipucu}
              </span>
            </div>

            <div
              className={`flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-white/5 px-3 py-6 text-center transition ${
                sonEylem === "dogru"
                  ? "ring-1 ring-emerald-400/60"
                  : sonEylem === "yanlis"
                    ? "tremble ring-1 ring-rose-400/60"
                    : "ring-1 ring-white/10"
              }`}
            >
              {aktifHarfler.map((c, i) => {
                const acik = c === " " || dogruTahminSeti.has(c) || durum !== "devam";
                const yazi = c === " " ? " " : acik ? c : "•";
                return (
                  <span
                    key={`${c}-${i}`}
                    ref={(el) => {
                      kelimeRefs.current[i] = el;
                    }}
                    className={`inline-flex min-w-10 items-center justify-center rounded-2xl border px-3 py-2 text-2xl font-extrabold tracking-wide shadow-sm transition sm:min-w-12 sm:text-3xl ${
                      c === " "
                        ? "border-transparent bg-transparent"
                        : acik
                          ? sonEylem === "dogru"
                            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                            : "border-white/15 bg-white/5 text-white"
                          : "border-white/10 bg-black/30 text-white/40"
                    }`}
                  >
                    {yazi}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Çizim */}
          <div className="rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Adam
            </p>
            <div className="flex items-center justify-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <svg
                width="280"
                height="260"
                viewBox="0 0 280 260"
                className="drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]"
              >
                {/* iskelet */}
                <line x1="40" y1="235" x2="240" y2="235" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />
                <line x1="90" y1="235" x2="90" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />
                <line x1="90" y1="30" x2="180" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />
                <line x1="180" y1="30" x2="180" y2="60" stroke="rgba(255,255,255,0.35)" strokeWidth="6" strokeLinecap="round" />

                {/* kafa */}
                {parcaGoster(1) && (
                  <circle
                    cx="180"
                    cy="85"
                    r="22"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    fill="rgba(52,211,153,0.08)"
                  />
                )}
                {/* gövde */}
                {parcaGoster(2) && (
                  <line
                    x1="180"
                    y1="110"
                    x2="180"
                    y2="165"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                {/* sol kol */}
                {parcaGoster(3) && (
                  <line
                    x1="180"
                    y1="125"
                    x2="155"
                    y2="145"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                {/* sağ kol */}
                {parcaGoster(4) && (
                  <line
                    x1="180"
                    y1="125"
                    x2="205"
                    y2="145"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                {/* sol bacak */}
                {parcaGoster(5) && (
                  <line
                    x1="180"
                    y1="165"
                    x2="160"
                    y2="200"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                {/* sağ bacak */}
                {parcaGoster(6) && (
                  <line
                    x1="180"
                    y1="165"
                    x2="200"
                    y2="200"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Alt klavye */}
        <div className="relative mt-6 rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Harf Seç
            </p>
            <div className="flex items-center gap-2 text-[11px] text-white/60">
              <span>
                Yanlış:{" "}
                <span className="font-semibold text-rose-200">
                  {yanlisSayisi}/{MAX_YANLIS}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
            {TURKCE_KLAVYE.map((h) => {
              const secildi = tahminler.includes(h);
              const dogru = secildi && aktif.kelime.includes(h);
              const yanlis = secildi && !aktif.kelime.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => harfSec(h)}
                  disabled={secildi || durum !== "devam"}
                  className={`h-10 rounded-2xl border text-sm font-extrabold shadow-sm transition active:scale-[0.98] ${
                    !secildi && durum === "devam"
                      ? "border-white/10 bg-white/5 text-white hover:border-sky-400/60 hover:bg-white/10"
                      : dogru
                        ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100"
                        : yanlis
                          ? "border-rose-400/50 bg-rose-500/15 text-rose-100"
                          : "border-white/10 bg-white/5 text-white/40"
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={resetKelime}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 shadow-sm transition hover:bg-white/10"
            >
              Aynı Kelimeyi Yeniden Başlat
            </button>
            <button
              type="button"
              onClick={sonrakiKelime}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)]"
            >
              Sonraki Kelime
            </button>
          </div>
        </div>

        {/* Sonuç overlay */}
        {durum !== "devam" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#050816]/95 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/10 sm:p-6">
              <div className="space-y-3 text-center">
                <div className="text-4xl">
                  {durum === "kazandi" ? "🎉" : "😵"}
                </div>
                <h2 className="text-xl font-semibold">
                  {durum === "kazandi" ? "Tebrikler!" : "Oyun Bitti!"}
                </h2>
                <p className="text-sm text-white/70">
                  {durum === "kazandi"
                    ? "Kelimeyi doğru bildin. Yeni kelimeye geçmeye hazır mısın?"
                    : "Hakkın kalmadı. Doğru kelimeyi aşağıda görebilirsin."}
                </p>
                <div className="rounded-2xl bg-white/5 px-4 py-3 text-center text-lg font-extrabold tracking-widest text-sky-100 ring-1 ring-white/10">
                  {aktif.kelime}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={resetKelime}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    Tekrar Dene
                  </button>
                  <button
                    type="button"
                    onClick={sonrakiKelime}
                    className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)]"
                  >
                    Sonraki Kelime
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Konfeti */}
        {konfeti && (
          <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="confetti absolute top-0 h-3 w-1.5 rounded-full"
                style={{
                  left: `${(i * 7) % 100}%`,
                  background:
                    i % 3 === 0
                      ? "rgba(56,189,248,0.95)"
                      : i % 3 === 1
                        ? "rgba(52,211,153,0.95)"
                        : "rgba(129,140,248,0.95)",
                  animationDelay: `${(i % 7) * 40}ms`,
                }}
              />
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes tremble {
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
          .tremble {
            animation: tremble 0.18s ease-in-out;
          }
          @keyframes confetti {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(520px) rotate(360deg);
              opacity: 0;
            }
          }
          .confetti {
            animation: confetti 1.25s ease-in forwards;
          }
        `}</style>
      </div>
    </div>
  );
}

