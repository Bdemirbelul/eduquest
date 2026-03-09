import AdamAsmacaGame from "@/components/games/AdamAsmacaGame";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";
import Sidebar from "@/components/Sidebar";

export default function AdamAsmacaPage() {
  return (
    <main className="min-h-screen bg-[#0B1020] text-white antialiased">
      <div className="grid min-h-screen w-full grid-cols-1 gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1.7fr)] lg:gap-6 lg:px-8 xl:grid-cols-[260px_minmax(0,2fr)_320px] 2xl:grid-cols-[320px_minmax(0,2.2fr)_420px] 2xl:gap-8 2xl:px-12">
        <div className="h-full">
          <Sidebar />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:gap-6 2xl:gap-8">
          <Navbar />
          <section className="flex flex-1 items-center justify-center">
            <AdamAsmacaGame />
          </section>
        </div>

        <div className="h-full">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

