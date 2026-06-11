import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Hero from "@/component/hero";
import PopularGamesGrid from "@/component/games/popular-games-grid";
import Features from "@/component/features";
import RecentActivity from "@/component/recent-activity";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <Navbar />
      
      <Hero />

      {/* Main Content Container - constrained to 1100px */}
      <div className="max-w-[1100px] mx-auto px-gutter py-12 flex flex-col gap-12 w-full">
        <PopularGamesGrid />
        <Features />
        <RecentActivity />
      </div>

      <Footer />
    </div>
  );
}
