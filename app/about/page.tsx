import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <Navbar />

      <main className="w-full max-w-container-max mx-auto px-gutter py-16 flex flex-col gap-16">
        {/* Hero */}
        <section className="max-w-2xl">
          <p className="text-label-md font-bold tracking-widest uppercase text-primary mb-4">About</p>
          <h1 className="font-display text-display-lg text-white font-bold tracking-tight leading-tight mb-6">
            Built for people who take games seriously.
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Gamelog is a social platform for tracking, discovering, and discussing video games.
            Think of it as the place your gaming life lives — your history, your opinions, your community.
          </p>
        </section>

        <div className="h-px bg-surface-variant" />

        {/* What we do */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "edit_square",
              title: "Log Every Game",
              body: "Keep a record of every game you play. Add ratings, write reviews, and track when you played — all in one place.",
            },
            {
              icon: "format_list_bulleted",
              title: "Build Lists",
              body: "Curate collections of games by genre, theme, era, or anything you can imagine. Share them with the community.",
            },
            {
              icon: "group",
              title: "Find Your People",
              body: "Follow critics, friends, and fellow enthusiasts. Discover games through the lens of people whose taste you trust.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-4 p-6 bg-surface-container-low border border-surface-variant rounded-xl">
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.icon}
              </span>
              <h2 className="font-display text-headline-sm text-white font-bold">{item.title}</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <div className="h-px bg-surface-variant" />

        {/* CTA */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-surface-container-low border border-surface-variant rounded-2xl">
          <div>
            <h2 className="font-display text-headline-md text-white font-bold mb-2">Ready to start?</h2>
            <p className="text-body-md text-on-surface-variant">
              Join thousands of gamers already tracking their journey on Gamelog.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 bg-primary text-on-primary-fixed px-8 py-4 rounded-lg font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md"
          >
            Get Started — It&apos;s Free
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
