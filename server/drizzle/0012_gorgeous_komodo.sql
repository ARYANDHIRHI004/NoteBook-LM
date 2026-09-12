ALTER TABLE "source-chunk" RENAME COLUMN "source_id" TO "sourceId";--> statement-breakpoint
ALTER TABLE "source-chunk" DROP CONSTRAINT "source-chunk_source_id_source_id_fk";
--> statement-breakpoint
ALTER TABLE "source-chunk" ADD CONSTRAINT "source-chunk_sourceId_source_id_fk" FOREIGN KEY ("sourceId") REFERENCES "public"."source"("id") ON DELETE cascade ON UPDATE no action;