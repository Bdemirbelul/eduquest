"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Flag, User } from "lucide-react";

type Question = {
  id: number;
  countryCode: string;
  nameTr: string;
  options: string[];
};

const BASE_QUESTIONS: Question[] = [
  {
    id: 1,
    countryCode: "DK",
    nameTr: "Danimarka",
    options: ["Karadağ", "Fildişi Sahili", "Yeşil Burun", "Danimarka"],
  },
  {
    id: 2,
    countryCode: "NP",
    nameTr: "Nepal",
    options: ["Nepal", "Suudi Arabistan", "Brezilya", "Kıbrıs"],
  },
  {
    id: 3,
    countryCode: "BR",
    nameTr: "Brezilya",
    options: ["Meksika", "Brezilya", "Hindistan", "Bangladeş"],
  },
  {
    id: 4,
    countryCode: "JP",
    nameTr: "Japonya",
    options: ["Japonya", "Güney Kore", "Çin", "Endonezya"],
  },
];

function buildQuestions(total: number): Question[] {
  if (total <= BASE_QUESTIONS.length) {
    return BASE_QUESTIONS.slice(0, total);
  }
  const result: Question[] = [];
  for (let i = 0; i < total; i += 1) {
    const base = BASE_QUESTIONS[i % BASE_QUESTIONS.length];
    result.push({ ...base, id: i + 1 });
  }
  return result;
}

type Screen = "setup" | "play" | "results";

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🏳️";
  const upper = code.toUpperCase();
  const A_CODE = "A".charCodeAt(0);
  const REGIONAL_INDICATOR_A = 0x1f1e6;

  const chars = upper.split("");
  if (chars.some((ch) => ch < "A" || ch > "Z")) {
    return "🏳️";
  }

  const codePoints = chars.map(
    (ch) => REGIONAL_INDICATOR_A + (ch.charCodeAt(0) - A_CODE),
  );
  return String.fromCodePoint(...codePoints);
}

export default function FlagQuizGame() {
  const router = useRouter();
  const TIME_PER_QUESTION = 5;
  const [screen, setScreen] = useState<Screen>("setup");
  const [playerName, setPlayerName] = useState("Demirkan");
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions(20),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );

  const currentQuestion = questions[currentIndex];

  const primaryProgress = useMemo(() => {
    if (!totalQuestions || screen !== "play") return 0;
    return Math.min(
      100,
      (currentIndex / Math.max(totalQuestions, 1)) * 100,
    );
  }, [currentIndex, screen, totalQuestions]);

  const timeProgress = useMemo(() => {
    if (screen !== "play") return 100;
    return Math.max(
      0,
      Math.min(100, (timeLeft / Math.max(TIME_PER_QUESTION, 1)) * 100),
    );
  }, [screen, timeLeft, TIME_PER_QUESTION]);

  useEffect(() => {
    if (screen !== "play") return;
    if (timeLeft <= 0) return;

    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [screen, timeLeft]);

  useEffect(() => {
    if (screen !== "play") return;
    if (timeLeft === 0 && !selectedAnswer && currentQuestion) {
      setAnswerState("wrong");
      setStreak(0);
      window.setTimeout(() => {
        goToNextQuestion();
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen]);

  const startGame = (count: number) => {
    const prepared = buildQuestions(count);
    setTotalQuestions(count);
    setQuestions(prepared);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setAnswerState("idle");
    setScreen("play");
  };

  const goToNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      setScreen("results");
      return;
    }
    setCurrentIndex(nextIndex);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  const handleAnswerClick = (option: string) => {
    if (screen !== "play") return;
    if (!currentQuestion) return;
    if (selectedAnswer) return;

    setSelectedAnswer(option);
    const isCorrect = option === currentQuestion.nameTr;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setAnswerState("correct");
    } else {
      setStreak(0);
      setAnswerState("wrong");
    }

    setTimeout(() => {
      goToNextQuestion();
    }, 700);
  };

  const resetToSetup = () => {
    setScreen("setup");
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setAnswerState("idle");
  };

  const renderSetup = () => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/oyunlar")}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-sky-400 hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Go back</span>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-600 text-3xl text-white shadow-lg">
          <Flag className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-[1.7rem]">
            Bayrakları Bul!
          </h1>
          <p className="text-sm text-slate-600">
            Ülkelerin bayraklarını ne kadar iyi biliyorsun? Soru sayısını seç
            ve hemen başla!
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-700 shadow-sm">
        <span className="text-base">🏆</span>
        <span>
          Rekor: <span className="font-bold">17</span>
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          Soru sayısı
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          İsmin
        </label>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <User className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="İsmini yaz"
            className="flex-1 border-none bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Oyun başlamadan önce ismini yaz.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { count: 20, label: "Hızlı oyun" },
          { count: 30, label: "Orta" },
          { count: 50, label: "Uzun oyun" },
          { count: 200, label: "Maraton" },
        ].map((item) => (
          <button
            key={item.count}
            type="button"
            onClick={() => startGame(item.count)}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-slate-200 bg-white py-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500 hover:shadow-lg active:translate-y-0"
          >
            <span className="text-4xl font-bold text-sky-600">
              {item.count}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlay = () => {
    if (!currentQuestion) return null;

    const answered = !!selectedAnswer;

    const optionClass = (option: string) => {
      if (!answered) {
        return "rounded-xl border px-3 py-4 text-left text-sm sm:text-lg font-medium text-slate-700 bg-white transition hover:bg-sky-50 hover:border-sky-400 active:scale-[0.98]";
      }

      const isCorrect = option === currentQuestion.nameTr;
      const isSelected = option === selectedAnswer;

      if (isCorrect) {
        return "rounded-xl border px-3 py-4 text-left text-sm sm:text-lg font-medium text-emerald-800 bg-emerald-50 border-emerald-500 shadow-sm";
      }

      if (isSelected) {
        return "rounded-xl border px-3 py-4 text-left text-sm sm:text-lg font-medium text-red-800 bg-red-50 border-red-500 shadow-sm";
      }

      return "rounded-xl border px-3 py-4 text-left text-sm sm:text-lg font-medium text-red-700 bg-red-50 border-red-300";
    };

    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Bayrakları Bul!
            </p>
            <p className="text-xs text-slate-500">
              Bol şans{playerName ? `, ${playerName}` : ""}!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <span>🎯</span>
              <span>
                {score} / {totalQuestions}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${primaryProgress}%` }}
            />
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200/60">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-300"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
              <span>⏱</span>
              <span>{timeLeft} sn</span>
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="mx-auto flex min-h-[220px] items-center justify-center">
              <div className="text-[96px] leading-none sm:text-[120px] lg:text-[140px]">
                {flagEmoji(currentQuestion.countryCode)}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Bu bayrak hangi ülkeye ait?
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswerClick(option)}
                  className={optionClass(option)}
                  disabled={answered}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <button
        type="button"
        onClick={resetToSetup}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-sky-400 hover:text-slate-900"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to setup</span>
      </button>

      <div className="rounded-3xl bg-white p-6 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
          🏁
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Tebrikler{playerName ? `, ${playerName}` : ""}!
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Toplam{" "}
          <span className="font-semibold">
            {score} / {totalQuestions}
          </span>{" "}
          doğru cevap verdin.
        </p>

        <div className="mt-4 flex justify-center gap-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 px-4 py-2">
            <span className="font-semibold">En iyi seri: </span>
            <span>{streak}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={resetToSetup}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 hover:shadow-lg"
          >
            Tekrar oyna
          </button>
          <button
            type="button"
            onClick={() => router.push("/oyunlar")}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-slate-900"
          >
            Oyunlara dön
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col rounded-3xl bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.5)] sm:p-6 lg:p-8">
      {screen === "setup" && renderSetup()}
      {screen === "play" && renderPlay()}
      {screen === "results" && renderResults()}
    </div>
  );
}

