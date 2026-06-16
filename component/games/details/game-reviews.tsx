"use client";

import { useEffect, useMemo, useState } from "react";
import GameCard, { GameData } from "@/component/game-card";
import { GameReview, getGameReviews } from "@/lib/game-api";
import { formatCount, listCoverImages, ListSummary } from "@/lib/lists-api";

type Tab = "REVIEWS" | "LISTS" | "SIMILAR";

interface GameReviewsProps {
  gameId?: string | number;
  initialReviews?: GameReview[];
  initialLists?: ListSummary[];
  initialSimilarGames?: GameData[];
}

function formatCompact(value?: number) {
  if (!value) return "0";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
    .format(value)
    .toLowerCase();
}

function formatReviewDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-base">chevron_left</span>
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onChange(index + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs transition-all ${
              current === index + 1
                ? "bg-primary text-on-primary shadow-sm"
                : "border border-surface-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  );
}

function EmptyState({ children }: { children: string }) {
  return (
    <div className="bg-surface-container-low border border-surface-variant p-6 rounded-lg text-on-surface-variant">
      {children}
    </div>
  );
}

export default function GameReviews({
  gameId,
  initialReviews = [],
  initialLists = [],
  initialSimilarGames = [],
}: GameReviewsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("REVIEWS");
  const [listPage, setListPage] = useState(1);
  const [similarPage, setSimilarPage] = useState(1);
  const [reviews, setReviews] = useState<GameReview[]>(initialReviews);
  const [reviewsError, setReviewsError] = useState("");

  const listsPerPage = 4;
  const similarPerPage = 12;
  const totalListPages = Math.max(1, Math.ceil(initialLists.length / listsPerPage));
  const totalSimilarPages = Math.max(1, Math.ceil(initialSimilarGames.length / similarPerPage));
  const currentLists = initialLists.slice((listPage - 1) * listsPerPage, listPage * listsPerPage);
  const currentSimilar = initialSimilarGames.slice(
    (similarPage - 1) * similarPerPage,
    similarPage * similarPerPage,
  );
  const reviewItems = useMemo(() => reviews.filter((review) => review.reviewText), [reviews]);

  useEffect(() => {
    if (!gameId) return;
    let isMounted = true;

    getGameReviews(gameId, { page: 1, limit: 10, sort: "popular" })
      .then((response) => {
        if (!isMounted) return;
        setReviews(response.items);
        setReviewsError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setReviewsError(err instanceof Error ? err.message : "Unable to load reviews");
      });

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  return (
    <div className="mt-stack-lg border-t border-surface-variant pt-stack-sm min-h-[500px]">
      <div className="flex gap-8 border-b border-surface-variant/50 overflow-x-auto no-scrollbar">
        {(["REVIEWS", "LISTS", "SIMILAR"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-label-md text-label-md uppercase tracking-widest pb-3 whitespace-nowrap transition-all font-bold border-b-2 ${
              activeTab === tab
                ? "text-primary border-primary"
                : "text-on-surface-variant hover:text-white border-transparent"
            }`}
          >
            {tab === "SIMILAR" ? "SIMILAR GAMES" : tab === "REVIEWS" ? "POPULAR REVIEWS" : "LISTS"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "REVIEWS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
            {reviewItems.map((review) => (
              <div
                key={review.id}
                className="bg-surface-container-low border border-surface-variant p-6 rounded-lg flex flex-col gap-4 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline shadow-sm">
                      <img
                        alt={review.user.username}
                        className="w-full h-full object-cover"
                        src={review.user.avatar ?? "/users/pewdiepie.jpg"}
                      />
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">
                        {review.user.username}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-primary-container gap-0.5">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className="material-symbols-outlined"
                              style={{
                                fontVariationSettings:
                                  index < (review.rating ?? 0) ? "'FILL' 1" : "'FILL' 0",
                                fontSize: "14px",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            favorite
                          </span>
                          {formatCompact(review.likesCount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatReviewDate(review.playedAt ?? review.createdAt)}
                  </span>
                </div>
                <p className="font-body text-body-md text-on-surface-variant line-clamp-4 leading-relaxed italic">
                  &quot;{review.reviewText}&quot;
                </p>
              </div>
            ))}
            {!reviewItems.length && (
              <div className="md:col-span-2">
                <EmptyState>
                  {reviewsError || "No reviews have been written for this game yet."}
                </EmptyState>
              </div>
            )}
          </div>
        )}

        {activeTab === "LISTS" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            {currentLists.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {currentLists.map((list) => (
                  <a key={list.id} href={`/lists/${list.id}`} className="group cursor-pointer flex flex-col">
                    <div className="flex h-32 mb-3 rounded-lg overflow-hidden border border-surface-variant group-hover:border-primary transition-colors shadow-sm bg-surface-container-low">
                      {listCoverImages(list).map((img, index) => (
                        <img
                          key={img}
                          alt={list.title}
                          className={`w-1/4 h-full object-cover ${
                            index < 3 ? "border-r border-surface-variant" : ""
                          }`}
                          src={img}
                        />
                      ))}
                      {!listCoverImages(list).length && (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl opacity-30">grid_view</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-headline text-[18px] leading-tight text-on-surface group-hover:text-primary transition-colors font-bold mb-1 truncate">
                      {list.title}
                    </h3>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[11px]">
                      <span className="font-bold truncate max-w-[110px]">
                        {list.user?.profile?.username ?? list.user?.profile?.name ?? "Player"}
                      </span>
                      <span className="opacity-60 shrink-0">{list._count?.items ?? 0} games</span>
                      <span className="flex items-center gap-1 ml-auto opacity-60">
                        <span
                          className="material-symbols-outlined text-[10px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                        {formatCount(list.likeCount ?? list._count?.likes ?? 0)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState>No public lists are available yet.</EmptyState>
            )}
            {totalListPages > 1 && (
              <Pagination current={listPage} total={totalListPages} onChange={setListPage} />
            )}
          </div>
        )}

        {activeTab === "SIMILAR" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            {currentSimilar.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {currentSimilar.map((game) => (
                  <GameCard key={game.id ?? game.slug ?? game.title} game={game} />
                ))}
              </div>
            ) : (
              <EmptyState>No similar games were found.</EmptyState>
            )}
            {totalSimilarPages > 1 && (
              <Pagination current={similarPage} total={totalSimilarPages} onChange={setSimilarPage} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
