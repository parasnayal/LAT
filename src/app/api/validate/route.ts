import { callGemini } from "@/shared/lib/gemini";
import { Question, ValidationResult } from "@/shared/types/lat";
import { NextRequest, NextResponse } from "next/server";
// import { callGemini } from "@/lib/gemini";
// import type { Question, ValidationResult } from "@/types/lat";

const VALIDATOR_SYSTEM_PROMPT = `You are a strict LAT question quality validator.

Check each question and return a validation result.

VALIDATION RULES:
1. Question tests application or analysis — NOT memory recall
2. Exactly 4 options present
3. Answer matches one of the options exactly
4. Question uses Indian context (names/cities/currency)
5. Language matches subject (Hindi/Sanskrit in script, others in English)
6. Competency and LO are filled and relevant
7. Question is grade-appropriate

For each question return:
- valid: true or false
- score: 1-10
- issues: array of problems found (empty if valid)
- fix: specific instruction to fix if invalid (null if valid)

OUTPUT: JSON only. No markdown. No extra text.

{
  "results": [
    {
      "id": 1,
      "valid": true,
      "score": 8,
      "issues": [],
      "fix": null
    }
  ],
  "summary": {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "average_score": 0
  }
}`;

export interface ValidationResponse {
  results: ValidationResultWithId[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    average_score: number;
  };
}

export interface ValidationResultWithId extends ValidationResult {
  id: number;
}

function parseJsonResponse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { questions: Question[] };
    const text = await callGemini({
      systemPrompt: VALIDATOR_SYSTEM_PROMPT,
      userPrompt: JSON.stringify(body.questions),
      maxOutputTokens: 2000
    });
    const parsed = parseJsonResponse<ValidationResponse>(text);

    if (!parsed) {
      return NextResponse.json({ error: "parse_failed", raw: text }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown validation error";
    if (message === "missing_api_key") {
      return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
    }

    return NextResponse.json({ error: "validation_failed", message }, { status: 500 });
  }
}
