// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  int,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `clipsnip_${name}`);

export const urlSchema = mysqlTable(
  "url",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    url: varchar("url", {
      length: 700,
    }).notNull(),
    description: varchar("description", { length: 256 }),
    shortUrl: varchar("short_url", { length: 256 }).notNull(),
    userAuthId: varchar("user_id", { length: 256 }).notNull(),
    totalVisitCount: int("total_visit_count").default(1).notNull(),
    // totalUniqueVisitCount: int("total_unique_visit_count").default(1).notNull(),
    disabled: boolean("disabled").default(false).notNull(),
    visitCountByCountry: json("visit_count_by_country").default("{}"),
    visitCountByDate: json("visit_count_by_date").default("{}"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow().defaultNow(),
  },
  (table) => ({
    urlIndex: index("url_idx").on(table.url),
    shortUrlIndex: index("short_url_idx").on(table.shortUrl),
    userAuthIdIndex: index("user_id_idx").on(table.userAuthId),
  }),
);
