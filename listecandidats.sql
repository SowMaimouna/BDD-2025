-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: projet_base_donnees
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

--
-- Table structure for table `candidats`
--

DROP TABLE IF EXISTS `candidats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numCarteElecteur` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `parti` varchar(255) DEFAULT NULL,
  `slogan` text DEFAULT NULL,
  `couleur1` varchar(7) DEFAULT NULL,
  `couleur2` varchar(7) DEFAULT NULL,
  `couleur3` varchar(7) DEFAULT NULL,
  `urlInfo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidats`
--

LOCK TABLES `candidats` WRITE;
/*!40000 ALTER TABLE `candidats` DISABLE KEYS */;
INSERT INTO `candidats` VALUES (1,'123456','candidat@example.com','123456789','Parti Exemple','Mon slogan','#ff0000','#00ff00','#0000ff','http://mon-candidat.com'),(2,'123456','h2@gm.com','555','dd','','','','',''),(3,'789012','lgrad@gmail.com','331234567','mackysall','guemsabop','','','','indisponible ');
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
  `numCarteElecteur` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `registered` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numCarteElecteur` (`numCarteElecteur`),
  UNIQUE KEY `unique_numCarteElecteur` (`numCarteElecteur`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `electeurs`
--

LOCK TABLES `electeurs` WRITE;
/*!40000 ALTER TABLE `electeurs` DISABLE KEYS */;
INSERT INTO `electeurs` VALUES (1,'123456','DUPONT','Jean','1990-01-01',0),(2,'789012','LEGRAND','Marie','1985-05-15',0),(3,'345678','DURAND','Paul','1992-09-30',0),(4,'123456789','Diallo','Mamadou','1985-03-12',0),(5,'321654987','Diop','Khady','1995-06-17',0),(6,'987654321','Ndiaye','Awa','1992-07-25',0),(7,'456789123','Faye','Amadou','1978-11-05',0),(8,'654321987','Ba','Ibrahima','1990-02-09',0);
/*!40000 ALTER TABLE `electeurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parrainage`
--

DROP TABLE IF EXISTS `parrainage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parrainage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parrainage`
--

LOCK TABLES `parrainage` WRITE;
/*!40000 ALTER TABLE `parrainage` DISABLE KEYS */;
INSERT INTO `parrainage` VALUES (1,'2025-12-12','2026-01-12');
/*!40000 ALTER TABLE `parrainage` ENABLE KEYS */;
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
  CONSTRAINT `parrainages_ibfk_1` FOREIGN KEY (`electeur_id`) REFERENCES `electeurs` (`id`),
  CONSTRAINT `parrainages_ibfk_2` FOREIGN KEY (`candidat_id`) REFERENCES `candidats` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parrainages`
--

LOCK TABLES `parrainages` WRITE;
/*!40000 ALTER TABLE `parrainages` DISABLE KEYS */;
/*!40000 ALTER TABLE `parrainages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-22 17:39:35
