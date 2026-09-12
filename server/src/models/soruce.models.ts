import { text, pgTable, timestamp, json } from "drizzle-orm/pg-core";
import { workspace } from "./workspace.model";
import { relations } from "drizzle-orm";
import { PgEnumColumn } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";

export const SourceStatus  = pgEnum("status", ["pending", "processing", "ready", "failed"]);

export const sourceType = pgEnum("type", ["pdf", "website", "youtube", "text", "markdown"]);

export const source = pgTable("source", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: text("workspaceId").notNull().references(() => workspace.id, { onDelete: "cascade" }),
    type: sourceType("type").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    url: text("url"),
    status: SourceStatus("status").default("pending").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
})

export const workspaceRelations = relations(workspace, ({ many }) => ({
    sources: many(source),
}))

export const sourceRelations = relations(source, ({ one }) => ({
    workspace: one(workspace, {
        fields: [source.workspaceId],
        references: [workspace.id],
    }),
}))