-- Crear el rol si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
        CREATE ROLE app_user LOGIN PASSWORD 'password_segura';
    END IF;
END
$$;

-- Permitir conexión a la base y uso del esquema
GRANT CONNECT ON DATABASE sga TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Asignar permisos completos sobre las tablas que manipulará el backend
GRANT SELECT, INSERT, UPDATE, DELETE ON
    participante,
    personal,
    curso,
    clase,
    inscripcion,
    avance_autonomo,
    asistencia,
    calificacion,
    asignacion_tutor_curso
TO app_user;

-- Permitir SELECT en tablas de catálogo (solo lectura)
GRANT SELECT ON
    catalogo_rol,
    catalogo_departamento,
    catalogo_modalidad
TO app_user;

-- Otorgar permisos SELECT sobre las vistas
GRANT SELECT ON
    vista_asistencias_admin,
    vista_notas_admin,
    vista_inscripciones_admin,
    vista_tutores_admin,
    vista_asistencias_tutor,
    vista_notas_tutor,
    vista_asistencias_participante,
    vista_notas_participante,
    vista_tutor_cursos,
    vista_participante_cursos,
    vista_calificaciones_sincronicas
TO app_user;

-- Permitir uso y modificación de secuencias
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Otorgar permisos de ejecución sobre funciones necesarias
GRANT EXECUTE ON FUNCTION es_sincronico(INT, INT) TO app_user;

SELECT * FROM vista_participante_cursos 