-- Catálogos
INSERT INTO
    catalogo_rol (nombre)
VALUES ('administrativo'),
    ('tutor'),
    ('participante');

INSERT INTO
    catalogo_modalidad (nombre)
VALUES ('sincronica'),
    ('autonoma');

INSERT INTO
    catalogo_departamento (
        nombre,
        codigo_ocad,
        region_ocad
    )
VALUES (
        'Antioquia',
        '05-001',
        'Región Centro'
    ),
    (
        'Cundinamarca',
        '25-002',
        'Región Centro'
    ),
    (
        'Valle del Cauca',
        '76-003',
        'Región Pacífico'
    );

-- Personal
INSERT INTO
    personal (
        id,
        nombre,
        correo,
        contrasena,
        telefono1,
        telefono2,
        rol_id
    )
VALUES (
        1001,
        'María Gómez',
        'maria.gomez@educa.com',
        'maria123',
        '3001112233',
        '3102223344',
        2
    ), -- tutor
    (
        1002,
        'Carlos Ruiz',
        'carlos.ruiz@educa.com',
        'carlos456',
        '3011111122',
        '3123334455',
        1
    );
-- administrativo

-- Participantes
INSERT INTO
    participante (
        id,
        nombre,
        correo,
        contrasena,
        telefono1,
        telefono2,
        departamento_id,
        rol_id
    )
VALUES (
        2001,
        'Luis Pérez',
        'luis.perez@correo.com',
        'luispass',
        '3112223344',
        '3203334455',
        1,
        3
    ),
    (
        2002,
        'Ana Torres',
        'ana.torres@correo.com',
        'anapass',
        '3134445566',
        '3215556677',
        2,
        3
    );

-- Curso
INSERT INTO
    curso (nombre, descripcion)
VALUES (
        'Matemáticas Básicas',
        'Curso de fundamentos matemáticos para todos los niveles'
    );

-- Clase
INSERT INTO
    clase (
        curso_id,
        tutor_id,
        fecha,
        tema
    )
VALUES (
        1,
        1001,
        '2025-07-10',
        'Números enteros y operaciones'
    );

-- Inscripción
INSERT INTO
    inscripcion (
        curso_id,
        participante_id,
        modalidad_id
    )
VALUES (1, 2001, 1), -- Luis en modalidad sincronica
    (1, 2002, 2);
-- Ana en modalidad autonoma

-- Avance autónomo
INSERT INTO
    avance_autonomo (inscripcion_id, descripcion)
VALUES (
        2,
        'Estudió el material de introducción a las fracciones'
    );

-- Asistencia y calificación
INSERT INTO
    asistencia (
        clase_id,
        participante_id,
        presente
    )
VALUES (1, 2001, TRUE);

INSERT INTO
    calificacion (
        clase_id,
        participante_id,
        nota,
        observaciones
    )
VALUES (
        1,
        2001,
        88.5,
        'Buen desempeño'
    );