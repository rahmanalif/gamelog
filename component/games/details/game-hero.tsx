"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import LogGameModal from "./log-game-modal";
import AddToListModal from "./add-to-list-modal";

interface GameHeroProps {
  gameTitle?: string;
}

export default function GameHero({ gameTitle = "Elden Ring" }: GameHeroProps) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) { openAuthModal("login"); return; }
    action();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-8 lg:gap-12 relative">
        {/* Left Column: Poster */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden border border-surface-variant group shadow-[0_0_40px_rgba(0,230,118,0.05)] transition-all duration-300 hover:border-primary-container hover:shadow-[0_0_40px_rgba(0,230,118,0.15)]">
            <img
              alt={`${gameTitle} Box Art`}
              className="w-full h-full object-cover"
              src="/elder.jpg"
            />
          </div>

          {/* Quick Stats under poster */}
          <div className="mt-stack-sm flex justify-between items-center px-2 py-3 border-y border-surface-variant">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                visibility
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                2.4M
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                favorite
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                840K
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                format_list_bulleted
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                1.1M
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-stack-md">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-display text-display-lg md:text-[56px] text-on-surface tracking-tighter leading-tight font-bold">
                {gameTitle}
              </h1>
              <span className="font-headline text-headline-sm text-on-surface-variant font-normal">
                2022
              </span>
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>
                Directed by{" "}
                <Link
                  className="text-on-surface hover:text-primary transition-colors font-bold"
                  href="#"
                >
                  Hidetaka Miyazaki
                </Link>
              </span>
              <span className="text-surface-variant px-1">•</span>
              <span>
                <Link
                  className="text-on-surface hover:text-primary transition-colors font-bold"
                  href="#"
                >
                  FromSoftware
                </Link>
              </span>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 py-4 border-y border-surface-variant/50">
            <div className="flex items-center text-primary-container text-2xl">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star_half
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-headline-sm text-on-surface leading-none font-bold">
                4.6
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                out of 5 from 1.2M ratings
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
            <button
              onClick={() => requireAuth(() => setIsLogModalOpen(true))}
              className="bg-primary-container hover:bg-primary text-on-primary-container h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                edit_square
              </span>
              <span className="font-label-sm text-label-sm font-bold tracking-widest">
                RATE
              </span>
            </button>

            <button
              onClick={() => requireAuth(() => setIsLiked(!isLiked))}
              className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group border ${
                isLiked
                  ? "bg-error/20 border-error/40 text-error"
                  : "bg-surface-variant hover:bg-surface-container-high text-on-surface border-transparent hover:border-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{
                  fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">
                LIKE
              </span>
            </button>

            <button
              onClick={() => requireAuth(() => setIsWishlisted(!isWishlisted))}
              className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group border ${
                isWishlisted
                  ? "bg-tertiary-container/20 border-tertiary-container/40 text-tertiary-container"
                  : "bg-surface-variant hover:bg-surface-container-high text-on-surface border-transparent hover:border-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{
                  fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bookmark
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">
                WISHLIST
              </span>
            </button>

            <button
              onClick={() => requireAuth(() => setIsListModalOpen(true))}
              className="bg-surface-variant hover:bg-surface-container-high text-on-surface h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group border border-transparent hover:border-surface-variant"
            >
              <span className="material-symbols-outlined text-xl group-hover:text-primary-container transition-colors">
                playlist_add
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">
                LIST
              </span>
            </button>
          </div>

          {/* Synopsis */}
          <div className="font-body text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
            <p className="mb-4">
              Rise, Tarnished, and be guided by grace to brandish the power of
              the Elden Ring and become an Elden Lord in the Lands Between. A
              vast world where open fields with a variety of situations and huge
              dungeons with complex and three-dimensional designs are seamlessly
              connected.
            </p>
            <p>
              As you explore, the joy of discovering unknown and overwhelming
              threats await you, leading to a high sense of accomplishment. In
              addition to customizing the appearance of your character, you can
              freely combine the weapons, armor, and magic that you equip.
            </p>
          </div>

          {/* Platforms */}
          <div className="mt-2">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3 font-bold">
              Available On
            </h3>
            <div className="flex flex-wrap gap-2">
              {["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "PC (Steam)"].map(
                (platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded text-on-surface font-label-sm text-label-sm font-bold"
                  >
                    {platform}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <LogGameModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        gameTitle={gameTitle}
      />
      <AddToListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        gameTitle={gameTitle}
      />
    </>
  );
}
