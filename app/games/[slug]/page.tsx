import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import GameHero from "@/component/games/details/game-hero";
import GameReviews from "@/component/games/details/game-reviews";
import BackButton from "@/component/games/details/back-button";
import { getGame, getGameReviews } from "@/lib/game-api";

export default async function GameDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallbackTitle = slug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const game = await getGame(slug).catch(() => null);
  const reviews = game?.rawgId
    ? await getGameReviews(game.rawgId, { page: 1, limit: 10, sort: "popular" })
        .then((response) => response.items)
        .catch(() => [])
    : [];

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-125 md:h-162.5 overflow-hidden pointer-events-none z-0">
        <img
          alt="Backdrop"
          className="w-full h-full object-cover object-top opacity-50"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          maskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
          src={game?.backdropImage ?? "/elder 2.jpg"}
        />
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="w-full max-w-container-max mx-auto px-gutter mt-8 relative z-20">
        <BackButton />
      </div>

      <main className="w-full max-w-container-max mx-auto px-gutter mt-12 md:mt-55 pb-12 flex flex-col gap-12 relative z-20">
        <GameHero gameTitle={fallbackTitle} game={game} slug={slug} />
        <GameReviews rawgId={game?.rawgId} initialReviews={reviews} />
      </main>

      <Footer />
    </div>
  );
}
