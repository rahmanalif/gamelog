"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listUsers, followUser, unfollowUser, getFollowing, type UserSummary } from "@/lib/people-api";
import { useAuthStore } from "@/store/auth.store";

function Avatar({ user }: { user: UserSummary }) {
  const [err, setErr] = useState(false);
  const colors = ["bg-[#f97316]","bg-[#22c55e]","bg-[#3b82f6]","bg-[#a855f7]","bg-[#ec4899]","bg-[#14b8a6]"];
  const color = colors[(user.username ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];

  if (!user.avatarUrl || err) {
    return (
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center border border-outline-variant/50 shadow-sm`}>
        <span className="font-bold text-white text-sm select-none">{(user.username ?? "?").charAt(0).toUpperCase()}</span>
      </div>
    );
  }
  return (
    <img
      alt={user.username ?? ""}
      src={user.avatarUrl}
      className="w-10 h-10 rounded-full object-cover border border-outline-variant/50 group-hover:border-primary/50 transition-colors shadow-sm"
      onError={() => setErr(true)}
    />
  );
}

export default function PopularThisWeek() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currentUser = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    listUsers({ sort: "reviews", limit: 10 })
      .then((r) => setMembers(r.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !currentUser?.username) return;
    getFollowing(currentUser.username, { limit: 100 })
      .then((r) => {
        const names = r.items.map((i) => i.following?.profile.username ?? "").filter(Boolean);
        setFollowed(new Set(names));
      })
      .catch(() => {});
  }, [isLoggedIn, currentUser?.username]);

  const toggle = async (username: string) => {
    if (!isLoggedIn) { openAuthModal("login"); return; }
    if (loadingSet.has(username)) return;
    setLoadingSet((prev) => new Set(prev).add(username));
    const was = followed.has(username);
    setFollowed((prev) => { const n = new Set(prev); was ? n.delete(username) : n.add(username); return n; });
    try {
      if (was) await unfollowUser(username);
      else await followUser(username);
    } catch {
      setFollowed((prev) => { const n = new Set(prev); was ? n.add(username) : n.delete(username); return n; });
    } finally {
      setLoadingSet((prev) => { const n = new Set(prev); n.delete(username); return n; });
    }
  };

  return (
    <div className="lg:col-span-3">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between font-bold">
        <span>Popular This Week</span>
        <Link className="text-primary hover:underline text-xs" href="/people">MORE</Link>
      </h2>
      {members.length === 0 ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-container" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 bg-surface-container rounded w-32" />
                <div className="h-3 bg-surface-container rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {members.map((member) => {
            const uname = member.username ?? "";
            const isFollowed = followed.has(uname);
            const isOwn = currentUser?.username?.toLowerCase() === uname.toLowerCase();
            return (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors px-2 group"
              >
                <div className="flex items-center gap-4">
                  <Link href={`/people/${uname}`}>
                    <Avatar user={member} />
                  </Link>
                  <div>
                    <Link href={`/people/${uname}`}>
                      <h4 className="font-label-md text-base text-on-surface font-bold hover:text-primary cursor-pointer transition-colors">
                        {member.name ?? uname}
                      </h4>
                    </Link>
                    <p className="font-label-sm text-on-surface-variant opacity-80">
                      {member.reviewsCount.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="hidden sm:flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                    <span className="font-label-sm text-on-surface-variant">{member.gamesCount.toLocaleString()}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">group</span>
                    <span className="font-label-sm text-on-surface-variant">{member.followersCount.toLocaleString()}</span>
                  </div>
                  {!isOwn && (
                    <button
                      onClick={() => toggle(uname)}
                      disabled={loadingSet.has(uname)}
                      className={`rounded-full w-8 h-8 flex items-center justify-center ml-2 shadow-sm transition-all disabled:opacity-50 ${
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
