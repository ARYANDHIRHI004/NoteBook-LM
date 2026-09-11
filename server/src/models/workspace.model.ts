import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

export const workspace = pgTable("worksapce",{
     id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    title: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    defaultModel: text("default_model").default("gpt-3.5-turbo"),
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