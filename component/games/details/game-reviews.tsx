"use client";
import { useState } from "react";
import Link from "next/link";
import GameCard from "@/component/game-card";

const REVIEWS = [
  {
    id: 1,
    user: "Sarah Connor",
    avatar: "/users/pewdiepie.jpg",
    rating: 5,
    date: "24 Feb 2022",
    likes: "1.2k",
    content: "Miyazaki has done it again. The transition to an open world format hasn't diluted the masterful level design FromSoftware is known for; it's expanded it. Limgrave alone offers more compelling exploration than most full games. Every horizon promises a new horrifying discovery or a beautiful, tragic vista. A monumental achievement in environmental storytelling."
  },
  {
    id: 2,
    user: "Alex Mercer",
    avatar: "/users/pewdiepie.jpg",
    rating: 4,
    date: "01 Mar 2022",
    likes: "850",
    content: "Incredible scope and art direction. The legacy dungeons are some of the best content they've ever produced (Stormveil Castle is a masterclass in layout). However, the late-game boss balancing feels a bit overturned compared to previous titles, relying heavily on delayed attacks that break the rhythm of combat. Still, an unforgettable journey."
  }
];

const LISTS = [
  {
    id: 1,
    title: "Best Action Games of the PS2 Era",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "150 games",
    likes: "12K",
    comments: "1.2K",
    images: ["/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/Devil May Cry 2.jpg", "/games/Box1.jpg", "/games/Hitman - Contracts.jpg"]
  },
  {
    id: 2,
    title: "Stylish Action & Hack 'n Slash Essentials",
    author: "Alexander",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "42 games",
    likes: "8.5K",
    comments: "450",
    images: ["/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/Devil May Cry 2.jpg", "/games/ah, memories.jpg", "/games/download (1).jpg"]
  },
  {
    id: 3,
    title: "Hardest Games Ever Made",
    author: "Gaming Legends",
    avatar: "/users/mr beast logo.jpg",
    gamesCount: "100 games",
    likes: "25K",
    comments: "3K",
    images: ["/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/download (7).jpg", "/games/download (8).jpg", "/games/download (9).jpg"]
  },
  {
    id: 4,
    title: "Capcom's Golden Age",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "85 games",
    likes: "15K",
    comments: "800",
    images: ["/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg", "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/download (10).jpg", "/games/download (5).jpg"]
  },
  {
    id: 5,
    title: "Every Devil May Cry Ranked",
    author: "DanteFan",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "6 games",
    likes: "5K",
    comments: "120",
    images: ["/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/Devil May Cry 2.jpg", "/games/download (6).jpg", "/games/download (4).jpg"]
  },
  {
    id: 6,
    title: "PS2 Classics You Must Play",
    author: "RetroGamer",
    avatarText: "R",
    gamesCount: "200 games",
    likes: "18K",
    comments: "1.5K",
    images: ["/games/grandtheftautovicecity_pc.jpg", "/games/need for speed most wanted.jpg", "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/prince of persia.jpg"]
  }
];

const SIMILAR_GAMES = [
  { id: 1, title: "Dark Souls III", rating: 4.8, views: "5.2m", likes: "980k", img: "/games/download (7).jpg" },
  { id: 2, title: "Bloodborne", rating: 4.9, views: "4.8m", likes: "1.2m", img: "/games/download (8).jpg" },
  { id: 3, title: "Sekiro", rating: 4.7, views: "3.5m", likes: "750k", img: "/games/download (9).jpg" },
  { id: 4, title: "Demon's Souls", rating: 4.5, views: "2.1m", likes: "400k", img: "/games/download (10).jpg" },
  { id: 5, title: "Nioh 2", rating: 4.3, views: "1.8m", likes: "200k", img: "/games/download.jpg" },
  { id: 6, title: "Lies of P", rating: 4.4, views: "1.2m", likes: "150k", img: "/games/ah, memories.jpg" },
  { id: 7, title: "Elden Ring", rating: 4.9, views: "10m", likes: "2m", img: "/games/Box1.jpg" },
  { id: 8, title: "Dark Souls II", rating: 4.1, views: "3m", likes: "400k", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg" },
  { id: 9, title: "Mortal Shell", rating: 3.9, views: "800k", likes: "50k", img: "/games/download (1).jpg" },
  { id: 10, title: "The Surge 2", rating: 4.0, views: "1.1m", likes: "90k", img: "/games/download (2).jpg" },
  { id: 11, title: "Remnant II", rating: 4.5, views: "2.5m", likes: "300k", img: "/games/download (3).jpg" },
  { id: 12, title: "Salt and Sanctuary", rating: 4.2, views: "700k", likes: "120k", img: "/games/download (4).jpg" },
];

type Tab = "REVIEWS" | "LISTS" | "SIMILAR";

export default function GameReviews() {
  const [activeTab, setActiveTab] = useState<Tab>("REVIEWS");
  const [listPage, setListPage] = useState(1);
  const [similarPage, setSimilarPage] = useState(1);

  const LISTS_PER_PAGE = 4;
  const SIMILAR_PER_PAGE = 12; // 2 rows of 6

  const totalListPages = Math.ceil(LISTS.length / LISTS_PER_PAGE);
  const currentLists = LISTS.slice((listPage - 1) * LISTS_PER_PAGE, listPage * LISTS_PER_PAGE);

  const totalSimilarPages = Math.ceil(SIMILAR_GAMES.length / SIMILAR_PER_PAGE);
  const currentSimilar = SIMILAR_GAMES.slice((similarPage - 1) * SIMILAR_PER_PAGE, similarPage * SIMILAR_PER_PAGE);

  const Pagination = ({ current, total, onChange }: { current: number, total: number, onChange: (p: number) => void }) => (
    <div className="flex items-center justify-end gap-2 mt-6">
      <button 
        onClick={() => onChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-base">chevron_left</span>
      </button>
      <div className="flex items-center gap-1">
        {[...Array(total)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onChange(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs transition-all ${
              current === i + 1 
                ? "bg-primary text-on-primary shadow-sm" 
                : "border border-surface-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button 
        onClick={() => onChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  );

  return (
    <div className="mt-stack-lg border-t border-surface-variant pt-stack-sm min-h-[500px]">
      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-surface-variant/50 overflow-x-auto no-scrollbar">
        {(["REVIEWS", "LISTS", "SIMILAR"] as Tab[]).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-label-md text-label-md uppercase tracking-widest pb-3 whitespace-nowrap transition-all font-bold border-b-2 ${
              activeTab === tab 
                ? "text-primary border-primary" 
                : "text-on-surface-variant hover:text-white border-transparent"
            }`}
          >
            {tab === "SIMILAR" ? "SIMILAR GAMES" : tab === "REVIEWS" ? "POPULAR REVIEWS" : "LISTS"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "REVIEWS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-surface-container-low border border-surface-variant p-6 rounded-xl flex flex-col gap-4 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline shadow-sm">
                      <img alt={review.user} className="w-full h-full object-cover" src={review.avatar} />
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">{review.user}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-primary-container gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0", fontSize: '14px' }}>star</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>favorite</span>
                          {review.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{review.date}</span>
                </div>
                <p className="font-body text-body-md text-on-surface-variant line-clamp-4 leading-relaxed italic">
                  "{review.content}"
                </p>
              </div>
            ))}
            <div className="md:col-span-2 flex justify-center mt-4">
              <button className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors border border-surface-variant hover:border-primary px-8 py-3 rounded-lg font-bold tracking-widest uppercase">
                READ ALL REVIEWS
              </button>
            </div>
          </div>
        )}

        {activeTab === "LISTS" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {currentLists.map((list) => (
                <Link key={list.id} href="#" className="group cursor-pointer flex flex-col">
                  <div className="flex h-32 mb-3 rounded-lg overflow-hidden border border-surface-variant group-hover:border-primary transition-colors shadow-sm">
                    {list.images.map((img, i) => (
                      <img key={i} alt="Game" className={`w-1/4 h-full object-cover ${i < 3 ? 'border-r border-surface-variant' : ''}`} src={img} />
                    ))}
                  </div>
                  <h3 className="font-headline text-[18px] leading-tight text-on-surface group-hover:text-primary transition-colors font-bold mb-1 truncate">{list.title}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[11px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {list.isOfficial ? (
                        <span className="w-4 h-4 rounded bg-primary text-on-primary flex items-center justify-center text-[9px] font-black">GB</span>
                      ) : (
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-surface-variant">
                          {list.avatar ? (
                            <img alt="Avatar" className="w-full h-full object-cover" src={list.avatar} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[8px]">{list.avatarText}</div>
                          )}
                        </div>
                      )}
                      <span className="font-bold truncate max-w-[80px]">{list.author}</span>
                    </div>
                    <span className="text-on-surface-variant opacity-60 shrink-0">{list.gamesCount}</span>
                    {list.likes && (
                      <div className="flex items-center gap-1.5 ml-auto shrink-0 opacity-60">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> {list.likes}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span> {list.comments}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {totalListPages > 1 && <Pagination current={listPage} total={totalListPages} onChange={setListPage} />}
          </div>
        )}

        {activeTab === "SIMILAR" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {currentSimilar.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            {totalSimilarPages > 1 && <Pagination current={similarPage} total={totalSimilarPages} onChange={setSimilarPage} />}
          </div>
        )}
      </div>
    </div>
  );
}
