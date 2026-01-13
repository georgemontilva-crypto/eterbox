-- Create bulk_emails table for storing email campaign history
CREATE TABLE IF NOT EXISTS bulk_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  target_users ENUM('all', 'free', 'premium') NOT NULL DEFAULT 'all',
  recipients_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status ENUM('pending', 'sending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
