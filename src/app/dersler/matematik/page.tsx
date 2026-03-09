"use client";

import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Operation = "add" | "sub" | "mul" | "div";

type Difficulty = "easy" | "medium" | "hard";

type MathSettings = {
  operations: Operation[];
  difficulty: Difficulty | null;
  team1Name: string;
  team2Name: string;
};

const STORAGE_KEY = "eduquest_math_settings";

const defaultSettings: MathSettings = {
  operations: ["add"],
  difficulty: "easy",
  team1Name: "Takım 1",
  team2Name: "Takım 2",
};

const operationOptions: { id: Operation; label: string; desc: string }[] = [
  { id: "add", label: "Toplama", desc: "2 + 3 = ?" },
  { id: "sub", label: "Çıkarma", desc: "5 - 2 = ?" },
  { id: "mul", label: "Çarpma", desc: "3 × 4 = ?" },
  { id: "div", label: "Bölme", desc: "8 ÷ 2 = ?" },
];

const difficultyOptions: { id: Difficulty; label: string; desc: string }[] = [
  {
    id: "easy",
    label: "Kolay",
    desc: "1 - 10 arası küçük sayılar.",
  },
  {
    id: "medium",
    label: "Orta",
    desc: "10 - 50 arası sayılar.",
  },
  {
    id: "hard",
    label: "Zor",
    desc: "50 - 200 arası sayılar.",
  },
];

export default function MathSettingsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState<MathSettings>(defaultSettings);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as MathSettings;
      setSettings({
        operations: parsed.operations?.length ? parsed.operations : ["add"],
        difficulty: parsed.difficulty ?? "easy",
        team1Name: parsed.team1Name || "Takım 1",
        team2Name: parsed.team2Name || "Takım 2",
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (!isCountingDown) return;
    if (countdown <= 0) {
      setIsCountingDown(false);
      router.push("/dersler/matematik/oyun");
      return;
    }

    const id = window.setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [isCountingDown, countdown, router]);

  const toggleOperation = (op: Operation) => {
    setSettings((prev) => {
      const exists = prev.operations.includes(op);
      if (exists) {
        const nextOps = prev.operations.filter((o) => o !== op);
        return {
          ...prev,
          operations: nextOps.length ? nextOps : [op],
        };
      }
      return { ...prev, operations: [...prev.operations, op] };
    });
  };

  const selectDifficulty = (d: Difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty: d }));
  };

  const handleTeamChange = (key: "team1Name" | "team2Name", value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 0 && !settings.operations.length) return;
    if (step === 1 && !settings.difficulty) return;
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStartGame = () => {
    const payload: MathSettings = {
      operations: settings.operations.length ? settings.operations : ["add"],
      difficulty: settings.difficulty ?? "easy",
      team1Name: settings.team1Name.trim() || "Takım 1",
      team2Name: settings.team2Name.trim() || "Takım 2",
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    setCountdown(5);
    setIsCountingDown(true);
  };

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Bir veya daha fazla işlem seç. Oyun boyunca sorular bu işlemlerden
            üretilecek.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {operationOptions.map((op) => {
              const active = settings.operations.includes(op.id);
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => toggleOperation(op.id)}
                  className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition-all duration-150 ${
                    active
                      ? "border-[#4F8CFF] bg-[#EFF6FF] shadow-[0_0_0_1px_rgba(79,140,255,0.4)]"
                      : "border-[#E5E7EB] bg-white hover:border-[#4F8CFF]/70"
                  }`}
                >
                  <span className="font-semibold text-slate-900">
                    {op.label}
                  </span>
                  <span className="text-xs text-slate-500">{op.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Zorluk seviyesini seç. Sayı aralıkları seviyeye göre değişir.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {difficultyOptions.map((d) => {
              const active = settings.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => selectDifficulty(d.id)}
                  className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition-all duration-150 ${
                    active
                      ? "border-[#A78BFA] bg-[#F5F3FF] shadow-[0_0_0_1px_rgba(167,139,250,0.45)]"
                      : "border-[#E5E7EB] bg-white hover:border-[#A78BFA]/70"
                  }`}
                >
                  <span className="font-semibold text-slate-900">
                    {d.label}
                  </span>
                  <span className="text-xs text-slate-500">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Takım adlarını belirle. Bu isimler oyun ekranında görünecek.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Takım 1 (Mavi)
            </p>
            <input
              value={settings.team1Name}
              onChange={(e) => handleTeamChange("team1Name", e.target.value)}
              className="h-10 w-full rounded-2xl border border-[#DBEAFE] bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]"
              placeholder="Takım 1"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Takım 2 (Kırmızı)
            </p>
            <input
              value={settings.team2Name}
              onChange={(e) => handleTeamChange("team2Name", e.target.value)}
              className="h-10 w-full rounded-2xl border border-[#FECACA] bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#FB7185] focus:ring-1 focus:ring-[#FB7185]"
              placeholder="Takım 2"
            />
          </div>
        </div>
      </div>
    );
  };

  const stepTitle =
    step === 0 ? "İşlemler" : step === 1 ? "Zorluk" : "Takımlar";

  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />

          <section className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-3xl rounded-3xl border border-[#E0E7FF] bg-white/95 p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.6)] sm:p-7 2xl:p-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#4F8CFF]">
                    TAKIMLARI HAZIRLA
                  </p>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    Matematik Halat Çekme Ayarları
                  </h1>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-[#F3F4FF] p-3 text-xs text-slate-600">
                  {["İşlemler", "Zorluk", "Takımlar"].map((label, index) => {
                    const active = step === index;
                    const completed = step > index;
                    return (
                      <div
                        key={label}
                        className="flex flex-1 items-center gap-2"
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                            active
                              ? "bg-[#4F8CFF] text-white shadow-[0_0_0_1px_rgba(191,219,254,1)]"
                              : completed
                                ? "bg-[#34D399]/90 text-white"
                                : "bg-white text-slate-400 shadow-sm"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="hidden flex-col sm:flex">
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                              active
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                          {active && (
                            <span className="text-[11px] text-slate-500">
                              Adım {index + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {stepTitle}
                  </h2>
                  {renderStepContent()}
                </div>

                <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p>
                      {step === 0 &&
                        "Birden fazla işlem seçebilirsin. Sorular karışık gelir."}
                      {step === 1 &&
                        "Zorluk arttıkça sayı aralığı genişler ve işlemler zorlaşır."}
                      {step === 2 &&
                        "Takım adları oyun ekranının üst kısmında görünecek."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300"
                      >
                        Geri
                      </button>
                    )}
                    {step < 2 && (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="rounded-2xl bg-[#4F8CFF] px-4 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(79,140,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(79,140,255,0.85)]"
                      >
                        İleri
                      </button>
                    )}
                    {step === 2 && (
                      <button
                        type="button"
                        onClick={handleStartGame}
                        className="rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(79,140,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(79,140,255,0.85)]"
                      >
                        Oyunu Başlat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isCountingDown && (
              <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-3xl border border-[#E5E7EB] bg-white p-6 text-center text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.55)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Oyun Başlıyor
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Oyun Başlıyor!
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Hazırlanın, birazdan ilk soru gelecek.
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EFF6FF] text-4xl font-bold text-[#4F8CFF] shadow-[0_0_0_1px_rgba(191,219,254,1),0_18px_40px_rgba(15,23,42,0.18)]">
                      {countdown}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

