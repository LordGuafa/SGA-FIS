-- Catálogos
INSERT INTO catalogo_rol (nombre) VALUES 
('administrativo'), ('tutor'), ('participante');

INSERT INTO catalogo_departamento (nombre, codigo_ocad, region_ocad) VALUES
('Antioquia', '05', 'Noroeste'),
('Cundinamarca', '25', 'Centro'),
('Valle del Cauca', '76', 'Suroccidente');

INSERT INTO catalogo_modalidad (nombre) VALUES 
('sincronica'), ('autonoma');

-- Personal
INSERT INTO personal (id, nombre, correo, contrasena, rol_id) VALUES
(101, 'Laura Gómez', 'laura@admin.edu.co', 'admin123', 1),
(201, 'Carlos Ruiz', 'carlos@tutor.edu.co', 'tutor456', 2),
(202, 'Ana Torres', 'ana@tutor.edu.co', 'tutor789', 2);

-- Participantes
INSERT INTO participante (id, nombre, correo, contrasena, departamento_id) VALUES
(301, 'Pedro Martínez', 'pedro@estudiante.edu.co', 'clave123', 1),
(302, 'Lucía Díaz', 'lucia@estudiante.edu.co', 'clave456', 2),
(303, 'Mateo López', 'mateo@estudiante.edu.co', 'clave789', 3);

-- Cursos
INSERT INTO curso (nombre, descripcion) VALUES
('Matemáticas I', 'Curso de fundamentos matemáticos'),
('Historia Universal', 'Estudio de las civilizaciones antiguas');

-- Clases
INSERT INTO clase (curso_id, tutor_id, fecha, tema) VALUES
(1, 201, '2025-07-01', 'Álgebra básica'),
(2, 202, '2025-07-02', 'Mesopotamia');

-- Inscripciones
INSERT INTO inscripcion (curso_id, participante_id, modalidad_id) VALUES
(1, 301, 1), -- Pedro - Matemáticas I - sincrónica
(1, 302, 2), -- Lucía - Matemáticas I - autónoma
(2, 303, 1); -- Mateo - Historia Universal - sincrónica

-- Avances autónomos
INSERT INTO avance_autonomo (inscripcion_id, descripcion, fecha) VALUES
(2, 'Lucía completó el módulo 1', '2025-07-03');

-- Asistencias
INSERT INTO asistencia (clase_id, participante_id, presente) VALUES
(1, 301, TRUE),
(2, 303, FALSE);

-- Calificaciones
INSERT INTO calificacion (clase_id, participante_id, nota, observaciones) VALUES
(1, 301, 85.5, 'Buen desempeño'),
(2, 303, 70.0, 'Debe mejorar la asistencia');
