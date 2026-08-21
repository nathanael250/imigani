USE imigani_db;

SET @highlight_description_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tour_highlights'
    AND COLUMN_NAME = 'description'
);

SET @drop_highlight_description_sql = IF(
  @highlight_description_exists = 1,
  'ALTER TABLE tour_highlights DROP COLUMN description',
  'SELECT 1'
);

PREPARE drop_highlight_description_stmt FROM @drop_highlight_description_sql;
EXECUTE drop_highlight_description_stmt;
DEALLOCATE PREPARE drop_highlight_description_stmt;
