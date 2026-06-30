import axios from "axios";
import { latApiClient } from "@/shared/lib/latApiClient";
import type { LatApiEnvelope } from "@/shared/types/lat-lookups.types";
import type { RegionReportItem } from "../types/report.types";

function normalizeRegion(item: unknown): RegionReportItem {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  return {
    regionId: Number(record.regionId ?? 0),
    regionName: String(record.regionName ?? "Unknown"),
    totalStudents: Number(record.totalStudents ?? 0),
    attemptedStudents: Number(record.attemptedStudents ?? 0),
    averageScore: Number(record.averageScore ?? 0)
  };
}

function unwrapRegionReport(data: unknown): RegionReportItem[] {
  const envelope = data && typeof data === "object" ? (data as LatApiEnvelope<unknown>) : null;
  const response = envelope?.response ?? data;

  if (Array.isArray(response)) {
    return response.map(normalizeRegion);
  }

  return [];
}

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      const record = data as { message?: unknown; error?: unknown; title?: unknown };
      return String(record.message ?? record.error ?? record.title ?? error.message);
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Unable to load the region report";
}

export const reportApi = {
  async getRegionReport(): Promise<RegionReportItem[]> {
    try {
      const response = await latApiClient.get<unknown>("/region-report");
      return unwrapRegionReport(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
};
