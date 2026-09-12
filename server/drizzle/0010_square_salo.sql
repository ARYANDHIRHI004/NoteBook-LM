ALTER TABLE "source" ALTER COLUMN "metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "source-chunk" ALTER COLUMN "metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "worksapce" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "worksapce" DROP COLUMN "name";