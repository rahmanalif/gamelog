import Link from "next/link";

const LIKED_LISTS = [
  {
    id: 1,
    title: "david lynch games ranked",
    author: "joão",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "6 games",
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
    gamesCount: "40 games",
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
    gamesCount: "4,229 games",
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
      <div className="flex items-center justify-between mb-4 border-b border-surface-variant pb-2">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">Recently Liked</h2>
      </div>
      <div className="flex flex-col gap-6">
        {LIKED_LISTS.map((list) => (
          <Link key={list.id} href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`} className="group cursor-pointer flex flex-col sm:flex-row gap-4 border-b border-surface-variant pb-6 last:border-0">
            <div className="flex w-full sm:w-48 h-24 rounded-lg overflow-hidden border border-surface-variant shrink-0 group-hover:border-primary transition-colors shadow-sm">
              {list.images.map((img, i) => (
                <img 
                  key={i} 
                  alt={`Game ${i + 1}`} 
                  className={`w-1/4 h-full object-cover ${i < 3 ? 'border-r border-surface-variant' : ''}`} 
                  src={img} 
                />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-headline text-[18px] text-on-surface group-hover:text-primary transition-colors font-bold mb-1 leading-tight">{list.title}</h3>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  {list.avatar ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-surface-variant border border-outline">
                      <img alt={list.author} className="w-full h-full object-cover" src={list.avatar} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[10px] text-on-surface border border-outline">
                      {list.avatarText}
                    </div>
                  )}
                  <span className="font-label-sm text-[12px] text-on-surface-variant">{list.author}</span>
                </div>
                <span className="font-label-sm text-[12px] text-on-surface-variant opacity-60 shrink-0">{list.gamesCount}</span>
                <span className="flex items-center gap-0.5 font-label-sm text-[12px] text-on-surface-variant opacity-60 ml-1 shrink-0">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> {list.likes}
                </span>
              </div>
              {list.description && (
                <p className="font-body text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {list.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
