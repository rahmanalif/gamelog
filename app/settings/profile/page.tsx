"use client";

import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import Image from "next/image";
import Link from "next/link";

export default function EditProfilePage() {
  return (
    <div className="bg-background min-h-screen text-on-surface font-body antialiased flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[800px] mx-auto px-gutter py-12 flex flex-col gap-12">
        <header className="border-b border-surface-variant pb-6">
          <h1 className="font-display text-headline-md md:text-display-lg text-white font-bold tracking-tight">Edit Profile</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">Customize your public persona on Gamelog.</p>
        </header>

        <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
          {/* Avatar Section */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8 bg-surface-container-low border border-surface-variant rounded-xl">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-surface-variant bg-surface-container-high relative group cursor-pointer flex-shrink-0 shadow-lg">
              <Image 
                src="/users/pewdiepie.jpg" 
                alt="User avatar" 
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[32px]">photo_camera</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left justify-center h-full pt-4">
              <button className="px-6 py-2 border-2 border-surface-variant text-on-surface font-bold text-label-md uppercase tracking-widest rounded hover:bg-surface-variant hover:border-outline-variant transition-all w-fit mx-auto sm:mx-0 shadow-sm" type="button">
                CHANGE AVATAR
              </button>
              <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest">JPG or PNG, max 5MB.</span>
            </div>
          </section>

          {/* Basic Info Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Display Name</label>
              <input 
                className="bg-transparent border-b-2 border-surface-variant py-2 text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" 
                type="text" 
                defaultValue="PEWDIEPIE" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Username</label>
              <div className="relative">
                <span className="absolute left-0 top-2.5 text-on-surface-variant font-body-lg">@</span>
                <input 
                  className="bg-transparent border-b-2 border-surface-variant py-2 pl-6 w-full text-body-lg text-on-surface-variant cursor-not-allowed opacity-70" 
                  disabled 
                  type="text" 
                  value="pewdiepie" 
                />
              </div>
              <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Username cannot be changed.</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Location</label>
              <input 
                className="bg-transparent border-b-2 border-surface-variant py-2 text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" 
                placeholder="City, Country" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Website</label>
              <input 
                className="bg-transparent border-b-2 border-surface-variant py-2 text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" 
                placeholder="https://" 
                type="url" 
              />
            </div>
          </section>

          {/* Bio */}
          <section className="flex flex-col gap-2 mt-4">
            <label className="font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant">Bio</label>
            <textarea 
              className="w-full bg-surface-container-low border border-surface-variant p-6 rounded-xl focus:outline-none focus:border-primary text-white font-body text-body-lg leading-relaxed min-h-[160px] resize-y placeholder:text-on-surface-variant/50 transition-colors" 
              placeholder="Write something about your gaming journey..."
              defaultValue="Playing everything, slowly. Obsessed with systemic design."
            />
            <span className="font-medium text-label-sm text-on-surface-variant uppercase tracking-widest self-end mt-2">Markdown supported</span>
          </section>

          {/* Favorite Games */}
          <section className="mt-6 flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-surface-variant pb-2">
              <h3 className="font-display font-bold text-headline-sm text-white tracking-wide">Favorite Games</h3>
              <span className="font-bold text-label-sm text-on-surface-variant uppercase tracking-[0.2em]">Choose up to 4</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {/* Filled Slot 1 */}
              <div className="aspect-[2/3] relative group rounded-lg overflow-hidden border border-surface-variant bg-surface-container-high cursor-pointer shadow-md">
                <Image 
                  src="/games/RE4 PS2 cover_ Resident Evil 4 ps2 cover.jpg" 
                  alt="Resident Evil 4" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-white text-[32px]">swap_horiz</span>
                </div>
              </div>
              {/* Empty Slots */}
              {[1, 2, 3].map((slot) => (
                <div key={slot} className="aspect-[2/3] relative group rounded-lg border-2 border-dashed border-surface-variant bg-surface-container-lowest/50 hover:bg-surface-container-high hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[32px]">add</span>
                  <span className="font-bold text-label-sm text-on-surface-variant group-hover:text-primary uppercase tracking-[0.2em] transition-colors">Select</span>
                </div>
              ))}
            </div>
          </section>

          {/* Social Links */}
          <section className="mt-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-headline-sm text-white border-b border-surface-variant pb-2 tracking-wide">Social Links</h3>
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-lg border border-surface-variant flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                </div>
                <input 
                  className="bg-transparent border-b-2 border-surface-variant py-2 flex-grow text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" 
                  placeholder="Twitter Username" 
                  type="text" 
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container-low rounded-lg border border-surface-variant flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant">link</span>
                </div>
                <input 
                  className="bg-transparent border-b-2 border-surface-variant py-2 flex-grow text-body-lg text-white focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50" 
                  placeholder="Discord Username" 
                  type="text" 
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-surface-variant pt-8 sm:justify-end items-center">
            <Link 
              href="/people/PEWDIEPIE"
              className="px-8 py-4 font-bold text-label-md uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors w-full sm:w-auto text-center"
            >
              CANCEL
            </Link>
            <button 
              className="px-10 py-4 bg-primary text-[#00210b] font-bold text-label-md uppercase tracking-[0.2em] rounded-full hover:bg-primary-container transition-all shadow-lg active:scale-95 w-full sm:w-auto" 
              type="submit"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
