"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessment(assessmentId: string) {
  return useQuery({
    queryKey: ["student-assessment", assessmentId],
    queryFn: () => assessmentApi.getAssessment(assessmentId),
    enabled: Boolean(assessmentId)
  });
}
