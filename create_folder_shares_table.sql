-- ========================================
-- Create folder_shares table for sharing folders between users
-- Feature: Corporate and Enterprise plans only
-- ========================================

CREATE TABLE IF NOT EXISTS folder_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folder_id INT NOT NULL,
  owner_id INT NOT NULL,
  shared_with_user_id INT NOT NULL,
  permission ENUM('read') DEFAULT 'read',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_share (folder_id, shared_with_user_id)
);

CREATE INDEX idx_folder_shares_folder ON folder_shares(folder_id);
CREATE INDEX idx_folder_shares_shared_with ON folder_shares(shared_with_user_id);
CREATE INDEX idx_folder_shares_owner ON folder_shares(owner_id);

-- Verify table creation
SELECT 'folder_shares table created successfully' AS status;
