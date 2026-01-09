ALTER TABLE `plans` ADD `maxGeneratedKeys` int DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `yearlyPrice` decimal(10,2);--> statement-breakpoint
ALTER TABLE `plans` ADD `yearlyDiscount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `plans` ADD `stripeYearlyPriceId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `generatedKeysUsed` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionPeriod` enum('monthly','yearly') DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStartDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `paypalSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `savedPaymentMethod` text;