-- Roles
INSERT INTO
    catalogo_rol (id, nombre)
VALUES (1, 'administrativo'),
    (2, 'tutor'),
    (3, 'participante');

-- Departamentos
INSERT INTO
    catalogo_departamento (
        id,
        nombre,
        codigo_ocad,
        region_ocad
    )
VALUES (1, 'Amazonas', 'AMZ01', 'Sur'),
    (
        2,
        'Antioquia',
        'ANT02',
        'Norte'
    ),
    (
        3,
        'Cundinamarca',
        'CUN03',
        'Centro'
    );

-- Modalidades
INSERT INTO
    catalogo_modalidad (id, nombre)
VALUES (1, 'sincronica'),
    (2, 'autonoma');

-- Personal (tutores y administrativos)
INSERT INTO
    personal (
        id,
        nombre,
        email,
        password,
        contact1,
        contact2,
        rol_id
    )
VALUES (
        101,
        'Ana Administrativa',
        'ana.admin@sga.com',
        '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G',--admin123
        '3001111111',
        '3002222222',
        1
    ),
    (
        102,
        'Carlos Tutor',
        'carlos.tutor@sga.com',
        '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G',--admin123
        '3003333333',
        NULL,
        2
    )
    ,
    (
        00000,
        'Tutor por asignar',
        'por asignar',
        '',--admin123
        NULL,
        NULL,
        2
    );

-- Participantes
INSERT INTO
    participante (
        id,
        nombre,
        email,
        password,
        contact1,
        contact2,
        departamento_id,
        rol_id
    )
VALUES (
        201,
        'Luis Participante',
        'luis.part@sga.com',
        '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G',--admin123
        '3011111111',
        NULL,
        1,
        3
    ),
    (
        202,
        'Maria Participante',
        'maria.part@sga.com',
        '$2b$10$fT9pk4.6KGSUoxTUWNn39uZlqMpZEgi6uj64ETL7.XqNAO6dZrW6G',--admin123
        '3012222222',
        '3013333333',
        2,
        3
    );

-- Cursos
INSERT INTO
    curso (id, nombre, descripcion)
VALUES (
        1,
        'Matemáticas Básicas',
        'Curso introductorio de matemáticas'
    ),
    (
        2,
        'Ciencias Naturales',
        'Curso de ciencias para principiantes'
    );

-- Clases
INSERT INTO
    clase (
        id,
        curso_id,
        tutor_id,
        fecha,
        tema
    )
VALUES (
        1,
        1,
        102,
        '2025-07-01',
        'Números y operaciones'
    ),
    (
        2,
        2,
        102,
        '2025-07-02',
        'La célula'
    );

-- Inscripciones
INSERT INTO
    inscripcion (
        id,
        curso_id,
        participante_id,
        modalidad_id,
        fecha_inscripcion
    )
VALUES (1, 1, 201, 1, '2025-06-20'),
    (2, 2, 202, 2, '2025-06-21');

-- Avance autónomo
INSERT INTO
    avance_autonomo (
        id,
        inscripcion_id,
        descripcion,
        fecha
    )
VALUES (
        1,
        1,
        'Ejercicios de repaso completados',
        '2025-07-03'
    ),
    (
        2,
        2,
        'Lectura de capítulo 1',
        '2025-07-04'
    );

-- Asistencia
INSERT INTO
    asistencia (
        id,
        clase_id,
        participante_id,
        presente
    )
VALUES (1, 1, 201, TRUE),
    (2, 2, 202, FALSE);

-- Calificaciones
INSERT INTO
    calificacion (
        id,
        clase_id,
        participante_id,
        nota,
        observaciones
    )
VALUES (
        1,
        1,
        201,
        85.5,
        'Buen desempeño'
    ),
    (
        2,
        2,
        202,
        92.0,
        'Excelente participación'
    );