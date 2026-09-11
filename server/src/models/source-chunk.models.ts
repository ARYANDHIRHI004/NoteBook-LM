import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { source } from "./soruce.models";
import { relations } from "drizzle-orm";

export const sourceChunk = pgTable("source-chunk", {
    id: text("id").primaryKey(),
    sourceId: text("source_id").notNull().references(() => source.id, { onDelete: "cascade" }),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),   
})

export const sourceChunkRelations = relations(sourceChunk, ({ one }) => ({
    source: one(source, {
        fields: [sourceChunk.sourceId],
        references: [source.id],
    }),
}))

export const sourceRelations = relations(source, ({ many }) => ({
    sourceChunks: many(sourceChunk),
}))