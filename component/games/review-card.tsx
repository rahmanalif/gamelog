"use client";

import Image from "next/image";

export interface ReviewData {
  id: string | number;
  game: string;
  year?: string;
  rating: number;
  user: string;
  avatar: string;
  poster: string;
  likes: number | string;
  content: string;
}

interface ReviewCardProps {
  review: ReviewData;
  showPoster?: boolean;
}

export default function ReviewCard({ review, showPoster = true }: ReviewCardProps) {
  return (
    <div className="p-4 flex gap-6 hover:bg-surface-container transition-all duration-300 cursor-pointer group rounded-xl border border-transparent hover:border-surface-variant">
      {showPoster && (
        <div className="w-20 h-28 flex-shrink-0 bg-surface-variant rounded overflow-hidden border border-surface-variant shadow-md transition-transform group-hover:scale-105">
          <img 
            alt={`${review.game} Poster`} 
            className="w-full h-full object-cover" 
            src={review.poster} 
          />
        </div>
      )}
      
      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-headline-sm text-on-surface leading-none group-hover:text-primary transition-colors truncate">
              {review.game}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-primary gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className="material-symbols-outlined text-[16px]" 
                    style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-on-surface-variant font-bold text-sm">
                {review.rating}/5
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {/* User Info Row */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm relative">
                <Image 
                  alt={review.user} 
                  src={review.avatar} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <span className="text-on-surface font-bold text-base leading-none">
                {review.user}
              </span>
              {review.year && (
                <span className="text-on-surface-variant font-label-sm text-label-sm font-bold opacity-40 ml-1">
                  {review.year}
                </span>
              )}
            </div>
            
            {/* Likes / Interaction */}
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">favorite</span>
                <span className="font-bold">{review.likes}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="font-body text-body-md text-on-surface-variant mt-2 leading-relaxed italic border-l-2 border-primary/20 pl-4">
          "{review.content}"
        </p>
      </div>
    </div>
  );
}
