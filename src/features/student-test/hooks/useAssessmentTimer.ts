"use client";

import { useEffect, useMemo, useState } from "react";

export function useAssessmentTimer({
  durationMinutes,
  storageKey,
  onExpire
}: {
  durationMinutes: number;
  storageKey: string;
  onExpire: () => void;
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const existingEndAt = window.localStorage.getItem(storageKey);
    const endAt = existingEndAt ? Number(existingEndAt) : Date.now() + durationMinutes * 60 * 1000;
    window.localStorage.setItem(storageKey, String(endAt));

    const tick = () => {
      const nextRemaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0) {
        onExpire();
      }
    };

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [durationMinutes, onExpire, storageKey]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    formattedTime,
    isWarning: remainingSeconds <= 5 * 60
  };
}
