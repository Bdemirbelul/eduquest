import {
  CheckCircle2,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";

export default function RightPanel() {
  return (
    <aside className="flex h-full flex-col gap-4 xl:gap-5 2xl:gap-6">
      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.55)] xl:p-5 2xl:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40">
              <Target className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight">
              Günlük Görevler
            </h3>
          </div>
          <span className="text-[11px] font-medium text-white/50">
            2 / 3 tamamlandı
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1 rounded-2xl bg-black/25 p-3 ring-1 ring-emerald-400/25">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-white">
                3 Matematik Düellosu Kazan
              </p>
              <span className="text-[11px] font-semibold text-emerald-300">
                %67
              </span>
            </div>
            <p className="text-[11px] text-white/60">
              Dereceli arenada üst üste zafer serisi kur.
            </p>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl bg-black/20 p-3 ring-1 ring-emerald-400/35">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <p className="font-semibold text-white">
                  Periyodik Tabloyu Ustalaş
                </p>
                <p className="text-[11px] text-emerald-200">
                  Tamamlandı — +120 tecrübe
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/40">
              Bitti
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.55)] xl:p-5 2xl:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-400/40">
              <Crown className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight">
              Global Sıralama
            </h3>
          </div>
          <span className="text-[11px] font-medium text-white/50">
            Canlı güncelleniyor
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/25 to-emerald-400/20 p-2.5 ring-1 ring-amber-300/60 shadow-[0_0_30px_rgba(251,191,36,0.9)]">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black shadow-[0_0_18px_rgba(251,191,36,0.9)]">
                1
              </span>
              <span className="font-semibold text-white">
                Neo_Scholar
              </span>
            </div>
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
              🥇 Şampiyon
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-violet-500/25 p-2.5 ring-1 ring-sky-300/60 shadow-[0_0_28px_rgba(59,130,246,0.9)]">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-xs font-bold text-black shadow-[0_0_18px_rgba(56,189,248,0.9)]">
                2
              </span>
              <span className="font-semibold text-white">Sen</span>
            </div>
            <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
              🥈 Lobi lideri
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl bg-black/25 p-2.5 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-black">
                3
              </span>
              <span className="font-semibold text-white/90">
                Zelda_Fan
              </span>
            </div>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-100">
              🥉 Onur kürsüsü
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.55)] xl:p-5 2xl:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-fuchsia-500/25 text-fuchsia-100 ring-1 ring-fuchsia-400/40">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight">
              Açılan Rozetler
            </h3>
          </div>
          <span className="text-[11px] font-medium text-white/50">
            Son 7 gün
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/25 p-2 ring-1 ring-amber-300/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.9)]">
              <Crown className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-semibold text-amber-100">
              Sezon
              <br />
              Ustası
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/25 p-2 ring-1 ring-emerald-300/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_18px_rgba(52,211,153,0.9)]">
              <Shield className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-100">
              Savunma
              <br />
              Duvarı
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/25 p-2 ring-1 ring-sky-300/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400 text-sky-950 shadow-[0_0_18px_rgba(56,189,248,0.9)]">
              <Medal className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-semibold text-sky-100">
              Bilgi
              <br />
              Avcısı
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/25 p-2 ring-1 ring-fuchsia-300/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-400 text-fuchsia-950 shadow-[0_0_18px_rgba(236,72,153,0.9)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-semibold text-fuchsia-100">
              Seri
              <br />
              Kombocu
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}

