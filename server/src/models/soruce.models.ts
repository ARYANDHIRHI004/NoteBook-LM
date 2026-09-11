import { text, pgTable, timestamp, json } from "drizzle-orm/pg-core";
import { workspace } from "./workspace.model";
import { relations } from "drizzle-orm";

export const source = pgTable("source", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    url: text("url"),
    workspaceId: text("workspace_id").notNull().references(() => workspace.id, { onDelete: "cascade" }),
    content: text("content"),
    metadata: json(),
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