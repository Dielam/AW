-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2018 at 08:30 PM
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
(1, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `pregunta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `respuestas`
--

CREATE TABLE `respuestas` (
  `idPregunta` int(11) NOT NULL,
  `idRespuesta` int(11) NOT NULL,
  `respuesta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

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
  `imagen` varchar(500) NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `contraseña`, `nombre`, `sexo`, `fecha`, `imagen`, `puntos`) VALUES
(1, 'usuario@ucm.es', '123456', 'Luffy Monkey D.', 'Masculino', '1999-12-05', 'OnePieceWallpaper1.jpg', 0),
(2, 'luffysenpai@gmail.com', '123456', 'Boa Hancock', 'Femenino', '1999-12-22', 'OnePieceWallpaper2.jpg', 0),
(3, 'naveganteSunny@hotmail.com', '123456', 'Nami', 'Femenino', '1999-12-04', 'OnePieceWallpaper3.jpg', 0),
(4, 'elGranShogekin@gmail.com', '123456', 'El Dios Usoop', 'Masculino', '1999-12-23', 'OnePieceWallpaper4.jpg', 0),
(5, 'vivaeldulce@gmail.com', '123456', 'Chopper', 'Otro', '1999-12-01', 'OnePieceWallpaper.jpg', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`usuario1`,`usuario2`) USING BTREE,
  ADD UNIQUE KEY `usuario1` (`usuario1`),
  ADD UNIQUE KEY `usuario2` (`usuario2`) USING BTREE;

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
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
