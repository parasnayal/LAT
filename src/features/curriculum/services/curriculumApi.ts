import { latApiClient } from "@/shared/lib/latApiClient";
import type {
  Chapter,
  Competency,
  CurriculumEntity,
  CurriculumEntityKind,
  CurriculumFormValues,
  CurriculumListParams,
  CurriculumListResponse,
  CurriculumMappingNode,
  CurriculumSummary,
  Grade,
  LearningIndicator,
  LearningOutcome,
  Subject,
  Topic
} from "../types/curriculum.types";

const endpoints: Record<CurriculumEntityKind, string> = {
  grades: "/grades",
  subjects: "/subjects",
  chapters: "/chapters",
  topics: "/topics",
  "learning-outcomes": "/learning-outcomes",
  "learning-indicators": "/learning-indicators",
  competencies: "/competencies"
};

type ApiEnvelope = {
  response?: unknown;
};

function unwrapEnvelope(data: unknown) {
  if (data && typeof data === "object" && "response" in data) {
    return (data as ApiEnvelope).response;
  }

  return data;
}

function normalizeList<TItem>(
  data: unknown,
  params: CurriculumListParams
): CurriculumListResponse<TItem> {
  const items = unwrapEnvelope(data);

  if (Array.isArray(items)) {
    return {
      items: items as TItem[],
      page: params.page ?? 1,
      pageSize: params.pageSize ?? items.length,
      total: items.length
    };
  }

  return data as CurriculumListResponse<TItem>;
}

export const curriculumApi = {
  async getSummary() {
    const [grades, subjects, competencies] = await Promise.all([
      curriculumApi.list<Grade>("grades", { page: 1, pageSize: 1 }),
      curriculumApi.list<Subject>("subjects", { page: 1, pageSize: 1 }),
      curriculumApi.list<Competency>("competencies", { page: 1, pageSize: 1 })
    ]);

    return {
      totalGrades: grades.total,
      totalSubjects: subjects.total,
      totalCompetencies: competencies.total,
      recentUpdates: [
        {
          id: "curriculum-update",
          title: "Curriculum structure synced",
          description:
            "Grades, subjects, outcomes, indicators, and competencies are ready for mapping.",
          updatedAt: new Date().toISOString()
        }
      ]
    } satisfies CurriculumSummary;
  },

  async list<TItem extends CurriculumEntity>(
    kind: CurriculumEntityKind,
    params: CurriculumListParams = {}
  ) {
    const response = await latApiClient.get(endpoints[kind], { params });
    return normalizeList<TItem>(response.data, params);
  },

  async create<TItem extends CurriculumEntity>(
    kind: CurriculumEntityKind,
    payload: CurriculumFormValues
  ) {
    const response = await latApiClient.post(endpoints[kind], payload);
    return unwrapEnvelope(response.data) as TItem;
  },

  async update<TItem extends CurriculumEntity>(
    kind: CurriculumEntityKind,
    id: string,
    payload: CurriculumFormValues
  ) {
    const response = await latApiClient.patch(`${endpoints[kind]}/${id}`, payload);
    return unwrapEnvelope(response.data) as TItem;
  },

  async remove(kind: CurriculumEntityKind, id: string) {
    await latApiClient.delete(`${endpoints[kind]}/${id}`);
  },

  async getMapping() {
    const response = await latApiClient.get("/curriculum-mapping");
    return unwrapEnvelope(response.data) as CurriculumMappingNode[];
  },

  async saveMapping(payload: CurriculumMappingNode[]) {
    const response = await latApiClient.post("/curriculum-mapping", payload);
    return unwrapEnvelope(response.data) as CurriculumMappingNode[];
  }
};

export type CurriculumEntityMap = {
  grades: Grade;
  subjects: Subject;
  chapters: Chapter;
  topics: Topic;
  "learning-outcomes": LearningOutcome;
  "learning-indicators": LearningIndicator;
  competencies: Competency;
};
