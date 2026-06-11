"use client";

interface ProfileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileNav({ activeTab, onTabChange }: ProfileNavProps) {
  const tabs = [
    "Profile", "Diary", "Activity", "Games", "Reviews", "Watchlist", "Lists", "Following", "Likes"
  ];

  return (
    <nav className="flex items-center justify-between border-b border-surface-variant mt-8 mb-10 overflow-x-auto no-scrollbar">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-4 text-label-md font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab 
                ? "text-white" 
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>
      <div className="hidden md:flex gap-4 pb-4">
        <button className="text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button className="text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">rss_feed</span>
        </button>
      </div>
    </nav>
  );
}
