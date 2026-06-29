import { embedText } from "@/shared/lib/gemini";
import { getPineconeNamespace, queryVectors } from "@/shared/lib/rag/pinecone";
import { RagSearchRequest, RagSearchResponse } from "@/shared/types/lat";
import { NextRequest, NextResponse } from "next/server";
// import { embedText } from "@/lib/gemini";
// import { getPineconeNamespace, queryVectors } from "@/lib/rag/pinecone";
// import type { RagSearchRequest, RagSearchResponse } from "@/types/lat";

function searchQuery(request: RagSearchRequest): string {
  return [
    "task: search result",
    `query: LAT baseline assessment context for Grade ${request.grade}`,
    `subject: ${request.subject}`,
    `competency: ${request.competency}`,
    "learning outcomes, grade level, application questions, examples, rubrics"
  ].join(" | ");
}

function metadataFilter(request: RagSearchRequest): Record<string, unknown> | undefined {
  if (!request.useFilters) {
    return undefined;
  }

  return {
    subject: { $eq: request.subject }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RagSearchRequest;
    const embedding = await embedText(searchQuery(body));
    const contexts = await queryVectors(embedding, body.topK ?? 4, metadataFilter(body));
    const response: RagSearchResponse = {
      contexts,
      namespace: getPineconeNamespace()
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RAG search error";
    return NextResponse.json({ error: "rag_search_failed", message }, { status: 500 });
  }
}
