"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AuthModal from "@/component/auth-modal";
import type { AuthSuccess, AuthTokens, AuthUser } from "@/lib/auth-api";

type User = AuthUser & { avatar: string };

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  openAuthModal: (mode?: "login" | "signup") => void;
  completeAuth: (auth: AuthSuccess) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  tokens: null,
  openAuthModal: () => {},
  completeAuth: () => {},
  signOut: () => {},
});

const MOCK_USER: User = {
  username: "PEWDIEPIE",
  avatar: "/users/pewdiepie.jpg",
};

const AUTH_STORAGE_KEY = "gamelog.auth";

function getStoredAuth() {
  if (typeof window === "undefined") return null;

  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedAuth) return null;

  try {
    return JSON.parse(storedAuth) as { user?: User; tokens?: AuthTokens };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const isLoggedIn = Boolean(tokens?.access ?? tokens?.accessToken);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedAuth = getStoredAuth();
      setUser(storedAuth?.user ?? null);
      setTokens(storedAuth?.tokens ?? null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const completeAuth = (auth: AuthSuccess) => {
    const nextUser = {
      ...(auth.user ?? MOCK_USER),
      avatar: auth.user?.avatar ?? MOCK_USER.avatar,
    };

    setUser(nextUser);
    setTokens(auth.tokens);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: nextUser, tokens: auth.tokens }),
    );
    setIsAuthModalOpen(false);
  };

  const signOut = () => {
    setUser(null);
    setTokens(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user: isLoggedIn ? user : null,
        tokens,
        openAuthModal,
        completeAuth,
        signOut,
      }}
    >
      {children}
      {isAuthModalOpen && (
        <AuthModal
          key={authMode}
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={completeAuth}
          initialMode={authMode}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
