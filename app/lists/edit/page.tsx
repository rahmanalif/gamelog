"use client";
import { Suspense, useState, useEffect, useCallback, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Link from "next/link";
import { searchGames, type GameSummary } from "@/lib/game-api";
import {
  useAddGameToListMutation,
  useDeleteListMutation,
  useGetListQuery,
  useRemoveGameFromListMutation,
  useUpdateListMutation,
} from "@/store/lists-api.slice";

type AddedGame = { id: string; title: string; coverImage?: string | null; isExisting?: boolean };

const PRIVACY_OPTIONS = [
  { value: "PUBLIC", label: "Anyone", description: "Publicly visible on your profile and in search results." },
  { value: "UNLISTED", label: "Anyone with the link", description: "Only visible to people who have the URL." },
  { value: "PRIVATE", label: "Private (only you)", description: "Completely hidden from everyone else." },
] as const;

function getMutationErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const record = err as {
      status?: unknown;
      data?: { message?: unknown; error?: unknown };
      error?: unknown;
    };
    const message = record.data?.message ?? record.data?.error ?? record.error;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
    if (record.status) return `${fallback} (${String(record.status)})`;
  }
  return fallback;
}

function EditListContent() {
  const searchParams = useSearchParams();
  const listId = searchParams.get("id");

  const { data: list, isLoading, refetch } = useGetListQuery(listId ?? "", {
    skip: !listId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updateList] = useUpdateListMutation();
  const [deleteList] = useDeleteListMutation();
  const [addGameToList] = useAddGameToListMutation();
  const [removeGameFromList] = useRemoveGameFromListMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"PUBLIC" | "UNLISTED" | "PRIVATE">("PUBLIC");
  const [addedGames, setAddedGames] = useState<AddedGame[]>([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GameSummary[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!list) return;
    setTitle(list.title);
    setDescription(list.description ?? "");
    setPrivacy(list.privacy as "PUBLIC" | "UNLISTED" | "PRIVATE");
    setAddedGames(list.items.map((i) => ({
      id: i.gameId,
      title: i.game.title,
      coverImage: i.game.coverUrl,
      isExisting: true,
    })));
    setRemovedIds(new Set());
  }, [list]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    const r = await searchGames(q).catch(() => ({ items: [] as GameSummary[] }));
    setSearchResults(r.items.filter((g) => !addedGames.some((a) => a.id === String(g.id))));
  }, [addedGames]);

  const addGame = (game: GameSummary) => {
    setAddedGames((prev) => [...prev, { id: String(game.id), title: game.title, coverImage: game.coverImage }]);
    setRemovedIds((prev) => { const s = new Set(prev); s.delete(String(game.id)); return s; });
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeGame = (id: string) => {
    setAddedGames((prev) => prev.filter((g) => g.id !== id));
    setRemovedIds((prev) => new Set([...prev, id]));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!listId || !list) return;
    if (!title.trim()) { setError("List name is required."); return; }

    const existingIds = new Set(list.items.map((i) => i.gameId));
    const selectedGames = [...addedGames];
    const selectedRemovedIds = new Set(removedIds);
    const newGames = selectedGames.filter((g) => !existingIds.has(g.id));
    const toRemove = [...selectedRemovedIds].filter((id) => existingIds.has(id));

    setSubmitting(true);
    setError(null);
    setToast(null);
    try {
      await Promise.all([
        ...newGames.map((g) => addGameToList({ listId, input: { gameId: g.id } }).unwrap()),
        ...toRemove.map((id) => removeGameFromList({ listId, gameId: id }).unwrap()),
      ]);

      await updateList({
        id: listId,
        input: { title: title.trim(), description: description.trim(), privacy },
      }).unwrap();

      await refetch();
      setRemovedIds(new Set());
      setToast("List saved.");
      setSubmitting(false);
    } catch (err) {
      setError(getMutationErrorMessage(err, "Failed to save."));
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!listId || !confirm("Delete this list? This cannot be undone.")) return;
    try {
      await deleteList(listId).unwrap();
      window.location.href = "/lists";
    } catch (err) {
      setError(getMutationErrorMessage(err, "Failed to delete."));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen text-on-surface font-body">
        <Navbar />
        <main className="w-full max-w-[900px] mx-auto px-gutter py-12">
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-12 bg-surface-container rounded w-1/2" />
            <div className="h-48 bg-surface-container rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!listId || (!isLoading && !list)) {
    return (
      <div className="bg-background min-h-screen text-on-surface font-body">
        <Navbar />
        <main className="w-full max-w-[900px] mx-auto px-gutter py-32 text-center">
          <p className="text-headline-sm text-on-surface-variant opacity-60">{error ?? "No list ID provided."}</p>
          <Link href="/lists" className="mt-4 inline-block text-primary hover:underline">Back to lists</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary flex flex-col">
      <Navbar />

      {toast && (
        <div className="fixed right-4 top-20 z-[100] max-w-sm rounded-lg border border-primary/40 bg-surface-container-high px-4 py-3 text-on-surface shadow-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <p className="text-body-sm font-bold">{toast}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-on-surface-variant hover:text-on-surface"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[900px] mx-auto px-gutter py-12">
        <header className="mb-10 border-b border-surface-variant pb-6">
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant mb-2 uppercase tracking-widest font-bold">
            <Link href={listId ? `/lists/${listId}` : "/lists"} className="hover:text-primary transition-colors">
              {list?.title ?? "List"}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Edit</span>
          </div>
          <h1 className="font-display text-display-lg md:text-[48px] text-white tracking-tight leading-tight font-bold">
            Edit List
          </h1>
        </header>

        {error && (
          <div className="mb-6 px-4 py-3 bg-error-container text-on-error-container rounded-lg text-body-md">{error}</div>
        )}

        <form className="flex flex-col gap-10" onSubmit={handleSave}>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Name of the list</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Favorite RPGs of All Time"
                  maxLength={120}
                  className="bg-surface-container border border-surface-variant rounded-lg p-4 text-body-lg focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  maxLength={1000}
                  className="bg-surface-container border border-surface-variant rounded-lg p-4 text-body-md focus:outline-none focus:border-primary transition-colors text-white resize-none"
                />
              </div>
            </div>

            <aside className="flex flex-col gap-6 bg-surface-container-low p-6 rounded-xl border border-surface-variant h-fit">
              <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Privacy Settings</label>
              <div className="flex flex-col gap-4">
                {PRIVACY_OPTIONS.map((option) => (
                  <label key={option.value} className="flex flex-col gap-1 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${privacy === option.value ? "border-primary bg-primary" : "border-outline group-hover:border-on-surface-variant"}`}>
                        {privacy === option.value && <div className="w-2 h-2 rounded-full bg-[#00210b]" />}
                      </div>
                      <input type="radio" name="privacy" className="hidden" value={option.value} checked={privacy === option.value} onChange={() => setPrivacy(option.value)} />
                      <span className={`text-label-md font-bold tracking-wide transition-colors ${privacy === option.value ? "text-primary" : "text-on-surface-variant group-hover:text-white"}`}>
                        {option.label.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant ml-8">{option.description}</p>
                  </label>
                ))}
              </div>
              <div className="mt-4 pt-6 border-t border-surface-variant">
                <button type="button" onClick={handleDelete} className="text-error hover:text-white font-bold text-label-md uppercase tracking-widest transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">delete</span> Delete List
                </button>
              </div>
            </aside>
          </section>

          <section className="flex flex-col gap-4 border-t border-surface-variant pt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-headline-sm text-white">Edit Games</h2>
                <p className="text-body-md text-on-surface-variant">Search for games to add to your list.</p>
              </div>
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Enter game title..."
                  className="w-full bg-surface-container-high border border-surface-variant rounded-full py-3 pl-12 pr-4 text-body-md focus:outline-none focus:border-primary transition-colors text-white"
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-surface-container border border-surface-variant rounded-xl overflow-hidden shadow-xl">
                {searchResults.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => addGame(game)}
                    className="flex items-center gap-4 w-full px-4 py-3 hover:bg-surface-container-high transition-colors text-left group"
                  >
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant bg-surface-variant">
                      {game.coverImage && <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-bold text-white group-hover:text-primary transition-colors truncate">{game.title}</p>
                      {game.releaseDate && <p className="text-label-sm text-on-surface-variant">{game.releaseDate.slice(0, 4)}</p>}
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">add</span>
                  </button>
                ))}
              </div>
            )}

            {addedGames.length > 0 ? (
              <div className="flex flex-col gap-0 border border-surface-variant rounded-xl overflow-hidden divide-y divide-surface-variant">
                {addedGames.map((game, index) => (
                  <div key={game.id} className="flex items-center gap-4 px-4 py-3 bg-surface-container-low hover:bg-surface-container transition-colors">
                    <span className="text-label-sm font-bold text-on-surface-variant w-6 text-center shrink-0 tabular-nums">{index + 1}</span>
                    <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant bg-surface-variant">
                      {game.coverImage && <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />}
                    </div>
                    <p className="flex-1 text-body-md font-bold text-white truncate">{game.title}</p>
                    <button type="button" onClick={() => removeGame(game.id)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ))}
                <div className="px-4 py-3 bg-surface-container">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">
                    {addedGames.length} game{addedGames.length !== 1 ? "s" : ""} in list
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 min-h-40 border-2 border-dashed border-surface-variant rounded-xl flex flex-col items-center justify-center text-on-surface-variant gap-2 bg-surface-container-lowest/50">
                <span className="material-symbols-outlined text-[48px] opacity-20">sports_esports</span>
                <p className="font-medium">No games added yet</p>
              </div>
            )}
          </section>

          <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 sm:gap-6 border-t border-surface-variant pt-10 mt-6">
            <Link
              href={listId ? `/lists/${listId}` : "/lists"}
              className="text-label-md font-bold tracking-widest text-on-surface-variant hover:text-white transition-colors uppercase w-full sm:w-auto text-center py-4 sm:py-0"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-[#00210b] px-10 py-4 w-full sm:w-auto rounded-full font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function EditListPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background min-h-screen text-on-surface font-body">
          <Navbar />
          <main className="w-full max-w-[900px] mx-auto px-gutter py-12">
            <div className="animate-pulse flex flex-col gap-6">
              <div className="h-12 bg-surface-container rounded w-1/2" />
              <div className="h-48 bg-surface-container rounded" />
            </div>
          </main>
        </div>
      }
    >
      <EditListContent />
    </Suspense>
  );
}
