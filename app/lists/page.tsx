"use client";
import { useState } from "react";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Link from "next/link";
import FeaturedLists from "@/component/lists/featured-lists";
import RecentlyLiked from "@/component/lists/recently-liked";
import CrewPicks from "@/component/lists/crew-picks";

export default function ListsPage() {
  const [activeFilter, setActiveFilter] = useState("TRENDING");

  return (
    <div className="bg-background min-h-screen text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden">
      <Navbar />
      
      <main className="w-full max-w-[1100px] mx-auto px-gutter py-12 flex flex-col gap-12">
        {/* Refined List Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-surface-variant pb-4">
          <div>
            <h1 className="font-display text-display-lg md:text-[48px] text-on-surface tracking-tight leading-tight font-bold">Discover Lists</h1>
            <p className="font-body text-body-md text-on-surface-variant mt-2">Curated collections from the community. Find your next obsession.</p>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["TRENDING", "TOP RATED", "BY FRIENDS"].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-label-md text-label-md transition-all font-bold tracking-widest whitespace-nowrap ${
                  activeFilter === filter ? "text-primary" : "text-on-surface-variant hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
            <div className="w-px h-4 bg-outline-variant mx-2"></div>
            <Link href="/lists/new" className="flex items-center gap-1 font-label-md text-label-md bg-primary text-[#00210b] px-4 py-2 rounded-full hover:bg-primary-container transition-colors whitespace-nowrap shadow-md active:scale-95 font-bold tracking-widest">
              <span className="material-symbols-outlined text-[16px] font-bold">add</span> CREATE LIST
            </Link>
          </div>
        </div>
        
        <FeaturedLists activeFilter={activeFilter} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <RecentlyLiked />
          </div>
          <aside className="md:col-span-1 md:border-l border-surface-variant md:pl-10">
            <CrewPicks />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
