"use client";

import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../services/reportApi";

export function useRegionReport() {
  return useQuery({
    queryKey: ["reports", "region-report"],
    queryFn: reportApi.getRegionReport
  });
}
