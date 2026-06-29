import { embedText } from "@/shared/lib/gemini";
import { chunkText } from "@/shared/lib/rag/chunk";
import { getPineconeNamespace, upsertVectors } from "@/shared/lib/rag/pinecone";
import { RagIngestRequest, RagIngestResponse } from "@/shared/types/lat";
import { NextRequest, NextResponse } from "next/server";
// import { embedText } from "@/lib/gemini";
// import { chunkText } from "@/lib/rag/chunk";
// import { getPineconeNamespace, upsertVectors } from "@/lib/rag/pinecone";
// import type { RagIngestRequest, RagIngestResponse } from "@/types/lat";

function formatDocumentForEmbedding(title: string, text: string): string {
  return `title: ${title || "none"} | text: ${text}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RagIngestRequest;

    if (!body.text.trim()) {
      return NextResponse.json({ error: "empty_text" }, { status: 400 });
    }

    const chunks = chunkText(body.text);

    if (chunks.length === 0) {
      return NextResponse.json({ error: "no_chunks_created" }, { status: 400 });
    }

    const vectors = [];

    for (const chunk of chunks) {
      const embedding = await embedText(formatDocumentForEmbedding(body.title, chunk.text));
      vectors.push({
        id: crypto.randomUUID(),
        values: embedding,
        metadata: {
          chunkText: chunk.text,
          title: body.title || "Untitled source",
          source: body.source || "manual",
          grade: body.grade || undefined,
          subject: body.subject || undefined,
          competency: body.competency || undefined,
          chunkIndex: chunk.index
        }
      });
    }

    const upsertedCount = await upsertVectors(vectors);
    const response: RagIngestResponse = {
      chunks: chunks.length,
      upsertedCount,
      namespace: getPineconeNamespace()
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RAG ingest error";
    return NextResponse.json({ error: "rag_ingest_failed", message }, { status: 500 });
  }
}
