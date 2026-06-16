import Link from "next/link";
import type { ListDetail } from "@/lib/lists-api";

interface ListHeroProps {
  list?: ListDetail;
  listTitle?: string;
}

export default function ListHero({ list, listTitle }: ListHeroProps) {
  const title = list?.title ?? listTitle ?? "Games everyone should play at least once";
  const profile = list?.user.profile;
  const gamesCount = list?._count.items ?? 0;
  const publishedYear = list ? new Date(list.createdAt).getFullYear() : "—";
  const privacy = list?.privacy ?? "PUBLIC";
  const likeCount = list?.likeCount ?? 0;
  const commentCount = list?.commentCount ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-8 lg:gap-12 relative">
      <div className="md:col-span-12 lg:col-span-10 flex flex-col gap-stack-md">
        {/* Creator Meta */}
        <div className="flex items-center gap-3">
          {profile?.avatarUrl ? (
            <img
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-primary-container shadow-sm object-cover"
              src={profile.avatarUrl}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-variant flex items-center justify-center font-bold text-sm text-on-surface">
              {(profile?.name || profile?.username)?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-label-md text-label-md">
              <span className="text-on-surface-variant">List by</span>
              {profile?.username ? (
                <Link className="text-on-surface font-bold hover:text-primary transition-colors" href={`/people/${profile.username}`}>
                  {profile.name || profile.username}
                </Link>
              ) : (
                <span className="text-on-surface font-bold">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-lg md:text-[56px] text-on-surface tracking-tighter leading-tight font-bold">
            {title}
          </h1>
        </div>

        {/* Description */}
        {list?.description && (
          <div className="font-body text-body-md text-on-surface-variant max-w-4xl leading-relaxed">
            <p>{list.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-6 mt-4 pt-6 border-t border-surface-variant/30 flex-wrap">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">GAMES</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">{gamesCount}</span>
          </div>
          <div className="h-8 w-px bg-surface-variant/30" />
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">PUBLISHED</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">{publishedYear}</span>
          </div>
          <div className="h-8 w-px bg-surface-variant/30" />
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">TYPE</span>
            <span className="font-headline text-headline-sm text-primary font-bold">{privacy}</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-surface-variant/30" />
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">LIST LIKES</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">{likeCount.toLocaleString()}</span>
          </div>

          <div className="ml-auto flex items-center gap-8 self-end pb-1">
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="font-label-md text-on-surface font-bold">{likeCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chat_bubble</span>
              <span className="font-label-md text-on-surface font-bold">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
