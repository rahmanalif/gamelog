"use client";
import { useState } from "react";
import Link from "next/link";
import GameStack from "../games/game-stack";

interface ListData {
  id: number;
  title: string;
  author: string;
  isOfficial?: boolean;
  avatar?: string;
  avatarText?: string;
  gamesCount: string;
  likes: string;
  comments: string;
  images: string[];
}

const TRENDING_LISTS: ListData[] = [
  {
    id: 1,
    title: "Gamelog's Top 500 Games",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "500 games",
    likes: "387K",
    comments: "33K",
    images: ["/games/ah, memories.jpg", "/games/Call of Duty Ghosts.jpg", "/games/Devil May Cry 2.jpg", "/games/Hitman - Contracts.jpg"]
  },
  {
    id: 2,
    title: "Most Fans on Gamelog",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "250 games",
    likes: "150K",
    comments: "12K",
    images: ["/games/need for speed carbon ps2.jpg", "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg", "/games/Super Mario Bros NES 18 X 24_ Video Game Poster, 1,2,3, and 4 Bundle - Etsy.jpg", "/games/wp11667647-minecraft-poster-wallpapers.jpg"]
  },
  {
    id: 3,
    title: "One Million Played Club",
    author: "Alexander",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "135 games",
    likes: "95K",
    comments: "8K",
    images: ["/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/download (1).jpg", "/games/download (2).jpg", "/games/download (3).jpg"]
  },
  {
    id: 4,
    title: "Top RPGs of the Decade",
    author: "Official Lists",
    isOfficial: true,
    gamesCount: "100 games",
    likes: "120K",
    comments: "5K",
    images: ["/games/download (4).jpg", "/games/download (5).jpg", "/games/download (6).jpg", "/games/download (7).jpg"]
  }
];

const TOP_RATED_LISTS = [
  {
    id: 101,
    title: "All-Time Masterpieces",
    author: "Critic's Choice",
    isOfficial: true,
    gamesCount: "100 games",
    likes: "1.2M",
    comments: "50K",
    images: ["/games/Box1.jpg", "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", "/games/download (7).jpg", "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg"]
  },
  {
    id: 102,
    title: "The Essential Collection",
    author: "GL Community",
    isOfficial: true,
    gamesCount: "250 games",
    likes: "890K",
    comments: "22K",
    images: ["/games/grandtheftautovicecity_pc.jpg", "/games/need for speed most wanted.jpg", "/games/prince of persia.jpg", "/games/igic.jpg"]
  },
  {
    id: 103,
    title: "Highest Rated Indie Gems",
    author: "Alexander",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "45 games",
    likes: "450K",
    comments: "15K",
    images: ["/games/ah, memories.jpg", "/games/wp11667647-minecraft-poster-wallpapers.jpg", "/games/download (10).jpg", "/games/download (2).jpg"]
  },
  {
    id: 104,
    title: "Games That Changed the World",
    author: "History Buff",
    avatarText: "H",
    gamesCount: "20 games",
    likes: "320K",
    comments: "10K",
    images: ["/games/Super Mario Bros NES 18 X 24_ Video Game Poster, 1,2,3, and 4 Bundle - Etsy.jpg", "/games/house of the dead.jpg", "/games/download (1).jpg", "/games/download (4).jpg"]
  }
];

const FRIENDS_LISTS: ListData[] = [
  {
    id: 201,
    title: "My PS2 Childhood",
    author: "PewDiePie",
    avatar: "/users/pewdiepie.jpg",
    gamesCount: "12 games",
    likes: "25K",
    comments: "1.2K",
    images: ["/games/Devil May Cry 2.jpg", "/games/Hitman - Contracts.jpg", "/games/need for speed carbon ps2.jpg", "/games/grandtheftautovicecity_pc.jpg"]
  },
  {
    id: 202,
    title: "Games I Played on Stream",
    author: "MrBeast",
    avatar: "/users/mr beast logo.jpg",
    gamesCount: "85 games",
    likes: "180K",
    comments: "45K",
    images: ["/games/wp11667647-minecraft-poster-wallpapers.jpg", "/games/Super Mario Bros NES 18 X 24_ Video Game Poster, 1,2,3, and 4 Bundle - Etsy.jpg", "/games/download (6).jpg", "/games/download (3).jpg"]
  }
];

export default function FeaturedLists({ activeFilter = "TRENDING", hideHeader = false }: { activeFilter?: string, hideHeader?: boolean }) {
  const getListData = () => {
    switch (activeFilter) {
      case "TOP RATED": return TOP_RATED_LISTS;
      case "BY FRIENDS": return FRIENDS_LISTS;
      default: return TRENDING_LISTS;
    }
  };

  const lists = getListData();

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
        {lists.map((list) => (
          <div key={list.id} className="flex flex-col">
            <GameStack
              images={list.images}
              title={list.title}
              href={`/lists/${list.title.toLowerCase().replace(/ /g, '-')}`}
              gamesCount={Number(list.gamesCount.replace(/\D/g, ''))}
              likes={list.likes}
              comments={list.comments}
            />
            {/* Custom footer for FeaturedLists to show Author */}
            <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-label-sm text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0">
                {list.isOfficial ? (
                  <span className="w-4 h-4 rounded bg-primary text-on-primary flex items-center justify-center text-[9px] font-black">GL</span>
                ) : (
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-surface-variant">
                    {list.avatar ? (
                      <img alt="Avatar" className="w-full h-full object-cover" src={list.avatar} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[8px]">{list.avatarText}</div>
                    )}
                  </div>
                )}
                <span className="font-bold truncate max-w-[120px]">{list.author}</span>
              </div>
            </div>
          </div>
        ))}
        {lists.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant opacity-60">
            No lists found for this filter.
          </div>
        )}
      </div>
    </section>
  );
}
