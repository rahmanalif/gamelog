import Link from "next/link";

export default function ListActions() {
  return (
    <div className="md:col-span-4 mt-stack-md md:mt-0">
      <div className="bg-surface-container/90 backdrop-blur-md border border-outline-variant/60 rounded-lg overflow-hidden sticky top-24 shadow-xl">
        {/* Actions */}
        <div className="flex flex-col">
          <button className="w-full py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors border-b border-outline-variant/60 group">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary">favorite</span>
            <span className="font-label-md text-label-md font-bold">Like this list? <span className="text-on-surface-variant font-normal">398,252</span></span>
          </button>
          <button className="w-full py-3 px-4 flex items-center justify-center gap-2 text-on-surface hover:bg-surface-container-high transition-colors border-b border-outline-variant/60 group">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface">content_copy</span>
            <span className="font-label-md text-label-md font-bold">Clone this list <span className="text-on-surface-variant font-normal">1.4K clones</span></span>
          </button>
          <button className="w-full py-3 px-4 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md uppercase tracking-wider font-bold">
            Share
          </button>
        </div>
        
        {/* Progress */}
        <div className="p-4 bg-surface-container-low/80 border-t border-outline-variant/60">
          <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">You've played</span>
              <span className="font-body text-body-md text-on-surface">177 of 800</span>
            </div>
            <span className="font-headline text-headline-md text-on-surface font-bold leading-none">22<span className="text-lg text-on-surface-variant font-normal">%</span></span>
          </div>
          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary-container w-[22%]"></div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="p-4 border-t border-outline-variant/60">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-3 font-bold">Tagged</span>
          <div className="flex flex-wrap gap-2">
            {["bucketlist", "essentials", "masterpieces", "reddit"].map(tag => (
              <Link key={tag} href="#" className="px-2 py-1 bg-surface-variant/80 text-on-surface-variant font-label-sm text-label-sm rounded hover:bg-surface-container-high hover:text-on-surface transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
