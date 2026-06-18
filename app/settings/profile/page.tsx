"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  getProfile,
  updateProfile,
  getFavoriteGames,
  setFavoriteGames,
  type FavoriteGameEntry,
} from "@/lib/people-api";
import { searchGames, type GameSummary } from "@/lib/game-api";

type FavoriteSlot = FavoriteGameEntry["game"] | null;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function EditProfilePage() {
  const user = useAuthStore((s) => s.user);
  const username = user?.username ?? "";

  // profile text fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  // favorites
  const [favorites, setFavorites] = useState<FavoriteSlot[]>([null, null, null, null]);
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // save
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  // load profile + favorites on mount
  useEffect(() => {
    if (!username) return;
    setProfileLoading(true);
    Promise.all([
      getProfile(username),
      getFavoriteGames(username),
    ])
      .then(([prof, favEntries]) => {
        setName(prof.name ?? "");
        setBio(prof.bio ?? "");
        setLocation(prof.location ?? "");
        setWebsite(prof.website ?? "");
        setTwitter(prof.twitter ?? "");
        setDiscord(prof.discord ?? "");

        const slots: FavoriteSlot[] = [null, null, null, null];
        favEntries.forEach((e) => { slots[e.position - 1] = e.game; });
        setFavorites(slots);
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [username]);

  // game search
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setSearching(true);
    searchGames(debouncedQuery)
      .then((r) => setResults(r.items))
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  // close picker on outside click
  useEffect(() => {
    if (pickerOpen === null) { setQuery(""); setResults([]); return; }
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  const selectGame = (slot: number, game: GameSummary) => {
    setFavorites((prev) => {
      const next = [...prev];
      next[slot] = {
        id: String(game.id),
        title: game.title,
        slug: game.slug,
        coverUrl: game.coverImage ?? null,
        avgRating: game.averageRating ?? 0,
        likeCount: game.likes ?? 0,
        logCount: game.views ?? 0,
      };
      return next;
    });
    setPickerOpen(null);
  };

  const removeSlot = (slot: number) => {
    setFavorites((prev) => { const next = [...prev]; next[slot] = null; return next; });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const gameIds = favorites.filter(Boolean).map((g) => g!.id);
      await Promise.all([
        updateProfile({ name: name || undefined, bio: bio || undefined, location: location || undefined, website: website || undefined, twitter: twitter || undefined, discord: discord || undefined }),
        setFavoriteGames(gameIds),
      ]);
      setSaveMsg({ text: "Profile saved.", ok: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save.";
      setSaveMsg({ text: msg, ok: false });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "bg-transparent border-b-2 border-surface-variant py-2 text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50";

  if (profileLoading) {
    return (
      <div className="bg-background min-h-screen text-on-surface font-body antialiased flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="text-on-surface-variant animate-pulse text-label-md uppercase tracking-widest">Loading...</span>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface font-body antialiased flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[800px] mx-auto px-gutter py-12 flex flex-col gap-12">
        <header className="border-b border-surface-variant pb-6">
          <h1 className="font-display text-headline-md md:text-display-lg text-white font-bold tracking-tight">Edit Profile</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">Customize your public persona on Gamelog.</p>
        </header>

        <form className="flex flex-col gap-10" onSubmit={handleSave}>

          {/* Avatar */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8 bg-surface-container-low border border-surface-variant rounded-xl">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-surface-variant bg-surface-container-high relative group cursor-pointer flex-shrink-0 shadow-lg">
              <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                <span className="font-display text-display-lg text-white font-bold select-none">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[32px]">photo_camera</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left justify-center h-full pt-4">
              <button className="px-6 py-2 border-2 border-surface-variant text-on-surface font-bold text-label-md uppercase tracking-widest rounded hover:bg-surface-variant hover:border-outline-variant transition-all w-fit mx-auto sm:mx-0 shadow-sm" type="button">
                CHANGE AVATAR
              </button>
              <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest">JPG or PNG, max 5MB.</span>
            </div>
          </section>

          {/* Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Display Name</label>
              <input
                className={inputClass}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Username</label>
              <div className="relative">
                <span className="absolute left-0 top-2.5 text-on-surface-variant">@</span>
                <input
                  className="bg-transparent border-b-2 border-surface-variant py-2 pl-6 w-full text-body-lg text-on-surface-variant cursor-not-allowed opacity-70"
                  disabled
                  type="text"
                  value={username}
                />
              </div>
              <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Username cannot be changed.</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Location</label>
              <input
                className={inputClass}
                placeholder="City, Country"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Website</label>
              <input
                className={inputClass}
                placeholder="https://"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={200}
              />
            </div>
          </section>

          {/* Bio */}
          <section className="flex flex-col gap-2 mt-4">
            <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Bio</label>
            <textarea
              className="w-full bg-surface-container-low border border-surface-variant p-6 rounded-xl focus:outline-none focus:border-primary text-white font-body text-body-lg leading-relaxed min-h-[160px] resize-y placeholder:text-on-surface-variant/50 transition-colors"
              placeholder="Write something about your gaming journey..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
            />
            <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest self-end mt-2">
              {bio.length}/300
            </span>
          </section>

          {/* Favorite Games */}
          <section className="mt-6 flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-surface-variant pb-2">
              <h3 className="font-display font-bold text-headline-sm text-white tracking-wide">Favorite Games</h3>
              <span className="font-bold text-label-sm text-on-surface-variant uppercase tracking-[0.2em]">Choose up to 4</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {favorites.map((slot, i) => (
                <div key={i} className="relative">
                  {slot ? (
                    <div className="aspect-[2/3] relative group rounded-lg overflow-hidden border border-surface-variant bg-surface-container-high cursor-pointer shadow-md">
                      {slot.coverUrl ? (
                        <Image
                          src={slot.coverUrl}
                          alt={slot.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <span className="text-on-surface-variant text-center text-label-sm font-bold">{slot.title}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => setPickerOpen(i)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded text-label-sm font-bold uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Change
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlot(i)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-error/80 text-white rounded text-label-sm font-bold uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPickerOpen(i)}
                      className="w-full aspect-[2/3] relative group rounded-lg border-2 border-dashed border-surface-variant bg-surface-container-lowest/50 hover:bg-surface-container-high hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[32px]">add</span>
                      <span className="font-bold text-label-sm text-on-surface-variant group-hover:text-primary uppercase tracking-[0.2em] transition-colors">Select</span>
                    </button>
                  )}

                  {pickerOpen === i && (
                    <div
                      ref={pickerRef}
                      className="absolute top-full left-0 mt-2 w-72 bg-surface-container-high border border-surface-variant rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                      <div className="p-3 border-b border-surface-variant">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search games..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="w-full bg-surface-container-low border border-surface-variant rounded px-3 py-2 text-white text-body-md focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {searching && (
                          <div className="p-4 text-center text-on-surface-variant text-label-sm">Searching...</div>
                        )}
                        {!searching && results.length === 0 && query.trim() && (
                          <div className="p-4 text-center text-on-surface-variant text-label-sm">No results.</div>
                        )}
                        {!searching && !query.trim() && (
                          <div className="p-4 text-center text-on-surface-variant text-label-sm opacity-60">Type to search</div>
                        )}
                        {results.map((game) => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => selectGame(i, game)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                          >
                            <div className="w-8 h-12 shrink-0 rounded overflow-hidden border border-surface-variant relative bg-surface-container">
                              {game.coverImage && (
                                <Image src={game.coverImage} alt={game.title} fill className="object-cover" />
                              )}
                            </div>
                            <span className="text-body-md text-white font-bold truncate flex-1">{game.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Social Links */}
          <section className="mt-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-headline-sm text-white border-b border-surface-variant pb-2 tracking-wide">Social Links</h3>
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-lg border border-surface-variant flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                </div>
                <input
                  className={`${inputClass} flex-grow`}
                  placeholder="Twitter / X username"
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-lg border border-surface-variant flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                </div>
                <input
                  className={`${inputClass} flex-grow`}
                  placeholder="Discord username"
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>
          </section>

          {/* Connected Accounts */}
          <section className="mt-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-headline-sm text-white border-b border-surface-variant pb-2 tracking-wide">Connected Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {["Google", "Apple", "Steam"].map((provider) => (
                <button
                  key={provider}
                  className="flex items-center justify-between gap-3 rounded-lg border border-surface-variant bg-surface-container-low px-4 py-3 text-left opacity-70 cursor-not-allowed"
                  type="button"
                  disabled
                >
                  <span className="font-bold text-label-md uppercase tracking-widest text-on-surface">{provider}</span>
                  <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Soon</span>
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-surface-variant pt-8 sm:justify-end items-center">
            {saveMsg && (
              <span className={`text-label-sm font-bold uppercase tracking-widest mr-auto ${saveMsg.ok ? "text-primary" : "text-error"}`}>
                {saveMsg.text}
              </span>
            )}
            <Link
              href={`/people/${username}`}
              className="px-8 py-4 font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors w-full sm:w-auto text-center"
            >
              CANCEL
            </Link>
            <button
              className="px-10 py-4 bg-primary text-[#00210b] font-bold text-label-md uppercase tracking-[0.2em] rounded-full hover:bg-primary-container transition-all shadow-lg active:scale-95 w-full sm:w-auto disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
