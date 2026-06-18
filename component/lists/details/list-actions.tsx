"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { formatCount } from "@/lib/lists-api";
import { useDeleteListMutation, useLikeListMutation, useUnlikeListMutation } from "@/store/lists-api.slice";

interface ListActionsProps {
  listId: string;
  ownerId: string;
  likeCount: number;
  itemCount: number;
  initialIsLiked?: boolean;
}

export default function ListActions({
  listId,
  ownerId,
  likeCount: initialLikeCount,
  itemCount,
  initialIsLiked = false,
}: ListActionsProps) {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [likeList] = useLikeListMutation();
  const [unlikeList] = useUnlikeListMutation();
  const [deleteList] = useDeleteListMutation();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isOwner = isLoggedIn && Boolean(user?.id) && user?.id === ownerId;

  const handleLike = async () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (likeLoading) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;
    const nextLiked = !previousLiked;

    setActionError(null);
    setLikeLoading(true);
    setIsLiked(nextLiked);
    setLikeCount(Math.max(0, previousCount + (nextLiked ? 1 : -1)));

    try {
      const response = previousLiked ? await unlikeList(listId).unwrap() : await likeList(listId).unwrap();
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      setActionError(err instanceof Error ? err.message : "Failed to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this list? This cannot be undone.")) return;
    setDeleteLoading(true);
    setActionError(null);
    try {
      await deleteList(listId).unwrap();
      window.location.href = "/lists";
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete.");
      setDeleteLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {isOwner && (
          <>
            <Link
              href={`/lists/edit?id=${listId}`}
              className="bg-primary-container hover:bg-primary text-on-primary-container h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                edit_square
              </span>
              <span className="font-label-sm text-label-sm font-bold tracking-widest">EDIT</span>
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-surface-variant hover:bg-error/10 text-on-surface hover:text-error h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group border border-transparent hover:border-error/40 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                delete
              </span>
              <span className="font-label-sm text-label-sm font-bold tracking-widest">
                {deleteLoading ? "DELETING" : "DELETE"}
              </span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group border disabled:opacity-60 ${
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
          <span className="font-label-sm text-label-sm tracking-widest font-bold">
            LIKE {formatCount(likeCount)}
          </span>
        </button>

        <button
          type="button"
          className="bg-surface-variant hover:bg-surface-container-high text-on-surface h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group border border-transparent hover:border-surface-variant"
        >
          <span className="material-symbols-outlined text-xl group-hover:text-primary-container transition-colors">
            content_copy
          </span>
          <span className="font-label-sm text-label-sm tracking-widest font-bold">CLONE</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="bg-surface-variant hover:bg-surface-container-high text-on-surface h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors group border border-transparent hover:border-surface-variant"
        >
          <span className="material-symbols-outlined text-xl group-hover:text-primary-container transition-colors">
            ios_share
          </span>
          <span className="font-label-sm text-label-sm tracking-widest font-bold">SHARE</span>
        </button>

        <div className="bg-surface-container-low border border-surface-variant h-14 rounded-lg flex flex-col items-center justify-center gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-bold">
            GAMES
          </span>
          <span className="font-label-md text-label-md text-on-surface font-black tabular-nums">
            {formatCount(itemCount)}
          </span>
        </div>
      </div>

      {actionError && (
        <p className="mt-3 rounded border border-error/30 bg-error/10 px-3 py-2 text-error text-label-sm font-bold">
          {actionError}
        </p>
      )}
    </div>
  );
}
