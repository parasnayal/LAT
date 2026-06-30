"use client";

import { LogOut, ShieldCheck, TimerReset } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import styles from "./assessment-submitted-logout-screen.module.scss";

const LOGOUT_DELAY_SECONDS = 10;

export function AssessmentSubmittedLogoutScreen() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const [secondsLeft, setSecondsLeft] = useState(LOGOUT_DELAY_SECONDS);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
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
  }, [clearSession, isLoggingOut]);

  useEffect(() => {
    const timerId = window.setTimeout(
      () => {
        if (secondsLeft <= 0) {
          void logout();
          return;
        }

        setSecondsLeft((current) => current - 1);
      },
      secondsLeft <= 0 ? 0 : 1000
    );

    return () => window.clearTimeout(timerId);
  }, [logout, secondsLeft]);

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="submitted-title">
        <div className={styles.brandMark}>LAT</div>
        <div className={styles.iconShell}>
          <ShieldCheck size={34} aria-hidden="true" />
        </div>
        <p className={styles.eyebrow}>Assessment submitted</p>
        <h1 id="submitted-title" className={styles.title}>
          Thank you for completing your assessment
        </h1>
        <p className={styles.description}>
          Your answers have been submitted successfully. For your security, you will be logged out
          in {secondsLeft} seconds.
        </p>

        <div className={styles.countdown} aria-live="polite">
          <TimerReset size={22} aria-hidden="true" />
          <span>{secondsLeft}s</span>
        </div>

        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => void logout()}
          disabled={isLoggingOut}
        >
          <LogOut size={18} aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Logout now"}
        </button>
      </section>
    </main>
  );
}
