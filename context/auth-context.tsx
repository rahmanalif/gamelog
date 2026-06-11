"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import AuthModal from "@/component/auth-modal";

interface User {
  username: string;
  avatar: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  openAuthModal: (mode?: "login" | "signup") => void;
  setIsLoggedIn: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  openAuthModal: () => {},
  setIsLoggedIn: () => {},
});

const MOCK_USER: User = {
  username: "PEWDIEPIE",
  avatar: "/users/pewdiepie.jpg",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user: isLoggedIn ? MOCK_USER : null,
        openAuthModal,
        setIsLoggedIn,
      }}
    >
      {children}
      {isAuthModalOpen && (
        <AuthModal
          key={authMode}
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsLoggedIn(true)}
          initialMode={authMode}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
