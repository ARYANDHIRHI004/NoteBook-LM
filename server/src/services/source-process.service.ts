import type { PineconeRecord } from "@pinecone-database/pinecone";
import { chunkPages, chunkText } from "../lib/chunking.js";
import { embedTexts } from "../lib/openai.js";
import { extractPdfFromCloudinary } from "../lib/pdf.js";
import {
  deleteSourceVectors,
  type VectorMetadata,
  upsertSourceVectors,
} from "../lib/pinecone.js";
import {
  createSourceChunkRecord,
  deleteSourceChunksBySourceId,
  findSourceChunksBySourceId,
  type SourceChunkRecord,
} from "../repositories/sourceChunk.repository.js";
import {
  findSourceContentById,
  updateSourceRecord,
  type SourceRecord,
} from "../repositories/source.repository.js";

/** Shape of JSON stored on a source's `metadata` column. */
type SourceMetadata = {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  publicId?: string;
  resourceType?: "raw" | "image";
  importedFrom?: string;
  videoId?: string;
  processingError?: string;
  chunkCount?: number;
  pageCount?: number;
  indexedAt?: string;
};

async function extractSourceText(source: SourceRecord) {
  const text = source.content?.trim();
  if (text) {
    return {
      text,
      pageCount: undefined,
      pages: undefined,
    };
  }

  if (source.type === "pdf") {
    const metadata =
      source.metadata &&
      typeof source.metadata === "object" &&
      !Array.isArray(source.metadata)
        ? (source.metadata as SourceMetadata)
        : {};
    if (!metadata.fileUrl) {
      throw new Error("PDF source is missing fileUrl metadata");
    }

    const extracted = await extractPdfFromCloudinary({
      fileUrl: metadata.fileUrl,
      publicId: metadata.publicId,
      resourceType: metadata.resourceType ?? "image",
    });
    return {
      text: extracted.text,
      pageCount: extracted.pageCount,
      pages: extracted.pages,
    };
  }

  // @ts-ignore
  throw new Error(`Source ${source.id} has no extractable content`);
}

export function markSourceProcessing(sourceId: string) {
  return updateSourceRecord(sourceId, { status: "processing" });
}

export async function markSourceFailed(
  sourceId: string,
  error: unknown,
  existingMetadata: SourceRecord["metadata"],
) {
  const message =
    error instanceof Error ? error.message : "Source processing failed";

  const metadata =
    existingMetadata &&
    typeof existingMetadata === "object" &&
    !Array.isArray(existingMetadata)
      ? (existingMetadata as SourceMetadata)
      : {};

  return updateSourceRecord(sourceId, {
    status: "failed",
    metadata: {
      ...metadata,
      processingError: message,
    },
  });
}

export async function extractSourceContent(sourceId: string) {
  const source = await findSourceContentById(sourceId);
  if (!source) {
    throw new Error("Source not found");
  }

  const extracted = await extractSourceText(source);
  const metadata =
    source.metadata &&
    typeof source.metadata === "object" &&
    !Array.isArray(source.metadata)
      ? (source.metadata as SourceMetadata)
      : {};

  await updateSourceRecord(sourceId, {
    content: extracted.text,
    metadata: {
      ...metadata,
      pageCount: extracted.pageCount ?? metadata.pageCount,
    },
  });

  return {
    sourceId,
    workspaceId: source.workspaceId,
    text: extracted.text,
    pages: extracted.pages,
    source,
  };
}

export async function chunkSourceContent(
  sourceId: string,
  text: string,
  pages?: string[],
) {
  await deleteSourceChunksBySourceId(sourceId);

  const chunks = pages?.length ? chunkPages(pages) : chunkText(text);

  if (chunks.length === 0) {
    throw new Error("No chunks were generated from source content");
  }

  return createSourceChunkRecord(
    chunks.map((chunk) => ({
      sourceId,
      index: chunk.index,
      content: chunk.content,
      tokenCount: Math.ceil(chunk.content.length / 4),
      metadata: chunk.metadata,
    })),
  );
}

export async function embedAndIndexSource(
  source: SourceRecord,
  chunks: SourceChunkRecord[],
) {
  const batchSize = 50;
  const records: PineconeRecord<VectorMetadata>[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const embeddings = await embedTexts(batch.map((chunk) => chunk.content));

    for (let j = 0; j < batch.length; j += 1) {
      const chunk = batch[j]!;
      const embedding = embeddings[j]!;
      const chunkMetadata =
        chunk.metadata &&
        typeof chunk.metadata === "object" &&
        !Array.isArray(chunk.metadata)
          ? (chunk.metadata as Record<string, unknown>)
          : {};

      records.push({
        id: chunk.id,
        values: embedding,
        metadata: {
          workspaceId: source.workspaceId,
          sourceId: source.id,
          chunkId: chunk.id,
          chunkIndex: chunk.index,
          sourceTitle: source.title,
          sourceType: source.type,
          text: chunk.content.slice(0, 35000),
          ...(typeof chunkMetadata.page === "number"
            ? { page: chunkMetadata.page }
            : {}),
        },
      });
    }
  }

  await upsertSourceVectors(source.workspaceId, records);

  const metadata =
    source.metadata &&
    typeof source.metadata === "object" &&
    !Array.isArray(source.metadata)
      ? (source.metadata as SourceMetadata)
      : {};

  return updateSourceRecord(source.id, {
    status: "ready",
    metadata: {
      ...metadata,
      chunkCount: chunks.length,
      indexedAt: new Date().toISOString(),
      processingError: undefined,
    },
  });
}

export async function removeSourceFromIndex(
  workspaceId: string,
  sourceId: string,
) {
  await deleteSourceVectors(workspaceId, sourceId);
  await deleteSourceChunksBySourceId(sourceId);
}

export async function listChunksForSource(sourceId: string) {
  const chunks = await findSourceChunksBySourceId(sourceId);
  return { chunks, count: chunks.length };
}
