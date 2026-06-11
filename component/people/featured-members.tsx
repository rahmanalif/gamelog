"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURED_MEMBERS = [
  { id: 1, name: "Elena Fisher", avatar: "/users/pewdiepie.jpg", stats: "5.7k games • 1.7k reviews" },
  { id: 2, name: "Alex Chen", avatar: "/users/pewdiepie.jpg", stats: "664 games • 561 reviews" },
  { id: 3, name: "Sarah Jenkins", avatar: "/users/pewdiepie.jpg", stats: "377 games • 335 reviews" },
  { id: 4, name: "NeoPixel", avatar: "/users/pewdiepie.jpg", stats: "1.4k games • 169 reviews" },
  { id: 5, name: "RetroRogue", avatar: "/users/pewdiepie.jpg", stats: "1k games • 112 reviews" },
];

const MEMBER_GAMES = [
  "/games/download (10).jpg",
  "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg",
  "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg",
  "/games/download (7).jpg",
];

export default function FeaturedMembers() {
  const [followed, setFollowed] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mb-stack-lg">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-6 pb-2 font-bold">
        Featured Members
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {FEATURED_MEMBERS.map((member) => {
          const isFollowed = followed.has(member.id);
          return (
            <div key={member.id} className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-3">
                <Link href={`/people/${member.name.replace(/ /g, '-').toLowerCase()}`}>
                  <img
                    alt={member.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-surface-container-high object-cover group-hover:border-primary transition-colors shadow-sm"
                    src={member.avatar}
                  />
                </Link>
                <button
                  onClick={() => toggle(member.id)}
                  className={`absolute bottom-0 right-2 md:right-4 rounded-full w-8 h-8 flex items-center justify-center border-2 border-background transition-all shadow-sm ${
                    isFollowed
                      ? "bg-primary text-on-primary-container"
                      : "bg-surface-container-high hover:bg-primary hover:text-on-primary-container text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm font-bold">
                    {isFollowed ? "check" : "add"}
                  </span>
                </button>
              </div>
              <Link href={`/people/${member.name.replace(/ /g, '-').toLowerCase()}`}>
                <h3 className="font-headline text-lg text-on-surface font-bold leading-tight group-hover:text-primary transition-colors text-center">
                  {member.name}
                </h3>
              </Link>
              <p className="font-label-sm text-[11px] text-on-surface-variant mb-2 text-center opacity-80">
                {member.stats}
              </p>
              <button
                onClick={() => toggle(member.id)}
                className={`text-label-sm font-bold uppercase tracking-widest px-4 py-1 rounded transition-all ${
                  isFollowed
                    ? "text-primary border border-primary/40 hover:bg-error/10 hover:text-error hover:border-error/40"
                    : "text-on-surface-variant border border-surface-variant hover:text-white hover:border-outline"
                }`}
              >
                {isFollowed ? "Following" : "Follow"}
              </button>
              <div className="flex gap-1 justify-center mt-2">
                {MEMBER_GAMES.map((img, i) => (
                  <img
                    key={i}
                    alt="Game Poster"
                    className="w-8 h-12 object-cover rounded-sm border border-outline-variant/30 shadow-sm"
                    src={img}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
