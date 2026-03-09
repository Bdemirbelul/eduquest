import {
  Atom,
  BookOpenCheck,
  Brain,
  Code2,
  Compass,
  FlaskConical,
  Languages,
  PenLine,
  Sigma,
} from "lucide-react";

export type Ders = {
  id: string;
  slug: string;
  baslik: string;
  altBaslik: string;
  ikon: React.ElementType;
  temaRengi: string;
  etiket?: string;
};

export const dersler: Ders[] = [
  {
    id: "math",
    slug: "matematik",
    baslik: "Matematik",
    altBaslik: "Problem çözme, cebir ve geometri pratikleri.",
    ikon: Sigma,
    etiket: "12+",
    temaRengi: "from-indigo-500/70 via-violet-500/70 to-rose-500/70",
  },
  {
    id: "english",
    slug: "ingilizce",
    baslik: "İngilizce",
    altBaslik: "Okuma, kelime ve konuşma görevleri.",
    ikon: Languages,
    etiket: "B1-B2",
    temaRengi: "from-sky-500/70 via-indigo-500/70 to-emerald-400/70",
  },
  {
    id: "mother_tongue",
    slug: "ana-dil",
    baslik: "Ana Dil (Türkçe / Dil Bilgisi)",
    altBaslik: "Dil bilgisi, yazım kuralları ve anlatım gücü.",
    ikon: PenLine,
    etiket: "Temel",
    temaRengi: "from-fuchsia-500/70 via-rose-500/70 to-amber-400/70",
  },
  {
    id: "biology",
    slug: "biyoloji",
    baslik: "Biyoloji",
    altBaslik: "Hücre, ekosistem ve insan biyolojisi görevleri.",
    ikon: Brain,
    etiket: "9+",
    temaRengi: "from-emerald-500/70 via-lime-400/70 to-teal-400/70",
  },
  {
    id: "chemistry",
    slug: "kimya",
    baslik: "Kimya",
    altBaslik: "Elementler, bileşikler ve tepkimeler simülasyonları.",
    ikon: FlaskConical,
    etiket: "Laboratuvar",
    temaRengi: "from-cyan-500/70 via-sky-500/70 to-indigo-500/70",
  },
  {
    id: "physics",
    slug: "fizik",
    baslik: "Fizik",
    altBaslik: "Kuvvet, hareket ve enerji deneyleri.",
    ikon: Atom,
    etiket: "STEM",
    temaRengi: "from-indigo-500/70 via-slate-500/70 to-sky-400/70",
  },
  {
    id: "history",
    slug: "tarih",
    baslik: "Tarih",
    altBaslik: "Antik medeniyetler, savaşlar ve kronoloji görevleri.",
    ikon: BookOpenCheck,
    temaRengi: "from-amber-500/70 via-orange-500/70 to-rose-500/70",
  },
  {
    id: "geography",
    slug: "cografya",
    baslik: "Coğrafya",
    altBaslik: "Harita, iklim ve bölge keşifleri.",
    ikon: Compass,
    temaRengi: "from-emerald-500/70 via-cyan-500/70 to-sky-400/70",
  },
  {
    id: "cs",
    slug: "bilgisayar-bilimleri",
    baslik: "Bilgisayar Bilimi",
    altBaslik: "Algoritmalar, kodlama ve mantık bulmacaları.",
    ikon: Code2,
    etiket: "Kodlama",
    temaRengi: "from-sky-500/70 via-indigo-500/70 to-purple-500/70",
  },
  {
    id: "literature",
    slug: "edebiyat",
    baslik: "Edebiyat",
    altBaslik: "Eser analizleri, tema ve karakter incelemeleri.",
    ikon: BookOpenCheck,
    temaRengi: "from-rose-500/70 via-purple-500/70 to-slate-500/70",
  },
  {
    id: "turkish",
    slug: "turkce",
    baslik: "Türkçe",
    altBaslik: "Okuma becerileri, paragraf ve anlam soruları.",
    ikon: PenLine,
    etiket: "Sınav",
    temaRengi: "from-amber-500/70 via-orange-500/70 to-rose-500/70",
  },
];

