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

function keyLabel(key: string) {
  return KEY_LABELS[key] || key.toUpperCase();
}

type KeyEntry = { label: string; correct: boolean; id: number };

export default function KonamiEgg() {
  const [show, setShow] = useState(false);
  const [keys, setKeys] = useState<KeyEntry[]>([]);
  const idCounter = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetKeys = useCallback(() => {
    setKeys([]);
  }, []);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(resetKeys, 5000);
  }, [resetKeys]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (show) return;

      const key = e.key;
      const currentIndex = keys.length;
      const expected = SEQUENCE[currentIndex];
      const isCorrect = expected !== undefined && key.toLowerCase() === expected.toLowerCase();

      idCounter.current++;
      const entry: KeyEntry = {
        label: keyLabel(key),
        correct: isCorrect,
        id: idCounter.current,
      };

      if (isCorrect) {
        const next = [...keys, entry];
        setKeys(next);
        restartTimer();

        if (next.length === SEQUENCE.length) {
          setShow(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          setTimeout(resetKeys, 300);
        }
      } else {
        setKeys((prev) => [...prev, entry]);
        if (timerRef.current) clearTimeout(timerRef.current);
        setTimeout(resetKeys, 800);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys, show, restartTimer, resetKeys]);

  useEffect(() => {
    if (show) {
      dismissRef.current = setTimeout(() => setShow(false), 5000);
    }
    return () => {
      if (dismissRef.current) clearTimeout(dismissRef.current);
    };
  }, [show]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {keys.length > 0 && (
        <div className="fixed top-[4.5rem] left-4 z-[199] flex items-center gap-1 animate-in fade-in">
          {keys.map((k) => (
            <span
              key={k.id}
              className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-bold border transition-all duration-200 ${
                k.correct
                  ? "border-primary/40 bg-primary/20 text-primary shadow-[0_0_8px_rgba(0,230,118,0.3)]"
                  : "border-error/40 bg-error/20 text-error shadow-[0_0_8px_rgba(255,50,50,0.3)]"
              }`}
            >
              {k.label}
            </span>
          ))}
        </div>
      )}

      {show && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShow(false)}
        >
          <div
            className="relative mx-4 w-full max-w-sm rounded-2xl border border-primary/30 bg-surface-container p-8 text-center shadow-[0_0_80px_rgba(0,230,118,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setShow(false)}
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
    </>
  );
}
