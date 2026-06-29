import { callGemini } from "@/shared/lib/gemini";
import { BASELINE_GRADE, COMPETENCIES, GRADE_CONFIG } from "@/shared/lib/lat/config";
import { GenerateRequest, GenerateResponse } from "@/shared/types/lat";
import { NextRequest, NextResponse } from "next/server";
// import { callGemini } from "@/lib/gemini";
// import { BASELINE_GRADE, COMPETENCIES, GRADE_CONFIG } from "@/lib/lat/config";
// import type { GenerateRequest, GenerateResponse } from "@/types/lat";

const AGENT_SYSTEM_PROMPT = `You are LAT Question Generator for KVS/PARAKH baseline assessments.

CORE RULE: Always generate for PREVIOUS grade (baseline).
Grade 3 student → Grade 2 level
Grade 6 student → Grade 5 level
Grade 8 student → Grade 7 level

GRADE CONFIG:
Grade 3 | 45Q | 90min | Hindi,English,Math,EVS
Grade 6 | 51Q | 120min | Hindi,English,Math,Science,SST,Sanskrit
Grade 8 | 60Q | 150min | Hindi,English,Math,Science,SST,Sanskrit

SUBJECT DISTRIBUTION:
Grade 3 (45Q): Hindi=12, English=11, Math=12, EVS=10
Grade 6 (51Q): Hindi=9, English=9, Math=10, Science=8, SST=8, Sanskrit=7
Grade 8 (60Q): Hindi=11, English=10, Math=12, Science=12, SST=10, Sanskrit=5

VALID COMPETENCIES:
Math: Integer Operations|Fraction Applications|Data Interpretation|Geometry|Measurement
Science: Weather|Climate|River Systems|Soil Formation|Living Things|Human Body
SST: Historical Changes|Society Impact|Geography Basics|Civics Awareness
Language: Reading Comprehension|Grammar Application|Vocabulary in Context|Writing Skills
EVS: Environment Awareness|Daily Life Science|Plants and Animals

QUESTION RULES:
- MCQ only: 4 options, exactly one correct
- NO memory recall — application and analysis only
- Indian context: use Indian names (Priya/Arjun/Ravi/Fatima), Indian cities, ₹ currency
- Grade-appropriate vocabulary
- Difficulty split: basic=40% | proficient=40% | advanced=20%
- Each question maps to exactly one Learning Outcome
- status is always "pending"

LANGUAGE RULE:
- Hindi/Sanskrit questions → generate in Hindi/Sanskrit script
- English/Math/Science/SST/EVS → generate in English

OUTPUT: JSON only. No markdown. No explanation. No extra text.

{
  "metadata": {
    "student_grade": "",
    "assessment_grade": "",
    "subject": "",
    "competency": "",
    "total_questions": 0,
    "duration_minutes": 0,
    "language": ""
  },
  "questions": [
    {
      "id": 1,
      "subject": "",
      "competency": "",
      "lo": "",
      "question": "",
      "options": ["A) ","B) ","C) ","D) "],
      "answer": "A",
      "difficulty": "basic|proficient|advanced",
      "status": "pending",
      "marks": 1
    }
  ]
}`;

function parseJsonResponse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function createPrompt(request: GenerateRequest): string {
  const grade = request.grade as keyof typeof GRADE_CONFIG;
  const subject = request.subject as keyof typeof COMPETENCIES;
  const competencies = COMPETENCIES[subject] ?? [];
  const assessmentGrade = BASELINE_GRADE[grade] ?? "";
  const duration = GRADE_CONFIG[grade]?.duration ?? 0;
  const retrievedContext = request.ragContext?.map((context, index) => ({
    rank: index + 1,
    score: context.score,
    title: context.title,
    source: context.source,
    grade: context.grade,
    subject: context.subject,
    competency: context.competency,
    text: context.text
  }));

  return JSON.stringify(
    {
      task: "Generate LAT baseline assessment questions.",
      instruction:
        "Use the retrieved_context as grounding material when relevant. Do not copy examples verbatim.",
      student_grade: request.grade,
      assessment_grade: assessmentGrade,
      subject: request.subject,
      competency: request.competency,
      valid_competencies_for_subject: competencies,
      count: request.count,
      duration_minutes: duration,
      language: request.language,
      retrieved_context: retrievedContext ?? []
    },
    null,
    2
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const text = await callGemini({
      systemPrompt: AGENT_SYSTEM_PROMPT,
      userPrompt: createPrompt(body),
      maxOutputTokens: 4000
    });
    const parsed = parseJsonResponse<GenerateResponse>(text);

    if (!parsed) {
      return NextResponse.json({ error: "parse_failed", raw: text }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    if (message === "missing_api_key") {
      return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
    }

    return NextResponse.json({ error: "generation_failed", message }, { status: 500 });
  }
}
