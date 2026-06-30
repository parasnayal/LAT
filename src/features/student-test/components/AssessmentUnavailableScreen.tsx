"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import styles from "./student-test.module.scss";

export function AssessmentUnavailableScreen() {
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
    } finally {
      window.location.replace("/login");
    }
  }

  return (
    <section className={styles.startScreen}>
      <div className={styles.startPanel}>
        <span className={styles.startMark}>LAT</span>
        <p className={styles.startEyebrow}>Student Assessment</p>
        <h1 className={styles.startTitle}>Assessment is not available</h1>
        <p className={styles.startSubtitle}>
          Please contact your teacher or school administrator for the assessment schedule.
        </p>
        <button
          className={styles.unavailableLogoutButton}
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </section>
  );
}
