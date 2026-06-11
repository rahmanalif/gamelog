"use client";

import { useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import PopularGamesGrid from "@/component/games/popular-games-grid";
import PopularReviews from "@/component/games/popular-reviews";

const GENRES = ["Action", "RPG", "Horror", "Racing", "Sports", "Adventure", "Shooter", "Platformer"];
const PLATFORMS = ["PlayStation 5", "PlayStation 4", "PlayStation 2", "Xbox Series X/S", "PC", "Nintendo Switch", "Mobile"];
const SORT_OPTIONS = ["Popular This Week", "Highest Rated", "Newest", "Most Reviewed", "Alphabetical"];

export default function GamesPage() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState("Popular This Week");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

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
              {activeGenre ?? "Genre"}
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
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setActiveGenre(g); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activeGenre === g ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {g}
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
              {activePlatform ?? "Platform"}
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
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setActivePlatform(p); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activePlatform === p ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {p}
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
              {activeSort}
              <span className="material-symbols-outlined text-[16px]">
                {openDropdown === "sort" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {openDropdown === "sort" && (
              <div className="absolute top-full right-0 mt-2 bg-surface-container border border-surface-variant rounded-xl shadow-2xl z-30 min-w-[200px] py-1 overflow-hidden">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setActiveSort(s); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-label-md font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-high ${
                      activeSort === s ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <PopularGamesGrid />

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
