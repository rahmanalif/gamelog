"use client";

import { useParams } from "next/navigation";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import ListHero from "@/component/lists/details/list-hero";
import ListActions from "@/component/lists/details/list-actions";
import ListGrid from "@/component/lists/details/list-grid";
import ListReviews from "@/component/lists/details/list-reviews";
import { useGetListQuery } from "@/store/lists-api.slice";

function getQueryErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return `Could not load this list. API returned ${status}.`;
    if (typeof status === "string") return `Could not load this list. ${status}`;
  }
  return "Could not load this list.";
}

export default function ListDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
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

  const backdropUrl = list?.items[0]?.game.coverUrl ?? null;

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      {/* Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-125 md:h-162.5 overflow-hidden pointer-events-none z-0">
        {backdropUrl ? (
          <img
            alt="Backdrop"
            className="w-full h-full object-cover object-top opacity-50"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            }}
            src={backdropUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-surface-container to-transparent opacity-50" />
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
              <div className="md:col-span-8 flex flex-col">
                <ListGrid
                  items={list.items}
                  updatedAt={list.updatedAt}
                  refreshing={isFetching}
                  onRefresh={refetch}
                />
                <ListReviews listId={list.id} initialCount={list.commentCount} />
              </div>
              <div className="md:col-span-4 mt-0 md:mt-20">
                <ListActions
                  listId={list.id}
                  ownerId={list.user.id}
                  likeCount={list.likeCount}
                  itemCount={list._count.items}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
