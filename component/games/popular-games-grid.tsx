"use client";
import { useState } from "react";
import Link from "next/link";
import { GameData } from "@/component/game-card";

export const POPULAR_GAMES: GameData[] = [
  { id: 1, title: "Spider-Man 3", rating: 4.2, views: "1.5m", likes: "124k", img: "/games/124909-spider-man-3-windows-front-cover.png" },
  { id: 2, title: "Devil May Cry 3", rating: 4.8, views: "8.5m", likes: "890k", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg" },
  { id: 3, title: "Hitman Contracts", rating: 4.3, views: "2.1m", likes: "156k", img: "/games/Hitman - Contracts.jpg" },
  { id: 4, title: "Resident Evil 4", rating: 4.9, views: "3.2m", likes: "210k", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg" },
  { id: 5, title: "Minecraft", rating: 4.6, views: "4.5m", likes: "340k", img: "/games/wp11667647-minecraft-poster-wallpapers.jpg" },
  { id: 6, title: "Call of Duty Ghosts", rating: 4.1, views: "650k", likes: "65k", img: "/games/Call of Duty Ghosts.jpg" },
  { id: 7, title: "Need for Speed Carbon", rating: 4.5, views: "1.2m", likes: "98k", img: "/games/need for speed carbon ps2.jpg" },
  { id: 8, title: "Grand Theft Auto Vice City", rating: 4.9, views: "5.5m", likes: "420k", img: "/games/grandtheftautovicecity_pc.jpg" },
  { id: 9, title: "IGI", rating: 4.2, views: "1.1m", likes: "76k", img: "/games/igic.jpg" },
  { id: 10, title: "Prince of Persia", rating: 4.7, views: "2.5m", likes: "180k", img: "/games/prince of persia.jpg" },
  { id: 11, title: "House of the Dead", rating: 4.0, views: "800k", likes: "45k", img: "/games/house of the dead.jpg" },
  { id: 12, title: "WWE Smackdown", rating: 4.4, views: "1.8m", likes: "110k", img: "/games/61N9DX5CRKL._SY445_.jpg" },
  { id: 13, title: "Elden Ring", rating: 4.9, views: "10m", likes: "2m", img: "/games/Box1.jpg" },
  { id: 14, title: "Spider-Man 3", rating: 4.2, views: "1.5m", likes: "124k", img: "/games/124909-spider-man-3-windows-front-cover.png" },
  { id: 15, title: "Devil May Cry 3", rating: 4.8, views: "8.5m", likes: "890k", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg" },
  { id: 16, title: "Hitman Contracts", rating: 4.3, views: "2.1m", likes: "156k", img: "/games/Hitman - Contracts.jpg" },
  { id: 17, title: "Resident Evil 4", rating: 4.9, views: "3.2m", likes: "210k", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg" },
  { id: 18, title: "Minecraft", rating: 4.6, views: "4.5m", likes: "340k", img: "/games/wp11667647-minecraft-poster-wallpapers.jpg" },
  { id: 19, title: "Call of Duty Ghosts", rating: 4.1, views: "650k", likes: "65k", img: "/games/Call of Duty Ghosts.jpg" },
  { id: 20, title: "Need for Speed Carbon", rating: 4.5, views: "1.2m", likes: "98k", img: "/games/need for speed carbon ps2.jpg" },
  { id: 21, title: "Grand Theft Auto Vice City", rating: 4.9, views: "5.5m", likes: "420k", img: "/games/grandtheftautovicecity_pc.jpg" },
  { id: 22, title: "IGI", rating: 4.2, views: "1.1m", likes: "76k", img: "/games/igic.jpg" },
  { id: 23, title: "Prince of Persia", rating: 4.7, views: "2.5m", likes: "180k", img: "/games/prince of persia.jpg" },
  { id: 24, title: "House of the Dead", rating: 4.0, views: "800k", likes: "45k", img: "/games/house of the dead.jpg" },
];

export default function PopularGamesGrid() {
  const [showAll, setShowAll] = useState(false);
  const displayedGames = showAll ? POPULAR_GAMES : POPULAR_GAMES.slice(0, 12);

  return (
    <section className="flex flex-col gap-stack-sm">
      <div className="flex justify-between items-end border-b border-surface-variant pb-2">
        <h2 className="font-display text-headline-md text-on-surface">Popular Games This Week</h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase"
        >
          {showAll ? "LESS" : "MORE"} <span className="material-symbols-outlined text-sm">{showAll ? "expand_less" : "expand_more"}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedGames.map((game) => (
          <Link 
            key={game.id} 
            href={game.isPlaceholder ? "#" : `/games/${game.title?.toLowerCase().replace(/ /g, '-') || ''}`} 
            className="flex flex-col gap-2 group cursor-pointer"
          >
            <div className={`relative w-full aspect-[2/3] border border-surface-variant rounded overflow-hidden group-hover:border-primary transition-colors ${game.isPlaceholder ? 'bg-surface-container-high' : ''}`}>
              {game.img ? (
                <img alt={game.title} className="w-full h-full object-cover" src={game.img} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-headline-sm text-on-surface-variant text-center px-2">{game.title}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10 p-4 gap-3">
                <div className="bg-primary text-on-primary font-label-md px-3 py-1.5 rounded flex items-center gap-1 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span> VIEW
                </div>
                <span className="text-white font-display text-headline-sm text-center leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{game.title}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-1 mt-1 overflow-hidden">
              <div className="flex items-center justify-between w-full gap-2">
                {game.isAnticipated ? (
                  <div className="flex items-center text-on-surface-variant gap-0.5 font-label-sm uppercase tracking-wider text-[10px] whitespace-nowrap">
                    Anticipated
                  </div>
                ) : (
                  <div className="flex items-center text-primary gap-0 shrink-0">
                    {[...Array(5)].map((_, i) => {
                      const fill = i + 0.5 < (game.rating || 0) ? 1 : 0;
                      const icon = i + 0.5 === (game.rating || 0) ? 'star_half' : 'star';
                      return (
                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${fill}`, fontSize: '13px' }}>{icon}</span>
                      );
                    })}
                  </div>
                )}
                
                <div className="flex items-center text-on-surface-variant gap-2 font-label-sm text-[10px] shrink-0">
                  <span className="flex items-center gap-0.5 whitespace-nowrap">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{game.isAnticipated ? 'watch_later' : 'visibility'}</span> 
                    {game.views}
                  </span>
                  {game.likes && game.likes !== "0" && (
                    <span className="flex items-center gap-0.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1", fontSize: '13px' }}>favorite</span> 
                      {game.likes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
