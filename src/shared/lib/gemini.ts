interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
    status?: string;
  };
}

interface GeminiEmbeddingResponse {
  embedding?: {
    values?: number[];
  };
  embeddings?: Array<{
    values?: number[];
  }>;
  error?: {
    message?: string;
    status?: string;
  };
}

interface GeminiRequest {
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens: number;
}

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_EMBEDDING_MODEL = "gemini-embedding-2";
const DEFAULT_GEMINI_EMBEDDING_DIMENSIONS = 1024;

function geminiEndpoint(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function geminiEmbeddingEndpoint(): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent`;
}

function embeddingDimensions(): number {
  const rawValue = process.env.GEMINI_EMBEDDING_DIMENSIONS;
  const parsedValue = rawValue
    ? Number.parseInt(rawValue, 10)
    : DEFAULT_GEMINI_EMBEDDING_DIMENSIONS;

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_GEMINI_EMBEDDING_DIMENSIONS;
  }

  return parsedValue;
}

export async function callGemini({
  systemPrompt,
  userPrompt,
  maxOutputTokens
}: GeminiRequest): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const response = await fetch(geminiEndpoint(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens,
        responseMimeType: "application/json"
      }
    })
  });

  const payload = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        payload.error?.status ??
        `Gemini request failed with ${response.status}`
    );
  }

  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
}

export async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const response = await fetch(geminiEmbeddingEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      model: `models/${GEMINI_EMBEDDING_MODEL}`,
      content: {
        parts: [{ text }]
      },
      output_dimensionality: embeddingDimensions()
    })
  });

  const payload = (await response.json()) as GeminiEmbeddingResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        payload.error?.status ??
        `Gemini embedding failed with ${response.status}`
    );
  }

  const values = payload.embedding?.values ?? payload.embeddings?.[0]?.values;

  if (!values || values.length === 0) {
    throw new Error("Gemini embedding response did not include vector values");
  }

  return values;
}
