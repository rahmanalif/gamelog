import Link from "next/link";

interface ListHeroProps {
  listTitle?: string;
}

export default function ListHero({ listTitle }: ListHeroProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-8 lg:gap-12 relative">
      {/* Right Column: Details (Now spans more or full if preferred, keeping grid for consistency) */}
      <div className="md:col-span-12 lg:col-span-10 flex flex-col gap-stack-md">
        {/* Creator Meta */}
        <div className="flex items-center gap-3">
          <img 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-primary-container shadow-sm" 
            src="/users/pewdiepie.jpg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-label-md text-label-md">
              <span className="text-on-surface-variant">List by</span>
              <Link className="text-on-surface font-bold hover:text-primary transition-colors" href="#">okaybro1</Link>
              <span className="bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase font-black">Pro</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-lg md:text-[56px] text-on-surface tracking-tighter leading-tight font-bold">
            {listTitle ?? "Games everyone should play at least once"}
          </h1>
        </div>

        {/* Description */}
        <div className="font-body text-body-md text-on-surface-variant max-w-4xl leading-relaxed">
          <p className="mb-4">
            I asked the community what's one game everyone should play at least once in their lifetime to create a definitive list of absolute essentials.
          </p>
          <p className="mb-4">
            Whether it's for historical significance, groundbreaking mechanics, or unparalleled storytelling, these are the titles that define the medium.
          </p>
          <p>
            Feel free to comment your progress on the list or any games you think should be added or removed. Thanks!
          </p>
        </div>

        {/* List Metadata (Enriched) */}
        <div className="flex items-center gap-6 mt-4 pt-6 border-t border-surface-variant/30 flex-wrap">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">GAMES</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">135</span>
          </div>
          <div className="h-8 w-px bg-surface-variant/30"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">PUBLISHED</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">2024</span>
          </div>
          <div className="h-8 w-px bg-surface-variant/30"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">TYPE</span>
            <span className="font-headline text-headline-sm text-primary font-bold">PUBLIC</span>
          </div>
          
          <div className="hidden sm:block h-8 w-px bg-surface-variant/30"></div>
          
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">CLONES</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">1.4K</span>
          </div>
          
          <div className="hidden sm:block h-8 w-px bg-surface-variant/30"></div>
          
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1 opacity-60">LIST LIKES</span>
            <span className="font-headline text-headline-sm text-on-surface font-bold">398K</span>
          </div>

          <div className="ml-auto flex items-center gap-8 self-end pb-1">
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
              <span className="font-label-md text-on-surface font-bold">12,402</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="font-label-md text-on-surface font-bold">840</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chat_bubble</span>
              <span className="font-label-md text-on-surface font-bold">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
