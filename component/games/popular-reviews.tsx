"use client";

import { useEffect, useState } from "react";
import ReviewCard, { ReviewData } from "./review-card";
import { getRecentReviews } from "@/lib/game-api";

const REVIEWS_PER_PAGE = 3;

export default function PopularReviews() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRecentReviews(REVIEWS_PER_PAGE, currentPage)
      .then((data) => {
        const mapped: ReviewData[] = data
          .filter((r) => r.reviewText)
          .map((r) => ({
            id: r.id,
            reviewId: r.id,
            game: r.game.title,
            slug: r.game.slug,
            year: r.game.releaseDate
              ? String(new Date(r.game.releaseDate).getFullYear())
              : undefined,
            rating: r.rating ?? 0,
            user: r.user.username,
            avatar: r.user.avatar ?? "",
            poster: r.game.coverUrl ?? "/games/placeholder.jpg",
            likes: r.likesCount ?? 0,
            isLiked: r.isLiked ?? false,
            content: r.reviewText ?? "",
          }));
        setReviews(mapped);
        setHasMore(data.length === REVIEWS_PER_PAGE);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [currentPage]);

  if (!loading && reviews.length === 0) return null;

  const skeletonRows = [...Array(REVIEWS_PER_PAGE)];

  return (
    <section className="flex flex-col gap-stack-sm">
      <div className="border-b border-surface-variant pb-2">
        <h2 className="font-display text-headline-sm text-on-surface">Reviews</h2>
      </div>

      <div className="flex flex-col gap-0 border border-surface-variant rounded bg-surface-container-low overflow-hidden shadow-lg">
        {loading
          ? skeletonRows.map((_, i) => (
              <div key={i} className="p-4 flex gap-6 animate-pulse">
                <div className="w-20 h-28 flex-shrink-0 bg-surface-variant rounded" />
                <div className="flex flex-col gap-3 flex-grow pt-2">
                  <div className="h-4 bg-surface-variant rounded w-1/2" />
                  <div className="h-3 bg-surface-variant rounded w-1/4" />
                  <div className="h-3 bg-surface-variant rounded w-3/4" />
                </div>
              </div>
            ))
          : reviews.map((review, index) => (
              <div key={review.id}>
                <ReviewCard review={review} />
                {index < reviews.length - 1 && (
                  <div className="h-px bg-surface-variant w-full" />
                )}
              </div>
            ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-base">chevron_left</span>
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center rounded font-bold text-xs bg-primary text-on-primary shadow-sm"
        >
          {currentPage}
        </button>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={!hasMore || loading}
          className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-base">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
