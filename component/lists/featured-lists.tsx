"use client";
import Link from "next/link";
import GameStack from "../games/game-stack";
import { listCoverImages, formatCount } from "@/lib/lists-api";
import { useGetListsQuery } from "@/store/lists-api.slice";

export default function FeaturedLists({ activeFilter = "TRENDING", hideHeader = false }: { activeFilter?: string; hideHeader?: boolean }) {
  const sort = activeFilter === "TOP RATED" ? "top_rated" : "trending";
  const { data, isLoading } = useGetListsQuery({ sort, limit: 4 }, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const lists = data?.items ?? [];

  return (
    <section>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4 border-b border-surface-variant pb-2">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">
            {activeFilter === "TRENDING" ? "Featured Lists" : activeFilter === "TOP RATED" ? "All-Time Top Rated" : "Lists from Friends"}
          </h2>
          <Link href="/lists" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-bold tracking-widest uppercase">
            ALL • OFFICIAL
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="aspect-[2/1] bg-surface-container rounded-lg" />
                <div className="h-4 bg-surface-container rounded w-3/4" />
              </div>
            ))
          : lists.map((list) => {
              const profile = list.user.profile;
              const images = listCoverImages(list, 4);
              return (
                <div key={list.id} className="flex flex-col">
                  <GameStack
                    images={images}
                    title={list.title}
                    href={`/lists/${list.id}`}
                    gamesCount={list._count.items}
                    likes={formatCount(list.likeCount)}
                    comments={formatCount(list.commentCount)}
                  />
                  <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-label-sm text-[11px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {profile.avatarUrl ? (
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-surface-variant">
                          <img alt="Avatar" className="w-full h-full object-cover" src={profile.avatarUrl} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[8px]">
                          {profile.name?.charAt(0).toUpperCase() ?? profile.username?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-bold truncate max-w-[120px]">
                        {profile.name || profile.username}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        {!isLoading && lists.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant opacity-60">
            No lists found.
          </div>
        )}
      </div>
    </section>
  );
}
