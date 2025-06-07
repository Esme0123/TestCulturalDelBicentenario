-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-06-2025 a las 07:36:26
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
-- Base de datos: `test`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Historia', 'Preguntas sobre la historia de Bolivia, incluyendo temas importantes que cada ciudadano debería de saber.'),
(2, 'Geografía', 'Preguntas sobre los aspectos geográficos de Bolivia.'),
(3, 'Cultura', 'Preguntas sobre la cultura boliviana. Una parte de nuestra identidad.'),
(4, 'Bicentenario', 'Preguntas sobre los eventos, personajes y conmemoraciones del país.'),
(5, 'Política', 'Preguntas sobre la historia política de Bolivia, de datos recientes y anteriores.'),
(6, 'Economía', 'Preguntas sobre la economía de Bolivia y su evolución en el transcurso de los años.'),
(7, 'Arte y Literatura', 'Preguntas sobre el arte y la literatura boliviana.'),
(8, 'Ciencia y Tecnología', 'Preguntas sobre los avances científicos y tecnológicos en nuestro país.');

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
  `fecha_fin` datetime DEFAULT NULL,
  `id_test_base` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `desafios`
--

INSERT INTO `desafios` (`id_desafio`, `id_dificultad`, `id_categoria`, `id_usuario_creador`, `id_usuario_retado`, `id_estado`, `fecha_inicio`, `fecha_fin`, `id_test_base`) VALUES
(1, 2, 1, 3, 4, 2, '2025-05-10 20:47:58', NULL, 2),
(2, 1, 2, 3, 4, 1, '2025-05-25 21:23:23', NULL, 2),
(3, 1, 3, 3, 5, 1, '2025-05-26 13:14:08', NULL, 4),
(4, 1, 3, 7, 3, 2, '2025-05-26 13:19:36', NULL, 4),
(5, 2, 1, 3, 7, 2, '2025-05-26 13:30:29', NULL, 2),
(6, 2, 1, 3, 7, 2, '2025-05-26 14:43:18', NULL, 3),
(7, 2, 1, 7, 3, 2, '2025-05-26 15:24:00', NULL, 3),
(8, 1, 3, 7, 3, 2, '2025-05-26 15:50:40', NULL, 4),
(9, 2, 1, 3, 7, 2, '2025-05-26 16:26:43', NULL, 2),
(10, 2, 1, 3, 7, 3, '2025-05-26 16:32:28', '2025-05-26 16:32:41', 2),
(11, 2, 1, 3, 7, 2, '2025-05-26 16:41:14', NULL, 3),
(12, 1, 3, 7, 3, 2, '2025-05-26 23:29:32', NULL, 4),
(13, 2, 1, 3, 7, 2, '2025-05-26 23:40:18', NULL, 3),
(14, 1, 3, 3, 4, 1, '2025-06-06 14:51:27', NULL, 4),
(15, 1, 3, 8, 3, 2, '2025-06-06 14:55:19', NULL, 4),
(16, 2, 5, 8, 3, 2, '2025-06-06 22:02:42', NULL, 5),
(17, 2, 1, 3, 8, 2, '2025-06-06 22:08:04', NULL, 2),
(18, 2, 5, 10, 3, 2, '2025-06-06 22:50:13', NULL, 5),
(19, 1, 3, 3, 10, 2, '2025-06-06 23:49:02', NULL, 4),
(20, 1, 3, 10, 3, 2, '2025-06-06 23:51:54', NULL, 4),
(21, 1, 3, 10, 3, 2, '2025-06-07 00:31:15', NULL, 4),
(22, 2, 1, 3, 10, 5, '2025-06-07 00:46:57', '2025-06-07 00:51:46', 2),
(23, 2, 1, 10, 3, 5, '2025-06-07 01:16:12', '2025-06-07 01:16:50', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `desafio_preguntas`
--

CREATE TABLE `desafio_preguntas` (
  `id_desafio` bigint(20) UNSIGNED NOT NULL,
  `id_pregunta` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `desafio_preguntas`
--

INSERT INTO `desafio_preguntas` (`id_desafio`, `id_pregunta`) VALUES
(13, 5),
(13, 6),
(13, 7),
(13, 8),
(13, 9),
(14, 15),
(14, 16),
(14, 17),
(14, 18),
(14, 19),
(15, 15),
(15, 16),
(15, 17),
(15, 18),
(15, 19),
(16, 25),
(16, 26),
(16, 27),
(16, 28),
(16, 29),
(16, 30),
(16, 31),
(16, 32),
(16, 33),
(16, 34),
(17, 1),
(17, 2),
(17, 3),
(17, 4),
(17, 85),
(18, 25),
(18, 26),
(18, 27),
(18, 28),
(18, 29),
(18, 30),
(18, 31),
(18, 32),
(18, 33),
(18, 34),
(19, 15),
(19, 16),
(19, 17),
(19, 18),
(19, 19),
(19, 20),
(19, 21),
(19, 22),
(19, 23),
(19, 24),
(20, 15),
(20, 16),
(20, 17),
(20, 18),
(20, 19),
(20, 20),
(20, 21),
(20, 22),
(20, 23),
(20, 24),
(21, 15),
(21, 16),
(21, 17),
(21, 18),
(21, 19),
(21, 20),
(21, 21),
(21, 22),
(21, 23),
(21, 24),
(22, 1),
(22, 2),
(22, 3),
(22, 4),
(22, 85),
(23, 1),
(23, 2),
(23, 3),
(23, 4),
(23, 85);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `desafio_resultados`
--

CREATE TABLE `desafio_resultados` (
  `id_resultado` int(11) NOT NULL,
  `id_desafio` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `puntaje` int(11) NOT NULL DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `desafio_resultados`
--

INSERT INTO `desafio_resultados` (`id_resultado`, `id_desafio`, `id_user`, `puntaje`, `fecha`) VALUES
(1, 22, 3, 80, '2025-06-07 04:47:37'),
(2, 22, 10, 40, '2025-06-07 04:47:41'),
(6, 23, 3, 30, '2025-06-07 05:16:49'),
(7, 23, 10, 20, '2025-06-07 05:16:50');

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

--
-- Volcado de datos para la tabla `estadisticas_usuario`
--

INSERT INTO `estadisticas_usuario` (`id_estadistica`, `id_user`, `id_categoria`, `preguntas_totales`, `respuestas_correctas`) VALUES
(1, 3, 1, 3, 0),
(2, 3, 8, 8, 1),
(3, 3, 8, 8, 1),
(4, 3, 8, 8, 2),
(5, 3, 1, 3, 1),
(6, 8, 5, 5, 1),
(7, 8, 4, 10, 7),
(8, 8, 4, 10, 9),
(9, 8, 1, 4, 4),
(10, 8, 5, 10, 7),
(11, 8, 4, 10, 10),
(12, 8, 8, 10, 4),
(13, 8, 5, 10, 10),
(14, 10, 1, 4, 2);

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
(3, 'RECHAZADO'),
(4, 'CANCELADO'),
(5, 'FINALIZADO');

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

--
-- Volcado de datos para la tabla `historial_tests`
--

INSERT INTO `historial_tests` (`id_historial`, `id_user`, `id_test`, `fecha`, `puntaje`, `total`, `duracion_segundos`) VALUES
(1, 3, 2, '2025-05-11 00:11:28', 0, 3, 180),
(2, 3, 2, '2025-05-26 01:23:23', 1, 1, 120),
(3, 3, 9, '2025-05-26 02:17:39', 10, 8, 13),
(4, 3, 9, '2025-05-26 02:36:30', 10, 8, 11),
(5, 3, 9, '2025-05-26 16:40:56', 20, 8, 28),
(6, 3, 2, '2025-06-06 18:50:21', 10, 3, 28),
(7, 8, 5, '2025-06-06 19:15:10', 10, 5, 440),
(8, 8, 10, '2025-06-06 22:59:36', 70, 10, 58),
(9, 8, 10, '2025-06-06 23:06:30', 90, 10, 39),
(10, 8, 2, '2025-06-06 23:13:25', 40, 4, 21),
(11, 8, 5, '2025-06-06 23:16:23', 70, 10, 59),
(12, 8, 10, '2025-06-07 01:05:49', 100, 10, 44),
(13, 8, 9, '2025-06-07 01:08:13', 40, 10, 117),
(14, 8, 5, '2025-06-07 01:10:41', 100, 10, 60),
(15, 10, 2, '2025-06-07 03:51:40', 20, 4, 11),
(16, 3, 2, '2025-06-07 04:47:37', 40, 50, 40),
(17, 10, 2, '2025-06-07 04:47:41', 10, 50, 44),
(18, 3, 2, '2025-06-07 04:47:45', 40, 50, 49),
(19, 10, 2, '2025-06-07 04:51:37', 40, 50, 281),
(20, 3, 2, '2025-06-07 04:51:46', 80, 50, 289),
(21, 3, 2, '2025-06-07 05:16:49', 30, 50, 38),
(22, 10, 2, '2025-06-07 05:16:50', 20, 50, 39);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insignias`
--

CREATE TABLE `insignias` (
  `id_insignia` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `insignias`
--

INSERT INTO `insignias` (`id_insignia`, `nombre`, `descripcion`) VALUES
(1, 'Primer Test', 'Completar el primer test con éxito'),
(2, 'Buen Puntaje', 'Obtener más del 80% de aciertos');

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

--
-- Volcado de datos para la tabla `lecturas_videos`
--

INSERT INTO `lecturas_videos` (`id_lectura`, `titulo`, `tipo`, `url`, `id_pregunta`) VALUES
(1, 'Lectura: Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 1),
(2, 'Video: Independencia de Bolivia en minutos', 'video', 'https://www.youtube.com/watch?v=ZyuxH9edpfo', 1),
(3, 'Lectura: Guerra del Chaco', 'lectura', 'https://es.wikipedia.org/wiki/Guerra_del_Chaco', 2),
(4, 'Video: La Guerra del Chaco en 10 minutos', 'video', 'https://www.youtube.com/watch?v=hvpfXrLd1SY', 2),
(5, 'Lectura: Simón Bolívar', 'lectura', 'https://es.wikipedia.org/wiki/Sim%C3%B3n_Bol%C3%ADvar', 3),
(6, 'Lectura: Juana Azurduy', 'lectura', 'https://es.wikipedia.org/wiki/Juana_Azurduy', 3),
(7, 'Lectura: Antonio José de Sucre', 'lectura', 'https://es.wikipedia.org/wiki/Antonio_Jos%C3%A9_de_Sucre', 3),
(8, 'Lectura: Fundación de La Paz', 'lectura', 'https://es.wikipedia.org/wiki/La_Paz_(Bolivia)', 4),
(9, 'Lectura: Guerra de la Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Guerra_de_la_Independencia_de_Bolivia', 5),
(10, 'Lectura: Simón Bolívar', 'lectura', 'https://es.wikipedia.org/wiki/Sim%C3%B3n_Bol%C3%ADvar', 6),
(11, 'Lectura: Declaración de Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 7),
(12, 'Lectura: Símbolos Patrios de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/S%C3%ADmbolos_de_Bolivia', 8),
(13, 'Lectura: Declaración de Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 9),
(14, 'Lectura: Declaración de Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 10),
(15, 'Lectura: Guerra del Chaco', 'lectura', 'https://es.wikipedia.org/wiki/Guerra_del_Chaco', 11),
(16, 'Lectura: Simón Bolívar', 'lectura', 'https://es.wikipedia.org/wiki/Sim%C3%B3n_Bol%C3%ADvar', 12),
(17, 'Lectura: Símbolos Patrios de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/S%C3%ADmbolos_de_Bolivia', 13),
(18, 'Lectura: Bicentenario de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 14),
(19, 'Lectura: Diablada', 'lectura', 'https://es.wikipedia.org/wiki/Diablada', 15),
(20, 'Lectura: Carnaval de Oruro', 'lectura', 'https://es.wikipedia.org/wiki/Carnaval_de_Oruro', 16),
(21, 'Lectura: Llama (animal)', 'lectura', 'https://es.wikipedia.org/wiki/Lama_glama', 17),
(22, 'Lectura: Cultura Tiahuanaco', 'lectura', 'https://es.wikipedia.org/wiki/Tiwanaku', 18),
(23, 'Lectura: Pan de arroz en Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Gastronom%C3%ADa_de_Bolivia', 19),
(24, 'Lectura: Literatura de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Literatura_de_Bolivia', 20),
(25, 'Lectura: Carnaval de Oruro', 'lectura', 'https://es.wikipedia.org/wiki/Carnaval_de_Oruro', 21),
(26, 'Lectura: Música andina', 'lectura', 'https://es.wikipedia.org/wiki/M%C3%BAsica_andina', 22),
(27, 'Lectura: Muralismo boliviano', 'lectura', 'https://es.wikipedia.org/wiki/Arte_de_Bolivia', 23),
(28, 'Lectura: Cultura de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Cultura_de_Bolivia', 24),
(29, 'Lectura: Antonio José de Sucre', 'lectura', 'https://es.wikipedia.org/wiki/Antonio_Jos%C3%A9_de_Sucre', 25),
(30, 'Lectura: Historia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Historia_de_Bolivia', 26),
(31, 'Lectura: Evo Morales', 'lectura', 'https://es.wikipedia.org/wiki/Evo_Morales', 27),
(32, 'Lectura: Ley del Voto Universal', 'lectura', 'https://es.wikipedia.org/wiki/Sufragio_en_Bolivia', 28),
(33, 'Lectura: Guerra del Pacífico', 'lectura', 'https://es.wikipedia.org/wiki/Guerra_del_Pac%C3%ADfico', 29),
(34, 'Lectura: Independencia de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Independencia_de_Bolivia', 30),
(35, 'Lectura: Revolución Nacional de 1952', 'lectura', 'https://es.wikipedia.org/wiki/Revoluci%C3%B3n_Nacional_de_1952', 31),
(36, 'Lectura: Evo Morales', 'lectura', 'https://es.wikipedia.org/wiki/Evo_Morales', 32),
(37, 'Lectura: Evo Morales', 'lectura', 'https://es.wikipedia.org/wiki/Evo_Morales', 33),
(38, 'Lectura: Evo Morales', 'lectura', 'https://es.wikipedia.org/wiki/Evo_Morales', 34),
(39, 'Lectura: Santa Cruz de la Sierra', 'lectura', 'https://es.wikipedia.org/wiki/Santa_Cruz_de_la_Sierra', 35),
(40, 'Lectura: Geografía de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Geograf%C3%ADa_de_Bolivia', 36),
(41, 'Lectura: Nevado Sajama', 'lectura', 'https://es.wikipedia.org/wiki/Nevado_Sajama', 37),
(42, 'Lectura: Geografía de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Geograf%C3%ADa_de_Bolivia', 38),
(43, 'Lectura: Lago Titicaca', 'lectura', 'https://es.wikipedia.org/wiki/Lago_Titicaca', 39),
(44, 'Lectura: Salar de Uyuni', 'lectura', 'https://es.wikipedia.org/wiki/Salar_de_Uyuni', 40),
(45, 'Lectura: Guerra del Pacífico', 'lectura', 'https://es.wikipedia.org/wiki/Guerra_del_Pac%C3%ADfico', 41),
(46, 'Lectura: Cochabamba', 'lectura', 'https://es.wikipedia.org/wiki/Cochabamba', 42),
(47, 'Lectura: Gran Chaco', 'lectura', 'https://es.wikipedia.org/wiki/Gran_Chaco', 43),
(48, 'Lectura: Capitales de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Capitales_de_Bolivia', 44),
(49, 'Lectura: Ricardo Jaimes Freyre', 'lectura', 'https://es.wikipedia.org/wiki/Ricardo_Jaimes_Freyre', 45),
(50, 'Lectura: Literatura de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Literatura_de_Bolivia', 46),
(51, 'Lectura: Víctor Montoya', 'lectura', 'https://es.wikipedia.org/wiki/V%C3%ADctor_Montoya', 47),
(52, 'Lectura: Blanca Wiethüchter', 'lectura', 'https://es.wikipedia.org/wiki/Blanca_Wieth%C3%BCchter', 48),
(53, 'Lectura: Miguel Alandia Pantoja', 'lectura', 'https://es.wikipedia.org/wiki/Miguel_Alandia_Pantoja', 49),
(54, 'Lectura: Edmundo Paz Soldán', 'lectura', 'https://es.wikipedia.org/wiki/Edmundo_Paz_Sold%C3%A1n', 50),
(55, 'Lectura: Diablada', 'lectura', 'https://es.wikipedia.org/wiki/Diablada', 51),
(56, 'Lectura: Carnaval de Oruro', 'lectura', 'https://es.wikipedia.org/wiki/Carnaval_de_Oruro', 52),
(57, 'Lectura: Sol de Pando', 'lectura', 'https://es.wikipedia.org/wiki/Sol_de_Pando', 53),
(58, 'Lectura: Juan José Flores', 'lectura', 'https://es.wikipedia.org/wiki/Juan_Jos%C3%A9_Flores', 54),
(59, 'Lectura: Economía de Bolivia', 'lectura', 'https://es.wikipedia.org/wiki/Econom%C3%ADa_de_Bolivia', 55);

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
  `id_tipo` bigint(20) UNSIGNED DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED DEFAULT NULL,
  `id_dificultad` bigint(20) UNSIGNED DEFAULT NULL,
  `explicacion` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id_pregunta`, `textoPregunta`, `id_tipo`, `id_categoria`, `id_dificultad`, `explicacion`) VALUES
(1, '¿En qué año se fundó Bolivia como república?', 1, 1, 1, NULL),
(2, 'La Guerra del Chaco ocurrió antes de la independencia de Bolivia.', 2, 1, 2, NULL),
(3, '¿Qué opinas sobre el legado de los héroes de la independencia?', 3, 1, 2, 'El legado de los héroes de la independencia de Bolivia es un tema complejo y de profundo valor para la identidad nacional. La lucha por la libertad, el sacrificio y la determinación de figuras como Simón Bolívar, Antonio José de Sucre y Juana Azurduy son recordados y celebrados, pero también hay perspectivas que cuestionan su papel en la independencia boliviana. '),
(4, '¿En qué año se fundó La Paz?', 1, 1, 1, NULL),
(5, '¿En qué año comenzó la Guerra de la Independencia en Bolivia?', 1, 1, 1, NULL),
(6, '¿Quién fue el principal líder de la lucha por la independencia de Bolivia?', 1, 1, 2, NULL),
(7, '¿Qué significó el 6 de agosto de 1825 para Bolivia?', 1, 1, 2, NULL),
(8, '¿Cuál es el principal símbolo de la independencia de Bolivia?', 1, 1, 1, NULL),
(9, '¿En qué año se proclamó la independencia de Bolivia?', 1, 1, 1, NULL),
(10, 'Bolivia declaró su independencia el 6 de agosto de 1825.', 2, 1, 1, NULL),
(11, 'La Guerra del Chaco fue la principal guerra que enfrentó Bolivia después de la independencia.', 2, 1, 2, NULL),
(12, 'El primer presidente de Bolivia fue Simón Bolívar.', 2, 1, 1, NULL),
(13, 'El Sol de Pando es el principal símbolo de la independencia de Bolivia.', 2, 1, 1, NULL),
(14, 'Bolivia celebró su Bicentenario de independencia en 2021.', 2, 4, 1, NULL),
(15, '¿Qué danza boliviana es conocida internacionalmente como parte del patrimonio cultural de Bolivia?', 1, 3, 1, NULL),
(16, '¿Cuál es el principal festival de música y danza que se celebra en Oruro?', 1, 3, 2, NULL),
(17, '¿La llama es un animal típico de las regiones andinas de Bolivia?', 2, 3, 1, NULL),
(18, '¿La cultura Tiahuanaco está vinculada con los orígenes de la civilización andina?', 2, 3, 2, NULL),
(19, '¿El pan de arroz es una de las comidas más tradicionales de Bolivia?', 2, 3, 1, NULL),
(20, '¿Qué famoso escritor boliviano recibió el Premio Nobel de Literatura?', 1, 3, 2, NULL),
(21, '¿En qué año se fundó el Carnaval de Oruro como Patrimonio de la Humanidad por la UNESCO?', 1, 3, 2, NULL),
(22, '¿La música tradicional andina es parte del patrimonio cultural de Bolivia?', 2, 3, 1, NULL),
(23, '¿La pintura muralista boliviana se ha visto influenciada por la Revolución Nacional de 1952?', 2, 3, 2, NULL),
(24, '¿La cultura boliviana ha preservado en gran medida sus tradiciones indígenas?', 2, 3, 1, NULL),
(25, '¿Quién fue el primer presidente constitucional de Bolivia?', 1, 5, 2, NULL),
(26, '¿En qué año se instauró la primera República en Bolivia?', 1, 5, 1, NULL),
(27, '¿Quién fue el presidente que promovió la nacionalización del gas y petróleo en Bolivia en 2006?', 1, 5, 2, NULL),
(28, '¿Qué ley boliviana instauró el voto universal?', 1, 5, 2, NULL),
(29, '¿Quién fue el presidente de Bolivia durante la Guerra del Pacífico?', 1, 5, 3, NULL),
(30, '¿Qué documento ratifica la independencia de Bolivia ante las naciones extranjeras?', 1, 5, 2, NULL),
(31, '¿Qué presidente de Bolivia impulsó el proceso de la Revolución Nacional de 1952?', 1, 5, 2, NULL),
(32, '¿En qué año Evo Morales asumió la presidencia de Bolivia por primera vez?', 1, 5, 1, NULL),
(33, '¿Cuántas veces fue reelegido Evo Morales como presidente de Bolivia?', 1, 5, 2, NULL),
(34, '¿Qué presidente boliviano fue conocido por su política de nacionalización de los recursos naturales?', 1, 5, 2, NULL),
(35, '¿Cuál es la ciudad más grande de Bolivia en términos de población?', 1, 2, 2, NULL),
(36, '¿Qué departamento de Bolivia limita con Brasil?', 3, 2, 2, 'Los departamentos de Bolivia que limitan con Brasil son Pando, Beni y Santa Cruz. '),
(37, '¿Cuál es el punto más alto de Bolivia?', 1, 2, 3, NULL),
(38, '¿Qué país no comparte frontera con Bolivia?', 1, 2, 1, NULL),
(39, '¿Cuál es el mayor lago de Bolivia en términos de volumen de agua?', 1, 2, 2, NULL),
(40, 'El Salar de Uyuni es el mayor desierto de sal del mundo.', 2, 2, 1, NULL),
(41, 'Bolivia tiene salida al mar gracias a la Guerra del Pacífico.', 2, 2, 2, NULL),
(42, 'La ciudad de Cochabamba es conocida como la “Ciudad Jardín de Bolivia”.', 2, 2, 2, NULL),
(43, 'El Chaco boliviano es un desierto de gran importancia ecológica y económica.', 2, 2, 2, NULL),
(44, 'La capital de Bolivia es Sucre, que es también la capital administrativa.', 2, 2, 1, NULL),
(45, '¿Quién es considerado el principal poeta boliviano del siglo XIX?', 1, 7, 2, NULL),
(46, '¿Qué movimiento literario estuvo presente en la literatura boliviana en la década de 1920?', 1, 7, 2, NULL),
(47, '¿Cuál de las siguientes obras es escrita por el autor boliviano Víctor Montoya?', 1, 7, 3, NULL),
(48, '¿Qué famosa autora boliviana fue galardonada con el Premio Nacional de Literatura en 2010?', 1, 7, 2, NULL),
(49, '¿Quién pintó el famoso mural \"El regreso de Túpac Katari\" en la ciudad de La Paz?', 1, 7, 3, NULL),
(50, 'El escritor boliviano Edmundo Paz Soldán es conocido por sus obras de literatura de ciencia ficción.', 2, 7, 2, NULL),
(51, 'La Diablada es una de las danzas más tradicionales y conocidas de Bolivia.', 2, 7, 1, NULL),
(52, 'El Carnaval de Oruro es reconocido por la UNESCO como Patrimonio Cultural de la Humanidad.', 2, 7, 2, NULL),
(53, 'El Sol de Pando es uno de los símbolos más representativos de Bolivia.', 2, 7, 2, NULL),
(54, 'El escritor boliviano Juan José Flores fue un referente literario del siglo XX.', 2, 7, 3, NULL),
(55, '¿Cuál es la principal fuente de ingresos para Bolivia?', 1, 6, 2, NULL),
(56, '¿Qué porcentaje de la población boliviana vive en áreas urbanas?', 1, 6, 2, NULL),
(57, '¿Cuál es la moneda oficial de Bolivia?', 1, 6, 1, NULL),
(58, '¿En qué año Bolivia nacionalizó el gas y petróleo?', 1, 6, 2, NULL),
(59, '¿Qué organismo internacional apoya el desarrollo económico de Bolivia?', 1, 6, 2, NULL),
(60, 'Bolivia es un país con economía basada principalmente en la minería y los recursos naturales.', 2, 6, 2, NULL),
(61, 'Bolivia tiene un acuerdo de libre comercio con la Unión Europea.', 2, 6, 3, NULL),
(62, 'El Producto Interno Bruto (PIB) de Bolivia ha aumentado significativamente en los últimos 10 años.', 2, 6, 2, NULL),
(63, 'Bolivia es un país miembro de la Organización Mundial del Comercio (OMC).', 2, 6, 3, NULL),
(64, 'El gobierno de Bolivia ha implementado políticas de nacionalización de recursos estratégicos, como el gas y petróleo.', 2, 6, 1, NULL),
(65, '¿Qué organismo internacional apoya la ciencia y la tecnología en Bolivia?', 1, 8, 2, NULL),
(66, '¿Cuál es el principal instituto de investigación científica en Bolivia?', 1, 8, 2, NULL),
(67, '¿En qué año se fundó la Universidad Mayor de San Andrés (UMSA) de La Paz?', 1, 8, 1, NULL),
(68, '¿Qué país contribuye con mayor tecnología espacial a Bolivia?', 1, 8, 2, NULL),
(69, '¿Qué avance tecnológico reciente ha impulsado Bolivia en el área de energía renovable?', 1, 8, 2, NULL),
(70, 'Bolivia ha lanzado su propio satélite de comunicaciones al espacio.', 2, 8, 2, NULL),
(71, 'La industria de los smartphones en Bolivia ha alcanzado altos niveles de producción.', 2, 8, 3, NULL),
(72, 'La red de internet en Bolivia se ha expandido a nivel nacional con cobertura total.', 2, 8, 2, NULL),
(73, 'Bolivia está desarrollando investigaciones sobre biotecnología para mejorar la producción agrícola.', 2, 8, 2, NULL),
(74, 'La biotecnología en Bolivia se centra principalmente en la producción de medicamentos.', 2, 8, 3, NULL),
(75, '¿En qué año se celebró el Bicentenario de la independencia de Bolivia?', 1, 4, 1, NULL),
(76, '¿Qué presidente boliviano participó activamente en la independencia de Bolivia?', 1, 4, 2, NULL),
(77, '¿En qué ciudad se firmó la declaración de independencia de Bolivia?', 1, 4, 2, NULL),
(78, '¿Qué evento clave sucedió en Bolivia en 2009?', 1, 4, 2, NULL),
(79, '¿Qué símbolo representa la unidad de Bolivia durante el Bicentenario?', 1, 4, 1, NULL),
(80, 'Bolivia fue una de las primeras naciones en América en independizarse del dominio colonial español.', 2, 4, 2, NULL),
(81, 'La Revolución Nacional de 1952 fue un evento importante en la historia del Bicentenario de Bolivia.', 2, 4, 2, NULL),
(82, 'El 7 de agosto de 1825 es la fecha exacta de la independencia de Bolivia.', 2, 4, 1, NULL),
(83, 'Bolivia celebrará su Bicentenario con un evento masivo en la Plaza Mayor de Sucre.', 2, 4, 2, NULL),
(84, 'La Constitución de 1825 fue el primer intento de crear un estado independiente en Bolivia.', 2, 4, 3, NULL),
(85, '¿Cuál es la capital administrativa de Bolivia?', 1, 2, 1, ''),
(86, 'En 2025, ¿Bolivia cumple 200 años?', 2, 4, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankingspuntajesaltos`
--

CREATE TABLE `rankingspuntajesaltos` (
  `id_ranking` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `id_resultado` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestapreguntas`
--

CREATE TABLE `respuestapreguntas` (
  `id_resPreg` bigint(20) UNSIGNED NOT NULL,
  `id_respuesta` bigint(20) UNSIGNED DEFAULT NULL,
  `id_pregunta` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestapreguntas`
--

INSERT INTO `respuestapreguntas` (`id_resPreg`, `id_respuesta`, `id_pregunta`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2),
(6, 15, 5),
(7, 18, 6),
(8, 21, 7),
(9, 24, 8),
(10, 27, 9),
(11, 30, 10),
(12, 31, 10),
(13, 4, 11),
(14, 5, 11),
(15, 30, 12),
(16, 31, 12),
(17, 30, 13),
(18, 31, 13),
(19, 30, 14),
(20, 31, 14),
(21, 40, 15),
(22, 41, 15),
(23, 42, 15),
(24, 43, 16),
(25, 44, 16),
(26, 45, 16),
(27, 4, 17),
(28, 5, 17),
(29, 4, 18),
(30, 5, 18),
(31, 4, 19),
(32, 5, 19),
(33, 52, 20),
(34, 53, 20),
(35, 54, 20),
(36, 55, 21),
(37, 56, 21),
(38, 57, 21),
(39, 4, 22),
(40, 5, 22),
(41, 4, 23),
(42, 5, 23),
(43, 4, 24),
(44, 5, 24),
(45, 64, 25),
(46, 65, 25),
(47, 66, 25),
(48, 67, 26),
(49, 68, 26),
(50, 69, 26),
(51, 70, 27),
(52, 71, 27),
(53, 72, 27),
(54, 73, 28),
(55, 74, 28),
(56, 75, 28),
(57, 76, 29),
(58, 77, 29),
(59, 78, 29),
(60, 79, 30),
(61, 80, 30),
(62, 81, 30),
(63, 82, 31),
(64, 83, 31),
(65, 84, 31),
(66, 85, 32),
(67, 86, 32),
(68, 87, 32),
(69, 88, 33),
(70, 89, 33),
(71, 90, 33),
(72, 91, 34),
(73, 92, 34),
(74, 93, 34),
(75, 95, 35),
(76, 94, 35),
(77, 96, 35),
(81, 101, 37),
(82, 100, 37),
(83, 102, 37),
(84, 104, 38),
(85, 103, 38),
(86, 105, 38),
(87, 106, 39),
(88, 107, 39),
(89, 108, 39),
(90, 30, 40),
(91, 31, 40),
(92, 30, 41),
(93, 31, 41),
(94, 4, 42),
(95, 5, 42),
(96, 4, 43),
(97, 5, 43),
(98, 137, 45),
(99, 138, 45),
(100, 139, 45),
(101, 140, 46),
(102, 141, 46),
(103, 142, 46),
(104, 143, 47),
(105, 144, 47),
(106, 145, 47),
(107, 146, 48),
(108, 147, 48),
(109, 148, 48),
(110, 149, 49),
(111, 150, 49),
(112, 151, 49),
(113, 4, 50),
(114, 5, 50),
(115, 4, 51),
(116, 5, 51),
(117, 4, 52),
(118, 5, 52),
(119, 158, 55),
(120, 159, 55),
(121, 160, 55),
(122, 161, 56),
(123, 162, 56),
(124, 163, 56),
(125, 164, 57),
(126, 165, 57),
(127, 166, 57),
(128, 167, 58),
(129, 168, 58),
(130, 169, 58),
(131, 170, 59),
(132, 171, 59),
(133, 172, 59),
(134, 4, 60),
(135, 5, 60),
(136, 4, 61),
(137, 5, 61),
(138, 4, 62),
(139, 5, 62),
(140, 4, 63),
(141, 5, 63),
(142, 181, 65),
(143, 182, 65),
(144, 183, 65),
(145, 184, 66),
(146, 185, 66),
(147, 186, 66),
(148, 187, 67),
(149, 188, 67),
(150, 189, 67),
(151, 190, 68),
(152, 191, 68),
(153, 192, 68),
(154, 193, 69),
(155, 194, 69),
(156, 195, 69),
(163, 202, 75),
(164, 203, 75),
(165, 204, 75),
(166, 205, 76),
(167, 206, 76),
(168, 207, 76),
(169, 208, 77),
(170, 209, 77),
(171, 210, 77),
(172, 211, 78),
(173, 212, 78),
(174, 213, 78),
(175, 214, 79),
(176, 215, 79),
(177, 216, 79),
(178, 4, 80),
(179, 5, 80),
(180, 4, 81),
(181, 5, 81),
(182, 30, 82),
(183, 31, 82),
(184, 4, 83),
(185, 5, 83),
(186, 227, 85),
(187, 226, 85),
(188, 225, 85),
(189, 6, 4),
(190, 7, 4),
(191, 8, 4),
(192, 16, 5),
(193, 17, 5),
(194, 19, 6),
(195, 20, 6),
(196, 22, 7),
(197, 23, 7),
(198, 25, 8),
(199, 26, 8),
(200, 28, 9),
(201, 29, 9),
(202, 30, 44),
(203, 31, 44),
(204, 30, 54),
(205, 31, 54),
(206, 30, 53),
(207, 31, 53),
(208, 4, 64),
(209, 5, 64),
(210, 4, 70),
(211, 5, 70),
(212, 30, 71),
(213, 31, 71),
(214, 30, 72),
(215, 31, 72),
(216, 4, 73),
(217, 5, 73),
(218, 30, 74),
(219, 31, 74),
(220, 4, 84),
(221, 5, 84),
(222, 228, 86),
(223, 229, 86);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `id_respuesta` bigint(20) UNSIGNED NOT NULL,
  `texto` varchar(100) NOT NULL,
  `es_correcta` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`id_respuesta`, `texto`, `es_correcta`) VALUES
(1, '1825', 1),
(2, '1809', 0),
(3, '1830', 0),
(4, 'Verdadero', 1),
(5, 'Falso', 0),
(6, '1538', 0),
(7, '1548', 1),
(8, '1605', 0),
(15, '1809', 1),
(16, '1825', 0),
(17, '1830', 0),
(18, 'Simón Bolívar', 1),
(19, 'Antonio José de Sucre', 0),
(20, 'Pedro Domingo Murillo', 0),
(21, 'Proclamación de independencia', 1),
(22, 'Fundación de La Paz', 0),
(23, 'Firma de la primera constitución', 0),
(24, 'La Bandera Tricolor', 1),
(25, 'La Diablada', 0),
(26, 'El Sol de Pando', 0),
(27, '1825', 1),
(28, '1809', 0),
(29, '1830', 0),
(30, 'Verdadero', 0),
(31, 'Falso', 1),
(40, 'La Diablada', 1),
(41, 'La Morenada', 0),
(42, 'El Tinku', 0),
(43, 'Carnaval de Oruro', 1),
(44, 'Fiesta de la Virgen de Copacabana', 0),
(45, 'Fiesta de la Virgen de La Candelaria', 0),
(52, 'Edmundo Paz Soldán', 0),
(53, 'Juan José Flores', 0),
(54, 'José de Mesa', 1),
(55, '2001', 1),
(56, '1998', 0),
(57, '2005', 0),
(64, 'Antonio José de Sucre', 1),
(65, 'Simón Bolívar', 0),
(66, 'José Manuel Pando', 0),
(67, '1825', 1),
(68, '1830', 0),
(69, '1809', 0),
(70, 'Evo Morales', 1),
(71, 'Carlos Mesa', 0),
(72, 'Jaime Paz Zamora', 0),
(73, 'Ley de Voto Universal de 1952', 1),
(74, 'Ley de Reforma Agraria de 1953', 0),
(75, 'Ley de Nacionalización del Gas', 0),
(76, 'Hilarión Daza', 1),
(77, 'José Ballivián', 0),
(78, 'Andrés de Santa Cruz', 0),
(79, 'La Constitución de 1826', 0),
(80, 'El Tratado de Paz y Amistad con Chile', 1),
(81, 'La Carta Magna de 1831', 0),
(82, 'Víctor Paz Estenssoro', 1),
(83, 'Carlos Mesa', 0),
(84, 'Evo Morales', 0),
(85, '2006', 1),
(86, '2002', 0),
(87, '2010', 0),
(88, 'Tres veces', 0),
(89, 'Cuatro veces', 0),
(90, 'Dos veces', 1),
(91, 'Evo Morales', 1),
(92, 'Carlos Mesa', 0),
(93, 'Hernán Siles Zuazo', 0),
(94, 'La Paz', 0),
(95, 'Santa Cruz', 1),
(96, 'Cochabamba', 0),
(100, 'Pico Sabaya', 1),
(101, 'Nevado Sajama', 0),
(102, 'Cerro Chacaltaya', 0),
(103, 'Perú', 0),
(104, 'Argentina', 0),
(105, 'Chile', 1),
(106, 'Lago Titicaca', 1),
(107, 'Lago Poopó', 0),
(108, 'Lago Uru Uru', 0),
(137, 'Ricardo Jaimes Freyre', 1),
(138, 'Eduardo Abaroa', 0),
(139, 'Juan de la Cruz', 0),
(140, 'Modernismo', 1),
(141, 'Realismo', 0),
(142, 'Naturalismo', 0),
(143, '“El hermano”', 0),
(144, '“Raza de Bronce”', 0),
(145, '“Las voces del viento”', 1),
(146, 'Giovanna Rivero', 1),
(147, 'María José Lanza', 0),
(148, 'Ana María Ríos', 0),
(149, 'Marcos Villegas', 0),
(150, 'Guillermo Aillón', 1),
(151, 'Roberto Mamani', 0),
(158, 'Gas y petróleo', 0),
(159, 'Agricultura', 0),
(160, 'Turismo', 1),
(161, '60%', 0),
(162, '50%', 0),
(163, '71%', 1),
(164, 'Boliviano', 0),
(165, 'Peso boliviano', 1),
(166, 'Dólar estadounidense', 0),
(167, '2006', 1),
(168, '2002', 0),
(169, '2010', 0),
(170, 'Fondo Monetario Internacional (FMI)', 1),
(171, 'Banco Mundial', 0),
(172, 'Banco Central de Bolivia', 0),
(181, 'Organismo Internacional de Energía Atómica (OIEA)', 0),
(182, 'UNICEF', 1),
(183, 'NASA', 0),
(184, 'Instituto Nacional de Ciencias de la Salud (INCS)', 0),
(185, 'Instituto Nacional de Innovación Agropecuaria y Forestal (INIAF)', 1),
(186, 'Centro de Investigación y Promoción del Campesinado (CIPCA)', 0),
(187, '1826', 0),
(188, '1830', 1),
(189, '1900', 0),
(190, 'China', 1),
(191, 'Estados Unidos', 0),
(192, 'Rusia', 0),
(193, 'Energía solar', 0),
(194, 'Energía geotérmica', 0),
(195, 'Energía nuclear', 1),
(202, '2021', 0),
(203, '1825', 0),
(204, '2025', 1),
(205, 'Simón Bolívar', 1),
(206, 'Carlos Mesa', 0),
(207, 'Hernán Siles Zuazo', 0),
(208, 'Sucre', 1),
(209, 'La Paz', 0),
(210, 'Cochabamba', 0),
(211, 'Aprobación de la nueva Constitución', 1),
(212, 'Firma del Tratado de Paz con Chile', 0),
(213, 'Fundación del Estado Plurinacional', 0),
(214, 'La bandera tricolor', 1),
(215, 'El sol de Pando', 0),
(216, 'La estrella roja', 0),
(217, 'Falso', 0),
(218, 'Verdadero', 0),
(219, 'Verdadero', 0),
(220, 'Falso', 1),
(221, 'Verdadero', 0),
(222, 'Falso', 0),
(223, 'Verdadero', 0),
(224, 'Falso', 0),
(225, 'La Paz', 1),
(226, 'Sucre', 0),
(227, 'Santa Cruz', 0),
(228, 'Verdadero', 1),
(229, 'Falso', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestasusuario`
--

CREATE TABLE `respuestasusuario` (
  `id_resu` bigint(20) UNSIGNED NOT NULL,
  `id_respuesta` bigint(20) UNSIGNED DEFAULT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL,
  `id_historial` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestasusuario`
--

INSERT INTO `respuestasusuario` (`id_resu`, `id_respuesta`, `id_user`, `id_historial`) VALUES
(1, 1, 3, 1),
(2, 5, 3, 1),
(3, 2, 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id_resultado` bigint(20) UNSIGNED NOT NULL,
  `id_resu` bigint(20) UNSIGNED DEFAULT NULL
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
  `explicacion` varchar(100) DEFAULT NULL,
  `texto_respuesta_abierta` varchar(100) DEFAULT NULL,
  `id_respuesta` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `resultado_pregunta`
--

INSERT INTO `resultado_pregunta` (`id_resultado_pregunta`, `id_historial`, `id_pregunta`, `id_resu`, `es_correcta`, `explicacion`, `texto_respuesta_abierta`, `id_respuesta`) VALUES
(1, 1, 1, NULL, 0, NULL, NULL, 1),
(3, 1, 2, NULL, 0, NULL, NULL, 5),
(13, 1, 1, 1, 1, NULL, NULL, 1),
(14, 1, 2, 2, 0, NULL, NULL, 5),
(15, 2, 85, 3, 1, NULL, NULL, 227),
(16, 3, 65, NULL, 0, NULL, NULL, 182),
(17, 3, 66, NULL, 0, NULL, NULL, 186),
(18, 3, 67, NULL, 0, NULL, NULL, 188),
(19, 3, 68, NULL, 0, NULL, NULL, 191),
(20, 3, 69, NULL, 0, NULL, NULL, 193),
(24, 4, 65, NULL, 0, NULL, NULL, 182),
(25, 4, 66, NULL, 1, NULL, NULL, 185),
(26, 4, 67, NULL, 0, NULL, NULL, 189),
(27, 4, 68, NULL, 0, NULL, NULL, 191),
(28, 4, 69, NULL, 0, NULL, NULL, 193),
(32, 5, 65, NULL, 0, NULL, NULL, 182),
(33, 5, 66, NULL, 0, NULL, NULL, 186),
(34, 5, 67, NULL, 0, NULL, NULL, 189),
(35, 5, 68, NULL, 0, NULL, NULL, 192),
(36, 5, 69, NULL, 1, NULL, NULL, 195),
(40, 6, 1, NULL, 1, NULL, NULL, 1),
(41, 6, 2, NULL, 0, NULL, NULL, 5),
(42, 6, 85, NULL, 0, 'La Paz es la capital administrativa.', NULL, 225),
(43, 7, 25, NULL, 1, NULL, NULL, 65),
(44, 7, 26, NULL, 0, NULL, NULL, 67),
(45, 7, 27, NULL, 0, NULL, NULL, 72),
(46, 7, 28, NULL, 0, NULL, NULL, 73),
(47, 7, 29, NULL, 0, NULL, NULL, 78),
(48, 8, 75, NULL, 1, NULL, NULL, 204),
(49, 8, 76, NULL, 1, NULL, NULL, 205),
(50, 8, 77, NULL, 0, NULL, NULL, 208),
(51, 8, 78, NULL, 1, NULL, NULL, 211),
(52, 8, 79, NULL, 0, NULL, NULL, 214),
(53, 8, 80, NULL, 1, NULL, NULL, 4),
(54, 8, 81, NULL, 1, NULL, NULL, 4),
(55, 8, 82, NULL, 1, NULL, NULL, 31),
(56, 8, 83, NULL, 0, NULL, NULL, 30),
(57, 8, 84, NULL, 1, NULL, NULL, 4),
(58, 9, 75, NULL, 1, NULL, NULL, 204),
(59, 9, 76, NULL, 1, NULL, NULL, 205),
(60, 9, 77, NULL, 1, NULL, NULL, 208),
(61, 9, 78, NULL, 1, NULL, NULL, 211),
(62, 9, 79, NULL, 1, NULL, NULL, 214),
(63, 9, 80, NULL, 0, NULL, NULL, 5),
(64, 9, 81, NULL, 1, NULL, NULL, 4),
(65, 9, 82, NULL, 1, NULL, NULL, 31),
(66, 9, 83, NULL, 1, NULL, NULL, 4),
(67, 9, 84, NULL, 1, NULL, NULL, 4),
(68, 10, 1, NULL, 1, NULL, NULL, 1),
(69, 10, 2, NULL, 1, NULL, NULL, 4),
(70, 10, 4, NULL, 1, NULL, NULL, 7),
(71, 10, 85, NULL, 1, '', NULL, 225),
(72, 11, 25, NULL, 1, NULL, NULL, 65),
(73, 11, 26, NULL, 0, NULL, NULL, 69),
(74, 11, 27, NULL, 1, NULL, NULL, 70),
(75, 11, 28, NULL, 0, NULL, NULL, 73),
(76, 11, 29, NULL, 1, NULL, NULL, 76),
(77, 11, 30, NULL, 1, NULL, NULL, 80),
(78, 11, 31, NULL, 1, NULL, NULL, 82),
(79, 11, 32, NULL, 1, NULL, NULL, 85),
(80, 11, 33, NULL, 0, NULL, NULL, 89),
(81, 11, 34, NULL, 1, NULL, NULL, 91),
(82, 12, 75, NULL, 1, NULL, NULL, 204),
(83, 12, 76, NULL, 1, NULL, NULL, 205),
(84, 12, 77, NULL, 1, NULL, NULL, 208),
(85, 12, 78, NULL, 1, NULL, NULL, 211),
(86, 12, 79, NULL, 1, NULL, NULL, 214),
(87, 12, 80, NULL, 1, NULL, NULL, 4),
(88, 12, 81, NULL, 1, NULL, NULL, 4),
(89, 12, 82, NULL, 1, NULL, NULL, 31),
(90, 12, 83, NULL, 1, NULL, NULL, 4),
(91, 12, 84, NULL, 1, NULL, NULL, 4),
(92, 13, 65, NULL, 1, NULL, NULL, 182),
(93, 13, 66, NULL, 0, NULL, NULL, 186),
(94, 13, 67, NULL, 1, NULL, NULL, 188),
(95, 13, 68, NULL, 0, NULL, NULL, 191),
(96, 13, 69, NULL, 0, NULL, NULL, 193),
(97, 13, 70, NULL, 1, NULL, NULL, 4),
(98, 13, 71, NULL, 0, NULL, NULL, 30),
(99, 13, 72, NULL, 1, NULL, NULL, 31),
(100, 13, 73, NULL, 0, NULL, NULL, 5),
(101, 13, 74, NULL, 0, NULL, NULL, 30),
(102, 14, 25, NULL, 1, NULL, NULL, 65),
(103, 14, 26, NULL, 1, NULL, NULL, 67),
(104, 14, 27, NULL, 1, NULL, NULL, 70),
(105, 14, 28, NULL, 1, NULL, NULL, 73),
(106, 14, 29, NULL, 1, NULL, NULL, 76),
(107, 14, 30, NULL, 1, NULL, NULL, 80),
(108, 14, 31, NULL, 1, NULL, NULL, 82),
(109, 14, 32, NULL, 1, NULL, NULL, 85),
(110, 14, 33, NULL, 1, NULL, NULL, 90),
(111, 14, 34, NULL, 1, NULL, NULL, 91),
(112, 15, 1, NULL, 1, NULL, NULL, 1),
(113, 15, 2, NULL, 0, NULL, NULL, 5),
(114, 15, 4, NULL, 1, NULL, NULL, 7),
(115, 15, 85, NULL, 0, '', NULL, 227),
(116, 21, 1, NULL, 1, NULL, NULL, 1),
(117, 21, 2, NULL, 1, NULL, NULL, 4),
(118, 21, 4, NULL, 0, NULL, NULL, 8),
(119, 21, 85, NULL, 1, NULL, NULL, 225),
(120, 22, 1, NULL, 0, NULL, NULL, 2),
(121, 22, 2, NULL, 1, NULL, NULL, 4),
(122, 22, 4, NULL, 1, NULL, NULL, 7),
(123, 22, 85, NULL, 0, NULL, NULL, 226);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tests`
--

CREATE TABLE `tests` (
  `id_test` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `id_dificultad` bigint(20) UNSIGNED DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED DEFAULT NULL,
  `es_personalizado` tinyint(1) DEFAULT NULL,
  `es_publico` tinyint(1) NOT NULL,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  `id_usuario_creador` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tests`
--

INSERT INTO `tests` (`id_test`, `nombre`, `descripcion`, `id_dificultad`, `id_categoria`, `es_personalizado`, `es_publico`, `fecha_creacion`, `id_usuario_creador`) VALUES
(2, 'Test Bicentenario Nivel Básico', 'Evaluación básica sobre la historia de Bolivia', 2, 1, 1, 1, '2025-05-13', NULL),
(3, 'Test sobre la independencia de Bolivia', 'Test sobre los eventos y figuras importantes de Bolivia', 2, 1, 1, 1, '2025-05-13', NULL),
(4, 'Test sobre la cultura boliviana', 'Test sobre las danzas, festivales y más', 1, 3, 1, 1, '2025-05-13', NULL),
(5, 'Test sobre la política boliviana', 'Test sobre la historia política', 2, 5, 1, 1, '2025-05-13', NULL),
(6, 'Test de Geografía de Bolivia', 'Test sobre la geografía de Bolivia', 2, 2, 1, 1, '2025-05-13', NULL),
(7, 'Test de Arte y Literatura', 'Test sobre la literatura, el arte y mucho más', 2, 7, 1, 1, '2025-05-13', NULL),
(8, 'Test de Economía de Bolivia', 'Test sobre la economía boliviana', 2, 6, 1, 1, '2025-05-13', NULL),
(9, 'Test de Ciencia y Tecnología', 'Test sobre los avances científicos en Bolivia', 2, 8, 1, 1, '2025-05-13', NULL),
(10, 'Test sobre el Bicentenario', 'Test sobre los eventos históricos de Bolivia', 2, 4, 1, 1, '2025-05-13', NULL),
(11, 'Test Bicentenario Básico', 'Test del bicentenario básico.', 1, 4, NULL, 1, '2025-06-07', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `test_pregunta`
--

CREATE TABLE `test_pregunta` (
  `id_test_pregunta` bigint(20) UNSIGNED NOT NULL,
  `id_test` bigint(20) UNSIGNED DEFAULT NULL,
  `id_pregunta` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `test_pregunta`
--

INSERT INTO `test_pregunta` (`id_test_pregunta`, `id_test`, `id_pregunta`) VALUES
(1, 2, 1),
(2, 2, 2),
(3, 2, 3),
(4, 3, 5),
(5, 3, 6),
(6, 3, 7),
(7, 3, 8),
(8, 3, 9),
(9, 4, 15),
(10, 4, 16),
(11, 4, 17),
(12, 4, 18),
(13, 4, 19),
(14, 5, 25),
(15, 5, 26),
(16, 5, 27),
(17, 5, 28),
(18, 5, 29),
(19, 6, 36),
(20, 6, 37),
(21, 6, 38),
(22, 6, 39),
(23, 5, 30),
(24, 5, 31),
(25, 5, 32),
(26, 5, 33),
(27, 5, 34),
(28, 6, 35),
(29, 7, 45),
(30, 7, 46),
(31, 7, 47),
(32, 7, 48),
(33, 7, 49),
(34, 7, 50),
(35, 7, 51),
(36, 7, 52),
(37, 7, 53),
(38, 7, 54),
(39, 8, 55),
(40, 8, 56),
(41, 8, 57),
(42, 8, 58),
(43, 8, 59),
(44, 8, 60),
(45, 8, 61),
(46, 8, 62),
(47, 8, 63),
(48, 8, 64),
(49, 9, 65),
(50, 9, 66),
(51, 9, 67),
(52, 9, 68),
(53, 9, 69),
(54, 9, 70),
(55, 9, 71),
(56, 9, 72),
(57, 9, 73),
(58, 9, 74),
(59, 10, 75),
(60, 10, 76),
(61, 10, 77),
(62, 10, 78),
(63, 10, 79),
(64, 10, 80),
(65, 10, 81),
(66, 10, 82),
(67, 10, 83),
(68, 10, 84),
(69, 2, 85),
(70, 3, 10),
(71, 3, 11),
(72, 3, 12),
(73, 3, 13),
(74, 3, 14),
(75, 4, 20),
(76, 4, 21),
(77, 4, 22),
(78, 4, 23),
(79, 4, 24),
(80, 2, 4),
(81, 6, 40),
(82, 6, 41),
(83, 6, 42),
(84, 6, 43),
(85, 6, 44);

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
(4, 'Marco', 'Camacho', 'Aldunate', 'marco@gmail.com', '54321', 'user'),
(5, 'Marta', 'Calderon', 'Aldunate', 'marta@gmail.com', '$2b$10$m9EHTxor2e8R8RuaDyNXAuPvceEq7vmCEsAFeZr7sGYmFwd5sf6hC', 'user'),
(6, 'Juan', 'Castaño', 'Mendieta', 'juan@gmail.com', '$2b$10$grbFqdIwNQph6YZ3TBqv9OJMtDHWK2vBIaTUSG/b2/nLWpDtNKy86', 'admin'),
(7, 'Favian', 'yujra', 'yana', 'fav@gmail.com', '$2b$10$NxY9Zo7qqYvrZmiN6NF8eetx7JwNrph2yLpNxvkJ/9U7u9c/4J072', 'user'),
(8, 'Carmen', 'Carranza', 'Lopez', 'carmen@gmail.com', '$2b$10$G00e19hOmtlHb0MdFxlLbOexVU4kFJYookJk9JIkaD1QZCIfAVoya', 'user'),
(9, 'Brenda', 'Gutierrez', 'Fernandez', 'brenda@gmail.com', '$2b$10$zX939nVtw4tqZZVKbRq5bOX9DS8sC7/ARz/xkP47wNkhKqEZK4GUa', 'admin'),
(10, 'Paula', 'Apaza', 'Carrion', 'paula@gmail.com', '$2b$10$Dg28IpGcSxUvXL6E1rVQgOha0X8nCpu6uVKZOLDA8xwwE9FsM9FDe', 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuariosinsignias`
--

CREATE TABLE `usuariosinsignias` (
  `id_user_insignia` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `id_insignia` bigint(20) UNSIGNED DEFAULT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuariosinsignias`
--

INSERT INTO `usuariosinsignias` (`id_user_insignia`, `fecha`, `id_insignia`, `id_user`) VALUES
(1, '2025-05-10', 1, 3),
(2, '2025-05-25', 1, 3),
(3, '2025-06-06', 1, 8),
(4, '2025-06-06', 2, 8),
(5, '2025-06-06', 1, 10);

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
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `fk_test` (`id_test_base`);

--
-- Indices de la tabla `desafio_preguntas`
--
ALTER TABLE `desafio_preguntas`
  ADD PRIMARY KEY (`id_desafio`,`id_pregunta`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `desafio_resultados`
--
ALTER TABLE `desafio_resultados`
  ADD PRIMARY KEY (`id_resultado`),
  ADD UNIQUE KEY `idx_desafio_user` (`id_desafio`,`id_user`),
  ADD KEY `id_user` (`id_user`);

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
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `fk_tipo_preg` (`id_tipo`),
  ADD KEY `fk_cat` (`id_categoria`),
  ADD KEY `fk_dif` (`id_dificultad`);

--
-- Indices de la tabla `rankingspuntajesaltos`
--
ALTER TABLE `rankingspuntajesaltos`
  ADD PRIMARY KEY (`id_ranking`),
  ADD KEY `fk_resul_ranking_alto` (`id_resultado`);

--
-- Indices de la tabla `respuestapreguntas`
--
ALTER TABLE `respuestapreguntas`
  ADD PRIMARY KEY (`id_resPreg`),
  ADD KEY `fk_preg` (`id_pregunta`),
  ADD KEY `fk_res` (`id_respuesta`);

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
  ADD KEY `fk_respuestasusuario_historial` (`id_historial`),
  ADD KEY `fk_repuesta_usuario_Res` (`id_respuesta`),
  ADD KEY `fk_user_respues` (`id_user`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id_resultado`),
  ADD KEY `fk_resu_resul` (`id_resu`);

--
-- Indices de la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  ADD PRIMARY KEY (`id_resultado_pregunta`),
  ADD KEY `id_historial` (`id_historial`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_resu` (`id_resu`),
  ADD KEY `fk_res_res` (`id_respuesta`);

--
-- Indices de la tabla `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id_test`),
  ADD KEY `fk_dificultad` (`id_dificultad`),
  ADD KEY `fk_cat_tes` (`id_categoria`),
  ADD KEY `fk_us_creador` (`id_usuario_creador`);

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
  ADD PRIMARY KEY (`id_user_insignia`),
  ADD KEY `fk_insi_user` (`id_insignia`),
  ADD KEY `fk_user_insi` (`id_user`);

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
  MODIFY `id_desafio` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `desafio_resultados`
--
ALTER TABLE `desafio_resultados`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estadisticas_usuario`
--
ALTER TABLE `estadisticas_usuario`
  MODIFY `id_estadistica` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_tests`
--
ALTER TABLE `historial_tests`
  MODIFY `id_historial` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `insignias`
--
ALTER TABLE `insignias`
  MODIFY `id_insignia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `lecturas_videos`
--
ALTER TABLE `lecturas_videos`
  MODIFY `id_lectura` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `niveldificultad`
--
ALTER TABLE `niveldificultad`
  MODIFY `id_dificultad` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `rankingspuntajesaltos`
--
ALTER TABLE `rankingspuntajesaltos`
  MODIFY `id_ranking` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestapreguntas`
--
ALTER TABLE `respuestapreguntas`
  MODIFY `id_resPreg` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id_respuesta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=230;

--
-- AUTO_INCREMENT de la tabla `respuestasusuario`
--
ALTER TABLE `respuestasusuario`
  MODIFY `id_resu` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id_resultado` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  MODIFY `id_resultado_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT de la tabla `tests`
--
ALTER TABLE `tests`
  MODIFY `id_test` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `test_pregunta`
--
ALTER TABLE `test_pregunta`
  MODIFY `id_test_pregunta` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT de la tabla `tipopregunta`
--
ALTER TABLE `tipopregunta`
  MODIFY `id_tipo` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_user` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuariosinsignias`
--
ALTER TABLE `usuariosinsignias`
  MODIFY `id_user_insignia` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `desafios_ibfk_5` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`),
  ADD CONSTRAINT `fk_test` FOREIGN KEY (`id_test_base`) REFERENCES `tests` (`id_test`);

--
-- Filtros para la tabla `desafio_preguntas`
--
ALTER TABLE `desafio_preguntas`
  ADD CONSTRAINT `desafio_preguntas_ibfk_1` FOREIGN KEY (`id_desafio`) REFERENCES `desafios` (`id_desafio`) ON DELETE CASCADE,
  ADD CONSTRAINT `desafio_preguntas_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `desafio_resultados`
--
ALTER TABLE `desafio_resultados`
  ADD CONSTRAINT `desafio_resultados_ibfk_1` FOREIGN KEY (`id_desafio`) REFERENCES `desafios` (`id_desafio`) ON DELETE CASCADE,
  ADD CONSTRAINT `desafio_resultados_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_user`) ON DELETE CASCADE;

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
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `fk_cat` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `fk_dif` FOREIGN KEY (`id_dificultad`) REFERENCES `niveldificultad` (`id_dificultad`),
  ADD CONSTRAINT `fk_tipo_preg` FOREIGN KEY (`id_tipo`) REFERENCES `tipopregunta` (`id_tipo`);

--
-- Filtros para la tabla `rankingspuntajesaltos`
--
ALTER TABLE `rankingspuntajesaltos`
  ADD CONSTRAINT `fk_resul_ranking_alto` FOREIGN KEY (`id_resultado`) REFERENCES `resultados` (`id_resultado`);

--
-- Filtros para la tabla `respuestapreguntas`
--
ALTER TABLE `respuestapreguntas`
  ADD CONSTRAINT `fk_preg` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`),
  ADD CONSTRAINT `fk_res` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`id_respuesta`);

--
-- Filtros para la tabla `respuestasusuario`
--
ALTER TABLE `respuestasusuario`
  ADD CONSTRAINT `fk_repuesta_usuario_Res` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`id_respuesta`),
  ADD CONSTRAINT `fk_respuestasusuario_historial` FOREIGN KEY (`id_historial`) REFERENCES `historial_tests` (`id_historial`),
  ADD CONSTRAINT `fk_user_respues` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_user`);

--
-- Filtros para la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `fk_resu_resul` FOREIGN KEY (`id_resu`) REFERENCES `respuestasusuario` (`id_resu`);

--
-- Filtros para la tabla `resultado_pregunta`
--
ALTER TABLE `resultado_pregunta`
  ADD CONSTRAINT `fk_res_res` FOREIGN KEY (`id_respuesta`) REFERENCES `respuestas` (`id_respuesta`),
  ADD CONSTRAINT `resultado_pregunta_ibfk_1` FOREIGN KEY (`id_historial`) REFERENCES `historial_tests` (`id_historial`),
  ADD CONSTRAINT `resultado_pregunta_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`),
  ADD CONSTRAINT `resultado_pregunta_ibfk_3` FOREIGN KEY (`id_resu`) REFERENCES `respuestasusuario` (`id_resu`);

--
-- Filtros para la tabla `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `fk_cat_tes` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `fk_dificultad` FOREIGN KEY (`id_dificultad`) REFERENCES `niveldificultad` (`id_dificultad`),
  ADD CONSTRAINT `fk_us_creador` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_user`);

--
-- Filtros para la tabla `test_pregunta`
--
ALTER TABLE `test_pregunta`
  ADD CONSTRAINT `test_pregunta_ibfk_1` FOREIGN KEY (`id_test`) REFERENCES `tests` (`id_test`),
  ADD CONSTRAINT `test_pregunta_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`);

--
-- Filtros para la tabla `usuariosinsignias`
--
ALTER TABLE `usuariosinsignias`
  ADD CONSTRAINT `fk_insi_user` FOREIGN KEY (`id_insignia`) REFERENCES `insignias` (`id_insignia`),
  ADD CONSTRAINT `fk_user_insi` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
