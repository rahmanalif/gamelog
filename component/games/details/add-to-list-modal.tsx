"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listCoverImages } from "@/lib/lists-api";
import { useAddGameToListMutation, useGetMyListsQuery } from "@/store/lists-api.slice";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string;
  gameTitle?: string;
}

export default function AddToListModal({
  isOpen,
  onClose,
  gameId,
  gameTitle = "this game",
}: AddToListModalProps) {
  const { data: myLists, isLoading: loading, isError } = useGetMyListsQuery(
    { limit: 50 },
    { skip: !isOpen, refetchOnFocus: true, refetchOnReconnect: true },
  );
  const [addGameToList] = useAddGameToListMutation();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lists = myLists?.items ?? [];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSelected([]);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (!gameId) {
      setError("Could not identify this game.");
      return;
    }
    if (selected.length === 0) {
      setError("Choose at least one list.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await Promise.all(selected.map((listId) => addGameToList({ listId, input: { gameId } }).unwrap()));
      setSaving(false);
      setSelected([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add this game to your list.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[440px] bg-surface-container border border-surface-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-6 pb-4 border-b border-surface-variant">
          <h2 className="font-display text-headline-sm text-white font-bold tracking-tight">Add to List</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Add <span className="text-white font-bold">{gameTitle}</span> to one of your lists.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-surface-variant max-h-[360px] overflow-y-auto">
          {loading && (
            <div className="py-10 text-center text-on-surface-variant opacity-60 text-body-md">
              Loading your lists…
            </div>
          )}
          {(error || isError) && (
            <div className="py-10 text-center text-error text-body-md">
              {error ?? "Could not load your lists."}
            </div>
          )}
          {!loading && !error && !isError && lists.length === 0 && (
            <div className="py-10 text-center text-on-surface-variant opacity-60 text-body-md">
              You have no lists yet.
            </div>
          )}
          {!loading && lists.map((list) => {
            const isSelected = selected.includes(list.id);
            const cover = listCoverImages(list, 1)[0];
            return (
              <button
                key={list.id}
                type="button"
                onClick={() => toggle(list.id)}
                className={`flex items-center gap-4 px-6 py-4 text-left w-full transition-colors hover:bg-surface-container-high ${
                  isSelected ? "bg-surface-container-high" : ""
                }`}
              >
                <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant shadow-sm bg-surface-variant">
                  {cover && (
                    <img alt={list.title} src={cover} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md font-bold text-on-surface uppercase tracking-wide truncate">
                    {list.title}
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">
                    {list._count.items} games
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "bg-primary border-primary" : "border-surface-variant"
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px] text-[#00210b]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6 pt-4 border-t border-surface-variant flex items-center justify-between gap-4">
          <Link
            href="/lists/new"
            onClick={onClose}
            className="flex items-center gap-1.5 text-label-md font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create New List
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="bg-primary text-[#00210b] px-7 py-2.5 rounded-lg font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md disabled:opacity-60"
          >
            {saving ? "Saving…" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
