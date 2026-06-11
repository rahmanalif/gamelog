"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle?: string;
}

const MY_LISTS = [
  {
    id: 1,
    title: "My Favorite RPGs",
    gamesCount: 12,
    cover: "/games/download (10).jpg",
  },
  {
    id: 2,
    title: "PS2 Classics I Grew Up With",
    gamesCount: 18,
    cover: "/games/grandtheftautovicecity_pc.jpg",
  },
  {
    id: 3,
    title: "Best Action Games Ever",
    gamesCount: 9,
    cover: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg",
  },
  {
    id: 4,
    title: "Must-Play Horror",
    gamesCount: 6,
    cover: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg",
  },
  {
    id: 5,
    title: "Games to Finish This Year",
    gamesCount: 3,
    cover: "/games/download (7).jpg",
  },
];

export default function AddToListModal({
  isOpen,
  onClose,
  gameTitle = "this game",
}: AddToListModalProps) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onClose();
    setSelected([]);
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

        {/* Header */}
        <div className="p-6 pb-4 border-b border-surface-variant">
          <h2 className="font-display text-headline-sm text-white font-bold tracking-tight">
            Add to List
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Add{" "}
            <span className="text-white font-bold">{gameTitle}</span> to one of
            your lists.
          </p>
        </div>

        {/* Lists */}
        <div className="flex flex-col divide-y divide-surface-variant max-h-[360px] overflow-y-auto">
          {MY_LISTS.map((list) => {
            const isSelected = selected.includes(list.id);
            return (
              <button
                key={list.id}
                type="button"
                onClick={() => toggle(list.id)}
                className={`flex items-center gap-4 px-6 py-4 text-left w-full transition-colors hover:bg-surface-container-high ${
                  isSelected ? "bg-surface-container-high" : ""
                }`}
              >
                <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-surface-variant shadow-sm">
                  <img
                    alt={list.title}
                    src={list.cover}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md font-bold text-on-surface uppercase tracking-wide truncate">
                    {list.title}
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">
                    {list.gamesCount} games
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-surface-variant"
                  }`}
                >
                  {isSelected && (
                    <span
                      className="material-symbols-outlined text-[14px] text-[#00210b]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
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
            className="bg-primary text-[#00210b] px-7 py-2.5 rounded-lg font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
