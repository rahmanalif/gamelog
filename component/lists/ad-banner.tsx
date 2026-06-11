export default function AdBanner() {
  return (
    <section className="border border-surface-variant rounded-xl overflow-hidden shadow-sm">
      <div className="bg-surface-container-high px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        <div className="text-center md:text-left">
          <h2 className="font-headline text-headline-sm md:text-headline-md text-on-surface mb-2 font-bold uppercase tracking-tight">Ad-Free. Stats. Custom Themes.</h2>
          <p className="font-body text-body-md text-on-surface-variant max-w-xl">Get annual and all-time stats, filtering by your favorite platforms, release notifications, no third-party ads and more...</p>
        </div>
        <button className="bg-surface-variant text-on-surface border border-surface-variant font-label-md text-label-md px-6 py-3 rounded-lg uppercase font-bold hover:border-primary transition-colors whitespace-nowrap shadow-sm hover:shadow">
          Upgrade to <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">Pro</span>
        </button>
      </div>
    </section>
  );
}
