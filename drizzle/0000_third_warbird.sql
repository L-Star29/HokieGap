CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`space_id` text NOT NULL,
	`level` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reports_created_at` ON `reports` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reports_session_created_at` ON `reports` (`session_id`,`created_at`);