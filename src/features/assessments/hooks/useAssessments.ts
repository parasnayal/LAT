"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentApi.list
  });
}
