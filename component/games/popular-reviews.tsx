"use client";
import { useState } from "react";

const REVIEWS = [
  {
    id: 1,
    game: "Elden Ring",
    year: "2022",
    rating: 5,
    user: "User123",
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/124909-spider-man-3-windows-front-cover.png",
    likes: 245,
    content: "An absolute masterpiece of open-world design. The sense of discovery is unmatched in modern gaming. Every corner hides a secret, a challenge, or a breathtaking view."
  },
  {
    id: 2,
    game: "Cyberpunk 2077",
    year: "2020",
    rating: 3,
    user: "NightCityNetrunner",
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/grandtheftautovicecity_pc.jpg",
    likes: 180,
    content: "Flawed but fascinating. The narrative and world-building are top-tier, even if the mechanics sometimes fall short of the ambition."
  },
  {
    id: 3,
    game: "The Last of Us Part II",
    year: "2020",
    rating: 5,
    user: "JoelMiller",
    avatar: "/users/mr beast logo.jpg",
    poster: "/games/igic.jpg",
    likes: 520,
    content: "A brutal, emotional rollercoaster. Naughty Dog's attention to detail is staggering. The combat is tense and every encounter feels like a desperate struggle for survival."
  },
  {
    id: 4,
    game: "God of War Ragnarök",
    year: "2022",
    rating: 5,
    user: "KratosFan99",
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/need for speed most wanted.jpg",
    likes: 410,
    content: "An epic conclusion to the Norse saga. The character development between Kratos and Atreus is beautifully handled, and the combat remains some of the best in the genre."
  },
  {
    id: 5,
    game: "Hades",
    year: "2020",
    rating: 5,
    user: "Zagreus",
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/prince of persia.jpg",
    likes: 350,
    content: "The perfect roguelike. The way the story unfolds through each run is genius, and the voice acting and art direction are absolutely top-notch."
  },
  {
    id: 6,
    game: "Resident Evil 4",
    year: "2023",
    rating: 5,
    user: "LeonKennedy",
    avatar: "/users/mr beast logo.jpg",
    poster: "/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg",
    likes: 290,
    content: "A masterclass in how to do a remake. It preserves the spirit of the original while modernizing the controls and expanding on the story in meaningful ways."
  }
];

const REVIEWS_PER_PAGE = 3;

export default function PopularReviews() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = REVIEWS.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <section className="flex flex-col gap-stack-sm">
      <div className="border-b border-surface-variant pb-2">
        <h2 className="font-display text-headline-sm text-on-surface">Popular Reviews This Week</h2>
      </div>
      <div className="flex flex-col gap-0 border border-surface-variant rounded bg-surface-container-low overflow-hidden">
        {currentReviews.map((review) => (
          <div key={review.id} className="p-4 border-b border-surface-variant last:border-b-0 flex gap-4 hover:bg-surface-container transition-colors cursor-pointer">
            <div className="w-16 h-24 flex-shrink-0 bg-surface-variant rounded overflow-hidden border border-surface-variant">
              <img alt={`${review.game} Poster`} className="w-full h-full object-cover" src={review.poster} />
            </div>
            <div className="flex flex-col gap-1 flex-grow">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-headline-sm text-on-surface leading-none mb-1">{review.game}</h3>
                <div className="flex flex-col gap-1.5">
                  {/* User Row - Name made bigger */}
                  <div className="flex items-center gap-2">
                    <img alt={review.user} src={review.avatar} className="w-5 h-5 rounded-full object-cover border border-outline-variant/30" />
                    <span className="text-on-surface font-bold text-base">{review.user}</span>
                  </div>
                  
                  {/* Metadata Row - Year, Stars, and Likes */}
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-sm text-label-sm flex-wrap">
                    <span className="font-bold opacity-60">{review.year}</span>
                    <div className="flex items-center text-primary gap-0">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-surface-variant"></div>
                    <span className="flex items-center gap-1 hover:text-primary cursor-pointer">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      {review.likes}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-body text-body-md text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Repositioned to bottom right and made smaller */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-base">chevron_left</span>
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs transition-all ${
                currentPage === i + 1 
                ? "bg-primary text-on-primary shadow-sm" 
                : "border border-surface-variant text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-base">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
