import { Clock3, Gamepad2, GraduationCap, Users } from "lucide-react";

type StatItem = {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

const stats: StatItem[] = [
  {
    label: "Öğrenciler",
    value: "150B+",
    description: "Aktif oyuncu ve öğrenen topluluk",
    icon: Users,
  },
  {
    label: "Oyunlar",
    value: "20+",
    description: "Gerçek zamanlı çok oyunculu modlar",
    icon: Gamepad2,
  },
  {
    label: "Dersler",
    value: "15",
    description: "Oyunlaştırılmış konu paketleri",
    icon: GraduationCap,
  },
  {
    label: "Eşleştirme",
    value: "Canlı",
    description: "Anında rakip bulma sistemi",
    icon: Clock3,
  },
];

export default function Stats() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4 2xl:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_0_35px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/60 hover:ring-sky-400/40 xl:p-4 2xl:p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(129,140,248,0.20),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.22),transparent_55%)] opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/70 to-sky-400/80 text-white shadow-[0_0_20px_rgba(56,189,248,0.8)]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                  {stat.label}
                </span>
                <span className="text-lg font-semibold text-white">
                  {stat.value}
                </span>
                <span className="mt-0.5 text-[11px] text-white/60">
                  {stat.description}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

