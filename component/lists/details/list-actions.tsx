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
}

export default function ListActions({ listId, ownerId, likeCount: initialLikeCount, itemCount }: ListActionsProps) {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [likeList] = useLikeListMutation();
  const [unlikeList] = useUnlikeListMutation();
  const [deleteList] = useDeleteListMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner = isLoggedIn && Boolean(user?.id) && user?.id === ownerId;

  const handleLike = async () => {
    if (!isLoggedIn || likeLoading) return;
    setLikeLoading(true);
    try {
      if (isLiked) {
        const r = await unlikeList(listId).unwrap();
        setIsLiked(false);
        setLikeCount(r.likeCount);
      } else {
        const r = await likeList(listId).unwrap();
        setIsLiked(true);
        setLikeCount(r.likeCount);
      }
    } catch {
      // revert on error
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this list? This cannot be undone.")) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteList(listId).unwrap();
      window.location.href = "/lists";
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="md:col-span-4 mt-stack-md md:mt-0">
      <div className="bg-surface-container/90 backdrop-blur-md border border-outline-variant/60 rounded-lg overflow-hidden sticky top-24 shadow-xl">
        {/* Owner actions */}
        {isOwner && (
          <div className="flex border-b border-outline-variant/60">
            <Link
              href={`/lists/edit?id=${listId}`}
              className="flex-1 py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary">edit</span>
              <span className="font-label-md text-label-md font-bold">Edit</span>
            </Link>
            <div className="w-px bg-outline-variant/60" />
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-error/10 hover:text-error transition-colors group disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-error">delete</span>
              <span className="font-label-md text-label-md font-bold">
                {deleteLoading ? "Deleting…" : "Delete"}
              </span>
            </button>
          </div>
        )}

        {deleteError && (
          <p className="px-4 py-2 text-error text-label-sm bg-error/10 border-b border-outline-variant/60">{deleteError}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-colors border-b border-outline-variant/60 group disabled:opacity-60 ${
              isLiked ? "text-primary" : ""
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-colors ${
                isLiked ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
              }`}
              style={isLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
            <span className="font-label-md text-label-md font-bold">
              {isLiked ? "Liked" : "Like this list?"}{" "}
              <span className="text-on-surface-variant font-normal">{formatCount(likeCount)}</span>
            </span>
          </button>
          <button className="w-full py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-colors border-b border-outline-variant/60 group">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface">content_copy</span>
            <span className="font-label-md text-label-md font-bold">Clone this list</span>
          </button>
          <button className="w-full py-3 px-4 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md uppercase tracking-wider font-bold">
            Share
          </button>
        </div>

        {/* Progress */}
        <div className="p-4 bg-surface-container-low/80 border-t border-outline-variant/60">
          <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Total games</span>
              <span className="font-body text-body-md text-on-surface">{itemCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
