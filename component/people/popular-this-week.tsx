"use client";

import { useState } from "react";
import Link from "next/link";

const POPULAR_MEMBERS = [
  { id: 1, name: "Brenda Meeks", avatar: "/users/pewdiepie.jpg", reviews: "24 reviews", views: "24", lists: "0", likes: "0" },
  { id: 2, name: "abigail", avatar: "/users/pewdiepie.jpg", reviews: "619 reviews", views: "702", lists: "23", likes: "258" },
  { id: 3, name: "cob", avatar: "/users/pewdiepie.jpg", reviews: "2,740 reviews", views: "2,897", lists: "161", likes: "2,145" },
  { id: 4, name: "demi adejuyigbe", avatar: "/users/pewdiepie.jpg", reviews: "1,623 reviews", views: "2,059", lists: "17", likes: "876" },
  { id: 5, name: "zoë rose bryant", avatar: "/users/pewdiepie.jpg", reviews: "2,430 reviews", views: "5,065", lists: "56", likes: "2,710" },
  { id: 6, name: "Karsten", avatarText: "K", reviews: "1,670 reviews", views: "2,563", lists: "60", likes: "1,908" },
];

export default function PopularThisWeek() {
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
    <div className="lg:col-span-3">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between font-bold">
        <span>Popular This Week</span>
        <Link className="text-primary hover:underline text-xs" href="/people">MORE</Link>
      </h2>
      <div className="flex flex-col">
        {POPULAR_MEMBERS.map((member) => {
          const isFollowed = followed.has(member.id);
          return (
            <div
              key={member.id}
              className="flex items-center justify-between py-3 border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors px-2 group"
            >
              <div className="flex items-center gap-4">
                {member.avatar ? (
                  <img
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant/50 group-hover:border-primary/50 transition-colors shadow-sm"
                    src={member.avatar}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-lg border border-outline-variant/50 shadow-sm">
                    {member.avatarText}
                  </div>
                )}
                <div>
                  <h4 className="font-label-md text-base text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                    {member.name}
                  </h4>
                  <p className="font-label-sm text-on-surface-variant opacity-80">{member.reviews}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span className="font-label-sm text-on-surface-variant">{member.views}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-tertiary-fixed-dim">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  <span className="font-label-sm text-on-surface-variant">{member.lists}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-error">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span className="font-label-sm text-on-surface-variant">{member.likes}</span>
                </div>
                <button
                  onClick={() => toggle(member.id)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center ml-2 shadow-sm transition-all ${
                    isFollowed
                      ? "bg-primary text-on-primary-container"
                      : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary-container"
                  }`}
                  title={isFollowed ? "Unfollow" : "Follow"}
                >
                  <span className="material-symbols-outlined text-sm font-bold">
                    {isFollowed ? "check" : "add"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
