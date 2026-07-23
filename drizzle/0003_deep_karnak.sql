CREATE TABLE "diagnostic_reports" (
	"report_id" text PRIMARY KEY NOT NULL,
	"payload_hash" text NOT NULL,
	"schema_version" integer,
	"tx_version" text,
	"fx_version" text,
	"provider" text,
	"generated_at" timestamp with time zone,
	"json_bytes" integer,
	"gzip_bytes" integer,
	"failed_sections" jsonb,
	"payload" jsonb NOT NULL,
	"submitter_ip" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostics_rate_limits" (
	"ip" text PRIMARY KEY NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_reports_payload_hash_idx" ON "diagnostic_reports" USING btree ("payload_hash");--> statement-breakpoint
CREATE INDEX "diagnostic_reports_received_at_idx" ON "diagnostic_reports" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "diagnostic_reports_expires_at_idx" ON "diagnostic_reports" USING btree ("expires_at");