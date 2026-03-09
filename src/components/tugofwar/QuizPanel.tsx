"use client";

import { useEffect, useState } from "react";

export type CoktanSecmeliSoru = {
  soru: string;
  secenekler: string[];
  dogruIndeks: number;
};

type QuizPanelProps = {
  team: "team1" | "team2";
  teamName: string;
  color: "blue" | "red";
  score: number;
  question: CoktanSecmeliSoru | null;
  onAnswer: (isCorrect: boolean) => void;
};

const renkHaritasi = {
  blue: {
    etiketArka: "bg-[#DBEAFE]",
    etiketYazi: "text-[#2563EB]",
    baslik: "text-[#2563EB]",
  },
  red: {
    etiketArka: "bg-[#FEE2E2]",
    etiketYazi: "text-[#DC2626]",
    baslik: "text-[#DC2626]",
  },
};

export default function QuizPanel({
  team,
  teamName,
  color,
  score,
  question,
  onAnswer,
}: QuizPanelProps) {
  const [seciliIndeks, setSeciliIndeks] = useState<number | null>(null);
  const [sonuc, setSonuc] = useState<"bos" | "dogru" | "yanlis">("bos");

  useEffect(() => {
    setSeciliIndeks(null);
    setSonuc("bos");
  }, [question?.soru]);

  if (!question) {
    return (
      <div className="flex flex-col rounded-3xl bg-white p-4 shadow-md sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              renkHaritasi[color].baslik
            }`}
          >
            {teamName} ({team === "team1" ? "Mavi" : "Kırmızı"})
          </p>
          <span
            className={`rounded-full px-3 py-0.5 text-[11px] font-medium text-slate-800 ${renkHaritasi[color].etiketArka}`}
          >
            Skor: {score}
          </span>
        </div>
        <div className="mt-4 flex min-h-[110px] items-center justify-center rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-500">
          Soru yükleniyor...
        </div>
      </div>
    );
  }

  const handleClick = (indeks: number) => {
    if (seciliIndeks !== null) return;
    setSeciliIndeks(indeks);
    const dogru = indeks === question.dogruIndeks;
    setSonuc(dogru ? "dogru" : "yanlis");
    onAnswer(dogru);
  };

  const sinifSecenek = (indeks: number) => {
    const temel =
      "flex items-center gap-3 rounded-xl border px-3 py-4 text-left text-sm sm:text-base font-medium shadow-sm transition";

    if (sonuc === "bos") {
      return `${temel} bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-sky-400 cursor-pointer`;
    }

    const dogru = indeks === question.dogruIndeks;
    const secili = indeks === seciliIndeks;

    if (dogru) {
      return `${temel} bg-emerald-50 border-emerald-500 text-emerald-800 cursor-default`;
    }
    if (secili) {
      return `${temel} bg-red-50 border-red-500 text-red-800 cursor-default`;
    }
    return `${temel} bg-red-50 border-red-300 text-red-700 cursor-default`;
  };

  return (
    <div className="flex flex-col rounded-3xl bg-white p-4 shadow-[0_18px_42px_rgba(15,23,42,0.18)] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            renkHaritasi[color].baslik
          }`}
        >
          {teamName} ({team === "team1" ? "Mavi" : "Kırmızı"})
        </p>
        <span
          className={`rounded-full px-3 py-0.5 text-[11px] font-medium text-slate-800 ${renkHaritasi[color].etiketArka}`}
        >
          Skor: {score}
        </span>
      </div>

      <div className="mt-4 flex min-h-[110px] items-center justify-center rounded-2xl bg-slate-50 px-4 py-6 text-center text-xl font-semibold leading-snug text-slate-900">
        {question.soru}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {question.secenekler.map((secenek, indeks) => {
          const harf = String.fromCharCode(65 + indeks); // A, B, C, D
          return (
            <button
              key={secenek}
              type="button"
              onClick={() => handleClick(indeks)}
              className={sinifSecenek(indeks)}
              disabled={sonuc !== "bos"}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-800">
                {harf}
              </div>
              <span>{secenek}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

