"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function GamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [genres, setGenres] = useState<GameMetaItem[]>(FALLBACK_GENRES);
  const [platforms, setPlatforms] = useState<GameMetaItem[]>(FALLBACK_PLATFORMS);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isBrowsingAll = searchParams.get("view") === "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  const activeGenre = useMemo(() => {
    const slug = searchParams.get("genre");
    return genres.find((g) => g.slug === slug) || null;
  }, [genres, searchParams]);

  const activePlatform = useMemo(() => {
    const slug = searchParams.get("platform");
    return platforms.find((p) => p.slug === slug) || null;
  }, [platforms, searchParams]);

  const activeSort = useMemo(() => {
    const val = searchParams.get("sort");
    return SORT_OPTIONS.find((s) => s.value === val) || SORT_OPTIONS[0];
  }, [searchParams]);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  const setIsBrowsingAll = (val: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("view", "all");
      params.set("page", "1");
    } else {
      params.delete("view");
      params.delete("page");
    }
    router.push(`/games?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/games?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/games?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genre");
    params.delete("platform");
    params.set("page", "1");
    router.push(`/games?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (isBrowsingAll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isBrowsingAll]);

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
        {/* Back Button if in Browse All Mode */}
        {isBrowsingAll && (
          <button
            onClick={() => setIsBrowsingAll(false)}
            className="flex items-center gap-2 text-primary hover:text-primary transition-opacity hover:opacity-80 font-bold uppercase tracking-widest text-label-md w-fit"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Discovery
          </button>
        )}

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
                    onClick={() => { setOpenDropdown(null); updateFilters("genre", null); }}
                    className="w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest text-error hover:bg-surface-container-high transition-colors"
                  >
                    Clear
                  </button>
                )}
                {genres.map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => { setOpenDropdown(null); updateFilters("genre", g.slug); }}
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
                    onClick={() => { setOpenDropdown(null); updateFilters("platform", null); }}
                    className="w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest text-error hover:bg-surface-container-high transition-colors"
                  >
                    Clear
                  </button>
                )}
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setOpenDropdown(null); updateFilters("platform", p.slug); }}
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
              onClick={clearAllFilters}
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
                    onClick={() => { setOpenDropdown(null); updateFilters("sort", s.value); }}
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

        <PopularGamesGrid 
          title={isBrowsingAll ? "All Games" : "Browse Games"} 
          filters={gameFilters} 
          onMoreClick={() => setIsBrowsingAll(true)}
          isFullView={isBrowsingAll}
          page={currentPage}
          onPageChange={handlePageChange}
        />

        {!isBrowsingAll && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-4">
              <PopularReviews />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <GamesPageContent />
    </Suspense>
  );
}
