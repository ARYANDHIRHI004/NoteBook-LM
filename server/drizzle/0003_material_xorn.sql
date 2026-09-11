ALTER TABLE "source" ADD COLUMN "type" "type" NOT NULL;--> statement-breakpoint
ALTER TABLE "source" ADD COLUMN "status" "status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "source-chunk" ADD COLUMN "index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "source-chunk" ADD COLUMN "token_tount" integer;--> statement-breakpoint
ALTER TABLE "source-chunk" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "worksapce" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "worksapce" ADD COLUMN "default_model" text DEFAULT 'gpt-3.5-turbo';--> statement-breakpoint
ALTER TABLE "source" DROP COLUMN "description";