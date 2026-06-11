import Link from "next/link";

export default function NewsAndArticles() {
  return (
    <section className="flex flex-col gap-stack-sm">
      <div className="border-b border-surface-variant pb-2">
        <h2 className="font-display text-headline-sm text-on-surface">News & Articles</h2>
      </div>
      <div className="flex flex-col gap-4">
        {/* Article 1 */}
        <div className="group cursor-pointer">
          <div className="w-full aspect-video bg-surface-variant rounded overflow-hidden mb-2 border border-surface-variant group-hover:border-primary transition-colors">
            <img 
              alt="Console Controller" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src="/users/pewdiepie.jpg" 
            />
          </div>
          <h3 className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2">The Evolution of the DualSense Controller</h3>
          <p className="font-body text-body-md text-on-surface-variant mt-1 line-clamp-2">A deep dive into how haptic feedback is changing the way we experience digital worlds.</p>
        </div>
        
        {/* Article 2 */}
        <div className="group cursor-pointer flex gap-3 border-t border-surface-variant pt-3">
          <div className="w-24 aspect-square bg-surface-variant rounded overflow-hidden border border-surface-variant flex-shrink-0 group-hover:border-primary transition-colors">
            <img 
              alt="Keyboard" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              src="/users/pewdiepie.jpg" 
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors text-lg leading-tight line-clamp-2 font-semibold">Best Indie Games of the Year So Far</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 uppercase tracking-wider">Editorial Team • 2 days ago</p>
          </div>
        </div>
      </div>
    </section>
  );
}
