"use client";

import { create } from "zustand";
import { logout as apiLogout, refreshTokens } from "@/lib/auth-api";
import type { AuthTokens, AuthUser, AuthSuccess } from "@/lib/auth-api";

const AUTH_STORAGE_KEY = "gamelog.auth";

type AuthMode = "login" | "signup";

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: AuthMode;

  hydrate: () => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  completeAuth: (auth: AuthSuccess) => void;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

function readStorage(): { user?: AuthUser; tokens?: AuthTokens } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as { user?: AuthUser; tokens?: AuthTokens }) : null;
  } catch {
    return null;
  }
}

type TokenObj = { token?: string };

function extractToken(val: string | TokenObj | undefined): string | undefined {
  if (typeof val === "string") return val || undefined;
  if (val && typeof (val as TokenObj).token === "string") return (val as TokenObj).token || undefined;
  return undefined;
}

function isTokenPresent(tokens: AuthTokens | null): boolean {
  if (!tokens) return false;
  return Boolean(
    extractToken(tokens.access as string | TokenObj | undefined) ??
    extractToken(tokens.accessToken as string | TokenObj | undefined),
  );
}

function extractRefreshToken(tokens: AuthTokens | null): string | undefined {
  if (!tokens) return undefined;
  return (
    extractToken(tokens.refresh as string | TokenObj | undefined) ??
    extractToken(tokens.refreshToken as string | TokenObj | undefined)
  );
}

function persist(user: AuthUser | null, tokens: AuthTokens | null) {
  if (typeof window === "undefined") return;
  if (user || tokens) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, tokens }));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isLoggedIn: false,
  isAuthModalOpen: false,
  authMode: "login",

  hydrate: () => {
    const stored = readStorage();
    if (!stored) return;
    const tokens = stored.tokens ?? null;
    const user = stored.user ?? null;
    set({ user, tokens, isLoggedIn: isTokenPresent(tokens) });
  },

  openAuthModal: (mode = "login") => set({ isAuthModalOpen: true, authMode: mode }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  completeAuth: (auth: AuthSuccess) => {
    const user = auth.user ?? null;
    const tokens = auth.tokens;
    set({ user, tokens, isLoggedIn: isTokenPresent(tokens), isAuthModalOpen: false });
    persist(user, tokens);
  },

  signOut: () => {
    const refreshToken = extractRefreshToken(get().tokens);
    if (refreshToken) apiLogout(refreshToken).catch(() => {});
    set({ user: null, tokens: null, isLoggedIn: false });
    persist(null, null);
  },

  refreshSession: async () => {
    const stored = readStorage();
    const refreshToken = extractRefreshToken(stored?.tokens ?? null);
    if (!refreshToken) return;
    try {
      const auth = await refreshTokens(refreshToken);
      const user = auth.user ?? get().user;
      const tokens = auth.tokens;
      set({ user, tokens, isLoggedIn: isTokenPresent(tokens) });
      persist(user, tokens);
    } catch {
      get().signOut();
    }
  },
}));
