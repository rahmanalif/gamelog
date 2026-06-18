"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./games/review-card";
import type { ReviewData } from "./games/review-card";
import { getRecentReviews } from "@/lib/game-api";

const LIMIT = 6;

export default function RecentActivity() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRecentReviews(LIMIT, page)
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
        setHasMore(data.length === LIMIT);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end border-b border-surface-variant pb-2 mb-8">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
          JUST REVIEWED...
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <span className="text-on-surface-variant text-sm font-bold">{page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface disabled:opacity-30 transition-colors"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-0 border border-surface-variant rounded bg-surface-container-low overflow-hidden shadow-lg">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="p-4 flex gap-6 animate-pulse">
              <div className="w-20 h-28 flex-shrink-0 bg-surface-variant rounded" />
              <div className="flex flex-col gap-3 flex-grow pt-2">
                <div className="h-4 bg-surface-variant rounded w-1/2" />
                <div className="h-3 bg-surface-variant rounded w-1/4" />
                <div className="h-3 bg-surface-variant rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-0 border border-surface-variant rounded bg-surface-container-low overflow-hidden shadow-lg">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <ReviewCard review={review} />
              {index < reviews.length - 1 && (
                <div className="h-px bg-surface-variant w-full opacity-50" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
