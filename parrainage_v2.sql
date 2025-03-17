-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 17 mars 2025 à 20:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `parrainage_v2`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','agent') NOT NULL DEFAULT 'agent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password_hash`, `role`) VALUES
(1, 'FatouFall', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'superadmin');

-- --------------------------------------------------------

--
-- Structure de la table `electeurs`
--

CREATE TABLE `electeurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `numero_carte_identite` varchar(50) NOT NULL,
  `numero_carte_electeur` varchar(50) NOT NULL,
  `bureau_vote` varchar(50) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `code_authentification` varchar(6) DEFAULT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_naissance` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `electeurs`
--

INSERT INTO `electeurs` (`id`, `nom`, `prenom`, `numero_carte_identite`, `numero_carte_electeur`, `bureau_vote`, `telephone`, `email`, `code_authentification`, `date_inscription`, `date_naissance`) VALUES
(1, 'Sow', NULL, '100123456', '123456789', '14', NULL, NULL, NULL, '2025-03-13 12:25:10', '1990-05-12'),
(2, 'Fall', NULL, '230654321', '234567890', '12', NULL, NULL, NULL, '2025-03-13 12:25:10', '1988-07-23'),
(3, 'Dione', NULL, '345987654', '345678901', '4', NULL, NULL, NULL, '2025-03-13 12:25:10', '1995-02-17'),
(4, 'Gueye', NULL, '456123789', '456789012', '2', NULL, NULL, NULL, '2025-03-13 12:25:10', '1992-11-30'),
(5, 'Ngom', NULL, '567321654', '567890123', '9', NULL, NULL, NULL, '2025-03-13 12:25:10', '1987-08-15'),
(6, 'Ba', NULL, '678654987', '678901234', '11', NULL, NULL, NULL, '2025-03-13 12:25:10', '1999-06-05'),
(7, 'Diop', NULL, '789456123', '789012345', '5', NULL, NULL, NULL, '2025-03-13 12:25:10', '1993-09-25'),
(8, 'Ba', NULL, '890789321', '890123456', '9', NULL, NULL, NULL, '2025-03-13 12:25:10', '2001-01-10'),
(9, 'Sow', NULL, '100123456', '123456789', '14', NULL, NULL, NULL, '2025-03-17 18:25:00', '1990-05-12'),
(10, 'Fall', NULL, '230654321', '234567890', '12', NULL, NULL, NULL, '2025-03-17 18:25:00', '1988-07-23'),
(11, 'Dione', NULL, '345987654', '345678901', '4', NULL, NULL, NULL, '2025-03-17 18:25:00', '1995-02-17'),
(12, 'Gueye', NULL, '456123789', '456789012', '2', NULL, NULL, NULL, '2025-03-17 18:25:00', '1992-11-30'),
(13, 'Ngom', NULL, '567321654', '567890123', '9', NULL, NULL, NULL, '2025-03-17 18:25:00', '1987-08-15'),
(14, 'Ba', NULL, '678654987', '678901234', '11', NULL, NULL, NULL, '2025-03-17 18:25:00', '1999-06-05'),
(15, 'Diop', NULL, '789456123', '789012345', '5', NULL, NULL, NULL, '2025-03-17 18:25:00', '1993-09-25'),
(16, 'Ba', NULL, '890789321', '890123456', '9', NULL, NULL, NULL, '2025-03-17 18:25:00', '2001-01-10');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `electeurs`
--
ALTER TABLE `electeurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `electeurs`
--
ALTER TABLE `electeurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
