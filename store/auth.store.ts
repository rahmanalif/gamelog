"use client";

import { create } from "zustand";
import { logout as apiLogout, refreshTokens } from "@/lib/auth-api";
import type { AuthTokens, AuthUser, AuthSuccess } from "@/lib/auth-api";
import {
  extractToken,
  getStoredRefreshToken,
  persistAuth,
  readStoredAuth,
} from "@/lib/auth-session";

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

function isTokenPresent(tokens: AuthTokens | null): boolean {
  if (!tokens) return false;
  return Boolean(
    extractToken(tokens.access) ??
    extractToken(tokens.accessToken) ??
    extractToken(tokens.access_token),
  );
}

function extractRefreshToken(tokens: AuthTokens | null): string | undefined {
  if (!tokens) return undefined;
  return (
    extractToken(tokens.refresh) ??
    extractToken(tokens.refreshToken) ??
    extractToken(tokens.refresh_token)
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isLoggedIn: false,
  isAuthModalOpen: false,
  authMode: "login",

  hydrate: () => {
    const stored = readStoredAuth();
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
    persistAuth(user, tokens);
  },

  signOut: () => {
    const refreshToken = extractRefreshToken(get().tokens);
    if (refreshToken) apiLogout(refreshToken).catch(() => {});
    set({ user: null, tokens: null, isLoggedIn: false });
    persistAuth(null, null);
  },

  refreshSession: async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return;
    try {
      const auth = await refreshTokens(refreshToken);
      const user = auth.user ?? get().user;
      const tokens = auth.tokens;
      set({ user, tokens, isLoggedIn: isTokenPresent(tokens) });
      persistAuth(user, tokens);
    } catch {
      get().signOut();
    }
  },
}));
