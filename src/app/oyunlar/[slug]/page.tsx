import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";
import FlagQuizGame from "@/components/flags/FlagQuizGame";

type GameMeta = {
  baslik: string;
  aciklama: string;
};

const GAME_META: Record<string, GameMeta> = {
  duello: {
    baslik: "Bilgi Kapışması (Düello)",
    aciklama:
      "Gerçek zamanlı bilgi düelloları çok yakında burada. Hazırlıklarını tamamla, rakiplerini bekletme.",
  },
  hafiza: {
    baslik: "Hafıza Oyunu",
    aciklama:
      "Hafıza kartları, artan seviye zorluğu ve günlük görevlerle dolu özel bir mod üzerinde çalışıyoruz.",
  },
  renkler: {
    baslik: "Farklı Rengi Bul",
    aciklama:
      "Renk tonları, hız ve dikkat odaklı mini oyun deneyimi yakında burada olacak.",
  },
  bayraklar: {
    baslik: "Bayrağı Bul",
    aciklama:
      "Dünya bayraklarını test edeceğin hızlı ve rekabetçi bir mod geliştiriliyor.",
  },
  "adam-asmaca": {
    baslik: "Adam Asmaca",
    aciklama:
      "Gizli kelimeyi tahmin et. Her yanlış harf seni sona yaklaştırır. Kelime hazneni ve hızlı düşünme becerini geliştir.",
  },
  "dogru-yanlis": {
    baslik: "Doğru mu Yanlış mı?",
    aciklama:
      "Bilgini test et. Karşına çıkan ifadelerin doğru mu yanlış mı olduğunu hızlıca karar ver.",
  },
  "crossword-bulmaca": {
    baslik: "Crossword Bulmaca",
    aciklama:
      "İpuçlarını kullanarak kelimeleri bul ve bulmacayı tamamla. Dil becerilerini ve genel kültürünü geliştir.",
  },
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = GAME_META[slug];
  const isFlagGame = slug === "bayraklar";

  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />

          <section className="flex flex-1 items-center">
            <div className="flex w-full justify-center">
              {isFlagGame ? (
                <FlagQuizGame />
              ) : (
                <div className="max-w-2xl space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_45px_rgba(15,23,42,0.95)] sm:p-6 2xl:p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100 ring-1 ring-amber-400/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
                    <span>Yakında</span>
                  </span>

                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[1.8rem] lg:leading-[1.15]">
                      {meta?.baslik ?? "Oyun modu hazırlanıyor"}
                    </h1>
                    <p className="text-sm text-white/70 sm:text-[15px]">
                      {meta?.aciklama ??
                        "Bu oyun modu henüz yayınlanmadı. Yeni sezon güncellemesiyle birlikte burada aktif olacak."}
                    </p>
                  </div>

                  <p className="text-xs text-white/50">
                    Bu sayfa şu anda bir önizleme alanıdır. Oyun modları
                    yayınlandığında; canlı skorlar, eşleştirme durumu ve
                    arkadaş davetleri burada görünecek.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

