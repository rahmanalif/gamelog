// Deprecated — use useAuthStore from @/store/auth.store directly.
export { useAuthStore as useAuth } from "@/store/auth.store";
export { useAuthStore } from "@/store/auth.store";

// Kept for layout compat — AuthInitializer replaces AuthProvider.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
