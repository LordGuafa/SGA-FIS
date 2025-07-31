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
    calificacion
TO app_user;

-- Permitir SELECT en tablas de catálogo (solo lectura)
GRANT SELECT ON
    catalogo_rol,
    catalogo_departamento,
    catalogo_modalidad
TO app_user;

-- Otorgar permisos SELECT sobre las vistas
GRANT SELECT ON
    vista_participante_detalle,
    vista_personal_detalle,
    vista_control_general,
    vista_tutor_calificaciones,
    vista_tutor_asistencias,
    vista_tutor_clases,
	vista_participante_asistencias,
	vista_participante_inscripciones
	TO app_user;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Otorgar permisos de ejecución sobre funciones necesarias
GRANT EXECUTE ON FUNCTION es_sincronico(INT, INT) TO app_user;
