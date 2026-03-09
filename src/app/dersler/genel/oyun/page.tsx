"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import RopeArena from "@/components/tugofwar/RopeArena";
import tugGif from "@/components/tugofwar/tugofwar.gif";
import QuizPanel, {
  type CoktanSecmeliSoru,
} from "@/components/tugofwar/QuizPanel";

const SORULAR: CoktanSecmeliSoru[] = [
  {
    soru: "Bu bayrak hangi ülkeye aittir? 🇳🇵",
    secenekler: ["Nepal", "Suudi Arabistan", "Brezilya", "Kıbrıs"],
    dogruIndeks: 0,
  },
  {
    soru: "Özbekistan Anayasası hangi ayda kabul edilmiştir?",
    secenekler: ["Ekim", "Aralık", "Kasım", "Eylül"],
    dogruIndeks: 1,
  },
  {
    soru: "Türkiye'nin başkenti neresidir?",
    secenekler: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    dogruIndeks: 1,
  },
  {
    soru: "Dünyanın en uzun nehri hangisidir?",
    secenekler: ["Nil", "Amazon", "Yangtze", "Fırat"],
    dogruIndeks: 0,
  },
];

const WIN_DIFF = 5;

export default function GenelBilgiHalatPage() {
  const router = useRouter();
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gameOver, setGameOver] = useState<"team1" | "team2" | null>(null);
  const [indexTeam1, setIndexTeam1] = useState(0);
  const [indexTeam2, setIndexTeam2] = useState(1);

  useEffect(() => {
    if (gameOver) return;
    const id = window.setInterval(
      () => setElapsedSeconds((prev) => prev + 1),
      1000,
    );
    return () => window.clearInterval(id);
  }, [gameOver]);

  const formattedTime = (() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  })();

  const ileriSoru = (takim: "team1" | "team2") => {
    if (takim === "team1") {
      setIndexTeam1((prev) => (prev + 2) % SORULAR.length);
    } else {
      setIndexTeam2((prev) => (prev + 2) % SORULAR.length);
    }
  };

  const handleAnswer = (takim: "team1" | "team2", dogru: boolean) => {
    if (gameOver) return;

    if (takim === "team1") {
      setTeam1Score((onceki) => {
        const yeni = dogru ? onceki + 1 : Math.max(0, onceki - 1);
        const diffNext = yeni - team2Score;
        if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
          setGameOver(diffNext >= 0 ? "team1" : "team2");
        }
        return yeni;
      });
      setTimeout(() => ileriSoru("team1"), 650);
    } else {
      setTeam2Score((onceki) => {
        const yeni = dogru ? onceki + 1 : Math.max(0, onceki - 1);
        const diffNext = team1Score - yeni;
        if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
          setGameOver(diffNext > 0 ? "team1" : "team2");
        }
        return yeni;
      });
      setTimeout(() => ileriSoru("team2"), 650);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F4FF] to-[#EEF2FF] text-slate-900 antialiased">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/oyunlar")}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#4F8CFF] hover:text-slate-800"
          >
            <span className="text-sm">←</span>
            <span>Oyunlara Dön</span>
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4F8CFF]">
              Halat Çekme: Genel Kültür
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              HALAT ÇEKME: GENEL KÜLTÜR
            </h1>
          </div>
        </header>

        <section className="flex items-center justify-between rounded-2xl bg-white/80 p-3 text-xs text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-2xl bg-[#DBEAFE] px-3 py-1 text-[11px] font-semibold text-slate-800">
              <span>Takım 1 Skor</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#2563EB]">
                {team1Score}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-[#FEE2E2] px-3 py-1 text-[11px] font-semibold text-slate-800">
              <span>Takım 2 Skor</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#DC2626]">
                {team2Score}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Süre: <span className="font-mono">{formattedTime}</span>
          </div>
        </section>

        <section className="grid gap-8 items-start justify-center md:grid-cols-2 lg:flex-1 lg:grid-cols-[minmax(320px,420px)_minmax(520px,700px)_minmax(320px,420px)]">
          <QuizPanel
            team="team1"
            teamName="Takım 1"
            color="blue"
            score={team1Score}
            question={SORULAR[indexTeam1]}
            onAnswer={(dogru) => handleAnswer("team1", dogru)}
          />

          <div className="order-1 flex justify-center md:order-1 md:col-span-2 lg:order-2 lg:col-span-1">
            <RopeArena
              team1Name="Takım 1"
              team2Name="Takım 2"
              team1Score={team1Score}
              team2Score={team2Score}
              winDiff={WIN_DIFF}
              gifSrc={tugGif}
            />
          </div>

          <QuizPanel
            team="team2"
            teamName="Takım 2"
            color="red"
            score={team2Score}
            question={SORULAR[indexTeam2]}
            onAnswer={(dogru) => handleAnswer("team2", dogru)}
          />
        </section>
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.6)] sm:p-7">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B] shadow-[0_10px_30px_rgba(245,158,11,0.5)]">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {gameOver === "team1" ? "Takım 1" : "Takım 2"}
                </h2>
                <p className="text-sm font-medium text-[#16A34A]">Kazandı!</p>
              </div>
              <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#F9FAFB] p-4 text-xs text-slate-600 ring-1 ring-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span>Skor farkı</span>
                  <span className="font-semibold text-slate-900">
                    {Math.abs(team1Score - team2Score)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Süre</span>
                  <span className="font-mono text-sm font-semibold">
                    {formattedTime}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTeam1Score(0);
                    setTeam2Score(0);
                    setElapsedSeconds(0);
                    setGameOver(null);
                    setIndexTeam1(0);
                    setIndexTeam2(1);
                  }}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(79,140,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,140,255,0.85)] sm:flex-none sm:px-6"
                >
                  Tekrar Oyna
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/oyunlar")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#4F8CFF] hover:text-slate-800 sm:flex-none sm:px-6"
                >
                  Oyunlara Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

