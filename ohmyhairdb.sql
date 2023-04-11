-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Dim 28 Mai 2017 à 21:24
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `ohmyhairdb`
--

-- --------------------------------------------------------

--
-- Structure de la table `achat_client`
--

CREATE TABLE `achat_client` (
  `id` int(50) NOT NULL,
  `id_client` int(50) NOT NULL,
  `timestamp` date NOT NULL,
  `rabais` double NOT NULL DEFAULT '0',
  `paye_cash` tinyint(1) NOT NULL DEFAULT '1',
  `commentaire` varchar(200) NOT NULL,
  `supplement` double NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `achat_client_produits`
--

CREATE TABLE `achat_client_produits` (
  `id_achat_client` int(50) NOT NULL,
  `id_produit` int(50) NOT NULL,
  `quantite` int(50) NOT NULL DEFAULT '1',
  `rabais` double NOT NULL DEFAULT '0',
  `supplement` double NOT NULL DEFAULT '0',
  `commentaire` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `achat_client_services`
--

CREATE TABLE `achat_client_services` (
  `id_achat_client` int(11) NOT NULL,
  `id_service` int(11) NOT NULL,
  `rabais` double DEFAULT NULL,
  `supplement` double NOT NULL DEFAULT '0',
  `commentaire` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(50) NOT NULL,
  `nom_categorie` varchar(50) NOT NULL,
  `parent` int(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `categories`
--

INSERT INTO `categories` (`id`, `nom_categorie`, `parent`) VALUES
(1, 'Topchic', NULL),
(2, 'Colorance', NULL),
(3, 'Dualsenses', NULL),
(4, 'Styledesign', NULL),
(5, 'Autre', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `id` int(50) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `prenom` varchar(25) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `telephone` text,
  `email` text,
  `rue` text NOT NULL,
  `ville` text NOT NULL,
  `npa` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `clients`
--

INSERT INTO `clients` (`id`, `nom`, `prenom`, `date_naissance`, `telephone`, `email`, `rue`, `ville`, `npa`) VALUES
(1, 'Ventura Coelho', 'João Filipe', '1993-10-16', '0762182822', 'joaoventura93@outlook.com', 'Medergässli 11', 'Salvenach', 1794);

-- --------------------------------------------------------

--
-- Structure de la table `marques`
--

CREATE TABLE `marques` (
  `id` int(50) NOT NULL,
  `nom_marque` varchar(50) NOT NULL,
  `contact` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

CREATE TABLE `produits` (
  `id` int(100) NOT NULL,
  `nom_produit` varchar(50) NOT NULL,
  `prix` double DEFAULT '0',
  `quantite` int(50) DEFAULT '0',
  `marque` int(50) DEFAULT NULL,
  `categorie` int(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id` int(50) NOT NULL,
  `nom_service` varchar(100) NOT NULL,
  `prix` double NOT NULL,
  `longueur` int(11) NOT NULL DEFAULT '0' COMMENT '0=inconnu, 1=court, 2=mi-long, 3=long',
  `sexe` int(11) NOT NULL DEFAULT '0' COMMENT '0= inconnu, 1=Homme, 2=Femme',
  `enfant` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=Adulte, 1=enfant'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `services`
--

INSERT INTO `services` (`id`, `nom_service`, `prix`, `longueur`, `sexe`, `enfant`) VALUES
(1, 'Shampoing + coupe + mise en forme', 36, 0, 1, 0),
(2, 'Shampoing + coupe + mise en forme - Etudiant', 32, 0, 1, 0),
(3, 'Coupe sur cheveux propres + mise en forme', 33, 0, 1, 0),
(5, 'Coupe sur cheveux propres + mise en forme - Etudiant', 29, 0, 1, 0),
(6, 'Coloration', 30, 0, 1, 0),
(7, 'Coupe tondeuse', 23, 0, 1, 0),
(8, 'Coupe 0 à 5 ans', 16, 0, 0, 1),
(9, 'Coupe 6 à 10 ans - Fille', 26, 0, 2, 1),
(10, 'Coupe 6 à 10 ans - Garçon', 22, 0, 1, 1),
(11, 'Coupe 11 à 14 ans - Fille', 31, 0, 2, 1),
(12, 'Coupe 11 à 14 ans - Garçon', 26, 0, 1, 1),
(13, 'Coupe 15 à 18 ans - Fille', 34, 0, 2, 1),
(14, 'Coupe 15 à 18 ans - Garçon', 29, 0, 1, 1),
(15, 'Brushing - Court', 36, 1, 2, 0),
(16, 'Brushing - Mi-long', 41, 2, 2, 0),
(17, 'Brushing - Long', 46, 3, 2, 0),
(18, 'Coupe + Séchage - Court', 46, 1, 2, 0),
(19, 'Coupe + Séchage - Mi-long', 51, 2, 2, 0),
(20, 'Coupe + Séchage - Long', 56, 3, 2, 0),
(21, 'Coupe + Brushing - Court', 69, 1, 2, 0),
(22, 'Coupe + Brushing - Mi-long', 74, 2, 2, 0),
(23, 'Coupe + Brushing - Long', 79, 3, 2, 0),
(24, 'Couleur + Brushing - Court', 86, 1, 2, 0),
(25, 'Couleur + Brushing - Mi-long', 96, 2, 2, 0),
(26, 'Couleur + Brushing - Long', 106, 3, 2, 0),
(27, 'Couleur + Coupe + Brushing - Court', 118, 1, 2, 0),
(28, 'Couleur + Coupe + Brushing - Mi-long', 118, 2, 2, 0),
(29, 'Couleur + Coupe + Brushing - Long', 132, 3, 2, 0),
(30, 'Frange', 5, 0, 2, 0),
(31, 'Mèches - Court', 50, 1, 2, 0),
(32, 'Mèches - Mi-long', 60, 2, 2, 0),
(33, 'Mèches - Long', 70, 3, 2, 0),
(34, 'Mèches + Patine - Court', 60, 1, 2, 0),
(35, 'Mèches + Patine - Mi-long', 75, 2, 2, 0),
(36, 'Mèches + Patine - Long', 90, 3, 2, 0),
(37, 'Mèches à l\'unité', 3, 0, 2, 0),
(38, 'Ambré hair / Tie-dye', 60, 0, 2, 0),
(39, 'Chignon / Coiffage', 40, 0, 2, 0),
(40, 'Mise-en-plis - Court', 38, 1, 2, 0),
(41, 'Mise-en-plis - Mi-long', 42, 2, 2, 0),
(42, 'Mise-en-plis - Long', 46, 3, 2, 0),
(43, 'Permanente - Court', 64, 1, 2, 0),
(44, 'Permanente - Mi-long', 74, 2, 2, 0),
(45, 'Permanente - Long', 84, 3, 2, 0),
(46, 'Décoloration - Court', 60, 1, 2, 0),
(47, 'Décoloration - Mi-long', 70, 2, 2, 0),
(48, 'Décoloration - Long', 80, 3, 2, 0);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `achat_client`
--
ALTER TABLE `achat_client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `marques`
--
ALTER TABLE `marques`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `achat_client`
--
ALTER TABLE `achat_client`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `marques`
--
ALTER TABLE `marques`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
