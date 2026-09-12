ALTER TABLE "source" RENAME COLUMN "workspace_id" TO "workspaceId";--> statement-breakpoint
ALTER TABLE "source" DROP CONSTRAINT "source_workspace_id_worksapce_id_fk";
--> statement-breakpoint
ALTER TABLE "source" ADD CONSTRAINT "source_workspaceId_worksapce_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."worksapce"("id") ON DELETE cascade ON UPDATE no action;