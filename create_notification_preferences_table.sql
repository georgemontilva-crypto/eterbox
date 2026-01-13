-- Create notification_preferences table
-- This table stores user email notification preferences

CREATE TABLE IF NOT EXISTS notification_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_promos BOOLEAN NOT NULL DEFAULT TRUE,
  product_updates BOOLEAN NOT NULL DEFAULT TRUE,
  account_activity BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key to users table
  CONSTRAINT fk_notification_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE,
  
  -- Ensure one preference row per user
  UNIQUE KEY unique_user_preferences (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create index for faster lookups
CREATE INDEX idx_user_id ON notification_preferences(user_id);

-- Insert default preferences for existing users
INSERT INTO notification_preferences (user_id, security_alerts, marketing_promos, product_updates, account_activity)
SELECT id, TRUE, TRUE, TRUE, TRUE
FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences);
