"use client";
import GameStack from "../games/game-stack";
import { listCoverImages } from "@/lib/lists-api";
import { useGetListsQuery } from "@/store/lists-api.slice";

export default function CrewPicks() {
  const { data, isLoading } = useGetListsQuery({ sort: "top_rated", limit: 3 }, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const lists = data?.items ?? [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-surface-variant pb-2">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">Crew Picks</h2>
      </div>
      <div className="flex flex-col gap-12">
        {isLoading
          ? Array.from({ length: 1 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="aspect-[2/1] bg-surface-container rounded-lg" />
                <div className="h-4 bg-surface-container rounded w-2/3" />
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
                  />
                  <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-label-sm text-[11px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {profile.avatarUrl ? (
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-surface-variant">
                          <img alt="Avatar" className="w-full h-full object-cover" src={profile.avatarUrl} />
                        </div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[7px]">
                          {(profile.name || profile.username)?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-bold">{profile.name || profile.username}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        {!isLoading && lists.length === 0 && (
          <p className="text-on-surface-variant opacity-60 text-sm">No crew picks yet.</p>
        )}
      </div>
    </div>
  );
}
