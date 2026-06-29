import { callGemini } from "@/shared/lib/gemini";
import { Question } from "@/shared/types/lat";
import { NextRequest, NextResponse } from "next/server";
// import { callGemini } from "@/lib/gemini";
// import type { Question } from "@/types/lat";

const FIX_SYSTEM_PROMPT =
  "Fix this LAT question based on the instruction. Return only the corrected question JSON. No markdown.";

function parseJsonResponse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { question: Question; fix: string };
    const text = await callGemini({
      systemPrompt: FIX_SYSTEM_PROMPT,
      userPrompt: `Question: ${JSON.stringify(body.question)} Fix instruction: ${body.fix}`,
      maxOutputTokens: 1000
    });
    const parsed = parseJsonResponse<Question>(text);

    if (!parsed) {
      return NextResponse.json({ error: "parse_failed", raw: text }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fix error";
    if (message === "missing_api_key") {
      return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
    }

    return NextResponse.json({ error: "fix_failed", message }, { status: 500 });
  }
}
