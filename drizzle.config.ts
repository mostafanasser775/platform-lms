import { defineConfig } from "drizzle-kit";
import { env } from "./data/env/server";
export default defineConfig({
    out: "./drizzle/migrations",
    schema: "./drizzle/schema.ts",
    strict: true,
    verbose: true,
    dialect: "postgresql",

    dbCredentials: {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        ssl: false,
    }
});