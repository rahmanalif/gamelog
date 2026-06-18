"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { followUser, unfollowUser } from "@/lib/people-api";

interface ProfileHeaderProps {
  username: string;
  avatar: string;
  isFollowing?: boolean | null;
  followersCount?: number;
  followingCount?: number;
  gamesCount?: number;
  reviewsCount?: number;
}

export default function ProfileHeader({
  username,
  avatar,
  isFollowing: initialIsFollowing,
  followersCount = 0,
  followingCount = 0,
  gamesCount = 0,
  reviewsCount = 0,
}: ProfileHeaderProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const [avatarError, setAvatarError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false);
  const [followerCount, setFollowerCount] = useState(followersCount);
  const [loading, setLoading] = useState(false);

  const isOwnProfile =
    isLoggedIn && user?.username.toLowerCase() === username.toLowerCase();

  const stats = [
    { label: "Games", value: gamesCount.toLocaleString() },
    { label: "Reviews", value: reviewsCount.toLocaleString() },
    { label: "Following", value: followingCount.toLocaleString() },
    { label: "Followers", value: followerCount.toLocaleString() },
  ];

  const initial = username.charAt(0).toUpperCase();
  const avatarColors = [
    "bg-[#f97316]", "bg-[#22c55e]", "bg-[#3b82f6]",
    "bg-[#a855f7]", "bg-[#ec4899]", "bg-[#14b8a6]",
  ];
  const colorIndex =
    username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    avatarColors.length;
  const avatarBg = avatarColors[colorIndex];
  const showFallback = !avatar || avatarError;

  const handleFollow = async () => {
    if (!isLoggedIn) { openAuthModal("login"); return; }
    if (loading) return;
    setLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowerCount((c) => c + (wasFollowing ? -1 : 1));
    try {
      if (wasFollowing) await unfollowUser(username);
      else await followUser(username);
    } catch {
      setIsFollowing(wasFollowing);
      setFollowerCount((c) => c + (wasFollowing ? 1 : -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-8 border-b border-surface-variant">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-surface-variant shadow-xl shrink-0">
          {showFallback ? (
            <div className={`w-full h-full ${avatarBg} flex items-center justify-center`}>
              <span className="font-display text-display-lg text-white font-bold select-none">
                {initial}
              </span>
            </div>
          ) : (
            <Image
              src={avatar}
              alt={username}
              width={128}
              height={128}
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              onError={() => setAvatarError(true)}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-headline-md md:text-display-lg text-white font-bold tracking-tight uppercase">
              {username}
            </h1>
            {isOwnProfile ? (
              <Link
                href="/settings/profile"
                className="hidden sm:block px-4 py-1.5 border border-outline-variant rounded text-label-sm font-bold tracking-widest text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-all"
              >
                EDIT PROFILE
              </Link>
            ) : (
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded text-label-sm font-bold tracking-widest transition-all disabled:opacity-60 ${
                  isFollowing
                    ? "border border-primary/40 text-primary hover:bg-error/10 hover:text-error hover:border-error/40"
                    : "border border-outline-variant text-on-surface-variant hover:text-white hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isFollowing ? "check" : "add"}
                </span>
                {isFollowing ? "FOLLOWING" : "FOLLOW"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 md:gap-8 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center cursor-pointer group">
            <span className="text-headline-sm font-bold text-white group-hover:text-primary transition-colors">
              {stat.value}
            </span>
            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
