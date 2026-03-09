"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type RopeArenaProps = {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winDiff: number;
  gifSrc: StaticImageData | string;
};

export default function RopeArena({
  team1Name: _team1Name,
  team2Name: _team2Name,
  team1Score,
  team2Score,
  winDiff,
  gifSrc,
}: RopeArenaProps) {
  const diff = team1Score - team2Score;
  const t = Math.max(-1, Math.min(1, diff / winDiff));
  let markerPercent = 50 - t * 40;
  markerPercent = Math.max(10, Math.min(90, markerPercent));
  const MAX_SHIFT_PX = 140;
  const gifShiftPx = -(t * MAX_SHIFT_PX);
  const absDiff = Math.abs(diff);

  const [animateKnot, setAnimateKnot] = useState(false);

  useEffect(() => {
    if (team1Score === 0 && team2Score === 0) return;
    setAnimateKnot(true);
    const id = window.setTimeout(() => {
      setAnimateKnot(false);
    }, 300);
    return () => window.clearTimeout(id);
  }, [team1Score, team2Score]);

  const showPulseAtCenter =
    team1Score === 0 && team2Score === 0 && !animateKnot;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-[700px] min-h-[560px] rounded-[28px] border border-white/40 bg-white/75 p-8 text-xs text-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.15)] backdrop-blur-md">
        <div className="flex h-full flex-col items-center justify-center gap-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-600">
            Halat Arenası
          </p>

          <div className="flex w-full flex-col items-center gap-2">
            <div className="relative h-[18px] w-full max-w-[640px] overflow-hidden rounded-full bg-[linear-gradient(to_right,#3b82f6,#a855f7,#ef4444)] shadow-inner">
              <div
                className={`absolute -top-1.5 h-[26px] w-[26px] rounded-full border-[3px] border-orange-400 bg-white shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showPulseAtCenter ? "animate-pulse" : ""
                } ${animateKnot ? "arena-knot-wiggle" : ""}`}
                style={{
                  left: `${markerPercent}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-slate-700">
              Score Difference: {absDiff} / {winDiff}
            </p>
          </div>

          <div className="mt-2 flex w-full items-center justify-center">
            <div className="flex h-[340px] w-full max-w-[640px] items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg">
              <div
                className={`inline-flex h-full w-full items-center justify-center transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                  animateKnot ? "arena-gif-bounce" : ""
                }`}
                style={{ transform: `translateX(${gifShiftPx}px)` }}
              >
                <Image
                  src={gifSrc}
                  alt="Halat çekme arenasi"
                  className="max-h-[320px] w-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600">
            Skor farkı 5 olursa oyun biter.
          </p>
        </div>

        <style jsx>{`
          @keyframes arena-knot-wiggle {
            0%,
            100% {
              transform: translateX(-50%) scale(1);
            }
            40% {
              transform: translateX(-50%) scale(1.06);
            }
            70% {
              transform: translateX(-50%) scale(1.02);
            }
          }
          .arena-knot-wiggle {
            animation: arena-knot-wiggle 0.3s ease-out;
          }
          @keyframes arena-knot-glow {
            0%,
            100% {
              box-shadow: 0 6px 16px rgba(15, 23, 42, 0.4);
            }
            40% {
              box-shadow: 0 8px 22px rgba(46, 144, 250, 0.6);
            }
          }
          .arena-knot-glow {
            animation: arena-knot-glow 0.3s ease-out;
          }
          @keyframes arena-gif-bounce {
            0%,
            100% {
              transform: scale(1);
            }
            40% {
              transform: scale(1.02);
            }
            70% {
              transform: scale(1.01);
            }
          }
          .arena-gif-bounce {
            animation: arena-gif-bounce 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

