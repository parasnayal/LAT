import type {
  LatApiEnvelope,
  LatLookupItem,
  LatSchoolLookupItem,
  LatSubjectLookupItem
} from "@/shared/types/lat-lookups.types";
import { latApiClient } from "@/shared/lib/latApiClient";

type LookupRecord = Record<string, unknown>;

function normalizeLookupItem(item: unknown): LatLookupItem {
  const record = item && typeof item === "object" ? (item as LookupRecord) : {};

  return {
    id: Number(record.id ?? 0),
    name: String(record.name ?? ""),
    isActive: typeof record.isActive === "boolean" ? record.isActive : undefined
  };
}

function normalizeSchoolItem(item: unknown): LatSchoolLookupItem {
  const lookup = normalizeLookupItem(item);
  const record = item && typeof item === "object" ? (item as LookupRecord) : {};

  return {
    ...lookup,
    regionId: Number(record.regionId ?? 0)
  };
}

function normalizeSubjectItem(item: unknown): LatSubjectLookupItem {
  const lookup = normalizeLookupItem(item);
  const record = item && typeof item === "object" ? (item as LookupRecord) : {};

  return {
    ...lookup,
    gradeId: record.gradeId ? Number(record.gradeId) : undefined
  };
}

function unwrapResponse<TItem>(
  envelope: LatApiEnvelope<unknown>,
  normalizer: (item: unknown) => TItem
) {
  if (envelope.status !== 1 || !Array.isArray(envelope.response)) {
    return [];
  }

  return envelope.response.map(normalizer).filter((item) => {
    if (typeof item !== "object" || !item) {
      return false;
    }

    return Boolean((item as { id?: number; name?: string }).id && (item as { name?: string }).name);
  });
}

export const latLookupApi = {
  async getActiveRegions() {
    const response = await latApiClient.get<LatApiEnvelope<unknown>>("/active-regions");
    return unwrapResponse(response.data, normalizeLookupItem);
  },

  async getGrades() {
    const response = await latApiClient.get<LatApiEnvelope<unknown>>("/grades");
    return unwrapResponse(response.data, normalizeLookupItem).filter(
      (grade) => grade.isActive !== false
    );
  },

  async getSchoolsByRegion(regionId: number) {
    const response = await latApiClient.get<LatApiEnvelope<unknown>>(`/schools/${regionId}`);
    return unwrapResponse(response.data, normalizeSchoolItem).filter(
      (school) => school.isActive !== false
    );
  },

  async getSubjectsByGrade(gradeId: number) {
    const response = await latApiClient.get<LatApiEnvelope<unknown>>(`/subjects/${gradeId}`);
    return unwrapResponse(response.data, normalizeSubjectItem).filter(
      (subject) => subject.isActive !== false
    );
  }
};
