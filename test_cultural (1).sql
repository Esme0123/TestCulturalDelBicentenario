-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-04-2025 a las 01:09:08
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `test_cultural`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'HISTORIA', ''),
(2, 'ARTE', ''),
(3, 'LITERATURA', ''),
(4, 'GASTRONOMÍA', ''),
(5, 'TRADICIONES', ''),
(6, 'HISTORIA', ''),
(7, 'ARTE', ''),
(8, 'LITERATURA', ''),
(9, 'GASTRONOMÍA', ''),
(10, 'TRADICIONES', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `desafios`
--

CREATE TABLE `desafios` (
  `id_desafio` bigint(20) UNSIGNED NOT NULL,
  `id_dificultad` bigint(20) UNSIGNED DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED DEFAULT NULL,
  `id_usuario_creador` bigint(20) UNSIGNED DEFAULT NULL,
  `id_usuario_retado` bigint(20) UNSIGNED DEFAULT NULL,
  `id_estado` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas_usuario`
--

CREATE TABLE `estadisticas_usuario` (
  `id_estadistica` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED DEFAULT NULL,
  `preguntas_totales` int(11) DEFAULT NULL,
  `respuestas_correctas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estado` bigint(20) UNSIGNED NOT NULL,
  `nombre_estado` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estado`, `nombre_estado`) VALUES
(1, 'PENDIENTE'),
(2, 'EN_PROGRESO'),
(3, 'TERMINADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_tests`
--

CREATE TABLE `historial_tests` (
  `id_historial` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL,
  `id_test` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `puntaje` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `duracion_segundos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insignias`
--

CREATE TABLE `insignias` (
  `id_insignia` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lecturas_videos`
--

CREATE TABLE `lecturas_videos` (
  `id_lectura` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(200) DEFAULT NULL,
  `tipo` enum('lectura','video') DEFAULT NULL,
  `url` text DEFAULT NULL,
  `id_pregunta` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveldificultad`
--

CREATE TABLE `niveldificultad` (
  `id_dificultad` bigint(20) UNSIGNED NOT NULL,
  `dificultad` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `niveldificultad`
--

INSERT INTO `niveldificultad` (`id_dificultad`, `dificultad`) VALUES
(1, 'BÁSICO'),
(2, 'INTERMEDIO'),
(3, 'AVANZADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id_pregunta` bigint(20) UNSIGNED NOT NULL,
  `textoPregunta` varchar(150) NOT NULL,
  `id_tipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id_pregunta`, `textoPregunta`, `id_tipo`) VALUES
(1, '¿En qué año se fundó Bolivia como república?', 1),
(2, 'La Guerra del Chaco ocurrió antes de la independencia de Bolivia.', 2),
(3, '¿Qué opinas sobre el legado de los héroes de la independencia?', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankingspuntajesaltos`
--

CREATE TABLE `rankingspuntajesaltos` (
  `id_ranking` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `id_resultado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestapreguntas`
--

CREATE TABLE `respuestapreguntas` (
  `id_resPreg` bigint(20) UNSIGNED NOT NULL,
  `id_respuesta` int(11) DEFAULT NULL,
  `id_pregunta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestapreguntas`
--

INSERT INTO `respuestapreguntas` (`id_resPreg`, `id_respuesta`, `id_pregunta`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `id_respuesta` bigint(20) UNSIGNED NOT NULL,
  `texto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`id_respuesta`, `texto`) VALUES
(1, '1825'),
(2, '1809'),
(3, '1830'),
(4, 'Verdadero'),
(5, 'Falso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestasusuario`
--

CREATE TABLE `respuestasusuario` (
  `id_resu` bigint(20) UNSIGNED NOT NULL,
  `id_respuesta` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_historial` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id_resultado` bigint(20) UNSIGNED NOT NULL,
  `id_resu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado_pregunta`
--

CREATE TABLE `resultado_pregunta` (
  `id_resultado_pregunta` bigint(20) UNSIGNED NOT NULL,
  `id_historial` bigint(20) UNSIGNED DEFAULT NULL,
  `id_pregunta` bigint(20) UNSIGNED DEFAULT NULL,
  `id_resu` bigint(20) UNSIGNED DEFAULT NULL,
  `es_correcta` tinyint(1) DEFAULT NULL,
  `explicacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tests`
--

CREATE TABLE `tests` (
  `id_test` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(30) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_dificultad` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `test_pregunta`
--

CREATE TABLE `test_pregunta` (
  `id_test_pregunta` bigint(20) UNSIGNED NOT NULL,
  `id_test` bigint(20) UNSIGNED DEFAULT NULL,
  `id_pregunta` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipopregunta`
--

CREATE TABLE `tipopregunta` (
  `id_tipo` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipopregunta`
--

INSERT INTO `tipopregunta` (`id_tipo`, `tipo`) VALUES
(1, 'OPCIÓN MÚLTIPLE'),
(2, 'VERDADERO/FALSO'),
(3, 'PREGUNTAS ABIERTAS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellidoPaterno` varchar(30) NOT NULL,
  `apellidoMaterno` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_user`, `nombre`, `apellidoPaterno`, `apellidoMaterno`, `email`, `contrasena`, `rol`) VALUES
(3, 'Esmeralda', 'Medina', 'Paredes', 'esme@gmail.com', '$2b$10$9GrGbxjw06kyC5lYoJAUIeq1UA753oUOWYkd9DtNAGfaoCEcIb24.', 'user'),
(4, 'Marco', 'Camacho', 'Aldunate', 'marco@gmail.com', '$2b$10$mn8uJamdjP2JhgcxUU9TDOTMNcGLV/K0BohxWrZgA/EyLbwfD6vqm', 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuariosinsignias`
--

CREATE TABLE `usuariosinsignias` (
  `id_user_insignia` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `id_insignia` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `desafios`
--
ALTER TABLE `desafios`
  ADD PRIMARY KEY (`id_desafio`),
  ADD KEY `id_dificultad` (`id_dificultad`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_usuario_creador` (`id_usuario_creador`),
  ADD KEY `id_usuario_retado` (`id_usuario_retado`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `estadisticas_usuario`
--
ALTER TABLE `estadisticas_usuario`
  ADD PRIMARY KEY (`id_estadistica`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `historial_tests`
--
ALTER TABLE `historial_tests`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_test` (`id_test`);

--
-- Indices de la tabla `insignias`
--
ALTER TABLE `insignias`
  ADD PRIMARY KEY (`id_insignia`);

--
-- Indices de la tabla `lecturas_videos`
--
ALTER TABLE `lecturas_videos`
  ADD PRIMARY KEY (`id_lectura`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `niveldificultad`
--
ALTER TABLE `niveldificultad`
  ADD PRIMARY KEY (`id_dificultad`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indices de la tabla `rankingspuntajesaltos`
--
ALTER TABLE `rankingspuntajesaltos`
  ADD PRIMARY KEY (`id_ranking`);

--
-- Indices de la tabla `respuestapreguntas`
--
ALTER TABLE `respuestapreguntas`
  ADD PRIMARY KEY (`id_resPreg`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`id_respuesta`);

--
-- Indices de la tabla `respuestasusuario`
--
ALTER TABLE `respuestasusuario`
  ADD PRIMARY KEY (`id_resu`),
  ADD KEY `fk_respuestasusuario_historial` (`id_historial`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id_resultado`);

--
-- Indices de la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  ADD PRIMARY KEY (`id_resultado_pregunta`),
  ADD KEY `id_historial` (`id_historial`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_resu` (`id_resu`);

--
-- Indices de la tabla `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id_test`),
  ADD KEY `fk_dificultad` (`id_dificultad`);

--
-- Indices de la tabla `test_pregunta`
--
ALTER TABLE `test_pregunta`
  ADD PRIMARY KEY (`id_test_pregunta`),
  ADD KEY `id_test` (`id_test`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `tipopregunta`
--
ALTER TABLE `tipopregunta`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_user`);

--
-- Indices de la tabla `usuariosinsignias`
--
ALTER TABLE `usuariosinsignias`
  ADD PRIMARY KEY (`id_user_insignia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `desafios`
--
ALTER TABLE `desafios`
  MODIFY `id_desafio` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadisticas_usuario`
--
ALTER TABLE `estadisticas_usuario`
  MODIFY `id_estadistica` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `historial_tests`
--
ALTER TABLE `historial_tests`
  MODIFY `id_historial` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `insignias`
--
ALTER TABLE `insignias`
  MODIFY `id_insignia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lecturas_videos`
--
ALTER TABLE `lecturas_videos`
  MODIFY `id_lectura` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `niveldificultad`
--
ALTER TABLE `niveldificultad`
  MODIFY `id_dificultad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `rankingspuntajesaltos`
--
ALTER TABLE `rankingspuntajesaltos`
  MODIFY `id_ranking` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestapreguntas`
--
ALTER TABLE `respuestapreguntas`
  MODIFY `id_resPreg` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id_respuesta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `respuestasusuario`
--
ALTER TABLE `respuestasusuario`
  MODIFY `id_resu` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id_resultado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  MODIFY `id_resultado_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tests`
--
ALTER TABLE `tests`
  MODIFY `id_test` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `test_pregunta`
--
ALTER TABLE `test_pregunta`
  MODIFY `id_test_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipopregunta`
--
ALTER TABLE `tipopregunta`
  MODIFY `id_tipo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_user` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuariosinsignias`
--
ALTER TABLE `usuariosinsignias`
  MODIFY `id_user_insignia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `desafios`
--
ALTER TABLE `desafios`
  ADD CONSTRAINT `desafios_ibfk_1` FOREIGN KEY (`id_dificultad`) REFERENCES `niveldificultad` (`id_dificultad`),
  ADD CONSTRAINT `desafios_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `desafios_ibfk_3` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_user`),
  ADD CONSTRAINT `desafios_ibfk_4` FOREIGN KEY (`id_usuario_retado`) REFERENCES `usuarios` (`id_user`),
  ADD CONSTRAINT `desafios_ibfk_5` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`);

--
-- Filtros para la tabla `estadisticas_usuario`
--
ALTER TABLE `estadisticas_usuario`
  ADD CONSTRAINT `estadisticas_usuario_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_user`),
  ADD CONSTRAINT `estadisticas_usuario_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);

--
-- Filtros para la tabla `historial_tests`
--
ALTER TABLE `historial_tests`
  ADD CONSTRAINT `historial_tests_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_user`),
  ADD CONSTRAINT `historial_tests_ibfk_2` FOREIGN KEY (`id_test`) REFERENCES `tests` (`id_test`);

--
-- Filtros para la tabla `lecturas_videos`
--
ALTER TABLE `lecturas_videos`
  ADD CONSTRAINT `lecturas_videos_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`);

--
-- Filtros para la tabla `respuestasusuario`
--
ALTER TABLE `respuestasusuario`
  ADD CONSTRAINT `fk_respuestasusuario_historial` FOREIGN KEY (`id_historial`) REFERENCES `historial_tests` (`id_historial`);

--
-- Filtros para la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  ADD CONSTRAINT `resultado_pregunta_ibfk_1` FOREIGN KEY (`id_historial`) REFERENCES `historial_tests` (`id_historial`),
  ADD CONSTRAINT `resultado_pregunta_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`),
  ADD CONSTRAINT `resultado_pregunta_ibfk_3` FOREIGN KEY (`id_resu`) REFERENCES `respuestasusuario` (`id_resu`);

--
-- Filtros para la tabla `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `fk_dificultad` FOREIGN KEY (`id_dificultad`) REFERENCES `niveldificultad` (`id_dificultad`);

--
-- Filtros para la tabla `test_pregunta`
--
ALTER TABLE `test_pregunta`
  ADD CONSTRAINT `test_pregunta_ibfk_1` FOREIGN KEY (`id_test`) REFERENCES `tests` (`id_test`),
  ADD CONSTRAINT `test_pregunta_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
