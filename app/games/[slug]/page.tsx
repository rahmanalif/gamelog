import Image from "next/image";
import { Suspense } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import GameHero from "@/component/games/details/game-hero";
import GameReviews from "@/component/games/details/game-reviews";
import BackButton from "@/component/games/details/back-button";
import { getGame, getGameReviews, getGames, GameSummary } from "@/lib/game-api";
import { getLists } from "@/lib/lists-api";
import { GameData } from "@/component/game-card";

function mapGameCard(game: GameSummary): GameData {
  return {
    id: game.id,
    title: game.title,
    slug: game.slug,
    img: game.coverImage ?? undefined,
    rating: (game.ratingCount ?? 0) > 0 ? (game.averageRating ?? undefined) : undefined,
    views: game.views ? String(game.views) : undefined,
    likes: game.likes ? String(game.likes) : undefined,
  };
}

function fallbackTitleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function GameReviewsSkeleton() {
  return (
    <div className="mt-stack-lg border-t border-surface-variant pt-stack-sm min-h-[500px]">
      <div className="flex gap-8 border-b border-surface-variant/50">
        <div className="h-8 w-24 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-16 rounded bg-surface-container-high animate-pulse" />
        <div className="h-8 w-32 rounded bg-surface-container-high animate-pulse" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-40 rounded-lg border border-surface-variant bg-surface-container-low animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

async function GameDetailsTabs({ gameId, primaryGenre }: { gameId?: string; primaryGenre?: string }) {
  const [reviews, lists, similarGames] = await Promise.all([
    gameId
      ? getGameReviews(gameId, { page: 1, limit: 10, sort: "popular" })
          .then((response) => response.items)
          .catch(() => [])
      : Promise.resolve([]),
    getLists({ sort: "trending", limit: 8 }).then((response) => response.items).catch(() => []),
    getGames({
      genre: primaryGenre,
      limit: 13,
      orderBy: "metacriticScore",
      order: "desc",
    })
      .then((response) =>
        response.items
          .filter((item) => String(item.id) !== gameId)
          .slice(0, 12)
          .map(mapGameCard),
      )
      .catch(() => []),
  ]);

  return (
    <GameReviews
      gameId={gameId}
      initialReviews={reviews}
      initialLists={lists}
      initialSimilarGames={similarGames}
    />
  );
}

export default async function GameDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallbackTitle = fallbackTitleFromSlug(slug);
  const game = await getGame(slug).catch(() => null);
  const gameId = game?.id ? String(game.id) : undefined;
  const primaryGenre = game?.genres?.[0]?.slug;

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-125 md:h-162.5 overflow-hidden pointer-events-none z-0">
        <Image
          alt="Backdrop"
          fill
          sizes="100vw"
          preload
          className="object-cover object-top opacity-50"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          maskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
          src={game?.backdropImage ?? game?.coverImage ?? "/elder 2.jpg"}
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
        <Suspense fallback={<GameReviewsSkeleton />}>
          <GameDetailsTabs gameId={gameId} primaryGenre={primaryGenre} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
