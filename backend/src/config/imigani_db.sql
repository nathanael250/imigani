-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 30, 2026 at 06:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imigani_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `category` varchar(150) DEFAULT NULL,
  `cover_image_url` varchar(500) DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `cover_image_url`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(2, 'Rwanda Safari Packages with Hermosa Life Tours – Discover the Heart of East Africa', 'rwanda-safari-packages-with-hermosa-life-tours-discover-the-heart-of-east-africa', NULL, '<p>Welcome to our Tours and Safari platform! </p>\n<p>Join us for an unforgettable adventure as we explore the breathtaking landscapes and diverse wildlife. Our expertly guided tours are designed to provide you with unique experiences that connect you with nature.</p>\n<p><b>Highlights of Our Tours:</b></p>\n<ul>\n<li><b>Wildlife Safaris: </b>Witness the Big Five in their natural habitat.</li>\n<li><strong>Cultural Experiences:</strong> Engage with local communities and learn about their traditions.</li>\n<li><strong>Adventure Activities:</strong> Enjoy hiking, bird watching, and more.</li>\n</ul>\n<p><strong>Upcoming Tours:</strong></p>\n<ol>\n<li><strong>Savannah Safari</strong> - Experience the vast plains and incredible wildlife.</li>\n<li><strong>Mountain Trekking</strong> - Conquer stunning peaks with our expert guides.</li>\n<li><strong>Cultural Village Tour</strong> - Immerse yourself in local culture and cuisine.</li>\n</ol>\n<p>For more information and to book your adventure, visit our website: <a href=\"imigani.zuselogic.com\">https://hermosalifetourism.com/</a></p>\n<p>Follow us on social media for updates and special offers:  </p>\n<ul>\n<li><a href=\"fcebook.com\">Facebook</a>  </li>\n<li><a href=\"Instagram.com\">Instagram</a>  </li>\n<li><a href=\"x.com\">Twitter</a></li>\n</ul>\n<p><b>Get ready for an adventure of a lifetime!</b></p>', NULL, '/uploads/1788014540403-images.jpeg', 'published', NULL, '2026-08-29 14:42:27', '2026-08-29 15:19:02');

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`) VALUES
(1, 'USD', 'US Dollar', '$'),
(2, 'RWF', 'Rwandan Franc', 'FRw'),
(3, 'EUR', 'Euro', '€'),
(4, 'GBP', 'British Pound', '£');

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rwanda', 'active', '2026-08-20 17:49:01', '2026-08-20 17:49:01'),
(2, 'Uganda', 'active', '2026-08-20 17:49:01', '2026-08-20 17:49:01'),
(3, 'Kenya', 'active', '2026-08-20 17:49:01', '2026-08-20 17:49:01'),
(4, 'Tanzania', 'active', '2026-08-20 17:49:01', '2026-08-20 17:49:01');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `inquiry` text NOT NULL,
  `status` enum('new','in_progress','responded','closed') NOT NULL DEFAULT 'new',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `inquiry`, `status`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 'NIYOGUSHIMWA Natanael', 'niyo.nathan00@gmail.com', '0781796824', 'Tour Consultancy Request\nInterested In: Gorilla tracking\n\nSubject: Request for Consultancy on Tours and Safaris\n\nDear Ommar,\n\nI hope this message finds you well. I am reaching out to request your expertise and consultancy regarding tours and safaris. I am interested in exploring various options and would appreciate your guidance on the best destinations, itineraries, and experiences available.\n\nCould we schedule a time to discuss this further? I am eager to learn more about what you offer and how we can tailor a memorable experience.\n\nThank you for your assistance. I look forward to your response.\n\nBest regards,\n\n', 'new', 1, '2026-08-30 07:29:43', '2026-08-30 13:31:03'),
(2, 'kalim denny', 'kalimdenny@gmail.com', '0781272387', 'Tour Consultancy Request\nInterested In: Safari and wildlife\n\nSubject: Inquiry for Consultancy Services on Tours and Safaris\n\nDear Ommar,\n\nI hope this message finds you well. I am interested in your consultancy services regarding tours and safaris. I would appreciate any information you can provide about your offerings, including packages, pricing, and availability.\n\nThank you for your assistance. I look forward to your prompt response.\n\nBest regards,', 'new', 1, '2026-08-30 07:31:19', '2026-08-30 13:30:58'),
(3, 'kalim denny', 'kalimdenny@gmail.com', '0781272387', 'Plan Your Visit Request\nNationality: Rwanda\nNumber of People: 2\nArrival Date: 2026-09-03\nDeparture Date: 2026-09-06\nTravel Category: Luxury\nInterests: Gorilla Tracking, Game Drives, Chimpanzee Tracking, Cultural Safaris\n\nHello!\n\nI hope this message finds you well. I am excited to share that I am planning an incredible trip filled with tours and safaris! This adventure promises to be a unique experience, allowing me to explore breathtaking landscapes, encounter diverse wildlife, and immerse myself in different cultures.\n\nI am currently researching various destinations and activities to ensure I make the most of this journey. If you have any recommendations or tips for must-see places or experiences, I would greatly appreciate your input!\n\nLooking forward to sharing more details as the plans unfold!\n\nBest regards,\nKalim Deny', 'new', 1, '2026-08-30 07:38:22', '2026-08-30 13:29:22'),
(4, 'NIYOGUSHIMWA Natanael', 'nathanaelniyogushimwa@gmail.com', '0781796824', 'Tour Consultancy Request\nInterested In: Safari and wildlife\n\nHello this is just for testing do not care.', 'new', 1, '2026-08-30 08:07:38', '2026-08-30 13:29:34'),
(5, 'NIYOGUSHIMWA Natanael', 'nathanaelniyogushimwa@gmail.com', '0781796824', 'Tour Consultancy Request\nInterested In: Safari and wildlife\n\nAnother testing please do not care.', 'new', 1, '2026-08-30 08:10:07', '2026-08-30 13:29:43'),
(6, 'kalim denny', 'kalimdenny@gmail.com', '0781272387', 'Plan Your Visit Request\nNationality: Rwanda\nNumber of People: 2\nArrival Date: 2026-09-02\nDeparture Date: 2026-09-06\nTravel Category: Luxury\nInterests: Gorilla Tracking, Game Drives, Cultural Safaris, Chimpanzee Tracking, Boat Trips, Golden Monkey Tracking, Easy to Moderate Hiking, Moderate to Difficult Hiking, Relaxation\n\nThis is for testing please do not care about this message.  Just ignore and we approgise to the issue that may be caused by this for sure.', 'responded', 1, '2026-08-30 08:11:43', '2026-08-30 13:29:15'),
(7, 'kalim denny', 'kalimdenny@gmail.com', '0781272387', 'Tour Consultancy Request\nInterested In: Safari and wildlife\n\nThis is just for testing please do not care.', 'new', 1, '2026-08-30 08:30:49', '2026-08-30 13:29:39'),
(8, 'kalim denny', 'kalimdenny@gmail.com', '0781272387', 'Tour: 3 Days in Kigali\nTickets: 2\nArrival Date: Not specified\n\nThis is for testing.', 'new', 1, '2026-08-30 08:34:30', '2026-08-30 13:31:06'),
(9, 'NIYOGUSHIMWA Natanael', 'nathanaelniyogushimwa@gmail.com', '0781796824', 'Tour Consultancy Request\nInterested In: Safari and wildlife\n\nHello im just requesting for consultancy for sure.', 'new', 1, '2026-08-30 13:02:13', '2026-08-30 13:29:28');

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`id`, `name`, `description`, `status`, `created_at`) VALUES
(1, 'Gorilla Trekking', 'Gorilla trekking experience', 'active', '2026-08-20 16:35:51'),
(2, 'Wildlife Safari', 'Wildlife and safari experience', 'active', '2026-08-20 16:35:51'),
(3, 'Photography', 'Photography experiences', 'active', '2026-08-20 16:35:51'),
(4, 'Cultural Experiences', 'Cultural experiences', 'active', '2026-08-20 16:35:51'),
(5, 'Community Experiences', 'Community experiences', 'active', '2026-08-20 16:35:51'),
(6, 'Adventure', 'Adventure experiences', 'active', '2026-08-20 16:35:51');

-- --------------------------------------------------------

--
-- Table structure for table `meal_types`
--

CREATE TABLE `meal_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_types`
--

INSERT INTO `meal_types` (`id`, `name`, `created_at`) VALUES
(1, 'Breakfast', '2026-08-20 16:35:51'),
(2, 'Lunch', '2026-08-20 16:35:51'),
(3, 'Dinner', '2026-08-20 16:35:51'),
(4, 'Snack', '2026-08-20 16:35:51');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('system','booking','blog','review','tour') NOT NULL DEFAULT 'system',
  `entity_type` varchar(80) DEFAULT NULL,
  `entity_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `entity_type`, `entity_id`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 'Blog post created', 'bhk was created as a draft blog post.', 'blog', 'blog_post', 1, 1, '2026-08-22 07:47:13', '2026-08-30 07:44:09'),
(2, 'Blog post created', 'Rwanda Safari Packages with Hermosa Life Tours – Discover the Heart of East Africa was created as a draft blog post.', 'blog', 'blog_post', 2, 1, '2026-08-29 14:42:27', '2026-08-30 07:44:09'),
(3, 'Settings updated', 'Website settings were updated.', 'system', 'settings', NULL, 1, '2026-08-29 15:54:41', '2026-08-30 07:44:09'),
(4, 'Settings updated', 'Website settings were updated.', 'system', 'settings', NULL, 1, '2026-08-29 15:54:42', '2026-08-30 07:44:09'),
(5, 'New booking enquiry', 'NIYOGUSHIMWA Natanael sent a new booking or enquiry message.', 'booking', 'inquiry', 1, 1, '2026-08-30 07:29:43', '2026-08-30 07:44:09'),
(6, 'New booking enquiry', 'kalim denny sent a new booking or enquiry message.', 'booking', 'inquiry', 2, 1, '2026-08-30 07:31:19', '2026-08-30 07:44:09'),
(7, 'New booking enquiry', 'kalim denny sent a new booking or enquiry message.', 'booking', 'inquiry', 3, 1, '2026-08-30 07:38:22', '2026-08-30 07:44:09'),
(8, 'New booking enquiry', 'NIYOGUSHIMWA Natanael sent a new booking or enquiry message.', 'booking', 'inquiry', 4, 1, '2026-08-30 08:07:38', '2026-08-30 13:23:44'),
(9, 'New booking enquiry', 'NIYOGUSHIMWA Natanael sent a new booking or enquiry message.', 'booking', 'inquiry', 5, 1, '2026-08-30 08:10:07', '2026-08-30 13:23:44'),
(10, 'New booking enquiry', 'kalim denny sent a new booking or enquiry message.', 'booking', 'inquiry', 6, 1, '2026-08-30 08:11:43', '2026-08-30 13:23:44'),
(11, 'New booking enquiry', 'kalim denny sent a new booking or enquiry message.', 'booking', 'inquiry', 7, 1, '2026-08-30 08:30:49', '2026-08-30 13:23:43'),
(12, 'New booking enquiry', 'kalim denny sent a new booking or enquiry message.', 'booking', 'inquiry', 8, 1, '2026-08-30 08:34:30', '2026-08-30 13:23:44'),
(13, 'New booking enquiry', 'NIYOGUSHIMWA Natanael sent a new booking or enquiry message.', 'booking', 'inquiry', 9, 1, '2026-08-30 13:02:14', '2026-08-30 13:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL DEFAULT 5,
  `review` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `setting_key` varchar(120) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'business_name', 'IMIGANI Tours & Safaris', '2026-08-22 06:16:34', '2026-08-22 06:16:34'),
(2, 'business_email', 'info@imiganitours.com', '2026-08-22 06:16:34', '2026-08-22 06:16:34'),
(3, 'business_phone', '+250 785 118 003', '2026-08-22 06:16:34', '2026-08-22 06:16:34'),
(4, 'business_whatsapp', '+250 785 118 003', '2026-08-22 06:16:34', '2026-08-22 06:16:34'),
(5, 'office_address', 'Kigali, Rwanda', '2026-08-22 06:16:34', '2026-08-22 06:16:34'),
(6, 'notification_email', 'info@imiganitours.com', '2026-08-22 06:16:34', '2026-08-22 06:16:34');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
  `source` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `email`, `status`, `source`, `created_at`, `updated_at`) VALUES
(1, 'nathanaelniyogushimwa@gmail.com', 'active', 'blog', '2026-08-30 12:57:00', '2026-08-30 12:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `description` longtext DEFAULT NULL,
  `duration_days` int(10) UNSIGNED DEFAULT NULL,
  `duration_nights` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('draft','published','inactive') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `category_id`, `name`, `slug`, `description`, `duration_days`, `duration_nights`, `status`, `created_at`, `updated_at`) VALUES
(3, 6, '3 Days in Kigali', '3-days-in-kigali', 'Discover the vibrant capital of Rwanda through a three-day cultural and city experience combining Kigali\'s history, local culture, markets, art, cuisine, and beautiful city views.', 3, 2, 'published', '2026-08-20 20:16:26', '2026-08-29 16:02:37');

-- --------------------------------------------------------

--
-- Table structure for table `tour_accommodations`
--

CREATE TABLE `tour_accommodations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `accommodation_id` bigint(20) UNSIGNED NOT NULL,
  `accommodation_option` enum('value','comfort','superior') DEFAULT NULL,
  `itinerary_day_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nights` int(10) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour_categories`
--

CREATE TABLE `tour_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_categories`
--

INSERT INTO `tour_categories` (`id`, `name`, `slug`, `description`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'FIT & Solo Travel', 'fit-solo-travel', 'Independent, solo, couples and tailor-made travelers.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07'),
(2, 'Private & Family Tours', 'private-family-tours', 'Families, couples, honeymooners and private journeys.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07'),
(3, 'Group & Adventure Tours', 'group-adventure-tours', 'Friends, organized groups, shared and adventure experiences.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07'),
(4, 'Business & Incentive Travel', 'business-incentive-travel', 'Corporate retreats, incentive trips, team building, conferences and organizations.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07'),
(5, 'Domestic Tours', 'domestic-tours', 'Rwandans and residents discovering Rwanda through leisure, culture, nature and adventure.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07'),
(6, 'Educational Tours', 'educational-tours', 'Schools, universities, research trips, study tours and learning experiences.', NULL, 'active', '2026-08-29 15:58:07', '2026-08-29 15:58:07');

-- --------------------------------------------------------

--
-- Table structure for table `tour_destinations`
--

CREATE TABLE `tour_destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `destination_id` bigint(20) UNSIGNED NOT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_destinations`
--

INSERT INTO `tour_destinations` (`id`, `tour_id`, `destination_id`, `display_order`, `description`, `created_at`) VALUES
(5, 3, 1, 1, '', '2026-08-20 20:16:26'),
(6, 3, 2, 2, '', '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_documents`
--

CREATE TABLE `tour_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `document_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour_exclusions`
--

CREATE TABLE `tour_exclusions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_exclusions`
--

INSERT INTO `tour_exclusions` (`id`, `tour_id`, `title`, `description`, `display_order`, `created_at`) VALUES
(1, 3, 'International flights Visa fees Travel insurance Personal expenses Meals not specifically mentioned Optional activities Tips', '<li data-start=\"1957\" data-end=\"1980\">International flights<span aria-hidden=\"true\" class=\"PDq2pG_selectionAnchor\"></span>\n</li>\n<li data-start=\"1981\" data-end=\"1992\">\nVisa fees\n</li>\n<li data-start=\"1993\" data-end=\"2011\">\nTravel insurance\n</li>\n<li data-start=\"2012\" data-end=\"2031\">\nPersonal expenses\n</li>\n<li data-start=\"2032\" data-end=\"2066\">\nMeals not specifically mentioned\n</li>\n<li data-start=\"2067\" data-end=\"2088\">\nOptional activities\n</li>\n<li data-start=\"2089\" data-end=\"2095\">\nTips</li>', 1, '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_extras`
--

CREATE TABLE `tour_extras` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(14,2) DEFAULT NULL,
  `currency_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_extras`
--

INSERT INTO `tour_extras` (`id`, `tour_id`, `name`, `description`, `price`, `currency_id`, `display_order`, `created_at`) VALUES
(1, 3, 'The itinerary can be adjusted according to the traveler\'s interests and arrival/departure times. Some activities may depend on availability and opening hours. Travelers should carry comfortable walking shoes and appropriate clothing.', '<li data-start=\"2124\" data-end=\"2222\">The itinerary can be adjusted according to the traveler\'s interests and arrival/departure times.<span aria-hidden=\"true\" class=\"PDq2pG_selectionAnchor\"></span>\n</li>\n<li data-start=\"2223\" data-end=\"2286\">\nSome activities may depend on availability and opening hours.\n</li>\n<li data-start=\"2287\" data-end=\"2363\">\nTravelers should carry comfortable walking shoes and appropriate clothing.</li>', NULL, NULL, 1, '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_highlights`
--

CREATE TABLE `tour_highlights` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_highlights`
--

INSERT INTO `tour_highlights` (`id`, `tour_id`, `title`, `display_order`, `created_at`) VALUES
(5, 3, 'nature', 1, '2026-08-20 20:16:26'),
(6, 3, 'forest', 2, '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_inclusions`
--

CREATE TABLE `tour_inclusions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_inclusions`
--

INSERT INTO `tour_inclusions` (`id`, `tour_id`, `title`, `description`, `display_order`, `created_at`) VALUES
(1, 3, 'Accommodation for 2 nights Daily breakfast Transportation during the tour Airport transfers Professional tour guide Entrance fees for included attractions Selected cultural experiences', '<li data-start=\"1732\" data-end=\"1760\">Accommodation for 2 nights<span aria-hidden=\"true\" class=\"PDq2pG_selectionAnchor\"></span>\n</li>\n<li data-start=\"1761\" data-end=\"1778\">\nDaily breakfast\n</li>\n<li data-start=\"1779\" data-end=\"1811\">\nTransportation during the tour\n</li>\n<li data-start=\"1812\" data-end=\"1831\">\nAirport transfers\n</li>\n<li data-start=\"1832\" data-end=\"1857\">\nProfessional tour guide\n</li>\n<li data-start=\"1858\" data-end=\"1898\">\nEntrance fees for included attractions\n</li>\n<li data-start=\"1899\" data-end=\"1930\">\nSelected cultural experiences</li>', 1, '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_itinerary_days`
--

CREATE TABLE `tour_itinerary_days` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `day_number` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_itinerary_days`
--

INSERT INTO `tour_itinerary_days` (`id`, `tour_id`, `day_number`, `title`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(7, 3, 1, 'Arrival & Kigali City Experience', '<p data-start=\"400\" data-end=\"1001\" class=\"PDq2pG_selectionAnchorContainer\">Arrive at Kigali International Airport where you will be welcomed by your guide and transferred to your hotel. After check-in and some time to refresh, begin your introduction to Kigali with a city tour exploring some of the capital\'s notable neighborhoods and landmarks. Visit the Kigali Genocide Memorial to learn about Rwanda\'s history and the country\'s journey toward reconciliation and development. Continue through the city and experience the atmosphere of local markets and everyday life before returning to your hotel. The evening is free to relax or explore the surroundings at your own pace.<span aria-hidden=\"true\" class=\"PDq2pG_selectionAnchor\"></span></p>\n<p data-start=\"1003\" data-end=\"1024\"><strong data-start=\"1003\" data-end=\"1017\">Overnight:</strong> Kigali</p>', 1, '2026-08-20 20:16:26', '2026-08-20 20:16:26'),
(8, 3, 2, 'Kigali Culture, Art & Local Life', 'After breakfast, continue your Kigali experience with a visit to one of the city\'s vibrant cultural and artistic spaces, where you can discover contemporary Rwandan art and learn more about the country\'s creative community. Enjoy a local lunch before exploring Kimironko Market, one of Kigali\'s lively markets, where you can experience local commerce and discover fresh produce, fabrics, crafts, and other products. Continue exploring Kigali\'s neighborhoods and enjoy views of the city\'s beautiful hills before returning to your hotel for a relaxing evening.', 2, '2026-08-20 20:16:26', '2026-08-20 20:16:26'),
(9, 3, 3, 'Kigali Discovery & Departure', 'Enjoy breakfast at the hotel before spending your final morning discovering more of Kigali. Visit a selected cultural or historical attraction and take some time to experience the city at a relaxed pace. After lunch, you will have free time for shopping, purchasing souvenirs, or enjoying your final moments in Kigali. At the agreed time, your guide will transfer you to Kigali International Airport for your departure, marking the end of your three-day Kigali experience.', 3, '2026-08-20 20:16:26', '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_meals`
--

CREATE TABLE `tour_meals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `itinerary_day_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meal_type_id` bigint(20) UNSIGNED NOT NULL,
  `included` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour_media`
--

CREATE TABLE `tour_media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `url` varchar(500) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `display_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_cover` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_media`
--

INSERT INTO `tour_media` (`id`, `tour_id`, `media_type`, `url`, `title`, `display_order`, `is_cover`, `created_at`) VALUES
(1, 3, 'image', '/uploads/1787256538012-Rwanda.png', 'Rwanda.png', 1, 1, '2026-08-20 20:16:26'),
(2, 3, 'image', '/uploads/1787256548241-gollira.png', 'gollira.png', 2, 0, '2026-08-20 20:16:26'),
(3, 3, 'image', '/uploads/1787256548260-Rwanda.png', 'Rwanda.png', 3, 0, '2026-08-20 20:16:26'),
(4, 3, 'image', '/uploads/1787256548287-Tanzania.png', 'Tanzania.png', 4, 0, '2026-08-20 20:16:26'),
(5, 3, 'image', '/uploads/1787256548341-Uganda.png', 'Uganda.png', 5, 0, '2026-08-20 20:16:26'),
(6, 3, 'image', '/uploads/1787256548363-Kigali.jpg', 'Kigali.jpg', 6, 0, '2026-08-20 20:16:26'),
(7, 3, 'image', '/uploads/1787256548372-Kenya.png', 'Kenya.png', 7, 0, '2026-08-20 20:16:26'),
(8, 3, 'image', '/uploads/1787256548390-nyungwe-canopy-walk.jpg', 'nyungwe-canopy-walk.jpg', 8, 0, '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `tour_prices`
--

CREATE TABLE `tour_prices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tour_id` bigint(20) UNSIGNED NOT NULL,
  `accommodation_option` enum('value','comfort','superior') DEFAULT NULL,
  `currency_id` bigint(20) UNSIGNED NOT NULL,
  `min_people` int(10) UNSIGNED DEFAULT NULL,
  `max_people` int(10) UNSIGNED DEFAULT NULL,
  `price` decimal(14,2) NOT NULL,
  `price_label` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tour_prices`
--

INSERT INTO `tour_prices` (`id`, `tour_id`, `accommodation_option`, `currency_id`, `min_people`, `max_people`, `price`, `price_label`, `notes`, `created_at`, `updated_at`) VALUES
(2, 3, NULL, 1, NULL, NULL, 200.00, NULL, NULL, '2026-08-20 20:16:26', '2026-08-20 20:16:26');

-- --------------------------------------------------------

--
-- Table structure for table `trip_plans`
--

CREATE TABLE `trip_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `number_of_people` int(10) UNSIGNED NOT NULL,
  `arrival_date` date DEFAULT NULL,
  `departure_date` date DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('new','in_progress','responded','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip_plan_categories`
--

CREATE TABLE `trip_plan_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `trip_plan_id` bigint(20) UNSIGNED NOT NULL,
  `tour_category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip_plan_interests`
--

CREATE TABLE `trip_plan_interests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `trip_plan_id` bigint(20) UNSIGNED NOT NULL,
  `interest_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'editor',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@imiganitoursandsafaris.com', '$2b$12$uennUEi9KE/XvbEOvtWnYuFfOrkIZ9uENDFVbJ0v8W6Q/PEC4L0RG', 'admin', 'active', '2026-08-20 17:28:11', '2026-08-30 15:01:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_posts_slug` (`slug`),
  ADD KEY `idx_blog_posts_status` (`status`),
  ADD KEY `idx_blog_posts_category` (`category`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `meal_types`
--
ALTER TABLE `meal_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_is_read` (`is_read`),
  ADD KEY `idx_notifications_type` (`type`),
  ADD KEY `idx_notifications_entity` (`entity_type`,`entity_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_status` (`status`),
  ADD KEY `fk_reviews_tour` (`tour_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_site_settings_key` (`setting_key`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_tours_category` (`category_id`);

--
-- Indexes for table `tour_accommodations`
--
ALTER TABLE `tour_accommodations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_accommodations_tour` (`tour_id`),
  ADD KEY `fk_tour_accommodations_accommodation` (`accommodation_id`),
  ADD KEY `fk_tour_accommodations_day` (`itinerary_day_id`);

--
-- Indexes for table `tour_categories`
--
ALTER TABLE `tour_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tour_destination` (`tour_id`,`destination_id`),
  ADD KEY `fk_tour_destinations_destination` (`destination_id`);

--
-- Indexes for table `tour_documents`
--
ALTER TABLE `tour_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tour_document` (`tour_id`,`document_id`),
  ADD KEY `fk_tour_documents_document` (`document_id`);

--
-- Indexes for table `tour_exclusions`
--
ALTER TABLE `tour_exclusions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_exclusions_tour` (`tour_id`);

--
-- Indexes for table `tour_extras`
--
ALTER TABLE `tour_extras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_extras_tour` (`tour_id`),
  ADD KEY `fk_tour_extras_currency` (`currency_id`);

--
-- Indexes for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_highlights_tour` (`tour_id`);

--
-- Indexes for table `tour_inclusions`
--
ALTER TABLE `tour_inclusions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_inclusions_tour` (`tour_id`);

--
-- Indexes for table `tour_itinerary_days`
--
ALTER TABLE `tour_itinerary_days`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tour_day` (`tour_id`,`day_number`);

--
-- Indexes for table `tour_meals`
--
ALTER TABLE `tour_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_meals_tour` (`tour_id`),
  ADD KEY `fk_tour_meals_day` (`itinerary_day_id`),
  ADD KEY `fk_tour_meals_type` (`meal_type_id`);

--
-- Indexes for table `tour_media`
--
ALTER TABLE `tour_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_media_tour` (`tour_id`);

--
-- Indexes for table `tour_prices`
--
ALTER TABLE `tour_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tour_prices_tour` (`tour_id`),
  ADD KEY `fk_tour_prices_currency` (`currency_id`);

--
-- Indexes for table `trip_plans`
--
ALTER TABLE `trip_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trip_plan_categories`
--
ALTER TABLE `trip_plan_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_trip_plan_category` (`trip_plan_id`,`tour_category_id`),
  ADD KEY `fk_trip_plan_categories_category` (`tour_category_id`);

--
-- Indexes for table `trip_plan_interests`
--
ALTER TABLE `trip_plan_interests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_trip_plan_interest` (`trip_plan_id`,`interest_id`),
  ADD KEY `fk_trip_plan_interests_interest` (`interest_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `meal_types`
--
ALTER TABLE `meal_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tour_accommodations`
--
ALTER TABLE `tour_accommodations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_categories`
--
ALTER TABLE `tour_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tour_documents`
--
ALTER TABLE `tour_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_exclusions`
--
ALTER TABLE `tour_exclusions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tour_extras`
--
ALTER TABLE `tour_extras`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tour_inclusions`
--
ALTER TABLE `tour_inclusions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tour_itinerary_days`
--
ALTER TABLE `tour_itinerary_days`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tour_meals`
--
ALTER TABLE `tour_meals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour_media`
--
ALTER TABLE `tour_media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tour_prices`
--
ALTER TABLE `tour_prices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trip_plans`
--
ALTER TABLE `trip_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trip_plan_categories`
--
ALTER TABLE `trip_plan_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trip_plan_interests`
--
ALTER TABLE `trip_plan_interests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tours`
--
ALTER TABLE `tours`
  ADD CONSTRAINT `fk_tours_category` FOREIGN KEY (`category_id`) REFERENCES `tour_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tour_accommodations`
--
ALTER TABLE `tour_accommodations`
  ADD CONSTRAINT `fk_tour_accommodations_accommodation` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_accommodations_day` FOREIGN KEY (`itinerary_day_id`) REFERENCES `tour_itinerary_days` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tour_accommodations_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_destinations`
--
ALTER TABLE `tour_destinations`
  ADD CONSTRAINT `fk_tour_destinations_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_destinations_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_documents`
--
ALTER TABLE `tour_documents`
  ADD CONSTRAINT `fk_tour_documents_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_documents_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_exclusions`
--
ALTER TABLE `tour_exclusions`
  ADD CONSTRAINT `fk_tour_exclusions_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_extras`
--
ALTER TABLE `tour_extras`
  ADD CONSTRAINT `fk_tour_extras_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tour_extras_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_highlights`
--
ALTER TABLE `tour_highlights`
  ADD CONSTRAINT `fk_tour_highlights_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_inclusions`
--
ALTER TABLE `tour_inclusions`
  ADD CONSTRAINT `fk_tour_inclusions_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_itinerary_days`
--
ALTER TABLE `tour_itinerary_days`
  ADD CONSTRAINT `fk_itinerary_days_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_meals`
--
ALTER TABLE `tour_meals`
  ADD CONSTRAINT `fk_tour_meals_day` FOREIGN KEY (`itinerary_day_id`) REFERENCES `tour_itinerary_days` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tour_meals_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tour_meals_type` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`);

--
-- Constraints for table `tour_media`
--
ALTER TABLE `tour_media`
  ADD CONSTRAINT `fk_tour_media_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tour_prices`
--
ALTER TABLE `tour_prices`
  ADD CONSTRAINT `fk_tour_prices_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`),
  ADD CONSTRAINT `fk_tour_prices_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trip_plan_categories`
--
ALTER TABLE `trip_plan_categories`
  ADD CONSTRAINT `fk_trip_plan_categories_category` FOREIGN KEY (`tour_category_id`) REFERENCES `tour_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_trip_plan_categories_trip_plan` FOREIGN KEY (`trip_plan_id`) REFERENCES `trip_plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trip_plan_interests`
--
ALTER TABLE `trip_plan_interests`
  ADD CONSTRAINT `fk_trip_plan_interests_interest` FOREIGN KEY (`interest_id`) REFERENCES `interests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_trip_plan_interests_trip_plan` FOREIGN KEY (`trip_plan_id`) REFERENCES `trip_plans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
