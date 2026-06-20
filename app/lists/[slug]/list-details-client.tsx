"use client";

import { useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import ListHero from "@/component/lists/details/list-hero";
import ListActions from "@/component/lists/details/list-actions";
import ListGrid from "@/component/lists/details/list-grid";
import ListComments from "@/component/lists/details/list-comments";
import { useAuthStore } from "@/store/auth.store";
import { useGetListQuery, useUpdateListMutation } from "@/store/lists-api.slice";

interface ListDetailsClientProps {
  slug: string;
}

function getQueryErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return `Could not load this list. API returned ${status}.`;
    if (typeof status === "string") return `Could not load this list. ${status}`;
  }
  return "Could not load this list.";
}

function CoverImagePicker({
  images,
  currentUrl,
  onSelect,
  onClose,
}: {
  images: string[];
  currentUrl: string | null;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-container rounded-xl border border-surface-variant p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-headline-sm text-on-surface font-bold">
            Choose Cover Image
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant mb-4">
          Select a game cover from your list to use as the backdrop
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => onSelect(url)}
              className={`relative aspect-2/3 rounded-lg overflow-hidden border-2 transition-all group ${
                url === currentUrl
                  ? "border-primary shadow-[0_0_12px_rgba(0,230,118,0.3)]"
                  : "border-surface-variant hover:border-primary-container"
              }`}
            >
              <img
                src={url}
                alt="Game cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {url === currentUrl && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary text-3xl drop-shadow-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-center text-on-surface-variant py-8">
            Add games to your list to choose a cover image
          </p>
        )}
      </div>
    </div>
  );
}

export default function ListDetailsClient({ slug }: ListDetailsClientProps) {
  const {
    data: list,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetListQuery(slug, {
    skip: !slug,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = Boolean(currentUserId && list?.user.id === currentUserId);

  const [showPicker, setShowPicker] = useState(false);
  const [updateList] = useUpdateListMutation();

  const backdropUrl = list?.coverImageUrl ?? list?.items[0]?.game.coverUrl ?? null;

  const coverImages = (list?.items ?? [])
    .map((item) => item.game.coverUrl)
    .filter((url): url is string => Boolean(url));

  const handleSelectCover = async (url: string) => {
    if (!list) return;
    try {
      await updateList({ id: list.id, input: { coverImageUrl: url } }).unwrap();
      setShowPicker(false);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-125 md:h-162.5 overflow-hidden z-0">
        {backdropUrl ? (
          <img
            alt="Backdrop"
            className="w-full h-full object-cover object-top opacity-50 pointer-events-none"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            }}
            src={backdropUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-surface-container to-transparent opacity-50 pointer-events-none" />
        )}

        {isOwner && list && coverImages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 hover:border-white/40 text-white/80 hover:text-white transition-all backdrop-blur-sm group"
          >
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
              photo_camera
            </span>
            <span className="font-label-sm text-label-sm tracking-wider font-bold hidden sm:inline">
              CHANGE COVER
            </span>
          </button>
        )}
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="w-full max-w-container-max mx-auto px-gutter mt-32 md:mt-75 pb-12 flex flex-col gap-12 relative z-20">
        {isLoading ? (
          <div className="py-32 flex flex-col gap-6 animate-pulse">
            <div className="h-8 bg-surface-container rounded w-1/3" />
            <div className="h-5 bg-surface-container rounded w-1/2 mt-2" />
            <div className="h-4 bg-surface-container rounded w-1/4 mt-2" />
          </div>
        ) : !list ? (
          <div className="py-32 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">
              format_list_bulleted
            </span>
            <p className="text-headline-sm text-on-surface-variant opacity-60">
              {error ? getQueryErrorMessage(error) : "List not found"}
            </p>
          </div>
        ) : (
          <>
            <ListHero list={list} />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-12 lg:col-span-10">
                <ListActions
                  listId={list.id}
                  ownerId={list.user.id}
                  likeCount={list.likeCount}
                  itemCount={list._count.items}
                  initialIsLiked={list.currentUser?.isLiked}
                />
              </div>

              <div className="md:col-span-12 lg:col-span-10 flex flex-col">
                <ListGrid
                  items={list.items}
                  updatedAt={list.updatedAt}
                  refreshing={isFetching}
                  onRefresh={refetch}
                />
              </div>
            </div>

            <div className="md:col-span-12 lg:col-span-10">
              <ListComments listId={list.id} initialCount={list.commentCount} />
            </div>
          </>
        )}
      </main>

      <Footer />

      {showPicker && (
        <CoverImagePicker
          images={coverImages}
          currentUrl={list?.coverImageUrl ?? null}
          onSelect={handleSelectCover}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
