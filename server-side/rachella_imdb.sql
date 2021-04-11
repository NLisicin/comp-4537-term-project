-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 10, 2021 at 11:11 PM
-- Server version: 5.7.33-log
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rachella_imdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `apiKey`
--

CREATE TABLE `apiKey` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `stat` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `apiKey`
--

INSERT INTO `apiKey` (`id`, `user_id`, `api_key`, `stat`, `description`) VALUES
(1, 1, 'shoopapikey', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `endpointCounts`
--

CREATE TABLE `endpointCounts` (
  `id` int(11) NOT NULL,
  `method` enum('GET','POST','PUT','DELETE') DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Game`
--

CREATE TABLE `Game` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `release_date` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Movie`
--

CREATE TABLE `Movie` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `director` varchar(255) DEFAULT NULL,
  `writer` varchar(255) DEFAULT NULL,
  `release_date` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `runtime` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Review`
--

CREATE TABLE `Review` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `show_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Table structure for table `TVShow`
--

CREATE TABLE `TVShow` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `director` varchar(255) DEFAULT NULL,
  `seasons` int(11) DEFAULT NULL,
  `release_date` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `username`, `password`) VALUES
(2, 'user', '$2b$10$h.MMj4nvQeqw8c2MeA3wkucaJEwpGxTjdIf8V52NIX2vC79ZKHc1K');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apiKey`
--
ALTER TABLE `apiKey`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `endpointCounts`
--
ALTER TABLE `endpointCounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Game`
--
ALTER TABLE `Game`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Movie`
--
ALTER TABLE `Movie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Review`
--
ALTER TABLE `Review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `game_id` (`game_id`),
  ADD KEY `show_id` (`show_id`);

--
-- Indexes for table `TVShow`
--
ALTER TABLE `TVShow`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apiKey`
--
ALTER TABLE `apiKey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `endpointCounts`
--
ALTER TABLE `endpointCounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `Game`
--
ALTER TABLE `Game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Movie`
--
ALTER TABLE `Movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `Review`
--
ALTER TABLE `Review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `TVShow`
--
ALTER TABLE `TVShow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
