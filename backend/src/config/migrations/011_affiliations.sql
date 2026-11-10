CREATE TABLE IF NOT EXISTS affiliations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo_url VARCHAR(500) NULL,
  website_url VARCHAR(500) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO affiliations (name, slug, logo_url, website_url, status, sort_order) VALUES
  ('Rwanda Tours and Travel Association', 'rtta', NULL, NULL, 'active', 1),
  ('African Travel & Tourism Association', 'atta', NULL, NULL, 'active', 2),
  ('Visit Rwanda', 'visit-rwanda', NULL, NULL, 'active', 3);
