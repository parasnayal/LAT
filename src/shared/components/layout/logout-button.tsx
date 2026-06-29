"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import styles from "./app-shell.module.scss";

export function LogoutButton() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authService.logout();
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      clearSession();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      className={styles.logoutButton}
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut size={18} aria-hidden="true" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
