import Image from "next/image";
import Link from "next/link";

export interface GameData {
  id?: string | number;
  title: string;
  slug?: string;
  img?: string;
  rating?: number;
  views?: string;
  likes?: string;
  isAnticipated?: boolean;
  isPlaceholder?: boolean;
}

interface GameCardProps {
  game: GameData;
  className?: string;
}

export default function GameCard({ game, className = "" }: GameCardProps) {
  const href = game.isPlaceholder
    ? "#"
    : `/games/${game.slug ?? game.title?.toLowerCase().replace(/ /g, "-")}`;

  return (
    <Link 
      href={href}
      className={`flex flex-col gap-2 group cursor-pointer ${className}`}
    >
      <div className={`relative w-full aspect-[2/3] border border-surface-variant rounded overflow-hidden group-hover:border-primary transition-colors ${game.isPlaceholder ? 'bg-surface-container-high' : ''}`}>
        {game.img ? (
          <Image
            alt={game.title}
            src={game.img}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-headline-sm text-on-surface-variant text-center px-2">{game.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10 p-4 gap-3">
          <div className="bg-primary text-on-primary font-label-md px-3 py-1.5 rounded flex items-center gap-1 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span> VIEW
          </div>
          <span className="text-white font-display text-headline-sm text-center leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{game.title}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1 mt-1 overflow-hidden">
        <div className="flex items-center justify-between w-full gap-2">
          {game.isAnticipated ? (
            <div className="flex items-center text-on-surface-variant gap-0.5 font-label-sm uppercase tracking-wider text-[10px] whitespace-nowrap">
              Anticipated
            </div>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center text-primary gap-0">
                {[...Array(5)].map((_, i) => {
                  const rating = game.rating || 0;
                  const filled = rating >= i + 1;
                  const half = !filled && rating > i && rating < i + 1;
                  return (
                    <span
                      key={i}
                      className={`material-symbols-outlined ${rating === 0 ? 'opacity-30' : ''}`}
                      style={{ fontVariationSettings: `'FILL' ${filled || half ? 1 : 0}`, fontSize: '13px' }}
                    >
                      {half ? 'star_half' : 'star'}
                    </span>
                  );
                })}
              </div>
              {(game.rating ?? 0) > 0 && (
                <span className="text-on-surface-variant font-label-sm text-[10px]">
                  {game.rating!.toFixed(1)}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center text-on-surface-variant gap-2 font-label-sm text-[10px] shrink-0">
            {game.views && (
              <span className="flex items-center gap-0.5 whitespace-nowrap">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{game.isAnticipated ? 'watch_later' : 'visibility'}</span> 
                {game.views}
              </span>
            )}
            {game.likes && game.likes !== "0" && (
              <span className="flex items-center gap-0.5 whitespace-nowrap">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1", fontSize: '13px' }}>favorite</span> 
                {game.likes}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
