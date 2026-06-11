import Navbar from "@/component/navbar";
import Footer from "@/component/footer";

const FAQ = [
  {
    question: "How do I log a game?",
    answer:
      "Navigate to any game's page and click the LOG button. You can rate the game, mark it as finished, record when you played it, select the platform, and optionally write a review.",
  },
  {
    question: "What's the difference between Wishlist and a List?",
    answer:
      "Your Wishlist is a personal, single queue of games you want to play — quick and private by default. Lists are curated collections you create and can share publicly with themes, descriptions, and tags.",
  },
  {
    question: "How do I follow someone?",
    answer:
      "Visit their profile page via the People section or by clicking their username on any review or list. Hit the FOLLOW button on their profile or from the People discovery page.",
  },
  {
    question: "What is the Diary?",
    answer:
      "Your Diary is a chronological log of every game you've played, sorted by date. It gives you a journal-style view of your gaming history — when you played, what you rated it, and any notes you left.",
  },
  {
    question: "Can I make a private list?",
    answer:
      "Yes. When creating a list, choose from five privacy levels: Anyone, Anyone with the link, Friends, People you follow, or Private (only you).",
  },
  {
    question: "How is the community rating calculated?",
    answer:
      "Community ratings are an average of all user ratings submitted for that game. Each user can submit one rating between 0.5 and 5 stars.",
  },
];

export default function HelpPage() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="w-full max-w-container-max mx-auto px-gutter py-16 flex flex-col gap-12">
        {/* Header */}
        <section className="max-w-xl">
          <p className="text-label-md font-bold tracking-widest uppercase text-primary mb-4">Help</p>
          <h1 className="font-display text-display-lg text-white font-bold tracking-tight leading-tight mb-4">
            How can we help?
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Answers to the most common questions about using Gamelog.
          </p>
        </section>

        <div className="h-px bg-surface-variant" />

        {/* FAQ */}
        <section className="flex flex-col gap-0 max-w-3xl divide-y divide-surface-variant">
          {FAQ.map((item) => (
            <div key={item.question} className="py-8">
              <h2 className="font-display text-headline-sm text-white font-bold mb-3">
                {item.question}
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </section>

        <div className="h-px bg-surface-variant" />

        {/* Still stuck */}
        <section className="p-8 bg-surface-container-low border border-surface-variant rounded-2xl max-w-3xl">
          <h2 className="font-display text-headline-sm text-white font-bold mb-2">
            Still have questions?
          </h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Reach out to the community or check the full documentation.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-surface-variant rounded-lg text-label-md font-bold text-on-surface-variant hover:text-white hover:border-outline transition-all tracking-widest uppercase"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              GitHub
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
