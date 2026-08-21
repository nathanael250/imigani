USE imigani_db;

START TRANSACTION;

SET @has_featured_image_url := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tours'
    AND COLUMN_NAME = 'featured_image_url'
);

SET @sql := IF(
  @has_featured_image_url = 1,
  'ALTER TABLE tours DROP COLUMN featured_image_url',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

COMMIT;
