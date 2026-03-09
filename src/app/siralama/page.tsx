"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Crown,
  Filter,
  MapPin,
  Search,
  TrendingUp,
  Users,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";

type Metric = "totalXP" | "weeklyXP" | "accuracy" | "streak" | "avgTime";
type TimeWindow = "today" | "7d" | "30d" | "all";
type Gender = "all" | "female" | "male" | "mixed";
type SchoolLevel = "all" | "primary" | "middle" | "high" | "university" | "graduate";
type Tab = "genel" | "sehrim" | "arkadaslar" | "yukselenler";

type Player = {
  id: string;
  name: string;
  avatarColor: string;
  country: string;
  city: string;
  district: string;
  gender: "female" | "male";
  age: number;
  schoolLevel: SchoolLevel;
  totalXP: number;
  weeklyXP: number;
  accuracy: number;
  avgTime: number;
  streak: number;
  favoriteSubject: string;
  favoriteMode: string;
  lastActiveAt: Date;
  createdAt: Date;
  rankDelta24h: number;
  friendsCount: number;
};

type Filters = {
  tab: Tab;
  country: string;
  city: string;
  district: string;
  gender: Gender;
  ageRange: "all" | "6-18" | "18-24" | "25+";
  schoolLevel: SchoolLevel;
  metric: Metric;
  timeWindow: TimeWindow;
  subject: "all" | "matematik" | "tarih" | "cografya" | "bayraklar" | "genel";
  mode: "all" | "halat" | "hafiza" | "bayrak";
  surpriseNew: boolean;
  surpriseUnderdog: boolean;
  surpriseStable: boolean;
  surpriseFastAccurate: boolean;
  surpriseSocial: boolean;
  surpriseImproving: boolean;
  surpriseNearby: boolean;
  surpriseRivals: boolean;
};

const sehirler = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Konya"];
const ilceler = ["Merkez", "Kadıköy", "Çankaya", "Kepez", "Nilüfer", "Selçuklu"];
const isimler = [
  "Demirkan",
  "Elif",
  "Ayşe",
  "Mehmet",
  "Zeynep",
  "Deniz",
  "Eren",
  "Selin",
  "Can",
  "Mira",
  "Burak",
  "İpek",
  "Arda",
  "Defne",
  "Yunus",
];
const avatarRenkleri = [
  "#0EA5E9",
  "#6366F1",
  "#EC4899",
  "#22C55E",
  "#F97316",
  "#A855F7",
];

function rastgele<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}

function olusturOyuncular(adet: number): Player[] {
  const sonuc: Player[] = [];
  const simdi = Date.now();
  for (let i = 0; i < adet; i += 1) {
    const gender: "female" | "male" = Math.random() < 0.5 ? "female" : "male";
    const ageGroupRand = Math.random();
    const age =
      ageGroupRand < 0.6
        ? 8 + Math.floor(Math.random() * 10)
        : ageGroupRand < 0.85
          ? 18 + Math.floor(Math.random() * 7)
          : 25 + Math.floor(Math.random() * 15);
    const schoolLevel: SchoolLevel =
      age < 11
        ? "primary"
        : age < 15
          ? "middle"
          : age < 19
            ? "high"
            : age < 24
              ? "university"
              : "graduate";

    const totalXP = 500 + Math.floor(Math.random() * 50000);
    const weeklyXP = Math.floor(totalXP * (0.05 + Math.random() * 0.2));
    const accuracy = 0.5 + Math.random() * 0.5;
    const avgTime = 3 + Math.random() * 10;
    const streak = Math.floor(Math.random() * 40);

    const createdAt = new Date(simdi - Math.floor(Math.random() * 90) * 86400000);
    const lastActiveAt = new Date(
      simdi - Math.floor(Math.random() * 5) * 86400000,
    );
    const rankDelta24h = Math.floor(Math.random() * 80) - 40;
    const friendsCount = Math.floor(Math.random() * 50);

    sonuc.push({
      id: `p-${i}`,
      name: rastgele(isimler),
      avatarColor: rastgele(avatarRenkleri),
      country: "Türkiye",
      city: rastgele(sehirler),
      district: rastgele(ilceler),
      gender,
      age,
      schoolLevel,
      totalXP,
      weeklyXP,
      accuracy,
      avgTime,
      streak,
      favoriteSubject: rastgele([
        "Matematik",
        "Tarih",
        "Coğrafya",
        "Bayraklar",
        "Genel",
      ]),
      favoriteMode: rastgele(["Halat Çekme", "Hafıza Oyunu", "Bayrak Bul"]),
      lastActiveAt,
      createdAt,
      rankDelta24h,
      friendsCount,
    });
  }
  return sonuc;
}

const TUM_OYUNCULAR: Player[] = olusturOyuncular(520);
const KULLANICI_ID = TUM_OYUNCULAR[0]?.id;

const varsayilanFiltreler: Filters = {
  tab: "genel",
  country: "Türkiye",
  city: "all",
  district: "all",
  gender: "all",
  ageRange: "all",
  schoolLevel: "all",
  metric: "weeklyXP",
  timeWindow: "7d",
  subject: "all",
  mode: "all",
  surpriseNew: false,
  surpriseUnderdog: false,
  surpriseStable: false,
  surpriseFastAccurate: false,
  surpriseSocial: false,
  surpriseImproving: false,
  surpriseNearby: false,
  surpriseRivals: false,
};

function filtreleriURLdenOku(params: URLSearchParams): Filters {
  const f = { ...varsayilanFiltreler };
  const tab = params.get("tab") as Tab | null;
  if (tab && ["genel", "sehrim", "arkadaslar", "yukselenler"].includes(tab)) {
    f.tab = tab;
  }
  const metric = params.get("metric") as Metric | null;
  if (
    metric &&
    ["totalXP", "weeklyXP", "accuracy", "streak", "avgTime"].includes(metric)
  ) {
    f.metric = metric;
  }
  const timeWindow = params.get("zaman") as TimeWindow | null;
  if (timeWindow && ["today", "7d", "30d", "all"].includes(timeWindow)) {
    f.timeWindow = timeWindow;
  }
  const gender = params.get("cinsiyet") as Gender | null;
  if (gender && ["all", "female", "male", "mixed"].includes(gender)) {
    f.gender = gender;
  }
  const ageRange = params.get("yas") as Filters["ageRange"] | null;
  if (ageRange && ["all", "6-18", "18-24", "25+"].includes(ageRange)) {
    f.ageRange = ageRange;
  }
  const school = params.get("okul") as SchoolLevel | null;
  if (
    school &&
    ["all", "primary", "middle", "high", "university", "graduate"].includes(
      school,
    )
  ) {
    f.schoolLevel = school;
  }
  const subject = params.get("ders") as Filters["subject"] | null;
  if (
    subject &&
    ["all", "matematik", "tarih", "cografya", "bayraklar", "genel"].includes(
      subject,
    )
  ) {
    f.subject = subject;
  }
  const mode = params.get("mod") as Filters["mode"] | null;
  if (mode && ["all", "halat", "hafiza", "bayrak"].includes(mode)) {
    f.mode = mode;
  }
  f.city = params.get("il") || "all";
  f.district = params.get("ilce") || "all";

  [
    "surpriseNew",
    "surpriseUnderdog",
    "surpriseStable",
    "surpriseFastAccurate",
    "surpriseSocial",
    "surpriseImproving",
    "surpriseNearby",
    "surpriseRivals",
  ].forEach((key) => {
    const v = params.get(key);
    if (v === "1") {
      (f as any)[key] = true;
    }
  });

  return f;
}

function filtreleriURLeYaz(router: ReturnType<typeof useRouter>, f: Filters) {
  const params = new URLSearchParams();
  params.set("tab", f.tab);
  if (f.city !== "all") params.set("il", f.city);
  if (f.district !== "all") params.set("ilce", f.district);
  if (f.gender !== "all") params.set("cinsiyet", f.gender);
  if (f.ageRange !== "all") params.set("yas", f.ageRange);
  if (f.schoolLevel !== "all") params.set("okul", f.schoolLevel);
  if (f.metric !== varsayilanFiltreler.metric) params.set("metric", f.metric);
  if (f.timeWindow !== varsayilanFiltreler.timeWindow)
    params.set("zaman", f.timeWindow);
  if (f.subject !== "all") params.set("ders", f.subject);
  if (f.mode !== "all") params.set("mod", f.mode);

  [
    "surpriseNew",
    "surpriseUnderdog",
    "surpriseStable",
    "surpriseFastAccurate",
    "surpriseSocial",
    "surpriseImproving",
    "surpriseNearby",
    "surpriseRivals",
  ].forEach((key) => {
    if ((f as any)[key]) {
      params.set(key, "1");
    }
  });

  const qs = params.toString();
  router.replace(qs ? `/siralama?${qs}` : "/siralama", { scroll: false });
}

function filtreleVeSirala(
  oyuncular: Player[],
  f: Filters,
  arama: string,
): Player[] {
  let liste = [...oyuncular];

  if (f.tab === "sehrim") {
    liste = liste.filter((p) => p.city === "İstanbul");
  } else if (f.tab === "arkadaslar") {
    liste = liste.filter((p) => p.friendsCount > 10);
  } else if (f.tab === "yukselenler") {
    liste = liste.filter((p) => p.rankDelta24h < -5);
  }

  if (f.city !== "all") liste = liste.filter((p) => p.city === f.city);
  if (f.district !== "all")
    liste = liste.filter((p) => p.district === f.district);

  if (f.gender === "female") liste = liste.filter((p) => p.gender === "female");
  if (f.gender === "male") liste = liste.filter((p) => p.gender === "male");

  if (f.ageRange === "6-18") liste = liste.filter((p) => p.age >= 6 && p.age <= 18);
  if (f.ageRange === "18-24")
    liste = liste.filter((p) => p.age >= 18 && p.age <= 24);
  if (f.ageRange === "25+") liste = liste.filter((p) => p.age >= 25);

  if (f.schoolLevel !== "all")
    liste = liste.filter((p) => p.schoolLevel === f.schoolLevel);

  if (f.subject !== "all") {
    const hedef = f.subject.toLowerCase();
    liste = liste.filter((p) =>
      p.favoriteSubject.toLowerCase().includes(hedef),
    );
  }

  if (f.mode === "halat")
    liste = liste.filter((p) => p.favoriteMode === "Halat Çekme");
  if (f.mode === "hafiza")
    liste = liste.filter((p) => p.favoriteMode === "Hafıza Oyunu");
  if (f.mode === "bayrak")
    liste = liste.filter((p) => p.favoriteMode === "Bayrak Bul");

  if (f.surpriseNew) {
    const yediGunOnce = Date.now() - 7 * 86400000;
    liste = liste.filter((p) => p.createdAt.getTime() >= yediGunOnce);
  }
  if (f.surpriseUnderdog) {
    liste = liste.filter((p) => p.rankDelta24h < -10);
  }
  if (f.surpriseStable) {
    liste = liste.filter((p) => p.streak >= 10);
  }
  if (f.surpriseFastAccurate) {
    liste = liste.filter((p) => p.accuracy >= 0.8 && p.avgTime <= 6);
  }
  if (f.surpriseSocial) {
    liste = liste.filter((p) => p.friendsCount >= 15);
  }
  if (f.surpriseImproving) {
    liste = liste.filter((p) => p.weeklyXP / Math.max(p.totalXP, 1) > 0.2);
  }
  if (f.surpriseNearby) {
    liste = liste.filter((p) => p.city === "İstanbul" || p.city === "Ankara");
  }
  if (f.surpriseRivals && KULLANICI_ID) {
    const ben = oyuncular.find((p) => p.id === KULLANICI_ID);
    if (ben) {
      liste = liste.filter(
        (p) => Math.abs(p.weeklyXP - ben.weeklyXP) < ben.weeklyXP * 0.1,
      );
    }
  }

  if (arama.trim()) {
    const q = arama.toLowerCase();
    liste = liste.filter((p) => p.name.toLowerCase().includes(q));
  }

  liste.sort((a, b) => {
    if (f.metric === "accuracy") return b.accuracy - a.accuracy;
    if (f.metric === "avgTime") return a.avgTime - b.avgTime;
    if (f.metric === "streak") return b.streak - a.streak;
    if (f.metric === "weeklyXP") return b.weeklyXP - a.weeklyXP;
    return b.totalXP - a.totalXP;
  });

  return liste;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() =>
    filtreleriURLdenOku(searchParams as unknown as URLSearchParams),
  );
  const [arama, setArama] = useState<string>(
    searchParams.get("q") ?? "",
  );
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [seciliOyuncu, setSeciliOyuncu] = useState<Player | null>(null);

  useEffect(() => {
    filtreleriURLeYaz(router, filters);
  }, [filters, router]);

  const oyuncular = useMemo(
    () => filtreleVeSirala(TUM_OYUNCULAR, filters, arama),
    [filters, arama],
  );

  const top3 = oyuncular.slice(0, 3);
  const kalan = oyuncular.slice(3, 103);

  const benIndex = KULLANICI_ID
    ? oyuncular.findIndex((p) => p.id === KULLANICI_ID)
    : -1;

  const handleBenNeredeyim = () => {
    if (benIndex === -1) return;
    const id = oyuncular[benIndex].id;
    const el = document.getElementById(`oyuncu-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const aktifSekmeSinif = (tab: Tab) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold transition ${
      filters.tab === tab
        ? "bg-white text-slate-900 shadow-sm"
        : "bg-white/5 text-white/70 hover:bg-white/10"
    }`;

  const guncelleFiltre = (parca: Partial<Filters>) => {
    setFilters((eski) => ({ ...eski, ...parca }));
  };

  const resetFiltre = () => {
    setFilters(varsayilanFiltreler);
    setArama("");
  };

  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[1.7rem] lg:leading-[1.1]">
                  Sıralama
                </h1>
                <p className="text-sm text-white/70 sm:text-[15px]">
                  Türkiye genelinde en iyi oyuncuları keşfet.
                </p>
              </div>
              <div className="hidden items-center gap-2 text-[11px] sm:flex">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-200 ring-1 ring-emerald-400/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                  Canlı güncelleniyor
                </span>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-[10px] font-semibold ring-1 ring-white/10">
                  <button
                    type="button"
                    className={`rounded-full px-2 py-0.5 ${
                      filters.timeWindow === "7d"
                        ? "bg-white text-slate-900"
                        : "text-white/70"
                    }`}
                    onClick={() => guncelleFiltre({ timeWindow: "7d" })}
                  >
                    Bu hafta
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-2 py-0.5 ${
                      filters.timeWindow === "30d"
                        ? "bg-white text-slate-900"
                        : "text-white/70"
                    }`}
                    onClick={() => guncelleFiltre({ timeWindow: "30d" })}
                  >
                    Bu ay
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-[11px] font-semibold ring-1 ring-white/10">
                <button
                  type="button"
                  className={aktifSekmeSinif("genel")}
                  onClick={() => guncelleFiltre({ tab: "genel" })}
                >
                  Genel
                </button>
                <button
                  type="button"
                  className={aktifSekmeSinif("sehrim")}
                  onClick={() => guncelleFiltre({ tab: "sehrim" })}
                >
                  Şehrim
                </button>
                <button
                  type="button"
                  className={aktifSekmeSinif("arkadaslar")}
                  onClick={() => guncelleFiltre({ tab: "arkadaslar" })}
                >
                  Arkadaşlar
                </button>
                <button
                  type="button"
                  className={aktifSekmeSinif("yukselenler")}
                  onClick={() => guncelleFiltre({ tab: "yukselenler" })}
                >
                  Bu Hafta Yükselenler
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 md:hidden"
                onClick={() => setShowFiltersMobile(true)}
              >
                <Filter className="h-3.5 w-3.5" />
                Filtreler
              </button>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Filtre paneli */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-3 rounded-3xl bg-white/5 p-4 text-xs text-white/80 ring-1 ring-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                    <SlidersHorizontal className="h-3 w-3" />
                    Filtreler
                  </div>
                  <button
                    type="button"
                    onClick={resetFiltre}
                    className="text-[11px] font-semibold text-slate-200 hover:text-white"
                  >
                    Sıfırla
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Konum
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
                        <MapPin className="h-3.5 w-3.5 text-sky-300" />
                        <span className="text-[11px]">
                          Ülke: <span className="font-semibold">Türkiye</span>
                        </span>
                      </div>
                      <select
                        className="h-8 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                        value={filters.city}
                        onChange={(e) =>
                          guncelleFiltre({ city: e.target.value })
                        }
                      >
                        <option value="all">Tüm Şehirler</option>
                        {sehirler.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <select
                        className="h-8 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                        value={filters.district}
                        onChange={(e) =>
                          guncelleFiltre({ district: e.target.value })
                        }
                      >
                        <option value="all">Tüm İlçeler</option>
                        {ilceler.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Profil
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "Hepsi", value: "all" },
                        { label: "Kızlar", value: "female" },
                        { label: "Erkekler", value: "male" },
                      ].map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({ gender: g.value as Gender })
                          }
                          className={`rounded-2xl px-2 py-1 text-[11px] font-semibold ${
                            filters.gender === g.value
                              ? "bg-white text-slate-900"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {[
                        { label: "Tümü", value: "all" },
                        { label: "6–18", value: "6-18" },
                        { label: "18–24", value: "18-24" },
                        { label: "25+", value: "25+" },
                      ].map((a) => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({
                              ageRange: a.value as Filters["ageRange"],
                            })
                          }
                          className={`rounded-2xl px-2 py-1 text-[11px] font-semibold ${
                            filters.ageRange === a.value
                              ? "bg-white text-slate-900"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>

                    <select
                      className="mt-2 h-8 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                      value={filters.schoolLevel}
                      onChange={(e) =>
                        guncelleFiltre({
                          schoolLevel: e.target.value as SchoolLevel,
                        })
                      }
                    >
                      <option value="all">Tüm Okul Seviyeleri</option>
                      <option value="primary">İlkokul</option>
                      <option value="middle">Ortaokul</option>
                      <option value="high">Lise</option>
                      <option value="university">Üniversite</option>
                      <option value="graduate">Mezun</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Sıralama Metriği
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: "Toplam XP", value: "totalXP" },
                        { label: "Haftalık XP", value: "weeklyXP" },
                        { label: "Doğru oranı", value: "accuracy" },
                        { label: "Streak", value: "streak" },
                        { label: "Hız", value: "avgTime" },
                      ].map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({ metric: m.value as Metric })
                          }
                          className={`rounded-2xl px-2 py-1 text-[11px] font-semibold ${
                            filters.metric === m.value
                              ? "bg-white text-slate-900"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {[
                        { label: "Bugün", value: "today" },
                        { label: "7g", value: "7d" },
                        { label: "30g", value: "30d" },
                        { label: "Tümü", value: "all" },
                      ].map((z) => (
                        <button
                          key={z.value}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({
                              timeWindow: z.value as TimeWindow,
                            })
                          }
                          className={`rounded-2xl px-2 py-1 text-[11px] font-semibold ${
                            filters.timeWindow === z.value
                              ? "bg-white text-slate-900"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          {z.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Ders &amp; Oyun Modu
                    </p>
                    <select
                      className="h-8 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                      value={filters.subject}
                      onChange={(e) =>
                        guncelleFiltre({
                          subject: e.target.value as Filters["subject"],
                        })
                      }
                    >
                      <option value="all">Tüm Dersler</option>
                      <option value="matematik">Matematik</option>
                      <option value="tarih">Tarih</option>
                      <option value="cografya">Coğrafya</option>
                      <option value="bayraklar">Bayraklar</option>
                      <option value="genel">Genel Kültür</option>
                    </select>

                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {[
                        { label: "Tümü", value: "all" },
                        { label: "Halat", value: "halat" },
                        { label: "Hafıza", value: "hafiza" },
                        { label: "Bayrak", value: "bayrak" },
                      ].map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({ mode: m.value as Filters["mode"] })
                          }
                          className={`rounded-2xl px-2 py-1 text-[11px] font-semibold ${
                            filters.mode === m.value
                              ? "bg-white text-slate-900"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      Şaşırt Beni
                    </p>
                    <div className="space-y-1">
                      {[
                        ["surpriseNew", "Sadece yeni oyuncular"],
                        ["surpriseUnderdog", "Underdog yükselişi"],
                        ["surpriseStable", "En istikrarlı"],
                        ["surpriseFastAccurate", "En hızlı doğru"],
                        ["surpriseSocial", "En sosyal"],
                        ["surpriseImproving", "En çok gelişen"],
                        ["surpriseNearby", "Yakınımdakiler"],
                        ["surpriseRivals", "Rivallerim"],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            guncelleFiltre({
                              [key]: !(filters as any)[key],
                            } as any)
                          }
                          className={`flex w-full items-center justify-between rounded-2xl px-3 py-1.5 text-[11px] ${
                            (filters as any)[key]
                              ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/60"
                              : "bg-white/5 text-white/70"
                          }`}
                        >
                          <span>{label}</span>
                          {(filters as any)[key] ? (
                            <X className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Leaderboard alanı */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/5 p-3 text-xs text-white/80 ring-1 ring-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] sm:p-4">
                <div className="flex flex-1 items-center gap-2 rounded-2xl bg-black/40 px-3 py-2">
                  <Search className="h-4 w-4 text-white/50" />
                  <input
                    value={arama}
                    onChange={(e) => setArama(e.target.value)}
                    placeholder="Oyuncu ara…"
                    className="h-7 flex-1 bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBenNeredeyim}
                    className="inline-flex items-center gap-1 rounded-2xl bg-sky-500/80 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_24px_rgba(56,189,248,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(56,189,248,1)]"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Ben neredeyim?
                  </button>
                  <span className="hidden rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 sm:inline-flex">
                    İlk {oyuncular.length > 100 ? 100 : oyuncular.length} sonuç
                    gösteriliyor
                  </span>
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="grid gap-3 sm:grid-cols-3">
                {top3.map((p, index) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSeciliOyuncu(p)}
                    className={`relative flex flex-col items-center justify-between rounded-3xl bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(37,99,235,0.9)] ${
                      index === 0 ? "sm:col-span-1 sm:scale-105" : ""
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
                    <div className="flex w-full flex-1 flex-col items-center gap-2 px-4 pb-4 pt-5">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {index === 0 && <Crown className="h-3 w-3 text-amber-400" />}
                          <span>{index + 1}. Sıra</span>
                        </div>
                        <h3 className="mt-1 text-sm font-semibold">{p.name}</h3>
                        <p className="text-[11px] text-slate-500">
                          {p.city} • {p.age} yaş
                        </p>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-slate-600">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold">
                          <TrendingUp className="h-3 w-3" />
                          {filters.metric === "weeklyXP"
                            ? `${p.weeklyXP.toLocaleString("tr-TR")} XP`
                            : filters.metric === "totalXP"
                              ? `${p.totalXP.toLocaleString("tr-TR")} XP`
                              : filters.metric === "accuracy"
                                ? `%${Math.round(p.accuracy * 100)} doğruluk`
                                : filters.metric === "streak"
                                  ? `${p.streak} streak`
                                  : `${p.avgTime.toFixed(1)} sn`}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                          <Clock className="h-3 w-3" />
                          {p.favoriteMode}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Liste */}
              <div className="space-y-2 rounded-3xl bg-white/5 p-2 text-xs text-white/80 ring-1 ring-white/10 shadow-[0_0_40px_rgba(15,23,42,0.9)] sm:p-3">
                {kalan.map((p, index) => {
                  const rank = index + 4;
                  const trend = p.rankDelta24h;
                  const trendLabel =
                    trend === 0
                      ? "Sabit"
                      : trend < 0
                        ? `↑ ${Math.abs(trend)} sıra`
                        : `↓ ${trend} sıra`;
                  return (
                    <div
                      key={p.id}
                      id={`oyuncu-${p.id}`}
                      className="group flex items-center justify-between gap-2 rounded-2xl bg-black/40 px-3 py-2.5 text-[11px] text-white/80 transition hover:bg-black/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-right font-semibold text-slate-300">
                          #{rank}
                        </span>
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
                          style={{ backgroundColor: p.avatarColor }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-semibold">
                              {p.name}
                            </span>
                            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60">
                              {p.city}
                            </span>
                            <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-white/60">
                              {p.age} yaş
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-white/50">
                            <span>
                              {filters.metric === "weeklyXP"
                                ? `Haftalık XP: ${p.weeklyXP.toLocaleString(
                                    "tr-TR",
                                  )}`
                                : filters.metric === "totalXP"
                                  ? `Toplam XP: ${p.totalXP.toLocaleString(
                                      "tr-TR",
                                    )}`
                                  : filters.metric === "accuracy"
                                    ? `Doğruluk: %${Math.round(
                                        p.accuracy * 100,
                                      )}`
                                    : filters.metric === "streak"
                                      ? `Streak: ${p.streak}`
                                      : `Ortalama süre: ${p.avgTime.toFixed(
                                          1,
                                        )} sn`}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <TrendingUp
                                className={`h-3 w-3 ${
                                  trend < 0
                                    ? "text-emerald-300"
                                    : trend > 0
                                      ? "text-rose-300"
                                      : "text-slate-400"
                                }`}
                              />
                              <span>{trendLabel}</span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span>Son aktif: {p.lastActiveAt.toLocaleDateString("tr-TR")}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/60 sm:inline-flex">
                          {p.favoriteSubject} • {p.favoriteMode}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSeciliOyuncu(p)}
                          className="hidden rounded-2xl bg-white/10 px-3 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 sm:inline-flex"
                        >
                          Profil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>

      {/* Mobil filtre drawer */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm sm:hidden">
          <div className="w-full rounded-t-3xl bg-[#050816] p-4 text-xs text-white/80 ring-1 ring-white/15 shadow-[0_-18px_45px_rgba(0,0,0,0.8)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                <Filter className="h-3 w-3" />
                Filtreler
              </span>
              <button
                type="button"
                onClick={() => setShowFiltersMobile(false)}
                className="rounded-full bg-white/10 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-2 text-[11px] text-white/60">
              Mobilde temel filtreleri kullanabilirsin. Tüm gelişmiş filtreler
              için masaüstünden bak.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-9 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                value={filters.city}
                onChange={(e) => guncelleFiltre({ city: e.target.value })}
              >
                <option value="all">Tüm Şehirler</option>
                {sehirler.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                className="h-9 w-full rounded-2xl border border-white/10 bg-white/5 px-2 text-[11px] text-white/80 outline-none"
                value={filters.metric}
                onChange={(e) =>
                  guncelleFiltre({ metric: e.target.value as Metric })
                }
              >
                <option value="weeklyXP">Haftalık XP</option>
                <option value="totalXP">Toplam XP</option>
                <option value="accuracy">Doğru oranı</option>
                <option value="streak">Streak</option>
                <option value="avgTime">Hız</option>
              </select>
              <button
                type="button"
                onClick={resetFiltre}
                className="col-span-2 mt-1 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profil modal */}
      {seciliOyuncu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.7)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
                  style={{ backgroundColor: seciliOyuncu.avatarColor }}
                >
                  {seciliOyuncu.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-semibold">
                    {seciliOyuncu.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {seciliOyuncu.city} • {seciliOyuncu.age} yaş •{" "}
                    {seciliOyuncu.gender === "female" ? "Kız" : "Erkek"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSeciliOyuncu(null)}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  En İyi Ders
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {seciliOyuncu.favoriteSubject}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Tercih edilen oyun modu: {seciliOyuncu.favoriteMode}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  İstatistikler
                </p>
                <ul className="mt-1 space-y-1">
                  <li>Toplam XP: {seciliOyuncu.totalXP.toLocaleString("tr-TR")}</li>
                  <li>Haftalık XP: {seciliOyuncu.weeklyXP.toLocaleString("tr-TR")}</li>
                  <li>Doğruluk: %{Math.round(seciliOyuncu.accuracy * 100)}</li>
                  <li>Ortalama süre: {seciliOyuncu.avgTime.toFixed(1)} sn</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Son 7 Gün Aktivite (simülasyon)
              </p>
              <div className="mt-2 flex items-end gap-1">
                {Array.from({ length: 7 }).map((_, i) => {
                  const h =
                    10 +
                    ((seciliOyuncu.weeklyXP % 50) + i * 7 + seciliOyuncu.streak) %
                      40;
                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      className="flex-1 rounded-t-full bg-gradient-to-t from-sky-500 to-emerald-400"
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                  Hız Canavarı
                </span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700">
                  Doğruluk Ustası
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                  Günlük Oyuncu
                </span>
              </div>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-2xl bg-sky-600 px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-sky-700"
                >
                  Rakip Ekle
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-800 shadow-sm hover:border-sky-400"
                >
                  Düello Daveti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

