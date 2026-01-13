-- Create payment_history table for tracking all payment transactions

CREATE TABLE IF NOT EXISTS payment_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50) NULL,
  transaction_id VARCHAR(255) NULL,
  stripe_payment_intent_id VARCHAR(255) NULL,
  paypal_order_id VARCHAR(255) NULL,
  description TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_plan_id (plan_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_stripe_payment_intent_id (stripe_payment_intent_id),
  INDEX idx_paypal_order_id (paypal_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data for testing (optional)
-- INSERT INTO payment_history (user_id, plan_id, amount, status, payment_method, description, completed_at) VALUES
-- (1, 2, 9.99, 'completed', 'stripe', 'Monthly subscription - Basic Plan', NOW()),
-- (2, 3, 19.99, 'completed', 'paypal', 'Monthly subscription - Corporate Plan', NOW());
