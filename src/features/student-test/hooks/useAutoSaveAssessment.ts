"use client";

import { useEffect, useRef, useState } from "react";
import { assessmentApi } from "../services/assessmentApi";
import type { StudentAnswer } from "../types/assessment.types";

export function useAutoSaveAssessment({
  attemptId,
  answers,
  enabled
}: {
  attemptId?: string;
  answers: StudentAnswer[];
  enabled: boolean;
}) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasSaveError, setHasSaveError] = useState(false);
  const latestAnswers = useRef(answers);

  useEffect(() => {
    latestAnswers.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!attemptId || !enabled) {
      return;
    }

    const saveAnswers = async () => {
      try {
        await assessmentApi.saveAttempt(attemptId, { answers: latestAnswers.current });
        setLastSavedAt(new Date());
        setHasSaveError(false);
      } catch {
        setHasSaveError(true);
      }
    };

    const intervalId = window.setInterval(() => {
      void saveAnswers();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [attemptId, enabled]);

  return { lastSavedAt, hasSaveError };
}
