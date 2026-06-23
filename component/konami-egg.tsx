"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
];

const KEY_LABELS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

export default function KonamiEgg() {
  const [triggered, setTriggered] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const posRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    posRef.current = 0;
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (triggered) return;

      const expected = SEQUENCE[posRef.current];
      if (expected && e.key.toLowerCase() === expected.toLowerCase()) {
        posRef.current++;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(reset, 5000);

        if (posRef.current === SEQUENCE.length) {
          setTriggered(true);
          if (timerRef.current) clearTimeout(timerRef.current);
        }
      } else {
        posRef.current = 0;
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggered, reset]);

  useEffect(() => {
    if (!triggered) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleKeys(i);
      if (i >= SEQUENCE.length) {
        clearInterval(interval);
        setTimeout(() => setShowModal(true), 400);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [triggered]);

  function dismiss() {
    setShowModal(false);
    setTriggered(false);
    setVisibleKeys(0);
    posRef.current = 0;
  }

  return (
    <>
      {triggered && visibleKeys > 0 && (
        <div className="fixed top-[4.5rem] left-4 z-[199] flex items-center gap-1">
          {SEQUENCE.slice(0, visibleKeys).map((key, i) => (
            <span
              key={i}
              className="inline-flex size-7 items-center justify-center rounded-md text-xs font-bold border border-primary/40 bg-primary/20 text-primary shadow-[0_0_8px_rgba(0,230,118,0.3)] animate-[pop_0.2s_ease-out]"
            >
              {KEY_LABELS[key] || key.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={dismiss}
        >
          <div
            className="relative mx-4 w-full max-w-sm rounded-2xl border border-primary/30 bg-surface-container p-8 text-center shadow-[0_0_80px_rgba(0,230,118,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={dismiss}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">code</span>
            </div>

            <p className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em] font-bold">
              Built by
            </p>

            <h2 className="mt-2 font-display text-headline-md text-on-surface font-bold tracking-tight">
              Mahmudur Rahman Alif
            </h2>

            <a
              href="mailto:rahman.alif.007@gmail.com"
              className="mt-3 inline-block font-body text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              rahman.alif.007@gmail.com
            </a>

            <div className="mt-6 rounded-lg bg-surface-variant/50 px-4 py-3">
              <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                Designed & developed with passion for gamers everywhere.
              </p>
            </div>

            <p className="mt-4 font-label-sm text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
              ↑ ↑ ↓ ↓ ← → ← →
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
