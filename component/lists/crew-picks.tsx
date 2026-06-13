import Link from "next/link";
import GameStack from "../games/game-stack";

const CREW_PICKS = [
  {
    id: 1,
    title: "Top 100 Games by Trans Directors",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: 100,
    images: [
      "/games/download (8).jpg",
      "/games/download (9).jpg",
      "/games/download (10).jpg",
      "/games/download.jpg"
    ]
  }
];

export default function CrewPicks() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-surface-variant pb-2">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">Crew Picks</h2>
      </div>
      <div className="flex flex-col gap-12">
        {CREW_PICKS.map((list) => (
          <div key={list.id} className="flex flex-col">
            <GameStack
              images={list.images}
              title={list.title}
              href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`}
              gamesCount={list.gamesCount}
            />
            <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-label-sm text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                {list.isOfficial && (
                  <span className="w-3.5 h-3.5 rounded bg-primary text-on-primary flex items-center justify-center text-[8px] font-black">GB</span>
                )}
                <span className="font-bold">{list.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
