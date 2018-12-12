-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2018 a las 19:35:25
-- Versión del servidor: 10.1.29-MariaDB
-- Versión de PHP: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebuk`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `usuario1` int(11) NOT NULL,
  `usuario2` int(11) NOT NULL,
  `confirmación` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`usuario1`, `usuario2`, `confirmación`) VALUES
(1, 2, NULL),
(1, 3, 1),
(1, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `pregunta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `pregunta`) VALUES
(1, '¿Como se llamaba el primer barco de la Banda de Sombrero de Paja(Mugiwara no Ichimi)?'),
(2, '¿Cuantas espadas lleva Zoro Roronoa?'),
(3, '¿Cuantos tripulates forman la Banda de Sombrero de Paja(Mugiwara no Ichimi)?'),
(4, '¿Cuantas frutas del diablo(Akuma no Mi) controla Barbanegra(Kurohige)?'),
(5, '¿Que fruta del diablo(Akuma no Mi) se comio Monkey D. Luffy?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `idPregunta` int(11) NOT NULL,
  `idRespuesta` int(11) NOT NULL,
  `respuesta` varchar(500) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `respuestas`
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
(5, 10, 'Ito Ito no Mi');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
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
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `contraseña`, `nombre`, `sexo`, `fecha`, `imagen`, `puntos`) VALUES
(1, 'usuario@ucm.es', '123456', 'Luffy Monkey D.', 'Masculino', '1999-12-05', 'OnePieceWallpaper.jpg', 0),
(2, 'luffysenpai@gmail.com', '123456', 'Boa Hancock', 'Femenino', '1999-12-22', 'OnePieceWallpaper2.jpg', 0),
(3, 'naveganteSunny@hotmail.com', '123456', 'Nami', 'Femenino', '1999-12-04', 'OnePieceWallpaper3.jpg', 0),
(4, 'elGranShogekin@gmail.com', '123456', 'El Dios Usoop', 'Masculino', '1999-12-23', 'OnePieceWallpaper4.jpg', 0),
(5, 'vivaeldulce@gmail.com', '123456', 'Chopper', 'Otro', '1999-12-01', 'OnePieceWallpaper1.jpg', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`usuario1`,`usuario2`) USING BTREE,
  ADD KEY `usuario1_2` (`usuario1`,`usuario2`),
  ADD KEY `amigos_ibfk_2` (`usuario2`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`idRespuesta`),
  ADD KEY `idPregunta` (`idPregunta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `idRespuesta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `amigos_ibfk_1` FOREIGN KEY (`usuario1`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `amigos_ibfk_2` FOREIGN KEY (`usuario2`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `preguntas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
