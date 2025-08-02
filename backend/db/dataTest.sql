-- Roles
INSERT INTO catalogo_rol (nombre) VALUES
('administrativo'),
('tutor'),
('participante');

-- Departamentos
INSERT INTO catalogo_departamento (nombre, codigo_ocad, region_ocad) VALUES
('Antioquia', 'OCAD-01', 'Región Andina'),
('Cundinamarca', 'OCAD-02', 'Región Andina');

-- Modalidades
INSERT INTO catalogo_modalidad (nombre) VALUES
('sincronica'),
('autonoma');

-- Personal (IDs son el documento)
INSERT INTO personal (id, nombre, email, password, contact1, contact2, rol_id) VALUES

(1001, 'Ana Admin', 'ana.admin@sga.com', '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G', '3001111111', '3102222222', 1),
(2001, 'Carlos Tutor', 'carlos.tutor@sga.com', '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G', '3013333333', NULL, 2);

-- Participantes
INSERT INTO participante (id, nombre, email, password, contact1, contact2, departamento_id, rol_id) VALUES
(3001, 'Pedro Participante', 'pedro.part@sga.com', '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G', '3024444444', NULL, 1, 3),
(3002, 'Laura Participante', 'laura.part@sga.com', '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G', '3035555555', '3156666666', 2, 3);

-- Cursos
INSERT INTO curso (nombre, descripcion) VALUES
('Matemáticas Básicas', 'Curso de matemáticas para principiantes'),
('Historia de Colombia', 'Curso sobre la historia nacional');

-- Asignación de tutor a curso
INSERT INTO asignacion_tutor_curso (tutor_id, curso_id) VALUES
(2001, 1),
(2001, 2);

-- Clases
INSERT INTO clase (curso_id, tutor_id, fecha, tema) VALUES
(1, 2001, '2025-08-01', 'Introducción a las matemáticas'),
(2, 2001, '2025-08-02', 'Historia precolombina');

-- Inscripciones
INSERT INTO inscripcion (curso_id, participante_id, modalidad_id) VALUES
(1, 3001, 1),
(1, 3002, 2),
(2, 3001, 1);

-- Calificaciones
INSERT INTO calificacion (clase_id, participante_id, nota, observaciones) VALUES
(1, 3001, 95, 'Excelente'),
(1, 3002, 85, 'Buen trabajo');

-- Asistencia
INSERT INTO asistencia (clase_id, participante_id, presente) VALUES
(1, 3001, TRUE),
(1, 3002, FALSE);
