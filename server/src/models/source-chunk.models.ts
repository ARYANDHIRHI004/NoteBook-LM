import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { source } from "./soruce.models";
import { relations } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { json } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";

export const sourceChunk = pgTable("source-chunk", {
     id: uuid("id").primaryKey().defaultRandom(),
    sourceId: text("source_id").notNull().references(() => source.id, { onDelete: "cascade" }),
    index: integer("index").notNull(), 
    content: text("content"),
    tokenTount: integer("token_tount"),
    metadata: jsonb("metadata"),
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