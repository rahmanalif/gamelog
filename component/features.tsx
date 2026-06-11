export default function Features() {
  return (
    <section className="py-12 border-t border-b border-surface-variant my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center gap-5">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>auto_stories</span>
          <h3 className="font-headline text-headline-sm text-on-surface">Your Diary</h3>
          <p className="font-body text-body-md text-on-surface-variant max-w-xs leading-relaxed">Keep track of every game you play, log your playtime, and write reviews to remember your thoughts.</p>
        </div>
        <div className="flex flex-col items-center gap-5">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>view_list</span>
          <h3 className="font-headline text-headline-sm text-on-surface">Build Lists</h3>
          <p className="font-body text-body-md text-on-surface-variant max-w-xs leading-relaxed">Curate your favorites, organize your endless backlog, or rank the best games of the year.</p>
        </div>
        <div className="flex flex-col items-center gap-5">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>group</span>
          <h3 className="font-headline text-headline-sm text-on-surface">Join the Community</h3>
          <p className="font-body text-body-md text-on-surface-variant max-w-xs leading-relaxed">Follow friends, discover new games through curated feeds, and read passionate reviews.</p>
        </div>
      </div>
    </section>
  );
}
