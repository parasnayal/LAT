"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessment() {
  return useQuery({
    queryKey: ["student-assessment"],
    queryFn: () => assessmentApi.getAssessment()
    // enabled: Boolean()
  });
}
