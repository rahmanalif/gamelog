"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function HeroCta() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const router = useRouter();

  function handleClick() {
    if (isLoggedIn) {
      router.push("/games");
    } else {
      openAuthModal("signup");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block bg-[#00e676] text-[#00210b] font-label-md text-label-md uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
    >
      GET STARTED — IT'S FREE
    </button>
  );
}
