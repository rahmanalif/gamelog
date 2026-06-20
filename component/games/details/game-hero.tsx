"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import LogGameModal from "./log-game-modal";
import AddToListModal from "./add-to-list-modal";
import {
  GameDetail,
  addToWatchlist,
  getGame,
  likeGame,
  removeFromWatchlist,
  unlikeGame,
} from "@/lib/game-api";

interface GameHeroProps {
  gameTitle?: string;
  game?: GameDetail | null;
  slug?: string;
}

function formatCompact(value?: number) {
  if (!value) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
    .format(value)
    .toLowerCase();
}

function releaseYear(releaseDate?: string | null) {
  if (!releaseDate) return "";
  return new Date(releaseDate).getFullYear();
}

function descriptionToParagraphs(description?: string | null) {
  if (!description) return [];
  return description
    .replace(/<[^>]+>/g, "")
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function RatingStars({ value, size = "text-2xl" }: { value: number; size?: string }) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={`flex items-center text-primary-container ${size}`}>
      {[...Array(5)].map((_, i) => {
        const star = i + 1;
        const isFull = rounded >= star;
        const isHalf = !isFull && rounded >= star - 0.5;

        return (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isFull || isHalf ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isHalf ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}

function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
      >
        <span className="material-symbols-outlined text-4xl">chevron_left</span>
      </button>

      <div
        className="relative w-[90vw] h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`Screenshot ${index + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
      >
        <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </button>

      <div className="absolute bottom-4 text-white/60 font-label-sm text-label-sm tracking-widest">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

function UserRatingPanel({ rating, onEdit }: { rating?: number; onEdit: () => void }) {
  if (!rating) return null;

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center justify-center gap-3 rounded border border-primary/45 bg-primary/10 px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/15 sm:w-auto sm:justify-start sm:px-5"
    >
      <span
        className="material-symbols-outlined text-primary text-[22px] shrink-0"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        verified
      </span>
      <div className="min-w-0">
        <p className="font-label-sm text-[10px] leading-none font-black uppercase tracking-widest text-primary">
          Your rating
        </p>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars value={rating} size="text-xl" />
          <span className="font-label-md text-label-md font-black text-on-surface tabular-nums">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function GameHero({ gameTitle = "Elden Ring", game, slug }: GameHeroProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameDetail | null>(game ?? null);
  const [isLiked, setIsLiked] = useState(game?.currentUser?.isLiked ?? false);
  const [isWishlisted, setIsWishlisted] = useState(game?.currentUser?.isInWatchlist ?? false);
  const [likeCount, setLikeCount] = useState(game?.likeCount ?? 0);
  const [watchlistCount, setWatchlistCount] = useState(game?.watchlistCount ?? 0);
  const [actionError, setActionError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = useMemo(() => {
    const imgs = currentGame?.images ?? [];
    return imgs.filter((url) => url !== currentGame?.coverImage);
  }, [currentGame?.images, currentGame?.coverImage]);

  const handleNavigate = useCallback(
    (i: number) => setLightboxIndex(i),
    [],
  );

  useEffect(() => {
    if (!slug || !isLoggedIn) return;

    getGame(slug)
      .then((freshGame) => {
        setCurrentGame(freshGame);
        setIsLiked(freshGame.currentUser?.isLiked ?? false);
        setIsWishlisted(freshGame.currentUser?.isInWatchlist ?? false);
        setLikeCount(freshGame.likeCount ?? 0);
        setWatchlistCount(freshGame.watchlistCount ?? 0);
      })
      .catch(() => {});
  }, [isLoggedIn, slug]);

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    action();
  };

  const title = currentGame?.title ?? gameTitle;
  const paragraphs = useMemo(
    () => descriptionToParagraphs(currentGame?.description),
    [currentGame?.description],
  );
  const ratingCount = currentGame?.ratingCount ?? 0;
  const userRating = ratingCount > 0 ? currentGame?.averageRating ?? 0 : 0;
  const myRating = currentGame?.currentUser?.rating;
  const platforms = currentGame?.platforms?.length
    ? currentGame.platforms.map((platform) => platform.name)
    : ["PlayStation 5", "PlayStation 4", "Xbox Series X/S", "PC (Steam)"];
  const gameId = currentGame?.id ? String(currentGame.id) : undefined;

  const toggleLike = async () => {
    if (!gameId) return;
    setActionError("");
    const previousLiked = isLiked;
    const previousCount = likeCount;
    setIsLiked(!previousLiked);
    setLikeCount(Math.max(0, previousCount + (previousLiked ? -1 : 1)));

    try {
      const response = previousLiked ? await unlikeGame(gameId) : await likeGame(gameId);
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      setActionError(err instanceof Error ? err.message : "Unable to update like");
    }
  };

  const toggleWatchlist = async () => {
    if (!gameId) return;
    setActionError("");
    const previousWishlisted = isWishlisted;
    const previousCount = watchlistCount;
    setIsWishlisted(!previousWishlisted);
    setWatchlistCount(Math.max(0, previousCount + (previousWishlisted ? -1 : 1)));

    try {
      const response = previousWishlisted
        ? await removeFromWatchlist(gameId)
        : await addToWatchlist(gameId);
      setIsWishlisted(response.isInWatchlist);
      setWatchlistCount(response.watchlistCount);
    } catch (err) {
      setIsWishlisted(previousWishlisted);
      setWatchlistCount(previousCount);
      setActionError(err instanceof Error ? err.message : "Unable to update watchlist");
    }
  };

  const refreshGameFromBackend = async () => {
    if (!slug) return;

    const freshGame = await getGame(slug);
    setCurrentGame(freshGame);
    setIsLiked(freshGame.currentUser?.isLiked ?? false);
    setIsWishlisted(freshGame.currentUser?.isInWatchlist ?? false);
    setLikeCount(freshGame.likeCount ?? 0);
    setWatchlistCount(freshGame.watchlistCount ?? 0);
  };

  const handleLogSaved = async () => {
    try {
      await refreshGameFromBackend();
      setActionError("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to refresh game details");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-8 lg:gap-12 relative">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden border border-surface-variant group shadow-[0_0_40px_rgba(0,230,118,0.05)] transition-all duration-300 hover:border-primary-container hover:shadow-[0_0_40px_rgba(0,230,118,0.15)]">
            <Image
              alt={`${title} Box Art`}
              src={currentGame?.coverImage ?? "/elder.jpg"}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
              preload
            />
          </div>

          <div className="mt-stack-sm flex justify-between items-center px-2 py-3 border-y border-surface-variant">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                visibility
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                {formatCompact(currentGame?.viewCount)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                favorite
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                {formatCompact(likeCount)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                format_list_bulleted
              </span>
              <span className="font-label-sm text-label-sm text-on-surface mt-1 uppercase tracking-tighter font-bold">
                {formatCompact(watchlistCount)}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-stack-md">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-display text-display-lg md:text-[56px] text-on-surface tracking-tighter leading-tight font-bold">
                {title}
              </h1>
              {currentGame?.releaseDate && (
                <span className="font-headline text-headline-sm text-on-surface-variant font-normal">
                  {releaseYear(currentGame.releaseDate)}
                </span>
              )}
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-2 flex-wrap">
              <span>
                Developed by{" "}
                <Link className="text-on-surface hover:text-primary transition-colors font-bold" href="#">
                  {currentGame?.developer ?? "Unknown"}
                </Link>
              </span>
              <span className="text-surface-variant px-1">/</span>
              <span>
                <Link className="text-on-surface hover:text-primary transition-colors font-bold" href="#">
                  {currentGame?.publisher ?? "Unknown Publisher"}
                </Link>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-4 border-y border-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <RatingStars value={userRating} />
              <div className="flex flex-col">
                <span className="font-headline text-headline-sm text-on-surface leading-none font-bold">
                  {ratingCount > 0 ? userRating.toFixed(1) : "N/A"}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  out of 5 from {formatCompact(ratingCount)} ratings
                </span>
              </div>
            </div>
            <UserRatingPanel
              rating={myRating}
              onEdit={() => requireAuth(() => setIsLogModalOpen(true))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
            <button
              onClick={() => requireAuth(() => setIsLogModalOpen(true))}
              className="bg-primary-container hover:bg-primary text-on-primary-container h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                edit_square
              </span>
              <span className="font-label-sm text-label-sm font-bold tracking-widest">RATE</span>
            </button>

            <button
              onClick={() => requireAuth(toggleLike)}
              className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group border ${
                isLiked
                  ? "bg-error/20 border-error/40 text-error"
                  : "bg-surface-variant hover:bg-surface-container-high text-on-surface border-transparent hover:border-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">LIKE</span>
            </button>

            <button
              onClick={() => requireAuth(toggleWatchlist)}
              className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group border ${
                isWishlisted
                  ? "bg-tertiary-container/20 border-tertiary-container/40 text-tertiary-container"
                  : "bg-surface-variant hover:bg-surface-container-high text-on-surface border-transparent hover:border-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">WISHLIST</span>
            </button>

            <button
              onClick={() => requireAuth(() => setIsListModalOpen(true))}
              className="bg-surface-variant hover:bg-surface-container-high text-on-surface h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group border border-transparent hover:border-surface-variant"
            >
              <span className="material-symbols-outlined text-xl group-hover:text-primary-container transition-colors">
                playlist_add
              </span>
              <span className="font-label-sm text-label-sm tracking-widest font-bold">LIST</span>
            </button>
          </div>

          {actionError && (
            <p className="text-label-sm text-error font-bold uppercase tracking-widest">
              {actionError}
            </p>
          )}

          <div className="font-body text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
            {paragraphs.length ? (
              paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? "mb-4" : undefined}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p>No description has been added for this game yet.</p>
            )}
          </div>

          <div className="mt-2">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3 font-bold">
              Available On
            </h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1.5 bg-surface-container-low border border-surface-variant rounded text-on-surface font-label-sm text-label-sm font-bold"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="mt-4">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3 font-bold">
                Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {galleryImages.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-video rounded-lg overflow-hidden border border-surface-variant hover:border-primary-container transition-colors group"
                  >
                    <Image
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && galleryImages.length > 0 && (
        <ImageLightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleNavigate}
        />
      )}

      <LogGameModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSaved={handleLogSaved}
        gameTitle={title}
        gamePoster={currentGame?.coverImage ?? "/elder.jpg"}
        platforms={currentGame?.platforms ?? []}
        gameId={gameId}
      />
      <AddToListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        gameId={currentGame?.id ? String(currentGame.id) : undefined}
        gameTitle={title}
      />
    </>
  );
}
