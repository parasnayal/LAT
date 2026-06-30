"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessmentAvailability() {
  return useQuery({
    queryKey: ["student-assessment-availability"],
    queryFn: () => assessmentApi.checkAssessmentAvailability()
  });
}
