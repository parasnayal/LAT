// import type { RagContext } from "@/types/lat";

import { RagContext } from "@/shared/types/lat";

export interface PineconeVector {
  id: string;
  values: number[];
  metadata: PineconeMetadata;
}

export interface PineconeMetadata {
  chunkText: string;
  title: string;
  source: string;
  grade?: string;
  subject?: string;
  competency?: string;
  chunkIndex: number;
}

interface PineconeMatch {
  id: string;
  score?: number;
  metadata?: Partial<PineconeMetadata>;
}

interface PineconeQueryResponse {
  matches?: PineconeMatch[];
}

interface PineconeUpsertResponse {
  upsertedCount?: number;
}

const DEFAULT_NAMESPACE = "lat-question-generator";

function pineconeConfig(): { apiKey: string; host: string; namespace: string } {
  const apiKey = process.env.PINECONE_API_KEY;
  const host = process.env.PINECONE_INDEX_HOST;
  const configuredNamespace = process.env.PINECONE_NAMESPACE?.trim();

  if (!apiKey) {
    throw new Error("missing_pinecone_api_key");
  }

  if (!host) {
    throw new Error("missing_pinecone_index_host");
  }

  return {
    apiKey,
    host: host.replace(/\/$/, ""),
    namespace:
      configuredNamespace && configuredNamespace !== "__default__"
        ? configuredNamespace
        : DEFAULT_NAMESPACE
  };
}

async function pineconePost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const { apiKey, host } = pineconeConfig();
  const response = await fetch(`${host}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey
    },
    body: JSON.stringify(body)
  });

  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null
        ? JSON.stringify(payload)
        : response.statusText;
    throw new Error(detail);
  }

  return payload as TResponse;
}

export function getPineconeNamespace(): string {
  return pineconeConfig().namespace;
}

export async function upsertVectors(vectors: PineconeVector[]): Promise<number> {
  const { namespace } = pineconeConfig();
  const response = await pineconePost<PineconeUpsertResponse>("/vectors/upsert", {
    namespace,
    vectors
  });

  return response.upsertedCount ?? vectors.length;
}

export async function queryVectors(
  vector: number[],
  topK: number,
  filter?: Record<string, unknown>
): Promise<RagContext[]> {
  const { namespace } = pineconeConfig();
  const response = await pineconePost<PineconeQueryResponse>("/query", {
    namespace,
    vector,
    topK,
    includeValues: false,
    includeMetadata: true,
    ...(filter ? { filter } : {})
  });

  return (response.matches ?? []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    title: match.metadata?.title ?? "Untitled source",
    source: match.metadata?.source ?? "unknown",
    text: match.metadata?.chunkText ?? "",
    grade: match.metadata?.grade,
    subject: match.metadata?.subject,
    competency: match.metadata?.competency
  }));
}
