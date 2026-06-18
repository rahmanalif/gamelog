"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listUsers, type UserSummary } from "@/lib/people-api";

export default function HQMembers() {
  const [members, setMembers] = useState<UserSummary[]>([]);

  useEffect(() => {
    listUsers({ sort: "followers", limit: 8 })
      .then((r) => setMembers(r.items))
      .catch(() => {});
  }, []);

  return (
    <div className="mb-8">
      <h2 className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase border-b border-outline-variant mb-4 pb-2 flex justify-between items-center font-bold">
        <span>HQ Members</span>
        <Link className="text-primary hover:underline text-xs" href="/people">ALL</Link>
      </h2>
      <div className="flex flex-wrap gap-3">
        {members.map((member) => {
          const uname = member.username ?? "";
          return (
            <Link key={member.id} href={`/people/${uname}`} title={uname}>
              {member.avatarUrl ? (
                <img
                  alt={uname}
                  src={member.avatarUrl}
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
