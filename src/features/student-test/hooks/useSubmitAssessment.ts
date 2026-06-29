"use client";

import { useMutation } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";
import type { AssessmentAnswerPayload } from "../types/assessment.types";

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: ({ attemptId, payload }: { attemptId: string; payload: AssessmentAnswerPayload }) =>
      assessmentApi.submitAttempt(attemptId, payload)
  });
}
