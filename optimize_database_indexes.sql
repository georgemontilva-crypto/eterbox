-- Optimize database indexes for better performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_plan_id ON users(plan_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_restricted ON users(is_restricted);

-- Payment history indexes
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_plan_id ON payment_history(plan_id);

-- Bulk emails indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_bulk_emails_status ON bulk_emails(status);
CREATE INDEX IF NOT EXISTS idx_bulk_emails_created_at ON bulk_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_emails_created_by ON bulk_emails(created_by);

-- Admin permissions indexes
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON admin_permissions(user_id);

-- Analyze tables for query optimization
ANALYZE TABLE users;
ANALYZE TABLE payment_history;
ANALYZE TABLE plans;
ANALYZE TABLE admin_permissions;
