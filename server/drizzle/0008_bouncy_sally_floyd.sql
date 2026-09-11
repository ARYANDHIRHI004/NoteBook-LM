CREATE TYPE "public"."status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('pdf', 'website', 'youtube', 'text', 'markdown');--> statement-breakpoint
ALTER TABLE "source" ALTER COLUMN "status" SET DEFAULT 'pending';