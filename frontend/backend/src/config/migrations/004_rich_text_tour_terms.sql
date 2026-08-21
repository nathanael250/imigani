USE imigani_db;

START TRANSACTION;

SET @has_inclusion_content := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'content'
);
SET @sql := IF(@has_inclusion_content = 0, 'ALTER TABLE tour_inclusions ADD COLUMN content LONGTEXT NULL AFTER tour_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_exclusion_content := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'content'
);
SET @sql := IF(@has_exclusion_content = 0, 'ALTER TABLE tour_exclusions ADD COLUMN content LONGTEXT NULL AFTER tour_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_extra_content := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'content'
);
SET @sql := IF(@has_extra_content = 0, 'ALTER TABLE tour_extras ADD COLUMN content LONGTEXT NULL AFTER tour_id', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_inclusion_title := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'title'
);
SET @sql := IF(
  @has_inclusion_title = 1,
  'CREATE TEMPORARY TABLE tmp_tour_inclusions AS
   SELECT MIN(id) AS keep_id, tour_id,
          GROUP_CONCAT(TRIM(CONCAT(COALESCE(NULLIF(title, ''''), ''''), CASE WHEN description IS NULL OR description = '''' THEN '''' ELSE ''\n'' END, COALESCE(NULLIF(description, ''''), ''''))) ORDER BY display_order ASC, id ASC SEPARATOR ''\n'') AS content
   FROM tour_inclusions
   GROUP BY tour_id',
  'CREATE TEMPORARY TABLE tmp_tour_inclusions AS SELECT id AS keep_id, tour_id, content FROM tour_inclusions WHERE content IS NOT NULL'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE tour_inclusions target
JOIN tmp_tour_inclusions source ON source.keep_id = target.id
SET target.content = source.content
WHERE target.content IS NULL OR target.content = '';

DELETE target FROM tour_inclusions target
LEFT JOIN tmp_tour_inclusions source ON source.keep_id = target.id
WHERE source.keep_id IS NULL;

SET @has_exclusion_title := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'title'
);
SET @sql := IF(
  @has_exclusion_title = 1,
  'CREATE TEMPORARY TABLE tmp_tour_exclusions AS
   SELECT MIN(id) AS keep_id, tour_id,
          GROUP_CONCAT(TRIM(CONCAT(COALESCE(NULLIF(title, ''''), ''''), CASE WHEN description IS NULL OR description = '''' THEN '''' ELSE ''\n'' END, COALESCE(NULLIF(description, ''''), ''''))) ORDER BY display_order ASC, id ASC SEPARATOR ''\n'') AS content
   FROM tour_exclusions
   GROUP BY tour_id',
  'CREATE TEMPORARY TABLE tmp_tour_exclusions AS SELECT id AS keep_id, tour_id, content FROM tour_exclusions WHERE content IS NOT NULL'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE tour_exclusions target
JOIN tmp_tour_exclusions source ON source.keep_id = target.id
SET target.content = source.content
WHERE target.content IS NULL OR target.content = '';

DELETE target FROM tour_exclusions target
LEFT JOIN tmp_tour_exclusions source ON source.keep_id = target.id
WHERE source.keep_id IS NULL;

SET @has_extra_name := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'name'
);
SET @sql := IF(
  @has_extra_name = 1,
  'CREATE TEMPORARY TABLE tmp_tour_extras AS
   SELECT MIN(id) AS keep_id, tour_id,
          GROUP_CONCAT(TRIM(CONCAT(COALESCE(NULLIF(name, ''''), ''''), CASE WHEN description IS NULL OR description = '''' THEN '''' ELSE ''\n'' END, COALESCE(NULLIF(description, ''''), ''''))) ORDER BY display_order ASC, id ASC SEPARATOR ''\n'') AS content
   FROM tour_extras
   GROUP BY tour_id',
  'CREATE TEMPORARY TABLE tmp_tour_extras AS SELECT id AS keep_id, tour_id, content FROM tour_extras WHERE content IS NOT NULL'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE tour_extras target
JOIN tmp_tour_extras source ON source.keep_id = target.id
SET target.content = source.content
WHERE target.content IS NULL OR target.content = '';

DELETE target FROM tour_extras target
LEFT JOIN tmp_tour_extras source ON source.keep_id = target.id
WHERE source.keep_id IS NULL;

DELETE FROM tour_inclusions WHERE content IS NULL OR content = '';
DELETE FROM tour_exclusions WHERE content IS NULL OR content = '';
DELETE FROM tour_extras WHERE content IS NULL OR content = '';

SET @has_inclusion_updated_at := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'updated_at'
);
SET @sql := IF(@has_inclusion_updated_at = 0, 'ALTER TABLE tour_inclusions ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_exclusion_updated_at := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'updated_at'
);
SET @sql := IF(@has_exclusion_updated_at = 0, 'ALTER TABLE tour_exclusions ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_extra_updated_at := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'updated_at'
);
SET @sql := IF(@has_extra_updated_at = 0, 'ALTER TABLE tour_extras ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE tour_inclusions MODIFY content LONGTEXT NOT NULL;
ALTER TABLE tour_exclusions MODIFY content LONGTEXT NOT NULL;
ALTER TABLE tour_extras MODIFY content LONGTEXT NOT NULL;

SET @has_extra_currency_fk := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tour_extras'
    AND CONSTRAINT_NAME = 'fk_tour_extras_currency'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @sql := IF(@has_extra_currency_fk = 1, 'ALTER TABLE tour_extras DROP FOREIGN KEY fk_tour_extras_currency', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @drop_columns := 'title,description,display_order';

SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'title');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_inclusions DROP COLUMN title', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'description');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_inclusions DROP COLUMN description', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_inclusions' AND COLUMN_NAME = 'display_order');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_inclusions DROP COLUMN display_order', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'title');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_exclusions DROP COLUMN title', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'description');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_exclusions DROP COLUMN description', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_exclusions' AND COLUMN_NAME = 'display_order');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_exclusions DROP COLUMN display_order', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'name');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_extras DROP COLUMN name', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'description');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_extras DROP COLUMN description', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'price');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_extras DROP COLUMN price', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'currency_id');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_extras DROP COLUMN currency_id', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @has_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_extras' AND COLUMN_NAME = 'display_order');
SET @sql := IF(@has_col = 1, 'ALTER TABLE tour_extras DROP COLUMN display_order', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

COMMIT;
