CREATE TABLE `paymentHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`planName` varchar(100) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'USD',
	`period` enum('monthly','yearly') NOT NULL,
	`paymentMethod` varchar(50) NOT NULL,
	`paypalOrderId` varchar(255),
	`paypalTransactionId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`payerEmail` varchar(320),
	`payerName` varchar(255),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paymentHistory_id` PRIMARY KEY(`id`)
);
