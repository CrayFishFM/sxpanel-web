import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./auth-schema";
import * as statsSchema from "./stats-schema";
import * as reportsSchema from "./reports-schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, {
  schema: { ...authSchema, ...statsSchema, ...reportsSchema },
});
