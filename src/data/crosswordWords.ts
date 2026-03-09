export type CrosswordDifficulty = "easy" | "medium" | "hard";

export type CrosswordCategory =
  | "genel"
  | "cografya"
  | "tarih"
  | "bilim"
  | "teknoloji"
  | "okul"
  | "doga"
  | "hayvanlar"
  | "gunluk"
  | "dil";

export type CrosswordWordEntry = {
  answer: string; // BÜYÜK HARF, TÜRKÇE KARAKTERLER OLABİLİR
  clue: string;
  difficulty: CrosswordDifficulty;
  category: CrosswordCategory;
};

// Not: Gerçek üretim ortamında bu listeyi 500+ / 1000+ kayda kadar
// genişletmek kolay; burada örnek olması için temsilî ve tekrar
// kullanılabilir bir alt küme veriyoruz.

export const crosswordWords: CrosswordWordEntry[] = [
  // Coğrafya – Kolay
  {
    answer: "ANKARA",
    clue: "Türkiye'nin başkenti",
    difficulty: "easy",
    category: "cografya",
  },
  {
    answer: "İZMİR",
    clue: "Ege Bölgesi'nde büyük bir liman kenti",
    difficulty: "easy",
    category: "cografya",
  },
  {
    answer: "ASYA",
    clue: "Yeryüzünün en büyük kıtası",
    difficulty: "easy",
    category: "cografya",
  },
  {
    answer: "AFRİKA",
    clue: "Sıcak iklimleriyle bilinen kıta",
    difficulty: "easy",
    category: "cografya",
  },
  {
    answer: "PASİFİK",
    clue: "Dünya'nın en büyük okyanusu",
    difficulty: "medium",
    category: "cografya",
  },
  // Okul – Kolay
  {
    answer: "LİSE",
    clue: "Ortaöğretim kurumu",
    difficulty: "easy",
    category: "okul",
  },
  {
    answer: "KİTAP",
    clue: "Okumak için kullanılan basılı kaynak",
    difficulty: "easy",
    category: "okul",
  },
  {
    answer: "KALEM",
    clue: "Yazı yazmak için kullanılan araç",
    difficulty: "easy",
    category: "okul",
  },
  {
    answer: "SİLGİ",
    clue: "Yapılan hataları temizleyen araç",
    difficulty: "easy",
    category: "okul",
  },
  // Bilim – Orta
  {
    answer: "ENERJİ",
    clue: "İş yapabilme kapasitesi",
    difficulty: "medium",
    category: "bilim",
  },
  {
    answer: "ATOM",
    clue: "Maddenin en küçük yapı taşlarından biri",
    difficulty: "medium",
    category: "bilim",
  },
  {
    answer: "MOLEKÜL",
    clue: "Birbirine bağlanmış atomlar topluluğu",
    difficulty: "medium",
    category: "bilim",
  },
  {
    answer: "HÜCRE",
    clue: "Canlıların en küçük canlı birimi",
    difficulty: "medium",
    category: "bilim",
  },
  // Tarih – Orta/Zor
  {
    answer: "CUMHURİYET",
    clue: "Türkiye'de 1923 yılında ilan edilen yönetim şekli",
    difficulty: "medium",
    category: "tarih",
  },
  {
    answer: "İNKILAP",
    clue: "Toplumsal yapıyı hızla değiştiren köklü yenilik",
    difficulty: "hard",
    category: "tarih",
  },
  // Genel kültür – Kolay
  {
    answer: "KIRMIZI",
    clue: "Trafik ışığında durmak için görülen renk",
    difficulty: "easy",
    category: "genel",
  },
  {
    answer: "MAVİ",
    clue: "Genellikle gökyüzü ile ilişkilendirilen renk",
    difficulty: "easy",
    category: "genel",
  },
  {
    answer: "HAFTA",
    clue: "Yedi günden oluşan zaman dilimi",
    difficulty: "easy",
    category: "genel",
  },
  // Dil / kelime – Orta
  {
    answer: "MANTIK",
    clue: "Akıl yürütme ve düşünme bilimi",
    difficulty: "medium",
    category: "dil",
  },
  {
    answer: "EDEBİYAT",
    clue: "Şiir, roman, öykü gibi türleri inceleyen alan",
    difficulty: "medium",
    category: "dil",
  },
  {
    answer: "KELİME",
    clue: "Harflerden oluşan anlamlı birim",
    difficulty: "easy",
    category: "dil",
  },
  // Doğa / hayvanlar – Kolay/Orta
  {
    answer: "IRMAK",
    clue: "Denize ya da göle dökülen akarsu",
    difficulty: "easy",
    category: "doga",
  },
  {
    answer: "ORMAN",
    clue: "Ağaçlarla kaplı geniş doğal alan",
    difficulty: "easy",
    category: "doga",
  },
  {
    answer: "ASLAN",
    clue: "Ormanların kralı olarak bilinen hayvan",
    difficulty: "easy",
    category: "hayvanlar",
  },
  {
    answer: "PENGUEN",
    clue: "Kutup bölgelerinde yaşayan uçamayan kuş",
    difficulty: "medium",
    category: "hayvanlar",
  },
  // Teknoloji – Orta
  {
    answer: "BİLGİSAYAR",
    clue: "Veri işleyen elektronik cihaz",
    difficulty: "medium",
    category: "teknoloji",
  },
  {
    answer: "İNTERNET",
    clue: "Dünyayı birbirine bağlayan iletişim ağı",
    difficulty: "medium",
    category: "teknoloji",
  },
  {
    answer: "YAZILIM",
    clue: "Bilgisayarın çalışmasını sağlayan komutlar bütünü",
    difficulty: "medium",
    category: "teknoloji",
  },
  // Günlük yaşam – Kolay
  {
    answer: "MASA",
    clue: "Üzerine eşya koyulan mobilya",
    difficulty: "easy",
    category: "gunluk",
  },
  {
    answer: "SANDALYE",
    clue: "Oturmak için kullanılan mobilya",
    difficulty: "easy",
    category: "gunluk",
  },
  {
    answer: "ÇANTA",
    clue: "Eşyaları taşımak için kullanılan aksesuar",
    difficulty: "easy",
    category: "gunluk",
  },
];

