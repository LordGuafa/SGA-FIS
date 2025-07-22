-- Crear el rol con contraseña (puedes cambiar 'securepassword')
CREATE ROLE app_user LOGIN PASSWORD 'securepassword';

-- No se le otorgan permisos de superusuario ni de creación
ALTER ROLE app_user NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;

-- Otorgar acceso a lectura y escritura solo en las tablas necesarias
GRANT SELECT, INSERT, UPDATE ON
    participante,
    personal,
    curso,
    clase,
    asistencia,
    calificacion,
    participante_curso
TO app_user;

-- Permitir lectura de catálogos
GRANT SELECT ON
    catalogo_rol,
    catalogo_departamento,
    catalogo_modalidad
TO app_user;

-- Otorgar acceso a vistas (solo SELECT)
GRANT SELECT ON
    vista_notas_participante,
    vista_asistencia_participante,
    vista_control_tutor,
    vista_info_administrador
TO app_user;

GRANT DELETE ON
    participante,
    personal,
    curso,
    clase,
    asistencia,
    calificacion,
    participante_curso
TO app_user;

-- Permitir uso de secuencias (si las hay para campos seriales, aunque usas ID explícitos)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Evita que otros roles creen objetos en el esquema por defecto
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
