"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import PopularGamesGrid from "@/component/games/popular-games-grid";
import PopularReviews from "@/component/games/popular-reviews";
import { GameMetaItem, getGenres, getPlatforms } from "@/lib/game-api";

const FALLBACK_GENRES: GameMetaItem[] = [
  { id: 4, name: "Action", slug: "action" },
  { id: 5, name: "RPG", slug: "role-playing-games-rpg" },
  { id: 3, name: "Adventure", slug: "adventure" },
  { id: 2, name: "Shooter", slug: "shooter" },
];
const FALLBACK_PLATFORMS: GameMetaItem[] = [
  { id: 4, name: "PC", slug: "pc" },
  { id: 187, name: "PlayStation 5", slug: "playstation5" },
  { id: 186, name: "Xbox Series S/X", slug: "xbox-series-x" },
  { id: 7, name: "Nintendo Switch", slug: "nintendo-switch" },
];
const SORT_OPTIONS = [
  { label: "Popular This Week", value: "popular-this-week" },
  { label: "Highest Rated", value: "highest-rated" },
  { label: "Newest", value: "newest" },
  { label: "Most Reviewed", value: "most-reviewed" },
  { label: "Alphabetical", value: "alphabetical" },
];

export default function GamesPage() {
  const [genres, setGenres] = useState<GameMetaItem[]>(FALLBACK_GENRES);
  const [platforms, setPlatforms] = useState<GameMetaItem[]>(FALLBACK_PLATFORMS);
  const [activeGenre, setActiveGenre] = useState<GameMetaItem | null>(null);
  const [activePlatform, setActivePlatform] = useState<GameMetaItem | null>(null);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  useEffect(() => {
    let isMounted = true;

    Promise.all([getGenres(), getPlatforms()])
      .then(([genreResponse, platformResponse]) => {
        if (!isMounted) return;
        setGenres(genreResponse.items.length ? genreResponse.items : FALLBACK_GENRES);
        setPlatforms(platformResponse.items.length ? platformResponse.items : FALLBACK_PLATFORMS);
      })
      .catch(() => {
        if (!isMounted) return;
        setGenres(FALLBACK_GENRES);
        setPlatforms(FALLBACK_PLATFORMS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const gameFilters = useMemo(
    () => ({
      genre: activeGenre?.slug,
      platform: activePlatform?.slug,
      sort: activeSort.value,
    }),
    [activeGenre, activePlatform, activeSort],
  );

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-container-max mx-auto px-gutter py-12 flex flex-col gap-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 py-4 border-b border-surface-variant">
          {/* Genre */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("genre")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-label-md font-bold uppercase tracking-widest transition-all ${
                activeGenre
                  ? "border-primary text-primary bg-primary/10"
                  : "border-surface-variant text-on-surface-variant hover:text-white hover:border-outline"
              }`}
            >
              {activeGenre?.name ?? "Genre"}
              <span className="material-symbols-outlined text-[16px]">
                {openDropdown === "genre" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {openDropdown === "genre" && (
              <div className="absolute top-full left-0 mt-2 bg-surface-container border border-surface-variant rounded-xl shadow-2xl z-30 min-w-[160px] py-1 overflow-hidden">
                {activeGenre && (
                  <button
                    onClick={() => { setActiveGenre(null); setOpenDropdown(null); }}
                    className="w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest text-error hover:bg-surface-container-high transition-colors"
                  >
                    Clear
                  </button>
                )}
                {genres.map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => { setActiveGenre(g); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activeGenre?.slug === g.slug ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platform */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("platform")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-label-md font-bold uppercase tracking-widest transition-all ${
                activePlatform
                  ? "border-primary text-primary bg-primary/10"
                  : "border-surface-variant text-on-surface-variant hover:text-white hover:border-outline"
              }`}
            >
              {activePlatform?.name ?? "Platform"}
              <span className="material-symbols-outlined text-[16px]">
                {openDropdown === "platform" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {openDropdown === "platform" && (
              <div className="absolute top-full left-0 mt-2 bg-surface-container border border-surface-variant rounded-xl shadow-2xl z-30 min-w-[200px] py-1 overflow-hidden">
                {activePlatform && (
                  <button
                    onClick={() => { setActivePlatform(null); setOpenDropdown(null); }}
                    className="w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest text-error hover:bg-surface-container-high transition-colors"
                  >
                    Clear
                  </button>
                )}
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setActivePlatform(p); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activePlatform?.id === p.id ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active filter chips */}
          {(activeGenre || activePlatform) && (
            <button
              onClick={() => { setActiveGenre(null); setActivePlatform(null); }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-label-sm font-bold text-error border border-error/30 hover:bg-error/10 transition-colors uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Clear all
            </button>
          )}

          {/* Sort — right aligned */}
          <div className="relative ml-auto">
            <button
              onClick={() => toggleDropdown("sort")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-variant text-label-md font-bold uppercase tracking-widest text-on-surface-variant hover:text-white hover:border-outline transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">sort</span>
              {activeSort.label}
              <span className="material-symbols-outlined text-[16px]">
                {openDropdown === "sort" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {openDropdown === "sort" && (
              <div className="absolute top-full right-0 mt-2 bg-surface-container border border-surface-variant rounded-xl shadow-2xl z-30 min-w-[200px] py-1 overflow-hidden">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setActiveSort(s); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activeSort.value === s.value ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <PopularGamesGrid title="Browse Games" filters={gameFilters} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-4">
            <PopularReviews />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
