-- Tours & Safaris Dynamic Website
-- Lightweight website-focused schema
-- MySQL 8.0+
-- No bookings, OTA operations, payments, fleet management, suppliers, or customer accounts.

CREATE DATABASE IF NOT EXISTS imigani_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE imigani_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tour_documents, documents, trip_plan_categories,
trip_plan_interests, interests, trip_plans, inquiries, tour_extras,
tour_exclusions, tour_inclusions, tour_prices, currencies,
tour_itinerary_items, tour_itinerary_days, tour_destinations,
destinations, tour_media, tour_highlights, tours, tour_categories,
users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. ADMIN USER
-- Used only for managing website content.
-- ============================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','editor') NOT NULL DEFAULT 'editor',
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. TOUR CATEGORIES
-- Examples: Educational, Wildlife, Cultural, Adventure, etc.
-- ============================================================

CREATE TABLE tour_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. TOURS
-- Main tour/package information.
-- ============================================================

CREATE TABLE tours (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL UNIQUE,
    description LONGTEXT NULL,
    duration_days INT UNSIGNED NULL,
    duration_nights INT UNSIGNED NULL,
    status ENUM('draft','published','inactive') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tours_category
        FOREIGN KEY (category_id) REFERENCES tour_categories(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 4. TOUR HIGHLIGHTS
-- The highlighted experiences shown on the tour page.
-- ============================================================

CREATE TABLE tour_highlights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_highlights_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. TOUR MEDIA
-- Images/videos associated with a tour.
-- ============================================================

CREATE TABLE tour_media (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    media_type ENUM('image','video') NOT NULL DEFAULT 'image',
    url VARCHAR(500) NOT NULL,
    title VARCHAR(255) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_media_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. DESTINATIONS
-- Simple destinations/places displayed in tours.
-- ============================================================

CREATE TABLE destinations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tour_destinations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    destination_id BIGINT UNSIGNED NOT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_tour_destination (tour_id, destination_id),
    CONSTRAINT fk_tour_destinations_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_destinations_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. ITINERARY
-- Stores each day as one rich itinerary document. Times, bullets,
-- meals, and activities belong inside the rich description content.
-- ============================================================

CREATE TABLE tour_itinerary_days (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    day_number INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_tour_day (tour_id, day_number),
    CONSTRAINT fk_itinerary_days_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 8. PRICING
-- Simple package pricing.
-- ============================================================

CREATE TABLE currencies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NULL
) ENGINE=InnoDB;

CREATE TABLE tour_prices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    currency_id BIGINT UNSIGNED NOT NULL,
    price DECIMAL(14,2) NOT NULL,
    price_note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_prices_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_prices_currency
        FOREIGN KEY (currency_id) REFERENCES currencies(id)
) ENGINE=InnoDB;

-- ============================================================
-- 11. INCLUSIONS / EXCLUSIONS / EXTRAS
-- ============================================================

CREATE TABLE tour_inclusions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_inclusions_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_exclusions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_exclusions_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tour_extras (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_extras_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 12. CUSTOMER REQUESTS
-- No bookings.
-- ============================================================

CREATE TABLE inquiries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    inquiry TEXT NOT NULL,
    status ENUM('new','in_progress','responded','closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE interests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE trip_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    nationality VARCHAR(100) NULL,
    number_of_people INT UNSIGNED NOT NULL,
    arrival_date DATE NULL,
    departure_date DATE NULL,
    message TEXT NULL,
    status ENUM('new','in_progress','responded','closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE trip_plan_interests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_plan_id BIGINT UNSIGNED NOT NULL,
    interest_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_trip_plan_interest (trip_plan_id, interest_id),
    CONSTRAINT fk_trip_plan_interests_trip_plan
        FOREIGN KEY (trip_plan_id) REFERENCES trip_plans(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_trip_plan_interests_interest
        FOREIGN KEY (interest_id) REFERENCES interests(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE trip_plan_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_plan_id BIGINT UNSIGNED NOT NULL,
    tour_category_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_trip_plan_category (trip_plan_id, tour_category_id),
    CONSTRAINT fk_trip_plan_categories_trip_plan
        FOREIGN KEY (trip_plan_id) REFERENCES trip_plans(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_trip_plan_categories_category
        FOREIGN KEY (tour_category_id) REFERENCES tour_categories(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 13. SIMPLE DOCUMENTS
-- Only for documents/files that need to be attached to tours.
-- ============================================================

CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tour_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    document_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_tour_document (tour_id, document_id),
    CONSTRAINT fk_tour_documents_tour
        FOREIGN KEY (tour_id) REFERENCES tours(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_documents_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- STARTER DATA
-- ============================================================

INSERT INTO tour_categories (name, slug, description) VALUES
('Educational Tours', 'educational-tours', 'Educational tour experiences'),
('Wildlife Tours', 'wildlife-tours', 'Wildlife and safari experiences'),
('Cultural Tours', 'cultural-tours', 'Cultural and community experiences'),
('Adventure Tours', 'adventure-tours', 'Adventure experiences');

INSERT INTO currencies (code, name, symbol) VALUES
('USD', 'US Dollar', '$'),
('RWF', 'Rwandan Franc', 'FRw'),
('EUR', 'Euro', '€'),
('GBP', 'British Pound', '£');

INSERT INTO interests (name, description) VALUES
('Gorilla Trekking', 'Gorilla trekking experience'),
('Wildlife Safari', 'Wildlife and safari experience'),
('Photography', 'Photography experiences'),
('Cultural Experiences', 'Cultural experiences'),
('Community Experiences', 'Community experiences'),
('Adventure', 'Adventure experiences');

-- ============================================================
-- END
-- ============================================================
