import Link from "next/link";

const GAMES: { id: number; title: string; img?: string; number?: number; isPlaceholder?: boolean }[] = [
  { id: 1, title: "Spider-Man 3", img: "/games/124909-spider-man-3-windows-front-cover.png", number: 1 },
  { id: 2, title: "GTA Vice City", img: "/games/grandtheftautovicecity_pc.jpg", number: 2 },
  { id: 3, title: "IGI", img: "/games/igic.jpg", number: 3 },
  { id: 4, title: "Need for Speed Most Wanted", img: "/games/need for speed most wanted.jpg", number: 4 },
  { id: 5, title: "Prince of Persia", img: "/games/prince of persia.jpg", number: 5 },
  { id: 6, title: "House of the Dead", img: "/games/house of the dead.jpg", number: 6 },
  { id: 7, title: "Devil May Cry 2", img: "/games/Devil May Cry 2.jpg", number: 7 },
  { id: 8, title: "Hitman - Contracts", img: "/games/Hitman - Contracts.jpg", number: 8 },
  { id: 9, title: "Resident Evil 4", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg", number: 9 },
  { id: 10, title: "Minecraft", img: "/games/wp11667647-minecraft-poster-wallpapers.jpg", number: 10 }
];

export default function ListGrid() {
  return (
    <>
      {/* Grid Toolbar */}
      <div className="flex justify-between items-center mt-stack-lg mb-stack-sm border-b border-outline-variant pb-2 relative z-20">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Updated 9 days ago</span>
        <div className="flex gap-4">
          <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase flex items-center gap-1 font-bold">Decade <span className="material-symbols-outlined text-[14px]">expand_more</span></button>
          <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase flex items-center gap-1 font-bold">Genre <span className="material-symbols-outlined text-[14px]">expand_more</span></button>
          <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase flex items-center gap-1 font-bold">Sort <span className="material-symbols-outlined text-[14px]">expand_more</span></button>
        </div>
      </div>
      
      {/* Poster Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 relative z-20">
        {GAMES.map((game) => (
          <div key={game.id} className="flex flex-col items-center gap-2">
            <Link 
              href={game.isPlaceholder ? "#" : `/games/${game.title?.toLowerCase().replace(/ /g, '-')}`}
              className="relative aspect-[2/3] w-full block group overflow-hidden bg-surface-container border border-outline-variant/50 hover:border-primary transition-colors rounded-sm"
            >
              {game.isPlaceholder ? (
                <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[32px]">image</span>
                </div>
              ) : (
                <>
                  <img 
                    alt={game.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    src={game.img}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                  </div>
                </>
              )}
            </Link>
            {game.number && (
              <span className="font-label-md text-label-md text-on-surface-variant">{game.number}</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
