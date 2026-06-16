"use client";

import { useState, useEffect, useRef } from "react";
import { GameMetaItem, logGame } from "@/lib/game-api";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function CustomDatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const parsed = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());
  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const select = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(d.toISOString().split("T")[0]);
    setOpen(false);
  };

  const displayLabel = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Select date...";

  return (
    <div ref={ref} className="relative select-none">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-surface-container-high border border-surface-variant rounded-lg p-3 text-body-md text-left flex items-center justify-between transition-colors hover:border-primary focus:outline-none focus:border-primary"
      >
        <span className={value ? "text-on-surface" : "text-on-surface-variant/40"}>{displayLabel}</span>
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
          {open ? "expand_less" : "calendar_month"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-surface-container border border-surface-variant rounded-xl p-4 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-body font-bold text-on-surface text-sm tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center font-bold text-[11px] tracking-widest text-on-surface-variant uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const thisDate = new Date(viewYear, viewMonth, day);
              thisDate.setHours(0, 0, 0, 0);
              const isSelected = selectedDate && thisDate.getTime() === selectedDate.getTime();
              const isToday = thisDate.getTime() === today.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(day)}
                  className={`mx-auto w-8 h-8 flex items-center justify-center rounded-lg text-sm font-body transition-colors
                    ${isSelected
                      ? "bg-primary text-on-primary-fixed font-bold"
                      : isToday
                      ? "border border-primary text-primary hover:bg-primary/20"
                      : "text-on-surface hover:bg-surface-variant"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-3 pt-3 border-t border-surface-variant">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-error transition-colors">Clear</button>
            <button type="button" onClick={() => { const t = new Date(); setViewYear(t.getFullYear()); setViewMonth(t.getMonth()); onChange(t.toISOString().split("T")[0]); setOpen(false); }} className="text-[11px] font-bold tracking-widest uppercase text-primary hover:text-primary-container transition-colors">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

interface LogGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
  gameTitle?: string;
  gamePoster?: string;
  platforms?: GameMetaItem[];
  gameId?: string | number;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = display >= star;
        const isHalf = !isFull && display >= star - 0.5;
        return (
          <div key={star} className="relative w-9 h-9 flex items-center justify-center cursor-pointer">
            <span
              className="material-symbols-outlined text-[32px] text-primary select-none"
              style={{ fontVariationSettings: isFull || isHalf ? "'FILL' 1" : "'FILL' 0" }}
            >
              {isHalf ? "star_half" : "star"}
            </span>
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full"
                onMouseEnter={() => setHover(star - 0.5)}
                onClick={() => onChange(value === star - 0.5 ? 0 : star - 0.5)}
              />
              <div
                className="w-1/2 h-full"
                onMouseEnter={() => setHover(star)}
                onClick={() => onChange(value === star ? 0 : star)}
              />
            </div>
          </div>
        );
      })}
      {display > 0 && (
        <span className="ml-2 font-headline text-headline-sm font-bold text-primary tabular-nums">
          {display % 1 === 0 ? `${display}.0` : display}
        </span>
      )}
    </div>
  );
}

export default function LogGameModal({
  isOpen,
  onClose,
  onSaved,
  gameTitle = "Elden Ring",
  gamePoster = "/elder.jpg",
  platforms = [],
  gameId,
}: LogGameModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [datePlayed, setDatePlayed] = useState(new Date().toISOString().split("T")[0]);
  const [platform, setPlatform] = useState("");
  const [finished, setFinished] = useState(true);
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId) return;

    const selectedPlatform = platforms.find((item) => String(item.id) === platform);
    setIsSaving(true);
    setError("");

    try {
      await logGame(gameId, {
        rating: rating || undefined,
        reviewText: review.trim() || undefined,
        playedAt: datePlayed,
        platformId: selectedPlatform?.id,
        platformName: selectedPlatform?.name,
        finished,
        containsSpoilers,
      });
      await onSaved?.();
      onClose();
      setReview("");
      setRating(0);
      setContainsSpoilers(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save log");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[520px] bg-surface-container border border-surface-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-on-surface-variant hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-5 p-6 pb-5 border-b border-surface-variant bg-surface-container-low">
          <div className="w-12 h-[72px] shrink-0 rounded overflow-hidden border border-surface-variant shadow-md">
            <img alt={gameTitle} src={gamePoster} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant mb-1">
              Log Game
            </p>
            <h2 className="font-display text-headline-sm text-white font-bold tracking-tight">
              {gameTitle}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Rating */}
          <div className="flex flex-col gap-3">
            <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
              Rating
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Finished toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
              Finished
            </span>
            <button
              type="button"
              onClick={() => setFinished(!finished)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                finished ? "bg-primary" : "bg-surface-variant"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
                  finished ? "right-1 bg-[#00210b]" : "left-1 bg-on-surface-variant"
                }`}
              />
            </button>
          </div>

          {/* Date Played */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
              Date Played
            </label>
            <CustomDatePicker value={datePlayed} onChange={setDatePlayed} />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
              Platform
            </label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-surface-container-high border border-surface-variant rounded-lg p-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface appearance-none cursor-pointer pr-10"
              >
                <option value="">Select platform...</option>
                {platforms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <span
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                style={{ fontSize: "18px" }}
              >
                expand_more
              </span>
            </div>
          </div>

          {/* Review */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                Review
              </label>
              <span className="text-label-sm text-on-surface-variant/60">(optional)</span>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              placeholder="Share your thoughts..."
              className="bg-surface-container-high border border-surface-variant rounded-lg p-3 text-body-md focus:outline-none focus:border-primary transition-colors text-on-surface resize-none placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
              Contains Spoilers
            </span>
            <button
              type="button"
              onClick={() => setContainsSpoilers(!containsSpoilers)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                containsSpoilers ? "bg-primary" : "bg-surface-variant"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
                  containsSpoilers ? "right-1 bg-[#00210b]" : "left-1 bg-on-surface-variant"
                }`}
              />
            </button>
          </div>

          {error && (
            <p className="text-label-sm text-error font-bold uppercase tracking-widest">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-2 border-t border-surface-variant">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md font-bold tracking-widest text-on-surface-variant hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !gameId || !datePlayed}
              className="bg-primary text-on-primary-fixed px-8 py-3 rounded-lg font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md flex items-center gap-2"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                edit_square
              </span>
              {isSaving ? "SAVING" : "SAVE LOG"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
