USE imigani_db;

START TRANSACTION;

SET @has_price_note := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tour_prices'
    AND COLUMN_NAME = 'price_note'
);

SET @sql := IF(
  @has_price_note = 0,
  'ALTER TABLE tour_prices ADD COLUMN price_note TEXT NULL AFTER price',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_price_label := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'price_label'
);

SET @has_notes := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'notes'
);

SET @sql := CASE
  WHEN @has_price_label = 1 AND @has_notes = 1 THEN
    'UPDATE tour_prices
     SET price_note = TRIM(CONCAT(COALESCE(NULLIF(price_label, ''''), ''''), CASE WHEN (price_label IS NULL OR price_label = '''') OR (notes IS NULL OR notes = '''') THEN '''' ELSE ''\n'' END, COALESCE(NULLIF(notes, ''''), '''')))
     WHERE price_note IS NULL'
  WHEN @has_price_label = 1 THEN
    'UPDATE tour_prices SET price_note = NULLIF(price_label, '''') WHERE price_note IS NULL'
  WHEN @has_notes = 1 THEN
    'UPDATE tour_prices SET price_note = NULLIF(notes, '''') WHERE price_note IS NULL'
  ELSE
    'SELECT 1'
END;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_accommodation_option := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'accommodation_option'
);
SET @sql := IF(@has_accommodation_option = 1, 'ALTER TABLE tour_prices DROP COLUMN accommodation_option', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_min_people := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'min_people'
);
SET @sql := IF(@has_min_people = 1, 'ALTER TABLE tour_prices DROP COLUMN min_people', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_max_people := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'max_people'
);
SET @sql := IF(@has_max_people = 1, 'ALTER TABLE tour_prices DROP COLUMN max_people', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_price_label := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'price_label'
);
SET @sql := IF(@has_price_label = 1, 'ALTER TABLE tour_prices DROP COLUMN price_label', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_notes := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tour_prices' AND COLUMN_NAME = 'notes'
);
SET @sql := IF(@has_notes = 1, 'ALTER TABLE tour_prices DROP COLUMN notes', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

COMMIT;
