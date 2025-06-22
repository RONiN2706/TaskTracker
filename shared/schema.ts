import { pgTable, text, serial, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  completed: boolean("completed").notNull().default(false),
  completedDate: date("completed_date"),
  createdDate: date("created_date").notNull().default(new Date().toISOString().split('T')[0]),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  completed: true,
  completedDate: true,
  createdDate: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
