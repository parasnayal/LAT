export interface TextChunk {
  index: number;
  text: string;
}

const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): TextChunk[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  const chunks: TextChunk[] = [];
  let start = 0;

  while (start < normalized.length) {
    const hardEnd = Math.min(start + CHUNK_SIZE, normalized.length);
    const softEnd = findSoftBreak(normalized, start, hardEnd);
    const chunk = normalized.slice(start, softEnd).trim();

    if (chunk) {
      chunks.push({ index: chunks.length, text: chunk });
    }

    if (softEnd >= normalized.length) {
      break;
    }

    start = Math.max(0, softEnd - CHUNK_OVERLAP);
  }

  return chunks;
}

function findSoftBreak(text: string, start: number, hardEnd: number): number {
  if (hardEnd >= text.length) {
    return text.length;
  }

  const window = text.slice(start, hardEnd);
  const paragraphBreak = window.lastIndexOf("\n\n");

  if (paragraphBreak > CHUNK_SIZE * 0.55) {
    return start + paragraphBreak;
  }

  const sentenceBreak = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("? "),
    window.lastIndexOf("! ")
  );

  if (sentenceBreak > CHUNK_SIZE * 0.55) {
    return start + sentenceBreak + 1;
  }

  const spaceBreak = window.lastIndexOf(" ");
  return spaceBreak > CHUNK_SIZE * 0.55 ? start + spaceBreak : hardEnd;
}
