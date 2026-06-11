import Link from "next/link";

const CREW_PICKS = [
  {
    id: 1,
    title: "Top 100 Games by Trans Directors",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "100 games",
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
      <div className="flex flex-col gap-6">
        {CREW_PICKS.map((list) => (
          <Link key={list.id} href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`} className="group cursor-pointer">
            <div className="flex h-24 mb-3 rounded-lg overflow-hidden border border-surface-variant group-hover:border-primary transition-colors shadow-sm">
              {list.images.map((img, i) => (
                <img 
                  key={i} 
                  alt={`Game ${i + 1}`} 
                  className={`w-1/4 h-full object-cover ${i < 3 ? 'border-r border-surface-variant' : ''}`} 
                  src={img} 
                />
              ))}
            </div>
            <h3 className="font-headline text-[16px] leading-tight text-on-surface group-hover:text-primary transition-colors font-bold mb-1.5">{list.title}</h3>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                {list.isOfficial && (
                  <span className="w-3.5 h-3.5 rounded bg-primary text-on-primary flex items-center justify-center text-[8px] font-black">GB</span>
                )}
                <span className="font-bold">{list.author}</span>
              </div>
              <span className="text-on-surface-variant opacity-60">{list.gamesCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
