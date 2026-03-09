"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import RopeArena from "@/components/tugofwar/RopeArena";
import tugGif from "@/components/tugofwar/tugofwar.gif";

type Operation = "add" | "sub" | "mul" | "div";
type Difficulty = "easy" | "medium" | "hard";

type MathSettings = {
  operations: Operation[];
  difficulty: Difficulty | null;
  team1Name: string;
  team2Name: string;
};

const STORAGE_KEY = "eduquest_math_settings";

type Question = {
  text: string;
  op: Operation;
  answer: number;
};

function getRangeForDifficulty(diff: Difficulty | null): [number, number] {
  if (diff === "medium") return [10, 50];
  if (diff === "hard") return [50, 200];
  return [1, 10];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(settings: MathSettings): Question {
  const operations =
    settings.operations && settings.operations.length
      ? settings.operations
      : ["add"];
  const op = operations[randomInt(0, operations.length - 1)];
  const [min, max] = getRangeForDifficulty(settings.difficulty ?? "easy");

  let a = randomInt(min, max);
  let b = randomInt(min, max);

  if (op === "div") {
    b = randomInt(min, Math.max(min, 10));
    const factor = randomInt(1, Math.max(2, Math.floor(max / Math.max(b, 1))));
    a = b * factor;
  }

  let answer: number;
  switch (op) {
    case "add":
      answer = a + b;
      break;
    case "sub":
      answer = a - b;
      break;
    case "mul":
      answer = a * b;
      break;
    case "div":
      answer = a / b;
      break;
    default:
      answer = a + b;
  }

  const symbol =
    op === "add" ? "+" : op === "sub" ? "-" : op === "mul" ? "×" : "÷";

  const text = `${a} ${symbol} ${b} = ?`;

  return { text, op, answer };
}

function generateTwoQuestions(settings: MathSettings): {
  q1: Question;
  q2: Question;
} {
  const first = generateQuestion(settings);
  let second = generateQuestion(settings);
  let attempts = 0;

  while (second.text === first.text && attempts < 5) {
    second = generateQuestion(settings);
    attempts += 1;
  }

  return { q1: first, q2: second };
}

export default function MathGamePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<MathSettings>({
    operations: ["add"],
    difficulty: "easy",
    team1Name: "Takım 1",
    team2Name: "Takım 2",
  });
  const [questionTeam1, setQuestionTeam1] = useState<Question | null>(null);
  const [questionTeam2, setQuestionTeam2] = useState<Question | null>(null);
  const [team1Answer, setTeam1Answer] = useState("");
  const [team2Answer, setTeam2Answer] = useState("");
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [feedbackTeam1, setFeedbackTeam1] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [feedbackTeam2, setFeedbackTeam2] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [team1Error, setTeam1Error] = useState("");
  const [team2Error, setTeam2Error] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gameOver, setGameOver] = useState<"team1" | "team2" | null>(null);

  const WIN_DIFF = 5;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const { q1, q2 } = generateTwoQuestions(settings);
      setQuestionTeam1(q1);
      setQuestionTeam2(q2);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as MathSettings;
      const merged: MathSettings = {
        operations: parsed.operations?.length ? parsed.operations : ["add"],
        difficulty: parsed.difficulty ?? "easy",
        team1Name: parsed.team1Name || "Takım 1",
        team2Name: parsed.team2Name || "Takım 2",
      };
      setSettings(merged);
      const { q1, q2 } = generateTwoQuestions(merged);
      setQuestionTeam1(q1);
      setQuestionTeam2(q2);
    } catch {
      const { q1, q2 } = generateTwoQuestions(settings);
      setQuestionTeam1(q1);
      setQuestionTeam2(q2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [gameOver]);

  const handleDigit = (team: "left" | "right", digit: string) => {
    if (gameOver) return;
    if (team === "left") {
      setTeam1Answer((prev) =>
        prev.length < 5 ? (prev === "0" ? digit : prev + digit) : prev,
      );
    } else {
      setTeam2Answer((prev) =>
        prev.length < 5 ? (prev === "0" ? digit : prev + digit) : prev,
      );
    }
  };

  const handleDelete = (team: "left" | "right") => {
    if (gameOver) return;
    if (team === "left") {
      setTeam1Answer((prev) => prev.slice(0, -1));
    } else {
      setTeam2Answer((prev) => prev.slice(0, -1));
    }
  };

  const submitAnswer = (team: "left" | "right") => {
    if (gameOver) return;
    const question = team === "left" ? questionTeam1 : questionTeam2;
    if (!question) return;
    const raw = team === "left" ? team1Answer : team2Answer;
    if (!raw || raw.trim() === "") {
      if (team === "left") {
        setTeam1Error("Lütfen bir cevap gir.");
      } else {
        setTeam2Error("Lütfen bir cevap gir.");
      }
      return;
    }
    if (team === "left") {
      setTeam1Error("");
    } else {
      setTeam2Error("");
    }
    const val = Number.parseInt(raw, 10);
    const correct = val === question.answer;
    if (correct) {
      if (team === "left") {
        setTeam1Score((prev) => {
          const next = prev + 1;
          const diffNext = next - team2Score;
          if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
            setGameOver(diffNext >= 0 ? "team1" : "team2");
          }
          return next;
        });
        setFeedbackTeam1("correct");
        window.setTimeout(() => {
          setFeedbackTeam1("idle");
        }, 1500);
        setQuestionTeam1(() => {
          let next = generateQuestion(settings);
          let attempts = 0;
          while (
            questionTeam2 &&
            next.text === questionTeam2.text &&
            attempts < 5
          ) {
            next = generateQuestion(settings);
            attempts += 1;
          }
          return next;
        });
      } else {
        setTeam2Score((prev) => {
          const next = prev + 1;
          const diffNext = team1Score - next;
          if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
            setGameOver(diffNext > 0 ? "team1" : "team2");
          }
          return next;
        });
        setFeedbackTeam2("correct");
        window.setTimeout(() => {
          setFeedbackTeam2("idle");
        }, 1500);
        setQuestionTeam2(() => {
          let next = generateQuestion(settings);
          let attempts = 0;
          while (
            questionTeam1 &&
            next.text === questionTeam1.text &&
            attempts < 5
          ) {
            next = generateQuestion(settings);
            attempts += 1;
          }
          return next;
        });
      }
    } else {
      if (team === "left") {
        setTeam1Score((prev) => {
          const next = Math.max(0, prev - 1);
          const diffNext = next - team2Score;
          if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
            setGameOver(diffNext >= 0 ? "team1" : "team2");
          }
          return next;
        });
        setFeedbackTeam1("wrong");
        window.setTimeout(() => {
          setFeedbackTeam1("idle");
        }, 1500);
        setQuestionTeam1(() => {
          let next = generateQuestion(settings);
          let attempts = 0;
          while (
            questionTeam2 &&
            next.text === questionTeam2.text &&
            attempts < 5
          ) {
            next = generateQuestion(settings);
            attempts += 1;
          }
          return next;
        });
      } else {
        setTeam2Score((prev) => {
          const next = Math.max(0, prev - 1);
          const diffNext = team1Score - next;
          if (!gameOver && Math.abs(diffNext) >= WIN_DIFF) {
            setGameOver(diffNext > 0 ? "team1" : "team2");
          }
          return next;
        });
        setFeedbackTeam2("wrong");
        window.setTimeout(() => {
          setFeedbackTeam2("idle");
        }, 1500);
        setQuestionTeam2(() => {
          let next = generateQuestion(settings);
          let attempts = 0;
          while (
            questionTeam1 &&
            next.text === questionTeam1.text &&
            attempts < 5
          ) {
            next = generateQuestion(settings);
            attempts += 1;
          }
          return next;
        });
      }
    }
    if (team === "left") {
      setTeam1Answer("");
    } else {
      setTeam2Answer("");
    }
  };

  const keypadButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const formattedTime = (() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  })();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F4FF] to-[#EEF2FF] text-slate-900 antialiased">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/dersler/matematik")}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#4F8CFF] hover:text-slate-800"
          >
            <span className="text-sm">←</span>
            <span>Ayarlara Dön</span>
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4F8CFF]">
              Halat Çekme: Matematik
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              HALAT ÇEKME: MATEMATİK
            </h1>
          </div>
        </header>

        <section className="flex items-center justify-between rounded-2xl bg-white/80 p-3 text-xs text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-2xl bg-[#DBEAFE] px-3 py-1 text-[11px] font-semibold text-slate-800">
              <span>{settings.team1Name} Skor</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#2563EB]">
                {team1Score}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-[#FEE2E2] px-3 py-1 text-[11px] font-semibold text-slate-800">
              <span>{settings.team2Name} Skor</span>
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
          <div className="order-2 flex flex-col rounded-3xl bg-white p-4 shadow-[0_18px_42px_rgba(37,99,235,0.18)] sm:p-5 md:order-2 lg:order-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                {settings.team1Name} (Mavi)
              </p>
              <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {settings.team1Name}
              </span>
            </div>
            <div
              className={`mt-4 flex min-h-[110px] items-center justify-center rounded-2xl px-4 py-6 text-center text-[32px] font-extrabold leading-tight text-slate-900 shadow-md sm:text-[38px] lg:text-[44px] ${
                feedbackTeam1 === "correct"
                  ? "bg-[#DCFCE7] shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_0_34px_rgba(34,197,94,0.45)]"
                  : feedbackTeam1 === "wrong"
                    ? "tug-shake bg-[#FEE2E2] shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_0_34px_rgba(239,68,68,0.55)]"
                    : "bg-[#DBEAFE]"
              }`}
            >
              {questionTeam1 ? questionTeam1.text : "Yükleniyor..."}
            </div>
            {feedbackTeam1 === "correct" && (
              <div className="mt-2 inline-flex items-center self-start rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
                Doğru!
              </div>
            )}
            {feedbackTeam1 === "wrong" && (
              <div className="mt-2 inline-flex items-center self-start rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
                Yanlış!
              </div>
            )}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold">Cevap:</span>
              <div className="flex h-16 min-w-[96px] items-center justify-center rounded-xl bg-white/90 px-3 shadow-inner">
                <span className="font-mono text-3xl font-bold leading-none text-slate-900">
                  {team1Answer || "—"}
                </span>
              </div>
            </div>
            {team1Error && (
              <p className="mt-1 text-[11px] text-[#B91C1C]">{team1Error}</p>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {keypadButtons.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleDigit("left", k)}
                  className="h-10 rounded-2xl bg-[#EFF6FF] text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#DBEAFE]"
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleDelete("left")}
                className="h-10 rounded-2xl bg-[#FEE2E2] text-sm font-semibold text-[#DC2626] shadow-sm transition hover:bg-[#FCA5A5]"
              >
                Sil
              </button>
              <button
                type="button"
                onClick={() => submitAnswer("left")}
                className="col-span-2 h-10 rounded-2xl bg-gradient-to-r from-[#4F8CFF] to-[#34D399] text-sm font-semibold text-white shadow-[0_10px_26px_rgba(79,140,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(79,140,255,0.85)]"
              >
                Onayla
              </button>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-1 md:col-span-2 lg:order-2 lg:col-span-1">
            <RopeArena
              team1Name={settings.team1Name}
              team2Name={settings.team2Name}
              team1Score={team1Score}
              team2Score={team2Score}
              winDiff={WIN_DIFF}
              gifSrc={tugGif}
            />
          </div>

          <div className="order-3 flex flex-col rounded-3xl bg-white p-4 shadow-[0_18px_42px_rgba(248,113,113,0.18)] sm:p-5 md:order-3 lg:order-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DC2626]">
                {settings.team2Name} (Kırmızı)
              </p>
              <span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {settings.team2Name}
              </span>
            </div>
            <div
              className={`mt-4 flex min-h-[110px] items-center justify-center rounded-2xl px-4 py-6 text-center text-[32px] font-extrabold leading-tight text-slate-900 shadow-md sm:text-[38px] lg:text-[44px] ${
                feedbackTeam2 === "correct"
                  ? "bg-[#DCFCE7] shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_0_34px_rgba(34,197,94,0.45)]"
                  : feedbackTeam2 === "wrong"
                    ? "tug-shake bg-[#FEE2E2] shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_0_34px_rgba(239,68,68,0.55)]"
                    : "bg-[#FEE2E2]"
              }`}
            >
              {questionTeam2 ? questionTeam2.text : "Yükleniyor..."}
            </div>
            {feedbackTeam2 === "correct" && (
              <div className="mt-2 inline-flex items-center self-start rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
                Doğru!
              </div>
            )}
            {feedbackTeam2 === "wrong" && (
              <div className="mt-2 inline-flex items-center self-start rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
                Yanlış!
              </div>
            )}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3 text-sm text-slate-600">
              <span className="font-semibold">Cevap:</span>
              <div className="flex h-16 min-w-[96px] items-center justify-center rounded-xl bg-white/90 px-3 shadow-inner">
                <span className="font-mono text-3xl font-bold leading-none text-slate-900">
                  {team2Answer || "—"}
                </span>
              </div>
            </div>
            {team2Error && (
              <p className="mt-1 text-[11px] text-[#B91C1C]">{team2Error}</p>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {keypadButtons.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleDigit("right", k)}
                  className="h-10 rounded-2xl bg-[#FEE2E2] text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#FCA5A5]"
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleDelete("right")}
                className="h-10 rounded-2xl bg-[#E5E7EB] text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-[#D1D5DB]"
              >
                Sil
              </button>
              <button
                type="button"
                onClick={() => submitAnswer("right")}
                className="col-span-2 h-10 rounded-2xl bg-gradient-to-r from-[#FB7185] to-[#F97316] text-sm font-semibold text-white shadow-[0_10px_26px_rgba(248,113,113,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(248,113,113,0.85)]"
              >
                Onayla
              </button>
            </div>
          </div>
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
                  {gameOver === "team1"
                    ? settings.team1Name
                    : settings.team2Name}
                </h2>
                <p className="text-sm font-medium text-[#16A34A]">Kazandı!</p>
              </div>
              <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#F9FAFB] p-4 text-xs text-slate-600 ring-1 ring-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span>Doğru sayısı</span>
                  <span className="font-semibold text-slate-900">
                    {gameOver === "team1" ? team1Score : team2Score}
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
                    setTeam1Answer("");
                    setTeam2Answer("");
                    setTeam1Error("");
                    setTeam2Error("");
                    setFeedbackTeam1("idle");
                    setFeedbackTeam2("idle");
                    const { q1, q2 } = generateTwoQuestions(settings);
                    setQuestionTeam1(q1);
                    setQuestionTeam2(q2);
                    setElapsedSeconds(0);
                    setGameOver(null);
                  }}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-[#4F8CFF] via-[#A78BFA] to-[#34D399] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(79,140,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(79,140,255,0.85)] sm:flex-none sm:px-6"
                >
                  Tekrar Oyna
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dersler/matematik")}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#4F8CFF] hover:text-slate-800 sm:flex-none sm:px-6"
                >
                  Ayarlara Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes tug-shake {
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
        .tug-shake {
          animation: tug-shake 0.18s ease-in-out;
        }
      `}</style>
    </main>
  );
}

