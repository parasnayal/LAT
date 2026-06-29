export type CurriculumStatus = "active" | "inactive";

export type CurriculumEntityKind =
  | "grades"
  | "subjects"
  | "chapters"
  | "topics"
  | "learning-outcomes"
  | "learning-indicators"
  | "competencies";

export type CurriculumBase = {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: CurriculumStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type Grade = CurriculumBase;

export type Subject = CurriculumBase & {
  gradeId: string;
  gradeName?: string;
};

export type Chapter = CurriculumBase & {
  gradeId: string;
  subjectId: string;
  gradeName?: string;
  subjectName?: string;
};

export type Topic = CurriculumBase & {
  gradeId: string;
  subjectId: string;
  chapterId: string;
  gradeName?: string;
  subjectName?: string;
  chapterName?: string;
};

export type LearningOutcome = CurriculumBase & {
  gradeId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  gradeName?: string;
  subjectName?: string;
  chapterName?: string;
  topicName?: string;
};

export type LearningIndicator = CurriculumBase & {
  learningOutcomeId: string;
  learningOutcomeName?: string;
};

export type Competency = CurriculumBase & {
  gradeId: string;
  subjectId: string;
  learningOutcomeId: string;
  learningIndicatorId: string;
  gradeName?: string;
  subjectName?: string;
  learningOutcomeName?: string;
  learningIndicatorName?: string;
};

export type CurriculumEntity =
  Grade | Subject | Chapter | Topic | LearningOutcome | LearningIndicator | Competency;

export type CurriculumListParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  gradeId?: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  learningOutcomeId?: string;
};

export type CurriculumListResponse<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};

export type CurriculumFormValues = {
  name: string;
  code: string;
  description?: string;
  status: CurriculumStatus;
  gradeId?: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  learningOutcomeId?: string;
  learningIndicatorId?: string;
};

export type CurriculumSummary = {
  totalGrades: number;
  totalSubjects: number;
  totalCompetencies: number;
  recentUpdates: Array<{
    id: string;
    title: string;
    description: string;
    updatedAt: string;
  }>;
};

export type CurriculumMappingNode = {
  id: string;
  label: string;
  type:
    | "grade"
    | "subject"
    | "chapter"
    | "topic"
    | "learningOutcome"
    | "learningIndicator"
    | "competency";
  children?: CurriculumMappingNode[];
};
