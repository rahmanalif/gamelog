"use client";

import Link from "next/link";
import { useState } from "react";
import { likeReview, unlikeReview } from "@/lib/game-api";
import { useAuthStore } from "@/store/auth.store";
import { getStoredAccessToken } from "@/lib/auth-session";

export interface ReviewData {
  id: string | number;
  reviewId?: string;
  game: string;
  slug?: string;
  year?: string;
  rating: number;
  user: string;
  avatar: string;
  poster: string;
  likes: number | string;
  isLiked?: boolean;
  content: string;
}

interface ReviewCardProps {
  review: ReviewData;
  showPoster?: boolean;
}

export default function ReviewCard({ review, showPoster = true }: ReviewCardProps) {
  const { isLoggedIn, openAuthModal } = useAuthStore();
  const [liked, setLiked] = useState(review.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(Number(review.likes));
  const [avatarError, setAvatarError] = useState(!review.avatar);

  async function toggleLike() {
    const token = getStoredAccessToken();
    if (!token) {
      openAuthModal("login");
      return;
    }
    if (!review.reviewId) return;
    const prev = liked;
    setLiked(!prev);
    setLikeCount((c) => c + (prev ? -1 : 1));
    try {
      if (prev) await unlikeReview(review.reviewId);
      else await likeReview(review.reviewId);
    } catch {
      setLiked(prev);
      setLikeCount((c) => c + (prev ? 1 : -1));
    }
  }

  const gameHref = review.slug ? `/games/${review.slug}` : undefined;

  const posterEl = (
    <div className="w-20 h-28 flex-shrink-0 bg-surface-variant rounded overflow-hidden border border-surface-variant shadow-md transition-transform group-hover:scale-105">
      <img
        alt={`${review.game} Poster`}
        className="w-full h-full object-cover"
        src={review.poster}
      />
    </div>
  );

  return (
    <div className="p-4 flex gap-6 hover:bg-surface-container transition-all duration-300 cursor-pointer group rounded-xl border border-transparent hover:border-surface-variant">
      {showPoster && (
        gameHref
          ? <Link href={gameHref}>{posterEl}</Link>
          : posterEl
      )}

      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            {gameHref ? (
              <Link href={gameHref}>
                <h3 className="font-display text-headline-sm text-on-surface leading-none group-hover:text-primary transition-colors truncate">
                  {review.game}
                </h3>
              </Link>
            ) : (
              <h3 className="font-display text-headline-sm text-on-surface leading-none group-hover:text-primary transition-colors truncate">
                {review.game}
              </h3>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-primary gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-on-surface-variant font-bold text-sm">
                {review.rating}/5
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm flex-shrink-0 bg-surface-variant">
                {!avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={review.user}
                    src={review.avatar}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant flex items-center justify-center w-full h-full">
                    person
                  </span>
                )}
              </div>
              <span className="text-on-surface font-bold text-base leading-none">
                {review.user}
              </span>
              {review.year && (
                <span className="text-on-surface-variant font-label-sm text-label-sm font-bold opacity-40 ml-1">
                  {review.year}
                </span>
              )}
            </div>

            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 font-label-sm text-label-sm w-fit transition-colors ${
                liked ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="font-bold">{likeCount}</span>
            </button>
          </div>
        </div>

        <p className="font-body text-body-md text-on-surface-variant mt-2 leading-relaxed italic border-l-2 border-primary/20 pl-4">
          &ldquo;{review.content}&rdquo;
        </p>
      </div>
    </div>
  );
}
