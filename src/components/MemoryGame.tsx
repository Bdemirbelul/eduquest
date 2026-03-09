"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Phase = "idle" | "memorize" | "play" | "win" | "lose";

type CellNumber = number | null;

const GRID_SIZE = 16;
const MAX_LEVEL = 10;
const BEST_SCORE_KEY = "eduquest_memory_best";

function calculateN(level: number): number {
  const extra = Math.floor(((level - 1) * 12) / 9);
  return Math.min(16, 4 + extra);
}

function generateMapping(level: number): CellNumber[] {
  const N = calculateN(level);
  const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const mapping: CellNumber[] = Array(GRID_SIZE).fill(null);

  for (let i = 0; i < N; i += 1) {
    const cellIndex = indices[i];
    mapping[cellIndex] = i + 1;
  }

  return mapping;
}

export default function MemoryGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [mapping, setMapping] = useState<CellNumber[]>(() =>
    generateMapping(1),
  );
  const [locked, setLocked] = useState<Set<number>>(() => new Set());
  const [currentTarget, setCurrentTarget] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [memorizeTimeLeft, setMemorizeTimeLeft] = useState(10);
  const [lastMistakeIndex, setLastMistakeIndex] = useState<number | null>(null);

  const N = useMemo(() => calculateN(level), [level]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        setBestScore(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (score <= 0) return;
    if (score <= bestScore) return;
    setBestScore(score);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (phase !== "memorize") return;
    if (memorizeTimeLeft <= 0) return;

    const id = window.setInterval(() => {
      setMemorizeTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("play");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [phase, memorizeTimeLeft]);

  const startLevel = (nextLevel: number, resetScore: boolean) => {
    const boundedLevel = Math.min(Math.max(nextLevel, 1), MAX_LEVEL);
    setLevel(boundedLevel);
    setMapping(generateMapping(boundedLevel));
    setLocked(new Set());
    setCurrentTarget(1);
    setLastMistakeIndex(null);
    setMemorizeTimeLeft(10);
    setPhase("memorize");
    if (resetScore) {
      setScore(0);
    }
  };

  const handleStart = () => {
    startLevel(1, true);
  };

  const handleReady = () => {
    if (phase !== "memorize") return;
    setPhase("play");
    setMemorizeTimeLeft(0);
  };

  const handleCellClick = (index: number) => {
    if (phase !== "play") return;
    if (locked.has(index)) return;

    const value = mapping[index];
    if (value === currentTarget) {
      const nextLocked = new Set(locked);
      nextLocked.add(index);
      setLocked(nextLocked);

      const gain = 10 * level;
      setScore((prev) => prev + gain);

      if (currentTarget >= N) {
        const bonus = 50 * level;
        setScore((prev) => prev + bonus);
        setPhase("win");
        return;
      }

      setCurrentTarget((prev) => prev + 1);
      return;
    }

    setLastMistakeIndex(index);
    setPhase("lose");
  };

  const handleRetry = () => {
    startLevel(1, true);
  };

  const handleNextLevel = () => {
    if (level >= MAX_LEVEL) {
      startLevel(1, true);
      return;
    }
    startLevel(level + 1, false);
  };

  const handleRestart = () => {
    startLevel(1, true);
  };

  const showWinAllLevels = phase === "win" && level === MAX_LEVEL;

  if (phase === "idle") {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-[#E0E7FF] bg-white/95 p-6 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Hafıza Oyunu
              </h1>
              <p className="text-sm text-slate-500 sm:text-[15px]">
                4x4 alanda sayıları ezberle, sonra 1&apos;den başlayarak sırayla
                bul.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl bg-[#F9FAFB] p-4 text-xs text-slate-600 ring-1 ring-[#E5E7EB] sm:grid-cols-2 sm:text-sm">
              <div>
                <p className="font-semibold text-slate-700">Nasıl oynanır?</p>
                <ul className="mt-1 space-y-1">
                  <li>• 4x4 karede bazı hücrelerde sayılar belirir.</li>
                  <li>• Önce sayıları ve yerlerini ezberle.</li>
                  <li>• Sonra 1&apos;den N&apos;e kadar doğru sırayla bul.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Puanlama</p>
                <ul className="mt-1 space-y-1">
                  <li>• Her doğru seçim: +10 × seviye</li>
                  <li>• Seviye sonu bonus: +50 × seviye</li>
                  <li>• Rekorun cihazında saklanır.</li>
                </ul>
              </div>
            </div>

            <div className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                <p>Hazırsan oyuna başlayabilirsin. İlk seviye ile başlar.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(79,140,255,0.7)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(79,140,255,0.85)]"
                >
                  Oyuna Başla
                </button>
                <div className="hidden items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-[11px] text-slate-500 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-[#A78BFA]" />
                  <span>Ses efektleri: Yakında</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-4 lg:gap-5 2xl:gap-6">
      <section className="rounded-3xl border border-[#E0E7FF] bg-white/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-5 2xl:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Hafıza Oyunu
            </h1>
            <p className="text-sm text-slate-500">
              Sayıları doğru sırayla hatırla ve bul.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Seviye
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {level} / {MAX_LEVEL}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Skor
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#34D399]">
                {score}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Rekor
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#F59E0B]">
                {bestScore}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Hedef
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#4F8CFF]">
                Şimdi {currentTarget}
                {". "}
                <span className="text-[10px] font-normal text-slate-400">
                  (Toplam {N})
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {phase === "memorize" && (
        <section className="rounded-3xl border border-[#DBEAFE] bg-white/90 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:px-5 sm:py-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Sayıları hatırla
              </p>
              <p className="text-[13px] text-slate-500">
                Hazır olunca Hazırım'a basabilirsin.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-semibold text-[#1D4ED8] shadow-[0_0_0_1px_rgba(191,219,254,1),0_10px_18px_rgba(15,23,42,0.08)]">
                {memorizeTimeLeft}
              </div>
              <button
                type="button"
                onClick={handleReady}
                className="rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_26px_rgba(79,140,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(79,140,255,0.7)]"
              >
                Hazırım
              </button>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5EDFF]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] transition-all duration-1000"
              style={{ width: `${(memorizeTimeLeft / 10) * 100}%` }}
            />
          </div>
        </section>
      )}

      <section className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5 2xl:gap-6">
        <div className="flex-1 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-5 2xl:p-6">
          <div className="mb-3 text-xs text-slate-500 sm:mb-4">
            <p>
              {phase === "memorize"
                ? "Sayıların yerini ezberle. Ardından sayıları doğru sırayla bul."
                : "Karelere sırayla tıkla ve 1'den N'e kadar doğru sayıları bul."}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-3 2xl:gap-4">
            {mapping.map((value, index) => {
              const isMemorizeVisible =
                phase === "memorize" && typeof value === "number";
              const isLocked = locked.has(index);
              const isCorrectFound = isLocked && phase !== "memorize";
              const isVisible = isMemorizeVisible || isCorrectFound;
              const isError =
                phase === "lose" && lastMistakeIndex === index && !isLocked;

              const baseClasses =
                "relative aspect-square rounded-3xl border border-[#E5E7EB] bg-white text-sm font-semibold flex items-center justify-center select-none cursor-pointer shadow-[0_16px_32px_rgba(15,23,42,0.06)] transition-all duration-150";

              const closedOverlay =
                "before:absolute before:inset-[3px] before:rounded-[1.25rem] before:bg-[radial-gradient(circle_at_0_0,rgba(79,140,255,0.12),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(167,139,250,0.16),transparent_55%)] before:opacity-70 before:transition-opacity before:duration-150";

              const stateClasses = isVisible
                ? isCorrectFound
                  ? "bg-gradient-to-br from-[#D1FAE5] via-[#BBF7D0] to-[#A7F3D0] text-emerald-900 border-[#6EE7B7] shadow-[0_0_32px_rgba(52,211,153,0.55)]"
                  : "bg-gradient-to-br from-[#DBEAFE] via-[#E0E7FF] to-[#EEF2FF] text-slate-900 border-[#BFDBFE] shadow-[0_0_28px_rgba(96,165,250,0.35)]"
                : "hover:border-[#4F8CFF] hover:shadow-[0_0_30px_rgba(79,140,255,0.4)]";

              const overlayVisibility = isVisible ? "before:opacity-0" : "";

              const disabled =
                phase !== "play" || isLocked || phase === "win" || phase === "lose";

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCellClick(index)}
                  disabled={disabled}
                  className={`${baseClasses} ${closedOverlay} ${overlayVisibility} ${stateClasses} ${
                    isLocked
                      ? "memory-pop"
                      : ""
                  } ${isError ? "memory-shake border-[#FB7185] bg-[#FFF1F2] shadow-[0_0_30px_rgba(251,113,133,0.55)]" : ""}`}
                >
                  {isVisible ? (
                    <span className="relative z-10 text-2xl font-extrabold tracking-tight text-slate-800">
                      {value}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 text-xs text-slate-600 lg:w-64 2xl:w-72">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Kurallar
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>• 4x4 gridde rastgele N kare sayıyla işaretlenir.</li>
              <li>• Ezberleme fazında tüm sayıları sırayla aklında tut.</li>
              <li>• Bulma fazında 1'den N'e doğru tıkla.</li>
              <li>• Yanlış karede oyun hemen biter.</li>
              <li>• Seviye yükseldikçe N artar ve skor katlanır.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#DBEAFE] bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-[#ECFEFF] p-4 shadow-[0_12px_28px_rgba(59,130,246,0.25)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
              Puanlama
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>
                • Doğru seçim:{" "}
                <span className="font-semibold text-[#34D399]">
                  +10 × seviye
                </span>
              </li>
              <li>
                • Seviye tamam:{" "}
                <span className="font-semibold text-[#34D399]">
                  +50 × seviye
                </span>
              </li>
              <li>• Rekor, cihazında saklanır (local).</li>
            </ul>
          </div>
        </div>
      </section>

      {(phase === "lose" || phase === "win") && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Hafıza Oyunu
                </p>
                {phase === "lose" && (
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Kaybettin!
                  </h2>
                )}
                {phase === "win" && !showWinAllLevels && (
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Seviye tamamlandı!
                  </h2>
                )}
                {showWinAllLevels && (
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Tebrikler! Tüm seviyeleri bitirdin 🎉
                  </h2>
                )}
              </div>

              <p className="text-sm text-slate-600">
                {phase === "lose"
                  ? "Yanlış kareyi seçtin. Dilersen aynı seviyeyi tekrar oynayabilir veya ana menüye dönebilirsin."
                  : showWinAllLevels
                    ? "Tüm hafıza seviyelerini başarıyla tamamladın. İstersen başa dönüp rekorunu geliştirebilirsin."
                    : "Tüm sayıları doğru sırayla buldun. Bir sonraki seviyeye geçmeye hazır mısın?"}
              </p>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F9FAFB] p-3 text-xs ring-1 ring-[#E5E7EB]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Seviye
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {level} / {MAX_LEVEL}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Skor
                  </p>
                  <p className="text-sm font-semibold text-[#34D399]">
                    {score}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Rekor
                  </p>
                  <p className="text-sm font-semibold text-[#F59E0B]">
                    {bestScore}
                  </p>
                </div>
                {phase === "lose" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Bulman Gereken
                    </p>
                    <p className="text-sm font-semibold text-[#FB7185]">
                      {currentTarget}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {phase === "lose" && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(79,140,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,140,255,0.75)] sm:flex-none sm:px-5"
                  >
                    Tekrar Dene
                  </button>
                )}
                {phase === "win" && !showWinAllLevels && (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(79,140,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,140,255,0.75)] sm:flex-none sm:px-5"
                  >
                    Sonraki Seviye
                  </button>
                )}
                {showWinAllLevels && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(79,140,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,140,255,0.75)] sm:flex-none sm:px-5"
                  >
                    Yeniden Başla
                  </button>
                )}
                <Link
                  href="/oyunlar"
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_0_24px_rgba(15,23,42,0.12)] transition-all duration-200 hover:border-[#4F8CFF] hover:text-slate-800 sm:flex-none sm:px-5"
                >
                  Ana Menü
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes memory-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }
        .memory-shake {
          animation: memory-shake 0.18s ease-in-out;
        }
        @keyframes memory-pop {
          0% {
            transform: scale(0.9);
          }
          60% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }
        .memory-pop {
          animation: memory-pop 0.22s ease-out;
        }
      `}</style>
    </div>
  );
}

