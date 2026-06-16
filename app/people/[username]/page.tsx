"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import ProfileHeader from "@/component/people/profile/profile-header";
import ProfileNav from "@/component/people/profile/profile-nav";
import GameCard from "@/component/game-card";
import GameStack from "@/component/games/game-stack";
import Image from "next/image";
import { getUserLists, listCoverImages, formatCount, type ListSummary } from "@/lib/lists-api";

const DIARY_ENTRIES = [
  { id: 1, month: "June 2026", day: "09", title: "Elden Ring", poster: "/games/download (10).jpg", rating: 5, platform: "PC", note: "A living, breathing world — unmatched." },
  { id: 2, month: "June 2026", day: "04", title: "Devil May Cry 3", poster: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", rating: 4.5, platform: "PS2", note: "Dante is peak character writing." },
  { id: 3, month: "June 2026", day: "01", title: "Resident Evil 4", poster: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg", rating: 5, platform: "PS2", note: "Replayed for the third time. Still perfect." },
  { id: 4, month: "May 2026", day: "28", title: "Hitman Contracts", poster: "/games/Hitman - Contracts.jpg", rating: 4, platform: "PC", note: "" },
  { id: 5, month: "May 2026", day: "21", title: "Prince of Persia", poster: "/games/prince of persia.jpg", rating: 4.5, platform: "PC", note: "Time mechanics still feel fresh." },
  { id: 6, month: "May 2026", day: "14", title: "Silent Hill 3", poster: "/games/download (4).jpg", rating: 5, platform: "PS2", note: "Most unsettling atmosphere in gaming." },
];

const games = [
  { title: "Elden Ring", img: "/games/download (10).jpg", rating: 5, views: "1.2k", likes: "850" },
  { title: "Resident Evil 4", img: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg", rating: 4.5, views: "900", likes: "420" },
  { title: "Silent Hill 3", img: "/games/download (4).jpg", rating: 5, views: "750", likes: "610" },
  { title: "Spider-Man 3", img: "/games/124909-spider-man-3-windows-front-cover.png", rating: 3.5, views: "1.5k", likes: "210" },
  { title: "Devil May Cry 3", img: "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg", rating: 4.5, views: "1.1k", likes: "530" },
  { title: "Hitman Contracts", img: "/games/Hitman - Contracts.jpg", rating: 4, views: "600", likes: "150" },
];

const FOLLOWING_USERS = [
  { id: 1, name: "Elena Fisher", avatar: "/users/pewdiepie.jpg", reviews: "1.7k reviews", views: "5,241", lists: "34", likes: "1,892" },
  { id: 2, name: "cob", avatar: "/users/pewdiepie.jpg", reviews: "2,740 reviews", views: "2,897", lists: "161", likes: "2,145" },
  { id: 3, name: "zoë rose bryant", avatar: "/users/pewdiepie.jpg", reviews: "2,430 reviews", views: "5,065", lists: "56", likes: "2,710" },
  { id: 4, name: "NeoPixel", avatar: "/users/pewdiepie.jpg", reviews: "169 reviews", views: "890", lists: "12", likes: "340" },
];

const PROFILE_LISTS = [
  {
    id: 1,
    title: "My Favorite RPGs",
    gamesCount: 12,
    likes: "45",
    comments: "8",
    images: [
      "/games/download (10).jpg",
      "/games/download (7).jpg",
      "/games/download (8).jpg",
      "/games/prince of persia.jpg",
    ],
  },
  {
    id: 2,
    title: "The PS2 Golden Era",
    gamesCount: 18,
    likes: "112",
    comments: "23",
    images: [
      "/games/grandtheftautovicecity_pc.jpg",
      "/games/need for speed carbon ps2.jpg",
      "/games/Devil May Cry 3_ Special Edition PS2 NTSC-J.jpg",
      "/games/Hitman - Contracts.jpg",
    ],
  },
  {
    id: 3,
    title: "Must-Play Horror",
    gamesCount: 6,
    likes: "67",
    comments: "11",
    images: [
      "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg",
      "/games/download (4).jpg",
      "/games/download (9).jpg",
      "/games/house of the dead.jpg",
    ],
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = (params.username as string) || "PEWDIEPIE";
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Profile");
  const [userLists, setUserLists] = useState<ListSummary[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [followingSet, setFollowingSet] = useState<Set<number>>(
    new Set(FOLLOWING_USERS.map((u) => u.id))
  );
  const toggleFollow = (id: number) => {
    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== "Lists") return;
    setListsLoading(true);
    getUserLists(username, { limit: 24 })
      .then((r) => setUserLists(r.items))
      .catch(() => setUserLists([]))
      .finally(() => setListsLoading(false));
  }, [activeTab, username]);

  const avatar =
    username.toLowerCase() === "pewdiepie" ? "/users/pewdiepie.jpg" : "";

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 flex flex-col gap-12">
              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Favorite Games
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {games.slice(0, 4).map((game, i) => (
                    <GameCard key={i} game={game} />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Recent Activity
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-80">
                  {games.slice(2, 6).map((game, i) => (
                    <GameCard key={i} game={game} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="flex flex-col gap-10">
              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Watchlist
                  </h2>
                  <span className="text-label-sm font-bold text-on-surface-variant">45</span>
                </div>
                <GameStack 
                  images={games.slice(0, 4).map(g => g.img)}
                  title="My Watchlist"
                  href={`/people/${username}?tab=Watchlist`}
                  showDetails={false}
                />
              </section>

              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Recent Reviews
                  </h2>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-24 shrink-0 rounded border border-surface-variant overflow-hidden relative">
                      <Image
                        src="/games/download (10).jpg"
                        alt="Review"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-body-md font-bold text-white uppercase tracking-wider">
                        Elden Ring
                      </h3>
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-label-sm text-on-surface-variant italic line-clamp-2">
                        "A living, breathing world that respects your curiosity..."
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        );

      case "Diary": {
        const months = [...new Set(DIARY_ENTRIES.map((e) => e.month))];
        return (
          <div className="flex flex-col gap-12 max-w-3xl">
            {months.map((month) => (
              <div key={month}>
                <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase border-b border-surface-variant pb-2 mb-4">
                  {month}
                </h2>
                <div className="flex flex-col divide-y divide-surface-variant">
                  {DIARY_ENTRIES.filter((e) => e.month === month).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 py-4 group hover:bg-surface-container-low transition-colors -mx-3 px-3 rounded"
                    >
                      <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest w-7 text-center shrink-0 tabular-nums">
                        {entry.day}
                      </span>
                      <div className="w-10 h-14 shrink-0 rounded overflow-hidden border border-surface-variant relative">
                        <Image src={entry.poster} alt={entry.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body-md font-bold text-white group-hover:text-primary transition-colors truncate">
                          {entry.title}
                        </h3>
                        <div className="flex items-center text-primary gap-0 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className="material-symbols-outlined"
                              style={{
                                fontSize: "12px",
                                fontVariationSettings:
                                  s <= entry.rating ? "'FILL' 1" : s - 0.5 === entry.rating ? "'FILL' 0.5" : "'FILL' 0",
                              }}
                            >
                              {s - 0.5 === entry.rating ? "star_half" : "star"}
                            </span>
                          ))}
                        </div>
                      </div>
                      {entry.note && (
                        <p className="hidden md:block text-label-sm text-on-surface-variant italic max-w-xs truncate">
                          "{entry.note}"
                        </p>
                      )}
                      <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest hidden sm:block shrink-0 opacity-60">
                        {entry.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "Games":
        return (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-lg border border-surface-variant">
              <div className="flex gap-6">
                <button className="text-label-md font-bold text-on-surface-variant hover:text-white uppercase tracking-widest flex items-center gap-1">
                  Genre{" "}
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
                <button className="text-label-md font-bold text-on-surface-variant hover:text-white uppercase tracking-widest flex items-center gap-1">
                  Platform{" "}
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
                <button className="text-label-md font-bold text-on-surface-variant hover:text-white uppercase tracking-widest flex items-center gap-1">
                  Year{" "}
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
              <button className="text-label-md font-bold text-on-surface-variant hover:text-white uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">sort</span> Date Added
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[...games, ...games, ...games].map((game, i) => (
                <GameCard key={i} game={game} />
              ))}
            </div>
          </div>
        );

      case "Activity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 flex flex-col gap-6">
              {games.slice(0, 3).map((game, i) => (
                <article key={i} className="flex gap-4 border-b border-surface-variant pb-6">
                  <div className="w-20 md:w-24 shrink-0 relative group">
                    <div className="aspect-2/3 rounded border border-surface-variant overflow-hidden relative">
                      <Image src={game.img} alt={game.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                        play_arrow
                      </span>
                      <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        Logged
                      </span>
                      <span className="text-label-sm font-bold text-surface-variant mx-1">•</span>
                      <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        {i + 1}h ago
                      </span>
                    </div>
                    <h3 className="text-headline-sm font-bold text-white mb-2">{game.title}</h3>
                    <div className="flex items-center gap-1 mb-2 text-primary">
                      {[...Array(5)].map((_, j) => (
                        <span
                          key={j}
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <p className="text-body-md text-on-surface-variant">
                      Finally got around to playing this. The design here is unmatched.
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <aside className="md:col-span-1">
              <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6">
                <h3 className="text-headline-sm font-bold text-white mb-4">Activity Filters</h3>
                <ul className="flex flex-col gap-3">
                  <li>
                    <button className="w-full text-label-md font-bold uppercase tracking-widest text-primary flex items-center justify-between">
                      <span>All Activity</span> <span>142</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-label-md font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors flex items-center justify-between">
                      <span>Reviews</span> <span>34</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-label-md font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors flex items-center justify-between">
                      <span>Likes</span> <span>89</span>
                    </button>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        );

      case "Reviews":
        return (
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            <div className="flex justify-between items-center text-label-sm font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-variant pb-2">
              <div>
                SORT BY:{" "}
                <span className="text-white cursor-pointer hover:text-primary transition-colors">
                  NEWEST
                </span>
              </div>
              <div>
                FILTER:{" "}
                <span className="text-white cursor-pointer hover:text-primary transition-colors">
                  ALL REVIEWS
                </span>
              </div>
            </div>
            {games.slice(0, 3).map((game, i) => (
              <article
                key={i}
                className="flex flex-col sm:flex-row gap-6 relative group pb-10 border-b border-surface-variant"
              >
                <div className="flex-shrink-0 w-32 sm:w-40">
                  <div className="aspect-2/3 relative rounded overflow-hidden border border-surface-variant bg-surface-container-high">
                    <Image src={game.img} alt={game.title} fill className="object-cover" />
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-headline-sm font-bold text-white hover:text-primary cursor-pointer transition-colors">
                        {game.title}
                      </h2>
                      <div className="flex items-center gap-2 text-label-md font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                        <span>2023</span>
                        <span>•</span>
                        <span>Reviewed by {username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4 text-primary">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <div className="text-body-lg text-on-surface opacity-90 leading-relaxed mb-4">
                    <p>
                      The atmospheric storytelling in {game.title} is nothing short of masterful.
                      It breathes with an authenticity that few games manage to capture.
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-auto text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-error transition-colors">
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>{" "}
                      24 Likes
                    </div>
                    <div className="ml-auto">Oct 12, 2023</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        );

      case "Watchlist":
        return (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2">
              <div className="flex gap-4">
                <button className="text-label-md font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                  GENRE{" "}
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
              <button className="text-label-md font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sort</span> DATE ADDED
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...games, ...games].map((game, i) => (
                <div key={i} className="relative group">
                  <GameCard game={game} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:opacity-100 rounded">
                    <div className="w-12 h-12 rounded-full bg-error/90 text-white flex items-center justify-center shadow-lg">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        remove
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Lists":
        return (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2">
              <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                {username}&apos;s Lists
              </h2>
              <Link
                href="/lists/new"
                className="flex items-center gap-1 text-label-md font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> New List
              </Link>
            </div>
            {listsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 animate-pulse">
                    <div className="aspect-[2/1] bg-surface-container rounded-lg" />
                    <div className="h-4 bg-surface-container rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : userLists.length === 0 ? (
              <div className="py-20 text-center text-on-surface-variant opacity-60">
                No lists yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {userLists.map((list) => (
                  <GameStack
                    key={list.id}
                    images={listCoverImages(list, 4)}
                    title={list.title}
                    href={`/lists/${list.id}`}
                    gamesCount={list._count.items}
                    likes={formatCount(list.likeCount)}
                    comments={formatCount(list.commentCount)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "Following": {
        return (
          <div className="max-w-3xl flex flex-col gap-0">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
              <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                Following
              </h2>
              <span className="text-label-sm font-bold text-on-surface-variant">
                {FOLLOWING_USERS.length}
              </span>
            </div>
            {FOLLOWING_USERS.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] opacity-20 text-on-surface-variant">
                  group
                </span>
                <p className="text-body-md text-on-surface-variant">Not following anyone yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {FOLLOWING_USERS.map((member) => {
                  const isFollowing = followingSet.has(member.id);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-4 border-b border-surface-variant hover:bg-surface-container-low transition-colors -mx-3 px-3 rounded group"
                    >
                      <div className="flex items-center gap-4">
                        <Link href={`/people/${member.name.replace(/ /g, "-").toLowerCase()}`}>
                          <img
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant/50 group-hover:border-primary/50 transition-colors shadow-sm"
                            src={member.avatar}
                          />
                        </Link>
                        <div>
                          <Link href={`/people/${member.name.replace(/ /g, "-").toLowerCase()}`}>
                            <h4 className="font-label-md text-base text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                              {member.name}
                            </h4>
                          </Link>
                          <p className="font-label-sm text-on-surface-variant opacity-80">{member.reviews}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden sm:flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                          <span className="font-label-sm text-on-surface-variant">{member.views}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">grid_view</span>
                          <span className="font-label-sm text-on-surface-variant">{member.lists}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[18px] text-error"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            favorite
                          </span>
                          <span className="font-label-sm text-on-surface-variant">{member.likes}</span>
                        </div>
                        <button
                          onClick={() => toggleFollow(member.id)}
                          className={`rounded-full w-8 h-8 flex items-center justify-center ml-2 shadow-sm transition-all ${
                            isFollowing
                              ? "bg-primary text-on-primary-container"
                              : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary-container"
                          }`}
                          title={isFollowing ? "Unfollow" : "Follow"}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">
                            {isFollowing ? "check" : "add"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "Likes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-label-md font-bold text-on-surface-variant mb-4 uppercase tracking-widest">
                  Filter Likes
                </h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    <button className="w-full flex items-center justify-between text-label-md font-bold text-primary p-2 -ml-2 rounded bg-surface-variant/30 uppercase tracking-widest">
                      <span>All Likes</span> <span>342</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center justify-between text-label-md font-bold text-on-surface-variant hover:text-white transition-colors p-2 -ml-2 rounded uppercase tracking-widest">
                      <span>Games</span> <span>128</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center justify-between text-label-md font-bold text-on-surface-variant hover:text-white transition-colors p-2 -ml-2 rounded uppercase tracking-widest">
                      <span>Reviews</span> <span>185</span>
                    </button>
                  </li>
                </ul>
              </div>
            </aside>
            <div className="md:col-span-3 flex flex-col gap-12">
              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
                    Liked Games
                  </h2>
                  <button className="text-label-sm font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest">
                    VIEW ALL
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {games.slice(0, 4).map((game, i) => (
                    <div key={i} className="relative group">
                      <GameCard game={{ ...game, likes: undefined, views: undefined, rating: undefined }} />
                      <div className="absolute top-2 right-2 z-20">
                        <span
                          className="material-symbols-outlined text-[16px] text-error"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl bg-surface-container-lowest/30">
            <span className="material-symbols-outlined text-[64px] opacity-20 text-on-surface-variant">
              construction
            </span>
            <div>
              <h3 className="text-headline-sm font-bold text-white uppercase tracking-widest">
                {activeTab} Section
              </h3>
              <p className="text-body-md text-on-surface-variant mt-1">
                This section is currently under development.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="w-full max-w-[1100px] mx-auto px-gutter py-6">
        <ProfileHeader username={username} avatar={avatar} />
        <ProfileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {renderTabContent()}
      </main>

      <Footer />
    </div>
  );
}
