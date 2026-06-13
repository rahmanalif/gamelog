"use client";
import Image from "next/image";
import Link from "next/link";

interface GameStackProps {
  images: string[];
  title: string;
  href: string;
  gamesCount?: number;
  likes?: string | number;
  comments?: string | number;
  showDetails?: boolean;
}

export default function GameStack({
  images,
  title,
  href,
  gamesCount,
  likes,
  comments,
  showDetails = true,
}: GameStackProps) {
  // Use up to 4 images
  const stackImages = images.slice(0, 4);

  return (
    <div className="group flex flex-col w-full">
      <Link href={href} className="relative h-44 mb-4 block">
        {stackImages.length > 0 ? (
          stackImages.map((img, i) => (
            <div
              key={i}
              className="absolute rounded border border-surface-variant shadow-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary/50"
              style={{
                left: `${i * 32}px`,
                top: `${i * 12}px`,
                zIndex: 40 - i,
                width: "110px",
                aspectRatio: "2/3",
                transform: `rotate(${i * 2 - 4}deg)`,
              }}
            >
              <Image src={img} alt={title} fill className="object-cover" />
              
              {/* Overlay on the top card */}
              {i === 0 && (
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
              )}
            </div>
          ))
        ) : (
          <div className="w-[110px] aspect-[2/3] bg-surface-container border border-surface-variant rounded flex items-center justify-center">
            <span className="material-symbols-outlined opacity-20 text-4xl">grid_view</span>
          </div>
        )}
      </Link>

      {showDetails && (
        <div className="mt-2">
          <Link href={href}>
            <h3 className="font-headline text-[18px] leading-tight text-on-surface group-hover:text-primary transition-colors font-bold mb-1">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-on-surface-variant font-label-sm text-[11px]">
            {gamesCount !== undefined && <span className="font-bold">{gamesCount} games</span>}
            {likes !== undefined && (
              <>
                <span className="opacity-60">•</span>
                <span className="flex items-center gap-0.5 opacity-60">
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>{" "}
                  {likes}
                </span>
              </>
            )}
            {comments !== undefined && (
              <>
                <span className="opacity-60">•</span>
                <span className="flex items-center gap-0.5 opacity-60">
                  <span
                    className="material-symbols-outlined text-[10px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    chat_bubble
                  </span>{" "}
                  {comments}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
