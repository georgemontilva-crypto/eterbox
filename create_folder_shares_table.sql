-- ========================================
-- Create folder_shares table for sharing folders between users
-- Feature: Corporate and Enterprise plans only
-- ========================================

CREATE TABLE IF NOT EXISTS folder_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  folderId INT NOT NULL,
  ownerId INT NOT NULL,
  sharedWithUserId INT NOT NULL,
  permission ENUM('read') DEFAULT 'read',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sharedWithUserId) REFERENCES users(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_share (folderId, sharedWithUserId)
);

CREATE INDEX idx_folder_shares_folder ON folder_shares(folderId);
CREATE INDEX idx_folder_shares_shared_with ON folder_shares(sharedWithUserId);
CREATE INDEX idx_folder_shares_owner ON folder_shares(ownerId);

-- Verify table creation
SELECT 'folder_shares table created successfully' AS status;
