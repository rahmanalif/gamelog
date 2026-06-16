import Link from "next/link";
import type { ListItem } from "@/lib/lists-api";

interface ListGridProps {
  items?: ListItem[];
  updatedAt?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} years ago`;
}

export default function ListGrid({ items = [], updatedAt, refreshing = false, onRefresh }: ListGridProps) {
  return (
    <>
      <div className="flex justify-between items-center mt-stack-lg mb-stack-sm border-b border-outline-variant pb-2 relative z-20">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
          {updatedAt ? `Updated ${timeAgo(updatedAt)}` : `${items.length} games`}
        </span>
        <div className="flex gap-4">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh list"
              title="Refresh list"
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase flex items-center gap-1 font-bold disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${refreshing ? "animate-spin" : ""}`}>
                refresh
              </span>
            </button>
          )}
          <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase flex items-center gap-1 font-bold">
            Sort <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center text-on-surface-variant opacity-40">
          <span className="material-symbols-outlined text-[48px]">sports_esports</span>
          <p className="mt-2">No games in this list yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 relative z-20">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <Link
                href={`/games/${item.game.slug}`}
                className="relative aspect-[2/3] w-full block group overflow-hidden bg-surface-container border border-outline-variant/50 hover:border-primary transition-colors rounded-sm"
              >
                {item.game.coverUrl ? (
                  <>
                    <img
                      alt={item.game.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={item.game.coverUrl}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline text-[32px]">image</span>
                  </div>
                )}
                {item.note && (
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] line-clamp-2">{item.note}</p>
                  </div>
                )}
              </Link>
              <span className="font-label-md text-label-md text-on-surface-variant">{index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
