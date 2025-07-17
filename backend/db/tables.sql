CREATE TABLE catalogo_rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL CHECK (nombre IN ('administrativo', 'tutor'))
);

CREATE TABLE catalogo_departamento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    codigo_ocad VARCHAR(20) NOT NULL,
    distribucion_ocad VARCHAR(100) NOT NULL
);

CREATE TABLE catalogo_modalidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) UNIQUE NOT NULL CHECK (nombre IN ('sincronica', 'autonoma'))
);

CREATE TABLE personal (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES catalogo_rol(id) ON DELETE RESTRICT
);

CREATE TABLE participante (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    departamento_id INTEGER NOT NULL REFERENCES catalogo_departamento(id) ON DELETE RESTRICT
);

CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE clase (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    tutor_id INTEGER NOT NULL REFERENCES personal(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    tema TEXT
);

CREATE TABLE inscripcion (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante(id) ON DELETE CASCADE,
    modalidad_id INTEGER NOT NULL REFERENCES catalogo_modalidad(id) ON DELETE RESTRICT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    UNIQUE (curso_id, participante_id)
);

CREATE TABLE avance_autonomo (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER NOT NULL REFERENCES inscripcion(id) ON DELETE CASCADE,
    descripcion TEXT,
    fecha DATE DEFAULT CURRENT_DATE
);

CREATE TABLE asistencia (
    id SERIAL PRIMARY KEY,
    clase_id INTEGER NOT NULL REFERENCES clase(id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante(id) ON DELETE CASCADE,
    presente BOOLEAN NOT NULL,
    UNIQUE (clase_id, participante_id)
);

CREATE TABLE calificacion (
    id SERIAL PRIMARY KEY,
    clase_id INTEGER NOT NULL REFERENCES clase(id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante(id) ON DELETE CASCADE,
    nota NUMERIC(4,2) CHECK (nota BETWEEN 0 AND 100),
    observaciones TEXT,
    UNIQUE (clase_id, participante_id)
);

CREATE OR REPLACE FUNCTION es_sincronico(p_participante_id INT, p_curso_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    modalidad_nombre TEXT;
BEGIN
    SELECT cm.nombre INTO modalidad_nombre
    FROM inscripcion i
    JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
    WHERE i.participante_id = p_participante_id AND i.curso_id = p_curso_id;

    RETURN modalidad_nombre = 'sincronica';
END;
$$ LANGUAGE plpgsql;

--Vista participante
CREATE OR REPLACE VIEW vista_participante AS
SELECT
    p.id AS participante_id,
    p.nombre,
    c.nombre AS curso,
    cm.nombre AS modalidad,
    cl.fecha AS fecha_clase,
    cl.tema,
    cal.nota,
    cal.observaciones,
    a.presente,
    aa.descripcion AS avance_autonomo,
    aa.fecha AS fecha_avance
FROM participante p
LEFT JOIN inscripcion i ON i.participante_id = p.id
LEFT JOIN catalogo_modalidad cm ON i.modalidad_id = cm.id
LEFT JOIN curso c ON c.id = i.curso_id
LEFT JOIN clase cl ON cl.curso_id = c.id
LEFT JOIN calificacion cal ON cal.clase_id = cl.id AND cal.participante_id = p.id
LEFT JOIN asistencia a ON a.clase_id = cl.id AND a.participante_id = p.id
LEFT JOIN avance_autonomo aa ON aa.inscripcion_id = i.id;

--Vista tutor
CREATE OR REPLACE VIEW vista_tutor AS
SELECT
    per.id AS tutor_id,
    per.nombre AS tutor,
    c.nombre AS curso,
    cl.fecha,
    cl.tema,
    part.nombre AS participante,
    cm.nombre AS modalidad,
    cal.nota,
    a.presente,
    aa.descripcion AS avance_autonomo
FROM personal per
JOIN clase cl ON cl.tutor_id = per.id
JOIN curso c ON c.id = cl.curso_id
LEFT JOIN inscripcion i ON i.curso_id = c.id
LEFT JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
LEFT JOIN participante part ON part.id = i.participante_id
LEFT JOIN calificacion cal ON cal.clase_id = cl.id AND cal.participante_id = part.id
LEFT JOIN asistencia a ON a.clase_id = cl.id AND a.participante_id = part.id
LEFT JOIN avance_autonomo aa ON aa.inscripcion_id = i.id;

--Roles y permisos
CREATE ROLE rol_participante;
CREATE ROLE rol_tutor;
CREATE ROLE rol_administrativo;

-- Administrativo: permisos totales
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rol_administrativo;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_administrativo;

-- Tutor: solo clases y seguimiento
GRANT SELECT, INSERT, UPDATE ON clase, calificacion, asistencia, avance_autonomo TO rol_tutor;

-- Participante: solo lectura sobre vista
GRANT SELECT ON vista_participante TO rol_participante;
