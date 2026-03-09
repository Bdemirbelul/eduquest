"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Lightbulb, Sparkles, Target, Trophy } from "lucide-react";
import {
  type CrosswordDifficulty,
  type CrosswordWordEntry,
} from "@/data/crosswordWords";
import {
  generateCrossword,
  type GeneratedPuzzle,
  type PlacedWord,
} from "@/lib/crosswordGenerator";

type LevelStats = {
  level: number;
  difficulty: CrosswordDifficulty;
  score: number;
  elapsedSeconds: number;
  hints: number;
};

type GameState = "playing" | "completed";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function difficultyLabel(d: CrosswordDifficulty) {
  if (d === "easy") return "Kolay";
  if (d === "medium") return "Orta";
  return "Zor";
}

function pickDifficultyForLevel(level: number): CrosswordDifficulty {
  if (level <= 3) return "easy";
  if (level <= 6) return "medium";
  return "hard";
}

export default function CrosswordBulmacaGame() {
  const [level, setLevel] = useState(1);
  const [puzzle, setPuzzle] = useState<GeneratedPuzzle | null>(null);
  const [state, setState] = useState<GameState>("playing");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastCorrectWord, setLastCorrectWord] = useState<string | null>(null);
  const [lastClick, setLastClick] = useState<{ key: string; time: number } | null>(null);
  const [result, setResult] = useState<LevelStats | null>(null);

  const effectiveDifficulty = useMemo(
    () => pickDifficultyForLevel(level),
    [level],
  );

  const loadPuzzle = () => {
    const yeni = generateCrossword(level, effectiveDifficulty);
    setPuzzle(yeni);
    setSelectedWordId(yeni.words[0]?.id ?? null);
    setFilled({});
    setSolved(new Set());
    setInput("");
    setMessage(null);
    setMessageError(false);
    setElapsed(0);
    setTimerRunning(true);
    setHintsUsed(0);
    setState("playing");
    setLastCorrectWord(null);
    setResult(null);
  };

  useEffect(() => {
    loadPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, effectiveDifficulty]);

  useEffect(() => {
    if (!timerRunning || state !== "playing") return;
    const id = window.setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, state]);

  const activeWord: PlacedWord | null = useMemo(() => {
    if (!puzzle || !selectedWordId) return null;
    return (
      puzzle.words.find((w) => w.id === selectedWordId) ?? puzzle.words[0] ?? null
    );
  }, [puzzle, selectedWordId]);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const activeWordCells = useMemo(() => {
    if (!activeWord) return [];
    const len = activeWord.answer.length;
    const cells = [];
    for (let i = 0; i < len; i += 1) {
      const r = activeWord.row + (activeWord.direction === "down" ? i : 0);
      const c = activeWord.col + (activeWord.direction === "across" ? i : 0);
      cells.push({ r, c, key: cellKey(r, c) });
    }
    return cells;
  }, [activeWord]);

  const completionPercent = useMemo(() => {
    if (!puzzle) return 0;
    let totalLetters = 0;
    let correctLetters = 0;
    for (let r = 0; r < puzzle.size; r += 1) {
      for (let c = 0; c < puzzle.size; c += 1) {
        const solution = puzzle.grid[r][c];
        if (!solution) continue;
        totalLetters += 1;
        const k = cellKey(r, c);
        if (filled[k] === solution) correctLetters += 1;
      }
    }
    if (!totalLetters) return 0;
    return Math.round((correctLetters / totalLetters) * 100);
  }, [puzzle, filled]);

  const setMessageWithStyle = (msg: string, isError: boolean) => {
    setMessage(msg);
    setMessageError(isError);
  };

  const handleCheck = () => {
    if (!activeWord || !puzzle) return;
    const normalized = input
      .trim()
      .replace(/\s+/g, "")
      .toLocaleUpperCase("tr-TR");
    if (!normalized) return;

    const correctAnswer = activeWord.answer;
    if (normalized === correctAnswer) {
      const len = correctAnswer.length;
      setFilled((prev) => {
        const copy = { ...prev };
        for (let i = 0; i < len; i += 1) {
          const r =
            activeWord.row + (activeWord.direction === "down" ? i : 0);
          const c =
            activeWord.col + (activeWord.direction === "across" ? i : 0);
          copy[cellKey(r, c)] = correctAnswer[i];
        }
        return copy;
      });
      setSolved((prev) => new Set(prev).add(activeWord.id));
      setLastCorrectWord(activeWord.id);
      setTimeout(() => setLastCorrectWord(null), 700);

      // Skor: +20 temel, hızlı cevap +10, hiç ipucu kullanmadıysa +5
      let kazanilan = 20;
      if (elapsed < 90) kazanilan += 10;
      if (hintsUsed === 0) kazanilan += 5;
      setScore((prev) => prev + kazanilan);
      setMessageWithStyle(`Doğru! +${kazanilan} puan`, false);
      setInput("");

      // tüm kelimeler çözüldü mü?
      const yeniSolved = new Set(solved).add(activeWord.id);
      const tumCozuldu = puzzle.words.every((w) => yeniSolved.has(w.id));
      if (tumCozuldu) {
        setState("completed");
        setTimerRunning(false);
        setResult({
          level,
          difficulty: effectiveDifficulty,
          score,
          elapsedSeconds: elapsed,
          hints: hintsUsed,
        });
      }
    } else {
      setMessageWithStyle("Tekrar dene", true);
      setTimeout(() => setMessageError(false), 200);
    }
  };

  const handleHint = () => {
    if (!activeWord || !puzzle) return;
    const cells = activeWordCells;
    const nextMissing = cells.find((cell) => {
      const solution = puzzle.grid[cell.r][cell.c];
      return filled[cell.key] !== solution;
    });
    if (!nextMissing) return;
    const solution = puzzle.grid[nextMissing.r][nextMissing.c];
    if (!solution) return;
    setFilled((prev) => ({ ...prev, [nextMissing.key]: solution }));
    setHintsUsed((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 3));
  };

  const handleSkip = () => {
    if (!puzzle || !activeWord) return;
    const remaining = puzzle.words.filter((w) => !solved.has(w.id));
    if (!remaining.length) return;
    const idx = remaining.findIndex((w) => w.id === activeWord.id);
    const next = remaining[(idx + 1) % remaining.length];
    setSelectedWordId(next.id);
    setInput("");
    setMessage(null);
    setMessageError(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!puzzle) return;
    const k = cellKey(row, col);
    const cellLetter = puzzle.grid[row][col];
    if (!cellLetter) return;

    const candidates = puzzle.words.filter((w) => {
      const len = w.answer.length;
      for (let i = 0; i < len; i += 1) {
        const r = w.row + (w.direction === "down" ? i : 0);
        const c = w.col + (w.direction === "across" ? i : 0);
        if (r === row && c === col) return true;
      }
      return false;
    });
    if (!candidates.length) return;

    const now = Date.now();
    let target = candidates[0];

    if (lastClick && lastClick.key === k && now - lastClick.time < 400) {
      const current = puzzle.words.find((w) => w.id === selectedWordId);
      const alt =
        candidates.find((w) => w.id !== current?.id) ?? candidates[0];
      target = alt;
    }

    setLastClick({ key: k, time: now });
    setSelectedWordId(target.id);
    setInput("");
    setMessage(null);
    setMessageError(false);
  };

  const yatayIpuclari = useMemo(
    () => puzzle?.words.filter((w) => w.direction === "across") ?? [],
    [puzzle],
  );
  const dikeyIpuclari = useMemo(
    () => puzzle?.words.filter((w) => w.direction === "down") ?? [],
    [puzzle],
  );

  if (!puzzle || !activeWord) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_0_45px_rgba(15,23,42,0.95)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.55),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.45),transparent_55%),radial-gradient(circle_at_55%_0,rgba(52,211,153,0.35),transparent_55%)]" />
        </div>

        {/* Üst bilgi */}
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Kelime • Zeka • Dil
            </div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Crossword Bulmaca
            </h1>
            <p className="text-sm text-white/70">
              Bir ipucu seç, kelimeyi yaz ve bulmacayı tamamla.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              Seviye:{" "}
              <span className="font-bold text-sky-200">{level}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              Zorluk:{" "}
              <span className="font-bold text-emerald-200">
                {difficultyLabel(effectiveDifficulty)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
              {formatTime(elapsed)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              Skor:{" "}
              <span className="font-bold text-amber-200">
                {score.toLocaleString("tr-TR")}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-semibold text-white/80 ring-1 ring-white/10">
              <Target className="h-3.5 w-3.5 text-emerald-300" />
              Tamamlama: %{completionPercent}
            </span>
          </div>
        </div>

        {/* İçerik */}
        <div className="relative mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_360px]">
          {/* Grid */}
          <div className="rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/10">
                Seçili ipucu:{" "}
                <span className="font-bold text-sky-200">
                  {activeWord.id} •{" "}
                  {activeWord.direction === "across" ? "Yatay" : "Dikey"}
                </span>
              </div>
            </div>

            <div className="mx-auto grid w-fit grid-cols-10 gap-[6px] rounded-2xl bg-[linear-gradient(180deg,#0f1724,#0a0f1a)] p-3 ring-1 ring-white/10">
              {Array.from({ length: puzzle.size }).map((_, r) =>
                Array.from({ length: puzzle.size }).map((__, c) => {
                  const solution = puzzle.grid[r][c];
                  const k = cellKey(r, c);
                  const isBlocked = !solution;
                  const isInActive = activeWordCells.some(
                    (cell) => cell.key === k,
                  );
                  const isSolvedWord = solved.has(activeWord.id) && isInActive;
                  const isLastCorrect =
                    lastCorrectWord === activeWord.id && isInActive;
                  const letter = filled[k] ?? "";
                  const startingWord = puzzle.words.find(
                    (w) => w.row === r && w.col === c,
                  );
                  const clueNumber = startingWord
                    ? startingWord.id.replace(/\D/g, "")
                    : "";

                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => handleCellClick(r, c)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-md text-sm font-extrabold transition ${
                        isBlocked
                          ? "cursor-default bg-[#05080f]"
                          : "bg-[#1a2535] border border-[rgba(255,255,255,0.15)] hover:border-sky-400/70 hover:bg-[#22324a]"
                      } ${
                        isInActive && !isBlocked
                          ? "bg-[#1f3a5f] shadow-[0_0_0_1px_rgba(56,189,248,0.6)]"
                          : ""
                      } ${
                        isSolvedWord && !isBlocked
                          ? "shadow-[0_0_0_1px_rgba(52,211,153,0.6)]"
                          : ""
                      } ${
                        isLastCorrect && !isBlocked ? "flash-green" : ""
                      }`}
                    >
                      {!isBlocked && (
                        <div className="relative flex h-full w-full items-center justify-center">
                          {clueNumber && (
                            <span className="pointer-events-none absolute left-[2px] top-[1px] text-[9px] font-semibold text-slate-300/90">
                              {clueNumber}
                            </span>
                          )}
                          <span
                            className={`text-sm ${
                              isLastCorrect ? "letter-pop" : ""
                            }`}
                          >
                            {letter}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          {/* İpuçları ve giriş */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                İpuçları
              </p>

              <div className="mt-3 space-y-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Yatay
                  </p>
                  <ul className="space-y-2 text-[12px] text-white/75">
                    {yatayIpuclari.map((w) => {
                      const selected = w.id === activeWord.id;
                      const done = solved.has(w.id);
                      return (
                        <li key={w.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedWordId(w.id);
                              setInput("");
                              setMessage(null);
                              setMessageError(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left ring-1 transition ${
                              done
                                ? "bg-emerald-500/10 ring-emerald-400/40"
                                : selected
                                  ? "bg-sky-500/15 ring-sky-400/40"
                                  : "bg-white/5 ring-white/10 hover:bg-white/10"
                            }`}
                          >
                            <span>
                              <span className="font-semibold text-sky-200">
                                {w.id}
                              </span>{" "}
                              {w.clue}{" "}
                              <span className="text-white/40">
                                ({w.answer.length})
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Dikey
                  </p>
                  <ul className="space-y-2 text-[12px] text-white/75">
                    {dikeyIpuclari.map((w) => {
                      const selected = w.id === activeWord.id;
                      const done = solved.has(w.id);
                      return (
                        <li key={w.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedWordId(w.id);
                              setInput("");
                              setMessage(null);
                              setMessageError(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left ring-1 transition ${
                              done
                                ? "bg-emerald-500/10 ring-emerald-400/40"
                                : selected
                                  ? "bg-sky-500/15 ring-sky-400/40"
                                  : "bg-white/5 ring-white/10 hover:bg-white/10"
                            }`}
                          >
                            <span>
                              <span className="font-semibold text-sky-200">
                                {w.id}
                              </span>{" "}
                              {w.clue}{" "}
                              <span className="text-white/40">
                                ({w.answer.length})
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Giriş alanı */}
            <div className="rounded-3xl bg-black/35 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Kelime Girişi
              </p>
              <p className="mt-1 text-[12px] text-white/70">
                {activeWord.id} için cevabı yaz (uzunluk:{" "}
                {activeWord.answer.length}).
              </p>

              <div
                className={`mt-3 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm transition ${
                  messageError ? "shake ring-rose-400/70" : ""
                }`}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCheck();
                    }
                  }}
                  placeholder="Kelimeyi yaz..."
                  className="w-full bg-transparent text-sm font-semibold tracking-[0.18em] text-white outline-none placeholder:text-white/35"
                />
              </div>

              {message && (
                <p
                  className={`mt-2 text-[12px] ${
                    messageError ? "text-rose-300" : "text-emerald-300"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2 text-[11px] text-white/60">
                  <button
                    type="button"
                    onClick={handleHint}
                    className="inline-flex items-center gap-1 rounded-2xl bg-white/5 px-3 py-1 font-semibold ring-1 ring-white/10 hover:bg-white/10"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-300" />
                    İpucu ver
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1 rounded-2xl bg-white/5 px-3 py-1 font-semibold ring-1 ring-white/10 hover:bg-white/10"
                  >
                    Atla
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCheck}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)]"
                >
                  Kontrol Et
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sonuç modal */}
        {state === "completed" && result && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#050816]/95 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/10 sm:p-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl shadow-[0_0_35px_rgba(16,185,129,0.7)]">
                  🎯
                </div>
                <h2 className="text-xl font-semibold">Harita Tamamlandı!</h2>
                <p className="text-sm text-white/70">
                  Tebrikler, bu seviyedeki tüm kelimeleri çözdün.
                </p>
                <div className="mt-2 w-full space-y-2 rounded-2xl bg-white/5 p-4 text-xs text-white/80 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <span>Seviye</span>
                    <span className="font-semibold">
                      {result.level} • {difficultyLabel(result.difficulty)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toplam Süre</span>
                    <span className="font-mono text-sm font-semibold">
                      {formatTime(result.elapsedSeconds)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kazanılan Skor</span>
                    <span className="font-semibold text-amber-200">
                      {result.score.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kullanılan İpucu</span>
                    <span className="font-semibold">{result.hints}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setLevel((prev) => prev + 1);
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)] sm:flex-none sm:px-6"
                  >
                    Sonraki Harita
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPuzzle()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white/90 shadow-sm transition hover:bg-white/10 sm:flex-none sm:px-6"
                  >
                    Tekrar Oyna
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
            animation: shake 0.16s ease-in-out;
          }
          @keyframes flashGreen {
            0% {
              background-color: rgba(34, 197, 94, 0.35);
            }
            60% {
              background-color: rgba(34, 197, 94, 0.1);
            }
            100% {
              background-color: transparent;
            }
          }
          .flash-green {
            animation: flashGreen 0.5s ease-out;
          }
          @keyframes letterPop {
            0% {
              transform: scale(0.7);
              opacity: 0;
            }
            60% {
              transform: scale(1.05);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .letter-pop {
            animation: letterPop 0.35s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

