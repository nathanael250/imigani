USE imigani_db;

START TRANSACTION;

SET @has_short_description := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tours'
    AND COLUMN_NAME = 'short_description'
);

SET @sql := IF(
  @has_short_description = 1,
  'ALTER TABLE tours DROP COLUMN short_description',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

COMMIT;
