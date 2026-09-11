import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { source } from "../models/soruce.models.js";

export const sourceSelect = {
    id: true,
    workspaceId: true,
    type: true,
    title: true,
    content: true,
    url: true,
    status: true,
    metadata: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type SourceRecord = typeof source.$inferSelect;


export type CreateSourceData = {
  workspaceId: string;
  type: SourceRecord["type"];
  title: string;
  content: string;
  url?: string | null;
  status?: SourceRecord["status"];
  metadata?: Record<string, unknown>;
};

export async function createSourceRecord(data: CreateSourceData) {
  return await db.insert(source).values(data);
}

export async function findSourceContentById(
  sourceId: string,
): Promise<SourceRecord | undefined> {
  const [result] = await db
    .select()
    .from(source)
    .where(eq(source.id, sourceId))
    .limit(1);

  return result;
}

export async function updateSourceRecord(
  sourceId: string,
  data: Partial<CreateSourceData>,
) {
  return await db.update(source).set(data).where(eq(source.id, sourceId));
}
