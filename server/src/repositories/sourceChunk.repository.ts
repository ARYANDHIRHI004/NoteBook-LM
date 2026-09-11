import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { sourceChunk } from "../models/source-chunk.models";

export type CreateSourceChunkData = {
    id: string;
    sourceId: string;
    index: number;
    content: string;
    tokenCount?: number | null;
};

export async function createSourceChunkRecord(data: CreateSourceChunkData[]) {
    return await db.insert(sourceChunk).values(data);
}

export async function findSourceChunksBySourceId(sourceId: string) {
    return await db.select().from(sourceChunk).where(eq(sourceChunk.sourceId, sourceId));
}

export async function deleteSourceChunksBySourceId(sourceId: string) {
    return await db.delete(sourceChunk).where(eq(sourceChunk.sourceId, sourceId));
}