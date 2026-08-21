USE imigani_db;

START TRANSACTION;

UPDATE tour_itinerary_days
SET title = CONCAT('Day ', day_number)
WHERE title IS NULL OR title = '';

ALTER TABLE tour_itinerary_days
  MODIFY title VARCHAR(255) NOT NULL;

SET @display_order_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tour_itinerary_days'
    AND COLUMN_NAME = 'display_order'
);

SET @add_display_order_sql = IF(
  @display_order_exists = 0,
  'ALTER TABLE tour_itinerary_days ADD COLUMN display_order INT UNSIGNED NOT NULL DEFAULT 0 AFTER description',
  'SELECT 1'
);

PREPARE add_display_order_stmt FROM @add_display_order_sql;
EXECUTE add_display_order_stmt;
DEALLOCATE PREPARE add_display_order_stmt;

UPDATE tour_itinerary_days
SET display_order = day_number
WHERE display_order = 0;

SET @itinerary_items_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tour_itinerary_items'
);

SET @merge_items_sql = IF(
  @itinerary_items_exists = 1,
  'UPDATE tour_itinerary_days day_row
   JOIN (
     SELECT
       itinerary_day_id,
       GROUP_CONCAT(
         CONCAT(
           COALESCE(DATE_FORMAT(start_time, ''%h:%i %p''), ''''),
           CASE WHEN start_time IS NULL THEN '''' ELSE '' - '' END,
           COALESCE(NULLIF(description, ''''), title)
         )
         ORDER BY display_order ASC, id ASC
         SEPARATOR ''\n''
       ) AS schedule_text
     FROM tour_itinerary_items
     WHERE COALESCE(NULLIF(description, ''''), title) IS NOT NULL
     GROUP BY itinerary_day_id
   ) schedule_rows ON schedule_rows.itinerary_day_id = day_row.id
   SET day_row.description = TRIM(
     CONCAT(
       COALESCE(NULLIF(day_row.description, ''''), ''''),
       CASE
         WHEN day_row.description IS NULL OR day_row.description = '''' THEN ''''
         ELSE ''\n\n''
       END,
       schedule_rows.schedule_text
     )
   )',
  'SELECT 1'
);

PREPARE merge_items_stmt FROM @merge_items_sql;
EXECUTE merge_items_stmt;
DEALLOCATE PREPARE merge_items_stmt;

DROP TABLE IF EXISTS tour_itinerary_items;

COMMIT;
