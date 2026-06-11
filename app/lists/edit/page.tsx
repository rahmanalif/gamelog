"use client";
import { useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Link from "next/link";
import { POPULAR_GAMES } from "@/component/games/popular-games-grid";
import type { GameData } from "@/component/game-card";
import { useRouter } from "next/navigation";

export default function EditListPage() {
  const router = useRouter();
  const [privacy, setPrivacy] = useState("Anyone");
  const [searchQuery, setSearchQuery] = useState("");

  // Pre-fill with mock data since we are editing
  const [listName, setListName] = useState("My Favorite RPGs");
  const [description, setDescription] = useState("A collection of the greatest role-playing games ever made, curated over a lifetime of gaming.");
  const [tags, setTags] = useState("rpg, retro, ps2, favorites");
  const [addedGames, setAddedGames] = useState<GameData[]>([
    { id: 1, title: "Silent Hill 3", img: "/games/download (4).jpg", rating: 5 },
    { id: 2, title: "Spider-Man 3", img: "/games/124909-spider-man-3-windows-front-cover.png", rating: 3.5 },
  ]);

  const privacyOptions = [
    { label: "Anyone", description: "Publicly visible on your profile and in search results." },
    { label: "Anyone with the link", description: "Only visible to people who have the URL." },
    { label: "Friends", description: "Only your mutual followers can see this list." },
    { label: "People you follow", description: "Visible to anyone you follow." },
    { label: "Private (only you)", description: "Completely hidden from everyone else." },
  ];

  const searchResults = searchQuery.length > 1
    ? POPULAR_GAMES.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !addedGames.some((a) => a.id === g.id)
      ).slice(0, 6)
    : [];

  const addGame = (game: GameData) => {
    setAddedGames((prev) => [...prev, game]);
    setSearchQuery("");
  };

  const removeGame = (id: GameData["id"]) => {
    setAddedGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/people/PEWDIEPIE?tab=Lists');
  };

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[900px] mx-auto px-gutter py-12">
        <header className="mb-10 border-b border-surface-variant pb-6">
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant mb-2 uppercase tracking-widest font-bold">
            <Link href="/people/PEWDIEPIE?tab=Lists" className="hover:text-primary transition-colors">
              Lists
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Edit List</span>
          </div>
          <h1 className="font-display text-display-lg md:text-[48px] text-white tracking-tight leading-tight font-bold">
            Edit List
          </h1>
        </header>

        <form className="flex flex-col gap-10" onSubmit={handleSave}>
          {/* List Details */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                  Name of the list
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="e.g. My Favorite RPGs of All Time"
                  className="bg-surface-container border border-surface-variant rounded-lg p-4 text-body-lg focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="bg-surface-container border border-surface-variant rounded-lg p-4 text-body-md focus:outline-none focus:border-primary transition-colors text-white resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="rpg, retro, ps2 (comma separated)"
                  className="bg-surface-container border border-surface-variant rounded-lg p-4 text-body-md focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
            </div>

            <aside className="flex flex-col gap-6 bg-surface-container-low p-6 rounded-xl border border-surface-variant h-fit">
              <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                Privacy Settings
              </label>
              <div className="flex flex-col gap-4">
                {privacyOptions.map((option) => (
                  <label key={option.label} className="flex flex-col gap-1 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          privacy === option.label
                            ? "border-primary bg-primary"
                            : "border-outline group-hover:border-on-surface-variant"
                        }`}
                      >
                        {privacy === option.label && (
                          <div className="w-2 h-2 rounded-full bg-[#00210b]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="privacy"
                        className="hidden"
                        value={option.label}
                        checked={privacy === option.label}
                        onChange={(e) => setPrivacy(e.target.value)}
                      />
                      <span
                        className={`text-label-md font-bold tracking-wide transition-colors ${
                          privacy === option.label
                            ? "text-primary"
                            : "text-on-surface-variant group-hover:text-white"
                        }`}
                      >
                        {option.label.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant ml-8">
                      {option.description}
                    </p>
                  </label>
                ))}
              </div>
              
              <div className="mt-4 pt-6 border-t border-surface-variant">
                <button type="button" className="text-error hover:text-white font-bold text-label-md uppercase tracking-widest transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">delete</span> Delete List
                </button>
              </div>
            </aside>
          </section>

          {/* Games Section */}
          <section className="flex flex-col gap-4 border-t border-surface-variant pt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-headline-sm text-white">Edit Games</h2>
                <p className="text-body-md text-on-surface-variant">
                  Search for games to add to your list or drag to reorder.
                </p>
              </div>
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter game title..."
                  className="w-full bg-surface-container-high border border-surface-variant rounded-full py-3 pl-12 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-surface-container border border-surface-variant rounded-xl overflow-hidden shadow-xl">
                {searchResults.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => addGame(game)}
                    className="flex items-center gap-4 w-full px-4 py-3 hover:bg-surface-container-high transition-colors text-left group"
                  >
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant">
                      {game.img && (
                        <img src={game.img} alt={game.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-bold text-white group-hover:text-primary transition-colors truncate">
                        {game.title}
                      </p>
                      <div className="flex items-center text-primary gap-0 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className="material-symbols-outlined"
                            style={{
                              fontSize: "11px",
                              fontVariationSettings:
                                s <= Math.floor(game.rating || 0) ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
                      add
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Added games list or empty state */}
            {addedGames.length > 0 ? (
              <div className="flex flex-col gap-0 border border-surface-variant rounded-xl overflow-hidden divide-y divide-surface-variant">
                {addedGames.map((game, index) => (
                  <div key={game.id} className="flex items-center gap-4 px-4 py-3 bg-surface-container-low hover:bg-surface-container transition-colors group cursor-grab">
                    <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity cursor-grab">drag_indicator</span>
                    <span className="text-label-sm font-bold text-on-surface-variant w-6 text-center shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant">
                      {game.img && (
                        <img src={game.img} alt={game.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="flex-1 text-body-md font-bold text-white truncate">
                      {game.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeGame(game.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between bg-surface-container">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">
                    {addedGames.length} game{addedGames.length !== 1 ? "s" : ""} in list
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 min-h-40 border-2 border-dashed border-surface-variant rounded-xl flex flex-col items-center justify-center text-on-surface-variant gap-2 bg-surface-container-lowest/50">
                <span className="material-symbols-outlined text-[48px] opacity-20">
                  sports_esports
                </span>
                <p className="font-medium">No games added yet</p>
                <p className="text-label-md">Start typing above to build your collection</p>
              </div>
            )}
          </section>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 sm:gap-6 border-t border-surface-variant pt-10 mt-6">
            <Link
              href="/people/PEWDIEPIE?tab=Lists"
              className="text-label-md font-bold tracking-widest text-on-surface-variant hover:text-white transition-colors uppercase w-full sm:w-auto text-center py-4 sm:py-0"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-primary text-[#00210b] px-10 py-4 w-full sm:w-auto rounded-full font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
