-- Crear roles de base de datos (si no existen)
CREATE ROLE administrativo LOGIN PASSWORD 'adminpass';
CREATE ROLE tutor LOGIN PASSWORD 'tutorpass';
CREATE ROLE participante LOGIN PASSWORD 'partpass';

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO administrativo;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO administrativo;


-- Permitir lectura de vista tutor
GRANT SELECT ON vista_tutor TO tutor;

-- Permitir inserción de clases, asistencias y calificaciones
GRANT SELECT, INSERT, UPDATE ON clase TO tutor;
GRANT SELECT, INSERT, UPDATE ON asistencia TO tutor;
GRANT SELECT, INSERT, UPDATE ON calificacion TO tutor;

-- Permitir lectura de participantes, cursos, inscripciones
GRANT SELECT ON participante, curso, inscripcion, catalogo_modalidad TO tutor;

GRANT SELECT ON vista_participante TO participante;

-- Asignar permisos SELECT al rol administrativo sobre las vistas
GRANT SELECT ON vista_administrativo_participantes TO administrativo;
GRANT SELECT ON vista_administrativo_personal TO administrativo;
GRANT SELECT ON vista_administrativo_control_academico TO administrativo;
GRANT SELECT ON vista_administrativo_avance_autonomo TO administrativo;

-- Revocar acceso genérico a todos
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
