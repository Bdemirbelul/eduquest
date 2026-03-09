 "use client";

import {
  BookOpen,
  Gamepad2,
  LayoutDashboard,
  Medal,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MainMenuItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
};

const mainMenu: MainMenuItem[] = [
  { label: "Ana Sayfa", icon: LayoutDashboard, href: "/" },
  { label: "Oyunlar", icon: Gamepad2, href: "/oyunlar", badge: "YENİ" },
  { label: "Dersler", icon: BookOpen, href: "/dersler" },
  { label: "Sıralama", icon: Trophy, href: "/siralama" },
  { label: "Başarımlar", icon: Medal, href: "/basarimlar" },
];

const socialMenu = [
  { label: "Arkadaşlar", icon: Users },
  { label: "Mesajlar", icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col gap-6 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.45)] 2xl:p-5">
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500/80 via-sky-500/80 to-emerald-400/80 p-[1px] shadow-[0_0_30px_rgba(56,189,248,0.5)]">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[#050816]/95 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-[0_0_25px_rgba(79,70,229,0.8)]">
            <span className="text-lg font-black tracking-tight">EQ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              EduQuest
            </span>
            <span className="text-[11px] font-medium tracking-[0.16em] text-white/60">
              LOBBY ALFA
            </span>
          </div>
        </div>
      </div>

      <nav className="space-y-4">
        <div className="space-y-1">
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`group flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/25 via-sky-500/20 to-emerald-400/25 text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] ring-1 ring-sky-400/50"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner shadow-black/40 transition-all duration-200 ${
                      isActive
                        ? "border-sky-300/60 bg-gradient-to-br from-indigo-500/60 to-sky-400/70 text-white"
                        : "group-hover:border-sky-300/50 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-gradient-to-r from-white/5 via-white/15 to-white/5" />

        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Sosyal
          </p>
          {socialMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-white/70 shadow-inner shadow-black/40 transition-all duration-200 group-hover:border-sky-300/60 group-hover:bg-white/10 group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-indigo-500/15 p-3 text-xs text-white/70 shadow-[0_0_30px_rgba(15,23,42,0.8)]">
        <p className="font-semibold text-white">
          Günlük bonus görevlerini kaçırma!
        </p>
        <p className="mt-1 text-[11px] text-white/70">
          Her gün giriş yap, derslerini tamamla ve ekstra oyun içi ödüller
          kazan.
        </p>
      </div>
    </aside>
  );
}

