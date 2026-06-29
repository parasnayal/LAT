export interface Question {
  id: number;
  subject: string;
  competency: string;
  lo: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "basic" | "proficient" | "advanced";
  status: "pending" | "approved" | "rejected";
  marks: number;
  validation?: ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  score: number;
  issues: string[];
  fix: string | null;
}

export interface AgentState {
  sessionId: string;
  grade: string;
  assessmentGrade: string;
  goal: string;
  status: "idle" | "running" | "completed" | "failed";
  completed: Record<string, number>;
  remaining: Record<string, number>;
  failed: Record<string, number>;
  retryCount: Record<string, number>;
  ragContexts: Record<string, RagContext[]>;
  allQuestions: Question[];
  logs: AgentLog[];
  startTime: number;
  endTime?: number;
}

export interface AgentLog {
  timestamp: number;
  type: "info" | "success" | "error" | "warning" | "validate";
  subject?: string;
  message: string;
}

export interface GenerateRequest {
  grade: string;
  subject: string;
  competency: string;
  count: number;
  language: string;
  ragContext?: RagContext[];
}

export interface GenerateResponse {
  metadata: Metadata;
  questions: Question[];
}

export interface Metadata {
  student_grade: string;
  assessment_grade: string;
  subject: string;
  competency: string;
  total_questions: number;
  duration_minutes: number;
  language: string;
}

export interface RagContext {
  id: string;
  score: number;
  title: string;
  source: string;
  text: string;
  grade?: string;
  subject?: string;
  competency?: string;
}

export interface RagIngestRequest {
  title: string;
  source: string;
  text: string;
  grade?: string;
  subject?: string;
  competency?: string;
}

export interface RagIngestResponse {
  chunks: number;
  upsertedCount: number;
  namespace: string;
}

export interface RagSearchRequest {
  grade: string;
  subject: string;
  competency: string;
  topK?: number;
  useFilters?: boolean;
}

export interface RagSearchResponse {
  contexts: RagContext[];
  namespace: string;
}

export interface Assessment {
  id: string;
  title: string;
  grade: string;
  assessmentGrade: string;
  durationMinutes: number;
  totalQuestions: number;
  status: "draft" | "published";
  subjectCounts: Record<string, number>;
  difficultyCounts: Record<Question["difficulty"], number>;
  questions: Question[];
  agentSessionId: string;
  ragContexts: Record<string, RagContext[]>;
  createdAt: string;
}

export interface CreateAssessmentRequest {
  title?: string;
  grade: string;
  assessmentGrade: string;
  durationMinutes: number;
  questions: Question[];
  agentSessionId: string;
  ragContexts: Record<string, RagContext[]>;
}

export interface CreateAssessmentResponse {
  assessment: Assessment;
  filePath: string;
}
