import Link from "next/link";
import GameStack from "../games/game-stack";

const LIKED_LISTS = [
  {
    id: 1,
    title: "david lynch games ranked",
    author: "joão",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: 6,
    likes: "2",
    description: "",
    images: [
      "/games/ah, memories.jpg",
      "/games/Hitman - Contracts.jpg",
      "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg",
      "/games/Devil May Cry 2.jpg"
    ]
  },
  {
    id: 2,
    title: "The Factory's Game Recommendations",
    author: "sugartownsucks",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: 40,
    likes: "7",
    description: "A compilation of favourite games curated by Discord server JDNO: The Factory. Join us with code jQSP7BRyNk...",
    images: [
      "/games/Super Mario Bros NES 18 X 24_ Video Game Poster, 1,2,3, and 4 Bundle - Etsy.jpg",
      "/games/wp11667647-minecraft-poster-wallpapers.jpg",
      "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg",
      "/games/Call of Duty Ghosts.jpg"
    ]
  },
  {
    id: 3,
    title: "Grindhousecinema.com",
    author: "HorrorMovieFan8",
    avatarText: "H",
    gamesCount: 4229,
    likes: "58",
    description: "All games listed on grindhousecinema.com (former domain: erotiga.net or Eroti.ga, or SleazeMovies). Not on Gamelog: 42nd Street Forever, Volume 5:...",
    images: [
      "/games/download (1).jpg",
      "/games/download (2).jpg",
      "/games/download (3).jpg",
      "/games/download (4).jpg"
    ]
  }
];

export default function RecentlyLiked() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8 border-b border-surface-variant pb-2">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">Recently Liked</h2>
      </div>
      <div className="flex flex-col gap-10">
        {LIKED_LISTS.map((list) => (
          <div key={list.id} className="flex flex-col sm:flex-row gap-12 border-b border-surface-variant pb-10 last:border-0">
            <div className="w-full sm:w-48 shrink-0">
              <GameStack
                images={list.images}
                title={list.title}
                href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`}
                showDetails={false}
              />
            </div>
            <div className="flex flex-col justify-center py-2 flex-1">
              <Link href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`}>
                <h3 className="font-headline text-[22px] text-on-surface group-hover:text-primary transition-colors font-bold mb-2 leading-tight">
                  {list.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  {list.avatar ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-surface-variant border border-outline">
                      <img alt={list.author} className="w-full h-full object-cover" src={list.avatar} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[10px] text-on-surface border border-outline">
                      {list.avatarText}
                    </div>
                  )}
                  <span className="font-label-sm text-[13px] text-on-surface-variant font-bold">{list.author}</span>
                </div>
                <span className="text-on-surface-variant opacity-40 px-1">•</span>
                <span className="font-label-sm text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">{list.gamesCount} games</span>
                <span className="text-on-surface-variant opacity-40 px-1">•</span>
                <span className="flex items-center gap-1 font-label-sm text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> {list.likes}
                </span>
              </div>
              {list.description && (
                <p className="font-body text-[15px] text-on-surface-variant line-clamp-3 leading-relaxed opacity-80 max-w-2xl">
                  {list.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
