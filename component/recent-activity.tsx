import ReviewCard, { ReviewData } from "./games/review-card";

const REVIEWS = [
  {
    id: 1,
    user: "AlexGamer",
    game: "Baldur's Gate 3",
    rating: 5,
    likes: 24,
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/Box1.jpg",
    content: "An absolute masterpiece of choice and consequence. The depth of the systems and the writing is unparalleled in modern RPGs. I've restarted three times just to see different outcomes."
  },
  {
    id: 2,
    user: "HorrorFan99",
    game: "Alan Wake 2",
    rating: 4,
    likes: 12,
    avatar: "/users/pewdiepie.jpg",
    poster: "/games/house of the dead.jpg",
    content: "Visually stunning and genuinely unsettling. The meta-narrative elements elevate it beyond a standard horror game, though combat can feel a bit clunky at times."
  }
];

export default function RecentActivity() {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-end border-b border-surface-variant pb-2 mb-8">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">JUST REVIEWED...</h2>
      </div>
      <div className="flex flex-col gap-0 border border-surface-variant rounded bg-surface-container-low overflow-hidden shadow-lg">
        {REVIEWS.map((review, index) => (
          <div key={review.id}>
            <ReviewCard review={review as ReviewData} />
            {index < REVIEWS.length - 1 && (
              <div className="h-px bg-surface-variant w-full opacity-50" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
