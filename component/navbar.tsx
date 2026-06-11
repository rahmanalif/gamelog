'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { POPULAR_GAMES } from '@/component/games/popular-games-grid';

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, openAuthModal, setIsLoggedIn } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.length > 1
    ? POPULAR_GAMES.filter((g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'GAMES', href: '/games' },
    { name: 'LISTS', href: '/lists' },
    { name: 'PEOPLE', href: '/people' },
  ];

  return (
    <>
      <header className="bg-surface border-b border-surface-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-gutter max-w-[1100px] mx-auto h-16">

          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="font-display text-headline-md tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Gamelog Logo" className="w-8 h-8 object-contain" />
              GAMELOG
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 items-center h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-label-md text-label-md uppercase tracking-widest px-3 py-2 rounded-md transition-all duration-300 h-10 flex items-center ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-on-surface-variant hover:text-white hover:bg-surface-container-high'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              <input
                className="bg-surface-container-high border-none rounded-full py-1.5 px-5 text-sm text-on-surface focus:ring-1 focus:ring-primary w-52 transition-all placeholder:text-on-surface-variant/50"
                placeholder="Search games..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <span
                className="material-symbols-outlined absolute right-4 top-2 text-on-surface-variant"
                style={{ fontSize: '18px' }}
              >
                search
              </span>

              {/* Search dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container border border-surface-variant rounded-xl shadow-2xl z-50 overflow-hidden">
                  {searchResults.map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.title?.toLowerCase().replace(/ /g, '-')}`}
                      onClick={clearSearch}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors group"
                    >
                      <div className="w-8 h-11 shrink-0 rounded overflow-hidden border border-surface-variant">
                        {game.img && (
                          <img src={game.img} alt={game.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {game.title}
                        </p>
                        <div className="flex items-center text-primary gap-0 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className="material-symbols-outlined"
                              style={{
                                fontSize: '11px',
                                fontVariationSettings:
                                  s <= Math.floor(game.rating || 0) ? "'FILL' 1" : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden sm:block font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-[#00e676] text-[#00210b] font-label-md text-label-md uppercase tracking-widest px-5 py-2 rounded-lg flex items-center gap-1.5 hover:bg-primary transition-all shadow-md active:scale-95"
                >
                  New Account
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-surface-variant h-8">
                {/* Notification Bell */}
                <button className="relative text-on-surface-variant hover:text-white transition-colors hidden sm:block">
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none">
                    3
                  </span>
                </button>

                {/* Username */}
                <div className="hidden sm:flex flex-col items-end">
                  {/* <span className="text-[11px] font-bold tracking-[0.2em] text-on-surface-variant uppercase leading-none mb-1">
                    PRO
                  </span> */}
                  <span className="text-label-md font-bold text-white tracking-widest uppercase leading-none">
                    {user?.username}
                  </span>
                </div>

                {/* Avatar + Dropdown */}
                <div className="relative group cursor-pointer">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-surface-variant group-hover:border-primary transition-colors">
                    <Image
                      src={user?.avatar ?? '/users/pewdiepie.jpg'}
                      alt={user?.username ?? ''}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-surface-container border border-surface-variant rounded-lg shadow-xl w-48 py-2 overflow-hidden">
                      <Link href={`/people/${user?.username}`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Profile</Link>
                      <Link href={`/people/${user?.username}?tab=Activity`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Activity</Link>
                      <Link href={`/people/${user?.username}?tab=Diary`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Diary</Link>
                      <Link href={`/people/${user?.username}?tab=Reviews`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Reviews</Link>
                      <Link href={`/people/${user?.username}?tab=Watchlist`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Watchlist</Link>
                      <Link href={`/people/${user?.username}?tab=Lists`} className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Lists</Link>
                      <div className="h-px bg-surface-variant my-2" />
                      <Link href="/settings/profile" className="block px-4 py-2 text-label-md text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold">Settings</Link>
                      <div className="h-px bg-surface-variant my-2" />
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full text-left px-4 py-2 text-label-md text-primary hover:text-white hover:bg-surface-container-high transition-colors tracking-widest uppercase font-bold"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-on-surface-variant hover:text-white transition-colors p-1"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[28px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-variant bg-surface">
            <nav className="flex flex-col px-gutter py-4 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-md text-label-md uppercase tracking-widest px-3 py-3 rounded-md transition-all ${
                      isActive
                        ? 'text-white font-bold bg-surface-container-high'
                        : 'text-on-surface-variant hover:text-white hover:bg-surface-container-high'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="h-px bg-surface-variant my-3" />
              {/* Mobile search */}
              <div className="relative">
                <input
                  className="bg-surface-container-high border-none rounded-full py-2.5 px-5 text-sm text-on-surface focus:ring-1 focus:ring-primary w-full placeholder:text-on-surface-variant/50"
                  placeholder="Search games, lists, people..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span
                  className="material-symbols-outlined absolute right-4 top-2.5 text-on-surface-variant"
                  style={{ fontSize: '18px' }}
                >
                  search
                </span>
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-surface-container border border-surface-variant rounded-xl overflow-hidden">
                    {searchResults.map((game) => (
                      <Link
                        key={game.id}
                        href={`/games/${game.title?.toLowerCase().replace(/ /g, '-')}`}
                        onClick={() => { clearSearch(); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors"
                      >
                        <div className="w-7 h-10 shrink-0 rounded overflow-hidden border border-surface-variant">
                          {game.img && <img src={game.img} alt={game.title} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-body-md font-bold text-on-surface">{game.title}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {!isLoggedIn && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}
                    className="flex-1 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors py-3 border border-surface-variant rounded-lg"
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
                    className="flex-1 bg-primary-container text-on-primary-fixed font-label-md text-label-md uppercase tracking-widest py-3 rounded-lg hover:bg-primary transition-all shadow-md active:scale-95"
                  >
                    + SIGN UP
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
