"use client";

import { useQuery } from "@tanstack/react-query";
import { curriculumApi } from "../services/curriculumApi";

export function useCurriculumSummary() {
  return useQuery({
    queryKey: ["curriculum", "summary"],
    queryFn: curriculumApi.getSummary
  });
}
