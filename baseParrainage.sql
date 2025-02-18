-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: parrainage
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP DATABASE IF EXISTS parrainage;
CREATE TABLE parrainage;
USE parrainage;
--
-- Table structure for table `candidat`
--

DROP TABLE IF EXISTS `candidat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `numero_carte_electeur` varchar(50) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `slogan` varchar(100) NOT NULL,
  `photo` longblob NOT NULL,
  `couleur1` varchar(7) NOT NULL,
  `couleur2` varchar(7) NOT NULL,
  `couleur3` varchar(7) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `code_authentification` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_carte_electeur` (`numero_carte_electeur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidat`
--

LOCK TABLES `candidat` WRITE;
/*!40000 ALTER TABLE `candidat` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidats`
--

/*DROP TABLE IF EXISTS `candidats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidats`*/
--

LOCK TABLES `candidats` WRITE;
/*!40000 ALTER TABLE `candidats` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `electeurs`
--

DROP TABLE IF EXISTS `electeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `electeurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `numero_carte_identite` varchar(50) NOT NULL,
  `numero_carte_electeur` varchar(50) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `bureau_vote` varchar(50) NOT NULL,
  `code_authentification` varchar(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_carte_identite` (`numero_carte_identite`),
  UNIQUE KEY `numero_carte_electeur` (`numero_carte_electeur`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `electeurs`
--

LOCK TABLES `electeurs` WRITE;
/*!40000 ALTER TABLE `electeurs` DISABLE KEYS */;
INSERT INTO `electeurs` VALUES (9,'Diouf','','1234567894523','789456123','777152774','ndeyemaremediouf27@gmail.com','2025-02-13 23:43:09','12','443126');
/*!40000 ALTER TABLE `electeurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_erreurs`
--

DROP TABLE IF EXISTS `logs_erreurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs_erreurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fichier_nom` varchar(255) DEFAULT NULL,
  `ligne` int(11) DEFAULT NULL,
  `message_erreur` text DEFAULT NULL,
  `date_erreur` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_erreurs`
--

LOCK TABLES `logs_erreurs` WRITE;
/*!40000 ALTER TABLE `logs_erreurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs_erreurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parrainages`
--

DROP TABLE IF EXISTS `parrainages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parrainages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `electeur_id` int(11) NOT NULL,
  `candidat_id` int(11) NOT NULL,
  `date_parrainage` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `electeur_id` (`electeur_id`),
  KEY `candidat_id` (`candidat_id`),
  CONSTRAINT `parrainages_ibfk_1` FOREIGN KEY (`electeur_id`) REFERENCES `electeurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `parrainages_ibfk_2` FOREIGN KEY (`candidat_id`) REFERENCES `candidats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parrainages`
--

LOCK TABLES `parrainages` WRITE;
/*!40000 ALTER TABLE `parrainages` DISABLE KEYS */;
/*!40000 ALTER TABLE `parrainages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temp_import_electeurs`
--

DROP TABLE IF EXISTS `temp_import_electeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_import_electeurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `numero_carte_identite` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `statut_import` enum('EN_ATTENTE','VALIDÉ','ERREUR') DEFAULT 'EN_ATTENTE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_import_electeurs`
--

LOCK TABLES `temp_import_electeurs` WRITE;
/*!40000 ALTER TABLE `temp_import_electeurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `temp_import_electeurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18 12:28:59
