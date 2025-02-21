ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "accounts" CASCADE;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "password" TO "clerkUserId";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkUserId_unique" UNIQUE("clerkUserId");