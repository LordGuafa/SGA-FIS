-- Tabla de roles del sistema (administrativo, tutor, participante)
CREATE TABLE IF NOT EXISTS catalogo_rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL CHECK (
        nombre IN (
            'administrativo',
            'tutor',
            'participante'
        )
    )
);

-- Tabla de departamentos OCAD
CREATE TABLE IF NOT EXISTS catalogo_departamento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    codigo_ocad VARCHAR(20) NOT NULL,
    region_ocad VARCHAR(100) NOT NULL
);

-- Tabla de modalidades de inscripción (sincrónica/autónoma)
CREATE TABLE IF NOT EXISTS catalogo_modalidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) UNIQUE NOT NULL CHECK (
        nombre IN ('sincronica', 'autonoma')
    )
);

-- Tabla de personal (usuarios administrativos y tutores)
CREATE TABLE IF NOT EXISTS personal (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    contact1 VARCHAR(20),
    contact2 VARCHAR(20),
    rol_id INTEGER NOT NULL REFERENCES catalogo_rol (id) ON DELETE RESTRICT
);

-- Tabla de participantes (usuarios que toman cursos)
CREATE TABLE IF NOT EXISTS participante (
    id INTEGER PRIMARY KEY ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    contact1 VARCHAR(20),
    contact2 VARCHAR(20),
    departamento_id INTEGER NOT NULL REFERENCES catalogo_departamento (id) ON DELETE RESTRICT,
    rol_id INTEGER NOT NULL REFERENCES catalogo_rol (id) ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT TRUE,
);

-- Tabla de cursos disponibles
CREATE TABLE IF NOT EXISTS curso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla de clases asociadas a cursos y tutores
CREATE TABLE IF NOT EXISTS clase (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES curso (id) ON DELETE CASCADE,
    tutor_id INTEGER NOT NULL REFERENCES personal (id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    tema TEXT
);

-- Tabla de inscripciones de participantes a cursos y modalidad
CREATE TABLE IF NOT EXISTS inscripcion (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES curso (id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante (id) ON DELETE CASCADE,
    modalidad_id INTEGER NOT NULL REFERENCES catalogo_modalidad (id) ON DELETE RESTRICT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    UNIQUE (curso_id, participante_id)
);

-- Tabla de avances autónomos de participantes en cursos
CREATE TABLE IF NOT EXISTS avance_autonomo (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER NOT NULL REFERENCES inscripcion (id) ON DELETE CASCADE,
    descripcion TEXT,
    fecha DATE DEFAULT CURRENT_DATE
);

-- Tabla de asistencias de participantes a clases
CREATE TABLE IF NOT EXISTS asistencia (
    id SERIAL PRIMARY KEY,
    clase_id INTEGER NOT NULL REFERENCES clase (id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante (id) ON DELETE CASCADE,
    presente BOOLEAN NOT NULL,
    UNIQUE (clase_id, participante_id)
);

-- Tabla de calificaciones de participantes en clases
CREATE TABLE IF NOT EXISTS calificacion (
    id SERIAL PRIMARY KEY,
    clase_id INTEGER NOT NULL REFERENCES clase (id) ON DELETE CASCADE,
    participante_id INTEGER NOT NULL REFERENCES participante (id) ON DELETE CASCADE,
    nota NUMERIC(4, 2) CHECK (nota BETWEEN 0 AND 100),
    observaciones TEXT,
    UNIQUE (clase_id, participante_id)
);

-- Función para verificar si la inscripción de un participante a un curso es sincrónica
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