import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

type GameCard = {
  id: string;
  baslik: string;
  etiket: string;
  aciklama: string;
  chipler: string[];
  vurgulu?: boolean;
};

const games: GameCard[] = [
  {
    id: "duello",
    baslik: "Bilgi Kapışması (Düello)",
    etiket: "TÜM DERSLER",
    aciklama:
      "Gerçek zamanlı bilgi düellolarına katıl. Arkadaşlarınla aynı lobide skor tablolarını zorla.",
    chipler: ["Rekabet", "Hız", "Skor"],
    vurgulu: true,
  },
  {
    id: "hafiza",
    baslik: "Hafıza Oyunu",
    etiket: "HAFIZA",
    aciklama:
      "Sayıları ve şekilleri aklında tut. Seviye ilerledikçe kombinasyonlar zorlaşır.",
    chipler: ["Dikkat", "Hız", "Rekor"],
  },
  {
    id: "renkler",
    baslik: "Farklı Rengi Bul",
    etiket: "RENKLER",
    aciklama:
      "Benzer tonlar arasındaki en ufak farkı yakala. Görsel dikkatini ve hızını geliştir.",
    chipler: ["Renk", "Dikkat", "Hız"],
  },
  {
    id: "bayraklar",
    baslik: "Bayrağı Bul",
    etiket: "BAYRAKLAR",
    aciklama:
      "Doğru bayrağı en hızlı şekilde seç. Hafıza ve odaklanma becerilerini test et.",
    chipler: ["Bayrak", "Hız", "Dikkat"],
  },
  {
    id: "adam-asmaca",
    baslik: "Adam Asmaca",
    etiket: "KELİME",
    aciklama:
      "Gizli kelimeyi tahmin et. Her yanlış harf seni sona yaklaştırır. Kelime hazneni ve hızlı düşünme becerini geliştir.",
    chipler: ["Kelime", "Hafıza", "Mantık"],
  },
  {
    id: "dogru-yanlis",
    baslik: "Doğru mu Yanlış mı?",
    etiket: "DOĞRU/YANLIŞ",
    aciklama:
      "Bilgini test et. Karşına çıkan ifadelerin doğru mu yanlış mı olduğunu hızlıca karar ver.",
    chipler: ["Bilgi", "Refleks", "Hız"],
  },
  {
    id: "crossword-bulmaca",
    baslik: "Crossword Bulmaca",
    etiket: "BULMACA",
    aciklama:
      "İpuçlarını kullanarak kelimeleri bul ve bulmacayı tamamla. Dil becerilerini ve genel kültürünü geliştir.",
    chipler: ["Kelime", "Zeka", "Dil"],
  },
];

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />

          <section className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100 ring-1 ring-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.8)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span>Ücretsiz Oyunlar</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[1.7rem] lg:leading-[1.1]">
                Etkileşimli Demo Oyunlar
              </h1>
              <p className="max-w-2xl text-sm text-white/70 sm:text-[15px]">
                Hızlıca pratik yapabileceğin mini oyunlar. Hafıza, dikkat ve
                hızını geliştiren modları dene.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5 2xl:gap-6">
            {games.map((game, index) => {
              const isFeatured = game.vurgulu;
              return (
                <article
                  key={game.id}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-[1px] shadow-[0_0_40px_rgba(15,23,42,0.95)] ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/60 hover:ring-sky-400/40 ${
                    isFeatured
                      ? "lg:col-span-3 bg-gradient-to-br from-indigo-500/40 via-cyan-500/35 to-amber-400/40"
                      : "bg-gradient-to-br from-slate-900/40 via-indigo-900/40 to-sky-900/40"
                  }`}
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#050816]/95 px-4 py-4 sm:px-5 sm:py-5 lg:px-5 lg:py-5 2xl:px-6 2xl:py-6">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(129,140,248,0.6),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.6),transparent_55%),radial-gradient(circle_at_50%_0,rgba(251,191,36,0.4),transparent_55%)]" />
                    </div>

                    <div className="relative flex flex-1 flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 ring-1 ring-emerald-400/50">
                          {game.etiket}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 ring-1 ring-white/15">
                          Demo mod
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h2
                          className={`font-semibold text-white ${
                            isFeatured
                              ? "text-base sm:text-lg lg:text-xl"
                              : "text-sm sm:text-[15px]"
                          }`}
                        >
                          {game.baslik}
                        </h2>
                        <p className="text-xs text-white/70 sm:text-[13px]">
                          {game.aciklama}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {game.chipler.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70 ring-1 ring-white/15"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] text-white/50">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                          <span>Giriş gerekmez • Hızlı dene</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/oyunlar/${game.id}`}
                            className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.9)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(56,189,248,1)]"
                          >
                            Oyna
                          </Link>
                          <Link
                            href={`/oyunlar/${game.id}`}
                            className="rounded-2xl border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 shadow-[0_0_25px_rgba(15,23,42,0.8)] transition-all duration-200 hover:border-sky-400/70 hover:bg-white/10 hover:text-white"
                          >
                            Detay
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

