USE imigani_db;

START TRANSACTION;

DROP TABLE IF EXISTS tour_accommodations;
DROP TABLE IF EXISTS accommodations;
DROP TABLE IF EXISTS tour_meals;
DROP TABLE IF EXISTS meal_types;

COMMIT;
