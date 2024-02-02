-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.3.0 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_academy
CREATE DATABASE IF NOT EXISTS `db_academy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_academy`;

-- Dumping structure for table db_academy.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(125) DEFAULT NULL,
  `status` enum('0','1') DEFAULT NULL,
  `address` varchar(125) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_academy.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `status`, `address`, `created_at`, `updated_at`) VALUES
	(21, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:05:57', '2024-02-02 08:05:57'),
	(22, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:05:58', '2024-02-02 08:05:58'),
	(24, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:06:00', '2024-02-02 08:06:00'),
	(25, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:06:01', '2024-02-02 08:06:01'),
	(26, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:06:01', '2024-02-02 08:06:01'),
	(27, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:06:02', '2024-02-02 08:06:02'),
	(28, 'Testing', 'testing@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:20:05', '2024-02-02 08:20:05'),
	(29, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:20:37', '2024-02-02 08:22:04'),
	(30, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:21:20', '2024-02-02 08:21:20'),
	(31, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:21:31', '2024-02-02 08:21:31'),
	(32, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:21:32', '2024-02-02 08:21:32'),
	(33, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:21:33', '2024-02-02 08:21:33'),
	(35, 'aku', 'aku@gmail.com', '1', 'Jl Cabe Raya', '2024-02-02 08:21:34', '2024-02-02 08:21:34');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
