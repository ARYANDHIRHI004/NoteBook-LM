import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const workspace = pgTable("worksapce",{
    id: text("id").primaryKey(),
    title: text("name").notNull(),
    description: text("description"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
})


export const userRelations = relations(user, ({ many }) => ({
    workspaces: many(workspace),
}))

export const workspaceRelations = relations(workspace, ({ one }) => ({
    user: one(user, {
      fields: [workspace.userId],
      references: [user.id],
    }),
  }));