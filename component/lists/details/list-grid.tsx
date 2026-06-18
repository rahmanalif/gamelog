import GameCard, { GameData } from "@/component/game-card";
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

function toNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function mapListItemToGameCard(item: ListItem): GameData {
  const rating = toNumber(item.game.avgRating);

  return {
    id: item.game.id,
    title: item.game.title,
    slug: item.game.slug,
    img: item.game.coverUrl ?? undefined,
    rating,
    views: String(item.game.logCount ?? 0),
    likes: String(item.game.likeCount ?? 0),
  };
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative z-20">
          {items.map((item, index) => (
            <div key={item.id} className="flex min-w-0 flex-col gap-1">
              <GameCard game={mapListItemToGameCard(item)} />
              <span className="text-center font-label-md text-label-md text-on-surface-variant">
                {item.position || index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
