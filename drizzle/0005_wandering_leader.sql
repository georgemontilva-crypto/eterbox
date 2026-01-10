ALTER TABLE `users` ADD `webauthnEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `webauthnCredentials` text;