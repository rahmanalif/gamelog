"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import AuthModal from "@/component/auth-modal";

export default function AuthInitializer() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const refreshSession = useAuthStore((s) => s.refreshSession);
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen);
  const authMode = useAuthStore((s) => s.authMode);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const completeAuth = useAuthStore((s) => s.completeAuth);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    refreshSession();
    const interval = window.setInterval(() => {
      refreshSession();
    }, 13 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [refreshSession]);

  if (!isAuthModalOpen) return null;

  return (
    <AuthModal
      key={authMode}
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      onSuccess={completeAuth}
      initialMode={authMode}
    />
  );
}
