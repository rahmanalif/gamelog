"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listUsers, followUser, unfollowUser, getFollowing, type UserSummary } from "@/lib/people-api";
import { useAuthStore } from "@/store/auth.store";

function UserAvatar({ user, size = 128 }: { user: UserSummary; size?: number }) {
  const [err, setErr] = useState(false);
  const colors = ["bg-[#f97316]","bg-[#22c55e]","bg-[#3b82f6]","bg-[#a855f7]","bg-[#ec4899]","bg-[#14b8a6]"];
  const color = colors[(user.username ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];
  const cls = size >= 128 ? "w-24 h-24 md:w-32 md:h-32" : "w-10 h-10";

  if (!user.avatarUrl || err) {
    return (
      <div className={`${cls} rounded-full ${color} flex items-center justify-center border-2 border-surface-container-high`}>
        <span className="font-bold text-white text-xl select-none">{(user.username ?? "?").charAt(0).toUpperCase()}</span>
      </div>
    );
  }
  return (
    <img
      alt={user.username ?? ""}
      src={user.avatarUrl}
      className={`${cls} rounded-full border-2 border-surface-container-high object-cover`}
      onError={() => setErr(true)}
    />
  );
}

export default function FeaturedMembers() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currentUser = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    listUsers({ sort: "followers", limit: 5 })
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

  if (members.length === 0) return null;

  return (
    <section className="mb-stack-lg">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-6 pb-2 font-bold">
        Featured Members
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {members.map((member) => {
          const uname = member.username ?? "";
          const isFollowed = followed.has(uname);
          const isOwn = currentUser?.username?.toLowerCase() === uname.toLowerCase();
          return (
            <div key={member.id} className="flex flex-col items-center group cursor-pointer">
              <div className="relative mb-3">
                <Link href={`/people/${uname}`}>
                  <UserAvatar user={member} size={128} />
                </Link>
                {!isOwn && (
                  <button
                    onClick={() => toggle(uname)}
                    disabled={loadingSet.has(uname)}
                    className={`absolute bottom-0 right-2 md:right-4 rounded-full w-8 h-8 flex items-center justify-center border-2 border-background transition-all shadow-sm disabled:opacity-50 ${
                      isFollowed
                        ? "bg-primary text-on-primary-container"
                        : "bg-surface-container-high hover:bg-primary hover:text-on-primary-container text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm font-bold">
                      {isFollowed ? "check" : "add"}
                    </span>
                  </button>
                )}
              </div>
              <Link href={`/people/${uname}`}>
                <h3 className="font-headline text-lg text-on-surface font-bold leading-tight group-hover:text-primary transition-colors text-center">
                  {member.name ?? uname}
                </h3>
              </Link>
              <p className="font-label-sm text-[11px] text-on-surface-variant mb-2 text-center opacity-80">
                {member.gamesCount.toLocaleString()} games • {member.reviewsCount.toLocaleString()} reviews
              </p>
              {!isOwn && (
                <button
                  onClick={() => toggle(uname)}
                  disabled={loadingSet.has(uname)}
                  className={`text-label-sm font-bold uppercase tracking-widest px-4 py-1 rounded transition-all disabled:opacity-50 ${
                    isFollowed
                      ? "text-primary border border-primary/40 hover:bg-error/10 hover:text-error hover:border-error/40"
                      : "text-on-surface-variant border border-surface-variant hover:text-white hover:border-outline"
                  }`}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              )}
              {(member.recentGameCovers ?? []).length > 0 && (
                <div className="flex gap-1 justify-center mt-2">
                  {(member.recentGameCovers ?? []).map((cover, i) => (
                    <img
                      key={i}
                      alt="Game"
                      className="w-8 h-12 object-cover rounded-sm border border-outline-variant/30 shadow-sm"
                      src={cover}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
