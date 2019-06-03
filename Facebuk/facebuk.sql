-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2019 at 05:02 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facebuk`
--

-- --------------------------------------------------------

--
-- Table structure for table `amigos`
--

CREATE TABLE `amigos` (
  `usuario1` int(11) NOT NULL,
  `usuario2` int(11) NOT NULL,
  `confirmación` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `amigos`
--

INSERT INTO `amigos` (`usuario1`, `usuario2`, `confirmación`) VALUES
(1, 2, NULL),
(1, 3, 1),
(1, 5, 1),
(4, 1, 1),
(6, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `pregunta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `preguntas`
--

INSERT INTO `preguntas` (`id`, `pregunta`) VALUES
(1, '¿Como se llamaba el primer barco de la Banda de Sombrero de Paja(Mugiwara no Ichimi)?'),
(2, '¿Cuantas espadas lleva Zoro Roronoa?'),
(3, '¿Cuantos tripulates forman la Banda de Sombrero de Paja(Mugiwara no Ichimi)?'),
(4, '¿Cuantas frutas del diablo(Akuma no Mi) controla Barbanegra(Kurohige)?'),
(5, '¿Que fruta del diablo(Akuma no Mi) se comio Monkey D. Luffy?'),
(12, 'Pregunta de prueba 01');

-- --------------------------------------------------------

--
-- Table structure for table `respuestas`
--

CREATE TABLE `respuestas` (
  `idPregunta` int(11) NOT NULL,
  `idRespuesta` int(11) NOT NULL,
  `respuesta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `respuestas`
--

INSERT INTO `respuestas` (`idPregunta`, `idRespuesta`, `respuesta`) VALUES
(1, 1, 'Going Merry'),
(1, 2, 'Baratie'),
(2, 3, '3'),
(4, 4, '2'),
(2, 5, '2'),
(4, 6, '5'),
(5, 7, 'Gomu Gomu no Mi'),
(3, 8, '10'),
(1, 9, 'Thousand Sunny'),
(5, 10, 'Ito Ito no Mi'),
(12, 35, 'Respuesta 01'),
(12, 36, 'Respuesta 02'),
(12, 37, 'Respuesta 03'),
(12, 38, 'Respuesta 04'),
(1, 39, 'Ni idea');

-- --------------------------------------------------------

--
-- Table structure for table `respuestas_usuarios`
--

CREATE TABLE `respuestas_usuarios` (
  `idPregunta` int(11) NOT NULL,
  `idRespuesta` int(11) NOT NULL,
  `idUsuarioPregunta` int(11) NOT NULL,
  `idUsuarioResponde` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `respuestas_usuarios`
--

INSERT INTO `respuestas_usuarios` (`idPregunta`, `idRespuesta`, `idUsuarioPregunta`, `idUsuarioResponde`) VALUES
(1, 1, 4, 1),
(1, 1, 4, 4),
(1, 2, 1, 5),
(1, 9, 4, 2),
(1, 39, 1, 1),
(2, 3, 1, 1),
(2, 5, 1, 2),
(3, 8, 3, 3),
(4, 4, 1, 1),
(4, 6, 1, 2),
(5, 7, 1, 1),
(5, 10, 1, 5),
(9, 24, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('S9P6bIXrDFEBngtbsKbXGs6KkPFnHbUp', 1559589188, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"usuario@ucm.es\",\"currentId\":1,\"currentPts\":0}'),
('picdYxPOcclkNdvDEjIchyH-H370ZCEc', 1559616710, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"usuario@ucm.es\",\"currentId\":1,\"currentPts\":0}');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `sexo` varchar(10) NOT NULL,
  `fecha` date NOT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `contraseña`, `nombre`, `sexo`, `fecha`, `imagen`, `puntos`) VALUES
(1, 'usuario@ucm.es', '123456', 'Luffy Monkey D.', 'Masculino', '1999-12-05', 'OnePieceWallpaper.jpg', 0),
(2, 'luffysenpai@gmail.com', '123456', 'Boa Hancock', 'Femenino', '1999-12-22', 'OnePieceWallpaper2.jpg', 0),
(3, 'naveganteSunny@hotmail.com', '123456', 'Nami', 'Femenino', '1999-12-04', 'OnePieceWallpaper3.jpg', 0),
(4, 'elGranShogekin@gmail.com', '123456', 'El Dios Usoop', 'Masculino', '1999-12-23', 'OnePieceWallpaper4.jpg', 0),
(5, 'vivaeldulce@gmail.com', '123456', 'Chopper', 'Otro', '1999-12-01', 'OnePieceWallpaper1.jpg', 0),
(6, 'prueba@mail.com', '123456', 'No se de One Piece', 'Otro', '1800-12-15', 'OnePieceWallpaper.jpg', 0),
(7, 'test@test.es', '123123', 'test01', 'Masculino', '2007-06-03', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`usuario1`,`usuario2`) USING BTREE,
  ADD KEY `usuario1_2` (`usuario1`,`usuario2`),
  ADD KEY `amigos_ibfk_2` (`usuario2`);

--
-- Indexes for table `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`idRespuesta`),
  ADD KEY `idPregunta` (`idPregunta`);

--
-- Indexes for table `respuestas_usuarios`
--
ALTER TABLE `respuestas_usuarios`
  ADD KEY `idPregunta` (`idPregunta`,`idRespuesta`,`idUsuarioPregunta`,`idUsuarioResponde`),
  ADD KEY `idUsuarioPregunta` (`idUsuarioPregunta`),
  ADD KEY `idUsuarioResponde` (`idUsuarioResponde`),
  ADD KEY `idRespuesta` (`idRespuesta`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `idRespuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `amigos_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `amigos_ibfk_2` FOREIGN KEY (`usuario2`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `preguntas` (`id`);

--
-- Constraints for table `respuestas_usuarios`
--
ALTER TABLE `respuestas_usuarios`
  ADD CONSTRAINT `respuestas_usuarios_ibfk_1` FOREIGN KEY (`idUsuarioPregunta`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `respuestas_usuarios_ibfk_2` FOREIGN KEY (`idUsuarioResponde`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `respuestas_usuarios_ibfk_3` FOREIGN KEY (`idPregunta`) REFERENCES `preguntas` (`id`),
  ADD CONSTRAINT `respuestas_usuarios_ibfk_4` FOREIGN KEY (`idRespuesta`) REFERENCES `respuestas` (`idRespuesta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
