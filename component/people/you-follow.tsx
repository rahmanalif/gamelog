"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFollowing, type FollowItem } from "@/lib/people-api";
import { useAuthStore } from "@/store/auth.store";

export default function YouFollow() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [items, setItems] = useState<FollowItem[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !user?.username) return;
    getFollowing(user.username, { limit: 12 })
      .then((r) => setItems(r.items))
      .catch(() => {});
  }, [isLoggedIn, user?.username]);

  if (!isLoggedIn || items.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between items-center font-bold">
        <span>You Follow</span>
        <span className="text-on-surface text-xs font-bold">{items.length}</span>
      </h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const u = item.following;
          if (!u) return null;
          const uname = u.profile.username;
          return (
            <Link key={u.id} href={`/people/${uname}`} title={uname}>
              {u.profile.avatarUrl ? (
                <img
                  alt={uname}
                  src={u.profile.avatarUrl}
                  className="w-10 h-10 rounded-full border border-outline-variant/50 hover:border-primary cursor-pointer transition-colors object-cover shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/50 hover:border-primary cursor-pointer transition-colors flex items-center justify-center text-xs font-bold text-on-surface-variant shadow-sm">
                  {uname.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
