"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessment(enabled = true) {
  return useQuery({
    queryKey: ["student-assessment"],
    queryFn: () => assessmentApi.getAssessment(),
    enabled
  });
}
