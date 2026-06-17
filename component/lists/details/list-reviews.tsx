"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { ListReview } from "@/lib/lists-api";
import { useAuthStore } from "@/store/auth.store";
import { useCreateListReviewMutation, useGetListReviewsQuery } from "@/store/lists-api.slice";

interface ListReviewsProps {
  listId: string;
  initialCount?: number;
}

function formatReviewDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const data = record.data as Record<string, unknown> | undefined;
    const message = data?.message ?? record.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return "Unable to save your review.";
}

function ReviewerAvatar({ review }: { review: ListReview }) {
  const displayName = review.user.name || review.user.username;

  if (review.user.avatarUrl) {
    return (
      <img
        alt={displayName}
        src={review.user.avatarUrl}
        className="w-10 h-10 rounded-full object-cover border border-outline"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline flex items-center justify-center text-on-surface font-bold">
      {displayName.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ListReviews({ listId, initialCount = 0 }: ListReviewsProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { data: reviews = [], isLoading, isFetching, isError, refetch } = useGetListReviewsQuery(listId, {
    skip: !listId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [createListReview, { isLoading: isSubmitting }] = useCreateListReviewMutation();

  const visibleReviews = useMemo(
    () => reviews.filter((review) => review.content.trim()),
    [reviews],
  );
  const reviewCount = Math.max(initialCount, visibleReviews.length);
  const trimmedContent = content.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }

    if (!trimmedContent) {
      setSubmitError("Write a few thoughts before posting.");
      return;
    }

    try {
      await createListReview({ listId, input: { content: trimmedContent } }).unwrap();
      setContent("");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <section className="mt-10 border-t border-surface-variant/60 pt-8">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-headline-sm text-on-surface font-bold tracking-tight">
            Reviews
          </h2>
          <p className="font-body text-body-sm text-on-surface-variant mt-1">
            {reviewCount ? `${reviewCount} ${reviewCount === 1 ? "response" : "responses"}` : "Be the first to respond"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 w-9 rounded border border-surface-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
          aria-label="Refresh reviews"
          title="Refresh reviews"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-low border border-surface-variant rounded-lg p-4 mb-6">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          maxLength={1200}
          placeholder="Review this list..."
          className="w-full bg-background/60 border border-surface-variant rounded p-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary resize-y min-h-28"
        />
        <div className="flex items-center justify-between gap-3 mt-3">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {content.length}/1200
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-4 rounded bg-primary-container hover:bg-primary text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : isLoggedIn ? "Post Review" : "Sign In To Review"}
          </button>
        </div>
        {submitError && (
          <p className="mt-3 text-error font-label-sm text-label-sm font-bold">{submitError}</p>
        )}
      </form>

      <div className="flex flex-col gap-4">
        {visibleReviews.map((review) => {
          const displayName = review.user.name || review.user.username;

          return (
            <article
              key={review.id}
              className="bg-surface-container-low border border-surface-variant rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ReviewerAvatar review={review} />
                  <div className="min-w-0">
                    {review.user.username ? (
                      <Link
                        href={`/people/${review.user.username}`}
                        className="font-label-md text-label-md text-on-surface font-bold hover:text-primary transition-colors truncate block"
                      >
                        {displayName}
                      </Link>
                    ) : (
                      <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {displayName}
                      </p>
                    )}
                    {review.createdAt && (
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        {formatReviewDate(review.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px]">rate_review</span>
              </div>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed mt-4 whitespace-pre-line">
                {review.content}
              </p>
            </article>
          );
        })}

        {isLoading && (
          <div className="bg-surface-container-low border border-surface-variant rounded-lg p-5 animate-pulse">
            <div className="h-4 bg-surface-container rounded w-1/3 mb-4" />
            <div className="h-4 bg-surface-container rounded w-full mb-2" />
            <div className="h-4 bg-surface-container rounded w-2/3" />
          </div>
        )}

        {!isLoading && !visibleReviews.length && (
          <div className="bg-surface-container-low border border-surface-variant rounded-lg p-6 text-on-surface-variant">
            {isError ? "Reviews could not be loaded right now." : "No one has reviewed this list yet."}
          </div>
        )}
      </div>
    </section>
  );
}
