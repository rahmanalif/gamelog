"use client";
import { useEffect, useState } from "react";
import GameCard, { GameData } from "@/component/game-card";
import { GameFilters, GameSummary, getGames, getPopularGames } from "@/lib/game-api";

export const POPULAR_GAMES: GameData[] = [
  { id: 1, title: "Spider-Man 3", rating: 4.2, views: "1.5m", likes: "124k", img: "/games/124909-spider-man-3-windows-front-cover.png" },
  { id: 2, title: "Devil May Cry 3", rating: 4.8, views: "8.5m", likes: "890k", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg" },
  { id: 3, title: "Hitman Contracts", rating: 4.3, views: "2.1m", likes: "156k", img: "/games/Hitman - Contracts.jpg" },
  { id: 4, title: "Resident Evil 4", rating: 4.9, views: "3.2m", likes: "210k", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg" },
  { id: 5, title: "Minecraft", rating: 4.6, views: "4.5m", likes: "340k", img: "/games/wp11667647-minecraft-poster-wallpapers.jpg" },
  { id: 6, title: "Call of Duty Ghosts", rating: 4.1, views: "650k", likes: "65k", img: "/games/Call of Duty Ghosts.jpg" },
  { id: 7, title: "Need for Speed Carbon", rating: 4.5, views: "1.2m", likes: "98k", img: "/games/need for speed carbon ps2.jpg" },
  { id: 8, title: "Grand Theft Auto Vice City", rating: 4.9, views: "5.5m", likes: "420k", img: "/games/grandtheftautovicecity_pc.jpg" },
  { id: 9, title: "IGI", rating: 4.2, views: "1.1m", likes: "76k", img: "/games/igic.jpg" },
  { id: 10, title: "Prince of Persia", rating: 4.7, views: "2.5m", likes: "180k", img: "/games/prince of persia.jpg" },
  { id: 11, title: "House of the Dead", rating: 4.0, views: "800k", likes: "45k", img: "/games/house of the dead.jpg" },
  { id: 12, title: "WWE Smackdown", rating: 4.4, views: "1.8m", likes: "110k", img: "/games/61N9DX5CRKL._SY445_.jpg" },
  { id: 13, title: "Elden Ring", rating: 4.9, views: "10m", likes: "2m", img: "/games/Box1.jpg" },
  { id: 14, title: "Spider-Man 3", rating: 4.2, views: "1.5m", likes: "124k", img: "/games/124909-spider-man-3-windows-front-cover.png" },
  { id: 15, title: "Devil May Cry 3", rating: 4.8, views: "8.5m", likes: "890k", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg" },
  { id: 16, title: "Hitman Contracts", rating: 4.3, views: "2.1m", likes: "156k", img: "/games/Hitman - Contracts.jpg" },
  { id: 17, title: "Resident Evil 4", rating: 4.9, views: "3.2m", likes: "210k", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg" },
  { id: 18, title: "Minecraft", rating: 4.6, views: "4.5m", likes: "340k", img: "/games/wp11667647-minecraft-poster-wallpapers.jpg" },
  { id: 19, title: "Call of Duty Ghosts", rating: 4.1, views: "650k", likes: "65k", img: "/games/Call of Duty Ghosts.jpg" },
  { id: 20, title: "Need for Speed Carbon", rating: 4.5, views: "1.2m", likes: "98k", img: "/games/need for speed carbon ps2.jpg" },
  { id: 21, title: "Grand Theft Auto Vice City", rating: 4.9, views: "5.5m", likes: "420k", img: "/games/grandtheftautovicecity_pc.jpg" },
  { id: 22, title: "IGI", rating: 4.2, views: "1.1m", likes: "76k", img: "/games/igic.jpg" },
  { id: 23, title: "Prince of Persia", rating: 4.7, views: "2.5m", likes: "180k", img: "/games/prince of persia.jpg" },
  { id: 24, title: "House of the Dead", rating: 4.0, views: "800k", likes: "45k", img: "/games/house of the dead.jpg" },
];

function formatCompact(value?: number) {
  if (!value) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value).toLowerCase();
}

function toGameData(game: GameSummary): GameData {
  const hasUserRatings = (game.ratingCount ?? 0) > 0;
  return {
    id: game.id ?? game.rawgId,
    title: game.title,
    slug: game.slug,
    rating: hasUserRatings ? (game.averageRating ?? 0) : 0,
    views: formatCompact(game.views),
    likes: formatCompact(game.likes),
    img: game.coverImage ?? undefined,
  };
}

interface PopularGamesGridProps {
  title?: string;
  filters?: GameFilters;
  initialGames?: GameData[];
  onMoreClick?: () => void;
  isFullView?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function PopularGamesGrid({
  title = "Popular Games This Week",
  filters,
  initialGames,
  onMoreClick,
  isFullView = false,
  page = 1,
  onPageChange,
}: PopularGamesGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [games, setGames] = useState<GameData[]>(initialGames ?? POPULAR_GAMES);
  const [isLoading, setIsLoading] = useState(!initialGames);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const displayedGames = isFullView || showAll ? games : games.slice(0, 12);

  useEffect(() => {
    let isMounted = true;

    async function loadGames() {
      setIsLoading(true);
      setError("");

      try {
        const limit = isFullView ? 18 : 24;
        const response = filters
          ? await getGames({ limit, page, ...filters })
          : await getPopularGames(limit, "week");

        if (isMounted) {
          setGames(response.items.map(toGameData));
          if (response.meta) {
            setTotalPages(response.meta.totalPages);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load games");
          setGames(initialGames ?? POPULAR_GAMES);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadGames();
    return () => {
      isMounted = false;
    };
  }, [filters, initialGames, isFullView, page]);

  return (
    <section className="flex flex-col gap-stack-md">
      <div className="flex justify-between items-end border-b border-surface-variant pb-2">
        <div>
          <h2 className="font-display text-headline-md text-on-surface">{title}</h2>
          {error && (
            <p className="text-label-sm text-error mt-1">
              Showing saved picks. {error}
            </p>
          )}
        </div>
        {!isFullView && (
          <button 
            onClick={onMoreClick || (() => setShowAll(!showAll))}
            disabled={games.length <= 12}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase"
          >
            {showAll ? "LESS" : "MORE"} <span className="material-symbols-outlined text-sm">{showAll ? "expand_less" : "expand_more"}</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? [...Array(isFullView ? 18 : 12)].map((_, index) => (
              <div key={index} className="aspect-[2/3] rounded bg-surface-container-high animate-pulse" />
            ))
          : displayedGames.map((game) => <GameCard key={game.id ?? game.title} game={game} />)}
      </div>

      {isFullView && totalPages > 1 && (
        <div className="flex justify-end items-center gap-6 mt-8 pb-4">
          <div className="text-label-md text-on-surface-variant uppercase tracking-widest font-bold">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1 || isLoading}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-surface-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-on-surface disabled:hover:border-surface-variant transition-all shadow-lg"
              title="Previous Page"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-surface-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-on-surface disabled:hover:border-surface-variant transition-all shadow-lg"
              title="Next Page"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
