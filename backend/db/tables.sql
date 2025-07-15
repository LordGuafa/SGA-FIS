-- Tabla de departamentos
CREATE TABLE departamentos (
    id SERIAL CONSTRAINT pk_departamentos PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL CONSTRAINT uq_departamentos_nombre UNIQUE
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL CONSTRAINT uq_usuarios_email UNIQUE,
    contraseña TEXT NOT NULL,
    rol VARCHAR(20) NOT NULL,
    CONSTRAINT chk_usuarios_rol CHECK (rol IN ('administrativo', 'tutor', 'participante'))
);

-- Tabla de participantes
CREATE TABLE participantes (
    id_usuario INTEGER CONSTRAINT pk_participantes PRIMARY KEY,
    departamento_id INTEGER NOT NULL,
    CONSTRAINT fk_participantes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_participantes_departamento FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

-- Tabla de tutores
CREATE TABLE tutores (
    id_usuario INTEGER CONSTRAINT pk_tutores PRIMARY KEY,
    CONSTRAINT fk_tutores_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de cursos
CREATE TABLE cursos (
    id SERIAL CONSTRAINT pk_cursos PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    modalidad VARCHAR(20) NOT NULL,
    CONSTRAINT chk_cursos_modalidad CHECK (modalidad IN ('sincrónica', 'autónoma'))
);

-- Inscripciones
CREATE TABLE inscripciones (
    id SERIAL CONSTRAINT pk_inscripciones PRIMARY KEY,
    participante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_inscripciones_participante FOREIGN KEY (participante_id) REFERENCES participantes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_inscripciones_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT uq_inscripciones_participante_curso UNIQUE (participante_id, curso_id)
);

-- Clases (solo para cursos sincrónicos)
CREATE TABLE clases (
    id SERIAL CONSTRAINT pk_clases PRIMARY KEY,
    curso_id INTEGER NOT NULL,
    tutor_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    tema TEXT,
    CONSTRAINT fk_clases_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT fk_clases_tutor FOREIGN KEY (tutor_id) REFERENCES tutores(id_usuario)
    -- Nota: la validación de modalidad sincrónica se recomienda hacer con TRIGGERS
);

-- Asistencia
CREATE TABLE asistencias (
    id SERIAL CONSTRAINT pk_asistencias PRIMARY KEY,
    clase_id INTEGER NOT NULL,
    participante_id INTEGER NOT NULL,
    presente BOOLEAN NOT NULL,
    CONSTRAINT fk_asistencias_clase FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE,
    CONSTRAINT fk_asistencias_participante FOREIGN KEY (participante_id) REFERENCES participantes(id_usuario) ON DELETE CASCADE
);

-- Calificaciones
CREATE TABLE calificaciones (
    id SERIAL CONSTRAINT pk_calificaciones PRIMARY KEY,
    participante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    nota NUMERIC(3,1) CONSTRAINT chk_calificaciones_nota CHECK (nota BETWEEN 0 AND 5),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_calificaciones_participante FOREIGN KEY (participante_id) REFERENCES participantes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_calificaciones_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT uq_calificaciones_participante_curso UNIQUE (participante_id, curso_id)
);
