import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  Assessment,
  CreateAssessmentRequest,
  CreateAssessmentResponse,
  Question
} from "@/shared/types/lat";
// import type { Assessment, CreateAssessmentRequest, CreateAssessmentResponse, Question } from "@/types/lat";

export const runtime = "nodejs";

const ASSESSMENT_DIR = path.join(process.cwd(), "data", "assessments");

function subjectCounts(questions: Question[]): Record<string, number> {
  return questions.reduce<Record<string, number>>((counts, question) => {
    counts[question.subject] = (counts[question.subject] ?? 0) + 1;
    return counts;
  }, {});
}

function difficultyCounts(questions: Question[]): Record<Question["difficulty"], number> {
  return questions.reduce<Record<Question["difficulty"], number>>(
    (counts, question) => {
      counts[question.difficulty] += 1;
      return counts;
    },
    { basic: 0, proficient: 0, advanced: 0 }
  );
}

function createAssessment(request: CreateAssessmentRequest): Assessment {
  const id = `assessment_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
  const createdAt = new Date().toISOString();

  return {
    id,
    title: request.title?.trim() || `Grade ${request.grade} LAT Baseline Assessment`,
    grade: request.grade,
    assessmentGrade: request.assessmentGrade,
    durationMinutes: request.durationMinutes,
    totalQuestions: request.questions.length,
    status: "draft",
    subjectCounts: subjectCounts(request.questions),
    difficultyCounts: difficultyCounts(request.questions),
    questions: request.questions,
    agentSessionId: request.agentSessionId,
    ragContexts: request.ragContexts,
    createdAt
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAssessmentRequest;

    if (!body.grade || !body.assessmentGrade) {
      return NextResponse.json({ error: "missing_grade" }, { status: 400 });
    }

    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json({ error: "missing_questions" }, { status: 400 });
    }

    const assessment = createAssessment(body);
    await mkdir(ASSESSMENT_DIR, { recursive: true });

    const filePath = path.join(ASSESSMENT_DIR, `${assessment.id}.json`);
    await writeFile(filePath, JSON.stringify(assessment, null, 2), "utf8");

    const response: CreateAssessmentResponse = {
      assessment,
      filePath
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown assessment save error";
    return NextResponse.json({ error: "assessment_create_failed", message }, { status: 500 });
  }
}
