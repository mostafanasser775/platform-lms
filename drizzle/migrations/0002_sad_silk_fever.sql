ALTER TABLE "lessons" ALTER COLUMN "videoUrl" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "videoUrl" SET NOT NULL;