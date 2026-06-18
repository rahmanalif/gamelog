"use client";
import { useState, useEffect } from "react";
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
import { removeFromWatchlist } from "@/lib/game-api";
import {
  getProfile,
  getFollowing,
  followUser,
  unfollowUser,
  getFavoriteGames,
  getUserGameLogs,
  getUserWatchlist,
  getUserReviews,
  getUserLikedGames,
  type UserProfile,
  type FollowItem,
  type GameLogEntry,
  type FavoriteGameEntry,
  type WatchlistEntry,
  type ReviewEntry,
  type LikedGameEntry,
} from "@/lib/people-api";
import { useAuthStore } from "@/store/auth.store";

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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.username?.toLowerCase() === username.toLowerCase();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Profile");
  const [userLists, setUserLists] = useState<ListSummary[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followingItems, setFollowingItems] = useState<FollowItem[]>([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [followLoadingSet, setFollowLoadingSet] = useState<Set<string>>(new Set());
  const [favGames, setFavGames] = useState<FavoriteGameEntry[]>([]);
  const [recentGames, setRecentGames] = useState<GameLogEntry[]>([]);
  const [profileGamesLoading, setProfileGamesLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [watchlistTotal, setWatchlistTotal] = useState(0);
  const [recentReviews, setRecentReviews] = useState<ReviewEntry[]>([]);
  const [tabReviews, setTabReviews] = useState<ReviewEntry[]>([]);
  const [tabReviewsLoading, setTabReviewsLoading] = useState(false);
  const [tabWatchlist, setTabWatchlist] = useState<WatchlistEntry[]>([]);
  const [tabWatchlistLoading, setTabWatchlistLoading] = useState(false);
  const [tabLikedGames, setTabLikedGames] = useState<LikedGameEntry[]>([]);
  const [tabLikedGamesTotal, setTabLikedGamesTotal] = useState(0);
  const [tabLikedGamesLoading, setTabLikedGamesLoading] = useState(false);

  const toggleFollow = async (targetUsername: string) => {
    if (!isLoggedIn) { openAuthModal("login"); return; }
    if (followLoadingSet.has(targetUsername)) return;
    setFollowLoadingSet((prev) => new Set(prev).add(targetUsername));
    const wasFollowing = followingSet.has(targetUsername);
    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (wasFollowing) next.delete(targetUsername);
      else next.add(targetUsername);
      return next;
    });
    try {
      if (wasFollowing) await unfollowUser(targetUsername);
      else await followUser(targetUsername);
    } catch {
      setFollowingSet((prev) => {
        const next = new Set(prev);
        if (wasFollowing) next.add(targetUsername);
        else next.delete(targetUsername);
        return next;
      });
    } finally {
      setFollowLoadingSet((prev) => {
        const next = new Set(prev);
        next.delete(targetUsername);
        return next;
      });
    }
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    getProfile(username)
      .then((p) => setProfile(p))
      .catch(() => {});
  }, [username]);

  useEffect(() => {
    setProfileGamesLoading(true);
    Promise.all([
      getFavoriteGames(username),
      getUserGameLogs(username, { limit: 4, orderBy: "playedAt", order: "desc" }),
      getUserWatchlist(username, { limit: 4 }),
      getUserReviews(username, { limit: 3 }),
    ])
      .then(([fav, recent, wl, reviews]) => {
        setFavGames(fav);
        setRecentGames(recent.items);
        setWatchlist(wl.items);
        setWatchlistTotal(wl.total);
        setRecentReviews(reviews);
      })
      .catch(() => {})
      .finally(() => setProfileGamesLoading(false));
  }, [username]);

  useEffect(() => {
    if (activeTab !== "Reviews") return;
    setTabReviewsLoading(true);
    getUserReviews(username, { limit: 50 })
      .then((r) => setTabReviews(r))
      .catch(() => setTabReviews([]))
      .finally(() => setTabReviewsLoading(false));
  }, [activeTab, username]);

  useEffect(() => {
    if (activeTab !== "Watchlist") return;
    setTabWatchlistLoading(true);
    getUserWatchlist(username, { limit: 100 })
      .then((r) => setTabWatchlist(r.items))
      .catch(() => setTabWatchlist([]))
      .finally(() => setTabWatchlistLoading(false));
  }, [activeTab, username]);

  useEffect(() => {
    if (activeTab !== "Lists") return;
    setListsLoading(true);
    getUserLists(username, { limit: 24 })
      .then((r) => setUserLists(r.items))
      .catch(() => setUserLists([]))
      .finally(() => setListsLoading(false));
  }, [activeTab, username]);

  useEffect(() => {
    if (activeTab !== "Likes") return;
    setTabLikedGamesLoading(true);
    getUserLikedGames(username, { limit: 100 })
      .then((r) => { setTabLikedGames(r.items); setTabLikedGamesTotal(r.total); })
      .catch(() => setTabLikedGames([]))
      .finally(() => setTabLikedGamesLoading(false));
  }, [activeTab, username]);

  useEffect(() => {
    if (activeTab !== "Following") return;
    setFollowingLoading(true);
    getFollowing(username, { limit: 50 })
      .then((r) => {
        setFollowingItems(r.items);
        setFollowingSet(new Set(r.items.map((item) => item.following?.profile.username ?? "").filter(Boolean)));
      })
      .catch(() => setFollowingItems([]))
      .finally(() => setFollowingLoading(false));
  }, [activeTab, username]);

  const avatar = profile?.avatarUrl ?? (username.toLowerCase() === "pewdiepie" ? "/users/pewdiepie.jpg" : "");

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
                {profileGamesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[2/3] rounded bg-surface-container animate-pulse" />
                    ))}
                  </div>
                ) : favGames.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant opacity-60">No games logged yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {favGames.map((entry) => (
                      <GameCard
                        key={entry.game.id}
                        game={{
                          id: entry.game.id,
                          title: entry.game.title,
                          slug: entry.game.slug,
                          img: entry.game.coverUrl ?? undefined,
                          rating: entry.game.avgRating || undefined,
                          likes: entry.game.likeCount > 0 ? String(entry.game.likeCount) : undefined,
                          views: entry.game.logCount > 0 ? String(entry.game.logCount) : undefined,
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Recent Activity
                  </h2>
                </div>
                {profileGamesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-80">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[2/3] rounded bg-surface-container animate-pulse" />
                    ))}
                  </div>
                ) : recentGames.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant opacity-60">No recent activity.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-80">
                    {recentGames.map((log) => (
                      <GameCard
                        key={log.id}
                        game={{
                          id: log.game.id,
                          title: log.game.title,
                          slug: log.game.slug,
                          img: log.game.coverUrl ?? undefined,
                          rating: log.rating ? parseFloat(log.rating) : undefined,
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="flex flex-col gap-10">
              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Watchlist
                  </h2>
                  {watchlistTotal > 0 && (
                    <span className="text-label-sm font-bold text-on-surface-variant">{watchlistTotal}</span>
                  )}
                </div>
                {profileGamesLoading ? (
                  <div className="aspect-[2/1] rounded bg-surface-container animate-pulse" />
                ) : watchlist.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant opacity-60">Watchlist empty.</p>
                ) : (
                  <GameStack
                    images={watchlist.map((w) => w.game.coverUrl).filter(Boolean) as string[]}
                    title="Watchlist"
                    href={`/people/${username}?tab=Watchlist`}
                    showDetails={false}
                  />
                )}
              </section>

              <section>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
                  <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                    Recent Reviews
                  </h2>
                </div>
                {profileGamesLoading ? (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-16 h-24 shrink-0 rounded bg-surface-container" />
                        <div className="flex flex-col gap-2 flex-1 pt-1">
                          <div className="h-3 bg-surface-container rounded w-3/4" />
                          <div className="h-3 bg-surface-container rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentReviews.length === 0 ? (
                  <p className="text-body-md text-on-surface-variant opacity-60">No reviews yet.</p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {recentReviews.map((review) => {
                      const rating = review.rating ? parseFloat(review.rating) : 0;
                      return (
                        <Link
                          key={review.id}
                          href={`/games/${review.game.slug}`}
                          className="flex gap-4 group"
                        >
                          <div className="w-16 h-24 shrink-0 rounded border border-surface-variant overflow-hidden relative">
                            {review.game.coverUrl ? (
                              <Image
                                src={review.game.coverUrl}
                                alt={review.game.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-surface-container">
                                <span className="text-[10px] text-on-surface-variant text-center px-1">{review.game.title}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="text-body-md font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-1">
                              {review.game.title}
                            </h3>
                            {rating > 0 && (
                              <div className="flex text-primary">
                                {[1, 2, 3, 4, 5].map((s) => {
                                  const filled = rating >= s;
                                  const half = !filled && rating > s - 1;
                                  return (
                                    <span
                                      key={s}
                                      className="material-symbols-outlined text-[14px]"
                                      style={{ fontVariationSettings: `'FILL' ${filled || half ? 1 : 0}` }}
                                    >
                                      {half ? "star_half" : "star"}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            {review.body && (
                              <p className="text-label-sm text-on-surface-variant italic line-clamp-2">
                                &ldquo;{review.body}&rdquo;
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
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
              <span>{profile?.reviewsCount ?? tabReviews.length} Reviews</span>
            </div>
            {tabReviewsLoading ? (
              <div className="flex flex-col gap-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-6 animate-pulse">
                    <div className="w-32 sm:w-40 aspect-[2/3] rounded bg-surface-container shrink-0" />
                    <div className="flex flex-col gap-3 flex-1 pt-2">
                      <div className="h-4 bg-surface-container rounded w-2/3" />
                      <div className="h-3 bg-surface-container rounded w-1/3" />
                      <div className="h-3 bg-surface-container rounded w-full" />
                      <div className="h-3 bg-surface-container rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tabReviews.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] opacity-20 text-on-surface-variant">rate_review</span>
                <p className="text-body-md text-on-surface-variant">No reviews yet.</p>
              </div>
            ) : (
              tabReviews.map((review) => {
                const rating = review.rating ? parseFloat(review.rating) : 0;
                const date = new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <article
                    key={review.id}
                    className="flex flex-col sm:flex-row gap-6 relative group pb-10 border-b border-surface-variant"
                  >
                    <div className="flex-shrink-0 w-32 sm:w-40">
                      <Link href={`/games/${review.game.slug}`}>
                        <div className="aspect-[2/3] relative rounded overflow-hidden border border-surface-variant bg-surface-container-high">
                          {review.game.coverUrl ? (
                            <Image src={review.game.coverUrl} alt={review.game.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                              <span className="text-on-surface-variant text-center text-label-sm">{review.game.title}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/games/${review.game.slug}`}>
                            <h2 className="text-headline-sm font-bold text-white hover:text-primary cursor-pointer transition-colors">
                              {review.game.title}
                            </h2>
                          </Link>
                          <div className="flex items-center gap-2 text-label-md font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                            <span>Reviewed by {username}</span>
                          </div>
                        </div>
                      </div>
                      {rating > 0 && (
                        <div className="flex items-center gap-0.5 mb-4 text-primary">
                          {[1, 2, 3, 4, 5].map((s) => {
                            const filled = rating >= s;
                            const half = !filled && rating > s - 1;
                            return (
                              <span
                                key={s}
                                className="material-symbols-outlined text-[14px]"
                                style={{ fontVariationSettings: `'FILL' ${filled || half ? 1 : 0}` }}
                              >
                                {half ? "star_half" : "star"}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {review.body && (
                        <div className="text-body-lg text-on-surface opacity-90 leading-relaxed mb-4">
                          <p>{review.body}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-6 mt-auto text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                          {review.likeCount} Likes
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">comment</span>
                          {review.commentCount}
                        </div>
                        <div className="ml-auto">{date}</div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        );

      case "Watchlist":
        return (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2">
              <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                {watchlistTotal > 0 ? `${watchlistTotal} Games` : "Watchlist"}
              </span>
            </div>
            {tabWatchlistLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded bg-surface-container animate-pulse" />
                ))}
              </div>
            ) : tabWatchlist.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] opacity-20 text-on-surface-variant">watch_later</span>
                <p className="text-body-md text-on-surface-variant">Watchlist empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tabWatchlist.map((entry) => (
                  <div key={entry.game.id} className="relative group">
                    <GameCard
                      game={{
                        id: entry.game.id,
                        title: entry.game.title,
                        slug: entry.game.slug,
                        img: entry.game.coverUrl ?? undefined,
                      }}
                    />
                    {isOwnProfile && (
                      <button
                        className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 flex items-center justify-center group-hover:opacity-100 rounded"
                        onClick={async () => {
                          setTabWatchlist((prev) => prev.filter((w) => w.game.id !== entry.game.id));
                          setWatchlistTotal((c) => Math.max(0, c - 1));
                          try { await removeFromWatchlist(entry.game.id); } catch {
                            setTabWatchlist((prev) => [...prev, entry]);
                            setWatchlistTotal((c) => c + 1);
                          }
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-error/90 text-white flex items-center justify-center shadow-lg pointer-events-none">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>remove</span>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
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
        if (followingLoading) {
          return (
            <div className="max-w-3xl flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-surface-container" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 bg-surface-container rounded w-32" />
                    <div className="h-3 bg-surface-container rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div className="max-w-3xl flex flex-col gap-0">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2 mb-6">
              <h2 className="text-label-sm font-bold tracking-[0.2em] text-on-surface-variant uppercase">
                Following
              </h2>
              <span className="text-label-sm font-bold text-on-surface-variant">
                {profile?.followingCount ?? followingItems.length}
              </span>
            </div>
            {followingItems.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] opacity-20 text-on-surface-variant">
                  group
                </span>
                <p className="text-body-md text-on-surface-variant">Not following anyone yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {followingItems.map((item) => {
                  const u = item.following;
                  if (!u) return null;
                  const uname = u.profile.username;
                  const isF = followingSet.has(uname);
                  const isLoadingF = followLoadingSet.has(uname);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between py-4 border-b border-surface-variant hover:bg-surface-container-low transition-colors -mx-3 px-3 rounded group"
                    >
                      <div className="flex items-center gap-4">
                        <Link href={`/people/${uname}`}>
                          {u.profile.avatarUrl ? (
                            <img
                              alt={uname}
                              className="w-10 h-10 rounded-full object-cover border border-outline-variant/50 group-hover:border-primary/50 transition-colors shadow-sm"
                              src={u.profile.avatarUrl}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 flex items-center justify-center">
                              <span className="text-label-md font-bold text-on-surface-variant uppercase">
                                {uname.charAt(0)}
                              </span>
                            </div>
                          )}
                        </Link>
                        <div>
                          <Link href={`/people/${uname}`}>
                            <h4 className="font-label-md text-base text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                              {u.profile.name ?? uname}
                            </h4>
                          </Link>
                          <p className="font-label-sm text-on-surface-variant opacity-80 uppercase tracking-widest">
                            @{uname}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(uname)}
                        disabled={isLoadingF}
                        className={`rounded-full w-8 h-8 flex items-center justify-center ml-2 shadow-sm transition-all disabled:opacity-50 ${
                          isF
                            ? "bg-primary text-on-primary-container"
                            : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary-container"
                        }`}
                        title={isF ? "Unfollow" : "Follow"}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          {isF ? "check" : "add"}
                        </span>
                      </button>
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
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-surface-variant pb-2">
              <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                {tabLikedGamesTotal > 0 ? `${tabLikedGamesTotal} Liked Games` : "Liked Games"}
              </span>
            </div>
            {tabLikedGamesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded bg-surface-container animate-pulse" />
                ))}
              </div>
            ) : tabLikedGames.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-surface-variant rounded-2xl">
                <span className="material-symbols-outlined text-[48px] opacity-20 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <p className="text-body-md text-on-surface-variant">No liked games yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tabLikedGames.map((entry) => (
                  <div key={entry.game.id} className="relative group">
                    <GameCard
                      game={{
                        id: entry.game.id,
                        title: entry.game.title,
                        slug: entry.game.slug,
                        img: entry.game.coverUrl ?? undefined,
                      }}
                    />
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
            )}
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
        <ProfileHeader
          username={username}
          avatar={avatar}
          isFollowing={profile?.isFollowing}
          followersCount={profile?.followersCount}
          followingCount={profile?.followingCount}
          gamesCount={profile?.gamesCount}
          reviewsCount={profile?.reviewsCount}
        />
        <ProfileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {renderTabContent()}
      </main>

      <Footer />
    </div>
  );
}
