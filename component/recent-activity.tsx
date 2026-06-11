const REVIEWS = [
  {
    id: 1,
    user: "AlexGamer",
    game: "Baldur's Gate 3",
    rating: 5,
    likes: 24,
    comments: 5,
    avatar: "/users/pewdiepie.jpg",
    thumb: "/games/Box1.jpg",
    content: "An absolute masterpiece of choice and consequence. The depth of the systems and the writing is unparalleled in modern RPGs. I've restarted three times just to see different outcomes."
  },
  {
    id: 2,
    user: "HorrorFan99",
    game: "Alan Wake 2",
    rating: 4,
    likes: 12,
    comments: 0,
    avatar: "/users/pewdiepie.jpg",
    thumb: "/games/house of the dead.jpg",
    content: "Visually stunning and genuinely unsettling. The meta-narrative elements elevate it beyond a standard horror game, though combat can feel a bit clunky at times."
  }
];

export default function RecentActivity() {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-end border-b border-surface-variant pb-2 mb-8">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">JUST REVIEWED...</h2>
      </div>
      <div className="flex flex-col gap-6">
        {REVIEWS.map((review, index) => (
          <div key={review.id}>
            <div className="flex gap-6 p-5 rounded-xl hover:bg-surface-container-high transition-all duration-300 border border-transparent hover:border-surface-variant group">
              <img 
                alt="Game Thumbnail" 
                className="w-20 h-28 object-cover rounded shadow-md border border-surface-variant transition-transform group-hover:scale-105" 
                src={review.thumb}
              />
              <div className="flex flex-col flex-grow justify-center gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline shadow-inner">
                      <img 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                        src={review.avatar}
                      />
                    </div>
                    <span className="font-label-md text-label-md text-on-surface font-bold">{review.user}</span>
                    <span className="text-on-surface-variant font-body text-sm">reviewed</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">{review.game}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex text-primary gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-base">favorite</span>
                      <span className="font-label-sm text-label-sm">{review.likes}</span>
                    </div>
                  </div>
                </div>
                <p className="font-body text-body-md text-on-surface-variant line-clamp-2 leading-relaxed italic">"{review.content}"</p>
              </div>
            </div>
            {index < REVIEWS.length - 1 && <div className="h-px bg-surface-variant w-full opacity-50 my-2"></div>}
          </div>
        ))}
      </div>
    </section>
  );
}
