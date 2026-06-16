"use client";
import Link from "next/link";
import GameStack from "../games/game-stack";
import { listCoverImages, formatCount } from "@/lib/lists-api";
import { useGetListsQuery } from "@/store/lists-api.slice";

export default function RecentlyLiked() {
  const { data, isLoading } = useGetListsQuery({ sort: "recent", limit: 3 }, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const lists = data?.items ?? [];

  return (
    <section>
      <div className="flex items-center justify-between mb-8 border-b border-surface-variant pb-2">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">Recently Liked</h2>
      </div>
      <div className="flex flex-col gap-10">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-12 border-b border-surface-variant pb-10 animate-pulse">
                <div className="w-full sm:w-48 shrink-0 aspect-[3/2] bg-surface-container rounded-lg" />
                <div className="flex flex-col gap-3 flex-1 py-2">
                  <div className="h-6 bg-surface-container rounded w-2/3" />
                  <div className="h-4 bg-surface-container rounded w-1/3" />
                </div>
              </div>
            ))
          : lists.map((list) => {
              const profile = list.user.profile;
              const images = listCoverImages(list, 4);
              return (
                <div key={list.id} className="flex flex-col sm:flex-row gap-12 border-b border-surface-variant pb-10 last:border-0">
                  <div className="w-full sm:w-48 shrink-0">
                    <GameStack
                      images={images}
                      title={list.title}
                      href={`/lists/${list.id}`}
                      showDetails={false}
                    />
                  </div>
                  <div className="flex flex-col justify-center py-2 flex-1">
                    <Link href={`/lists/${list.id}`}>
                      <h3 className="font-headline text-[22px] text-on-surface group-hover:text-primary transition-colors font-bold mb-2 leading-tight">
                        {list.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className="flex items-center gap-1.5 shrink-0">
                        {profile.avatarUrl ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-surface-variant border border-outline">
                            <img alt={profile.name || profile.username} className="w-full h-full object-cover" src={profile.avatarUrl} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[10px] text-on-surface border border-outline">
                            {(profile.name || profile.username)?.charAt(0).toUpperCase() ?? "?"}
                          </div>
                        )}
                        <span className="font-label-sm text-[13px] text-on-surface-variant font-bold">
                          {profile.name || profile.username}
                        </span>
                      </div>
                      <span className="text-on-surface-variant opacity-40 px-1">•</span>
                      <span className="font-label-sm text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">
                        {list._count.items} games
                      </span>
                      <span className="text-on-surface-variant opacity-40 px-1">•</span>
                      <span className="flex items-center gap-1 font-label-sm text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        {formatCount(list.likeCount)}
                      </span>
                    </div>
                    {list.description && (
                      <p className="font-body text-[15px] text-on-surface-variant line-clamp-3 leading-relaxed opacity-80 max-w-2xl">
                        {list.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        {!isLoading && lists.length === 0 && (
          <p className="text-on-surface-variant opacity-60 text-center py-8">No lists yet.</p>
        )}
      </div>
    </section>
  );
}
