"use client";

import { useQuery } from "@tanstack/react-query";
import { latLookupApi } from "@/shared/services/latLookupApi";

export function useActiveRegions() {
  return useQuery({
    queryKey: ["lat-lookups", "active-regions"],
    queryFn: latLookupApi.getActiveRegions,
    staleTime: 1000 * 60 * 15
  });
}

export function useGrades() {
  return useQuery({
    queryKey: ["lat-lookups", "grades"],
    queryFn: latLookupApi.getGrades,
    staleTime: 1000 * 60 * 15
  });
}

export function useSchoolsByRegion(regionId?: number) {
  return useQuery({
    queryKey: ["lat-lookups", "schools", regionId],
    queryFn: () => latLookupApi.getSchoolsByRegion(regionId ?? 0),
    enabled: Boolean(regionId),
    staleTime: 1000 * 60 * 15
  });
}

export function useSubjectsByGrade(gradeId?: number) {
  return useQuery({
    queryKey: ["lat-lookups", "subjects", gradeId],
    queryFn: () => latLookupApi.getSubjectsByGrade(gradeId ?? 0),
    enabled: Boolean(gradeId),
    staleTime: 1000 * 60 * 15
  });
}
