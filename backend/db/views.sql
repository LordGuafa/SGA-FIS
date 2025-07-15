-- Vistas para participantes
-- Cursos en los que está inscrito un participante
CREATE VIEW vista_cursos_participante AS
SELECT 
    u.id AS id_participante,
    c.id AS id_curso,
    c.nombre AS curso,
    c.descripcion,
    c.modalidad,
    i.fecha_inscripcion
FROM inscripciones i
JOIN cursos c ON c.id = i.curso_id
JOIN usuarios u ON u.id = i.participante_id
WHERE u.rol = 'participante';

-- Calificaciones del participante
CREATE VIEW vista_calificaciones_participante AS
SELECT 
    p.id_usuario AS id_participante,
    c.id AS id_curso,
    cur.nombre AS curso,
    cal.nota,
    cal.fecha_registro
FROM calificaciones cal
JOIN participantes p ON p.id_usuario = cal.participante_id
JOIN cursos cur ON cur.id = cal.curso_id
JOIN usuarios c ON c.id = p.id_usuario;

-- Historial de asistencia del participante
CREATE VIEW vista_asistencia_participante AS
SELECT 
    a.participante_id,
    cl.curso_id,
    co.nombre AS curso,
    cl.fecha,
    cl.tema,
    a.presente
FROM asistencias a
JOIN clases cl ON cl.id = a.clase_id
JOIN cursos co ON co.id = cl.curso_id;

-- Vistas para tutores

-- Clases dictadas por tutor
CREATE VIEW vista_clases_tutor AS
SELECT 
    t.id_usuario AS id_tutor,
    cl.id AS id_clase,
    c.id AS id_curso,
    c.nombre AS curso,
    cl.fecha,
    cl.tema
FROM clases cl
JOIN cursos c ON c.id = cl.curso_id
JOIN tutores t ON t.id_usuario = cl.tutor_id;

-- Participantes inscritos en los cursos dictados por el tutor
CREATE VIEW vista_participantes_tutor AS
SELECT 
    cl.tutor_id,
    i.participante_id,
    i.curso_id,
    cu.nombre AS curso,
    u.nombre_completo AS nombre_participante
FROM clases cl
JOIN cursos cu ON cu.id = cl.curso_id
JOIN inscripciones i ON i.curso_id = cu.id
JOIN usuarios u ON u.id = i.participante_id;

-- Asistencias en clases dictadas por el tutor
CREATE VIEW vista_asistencias_tutor AS
SELECT 
    cl.tutor_id,
    cl.id AS clase_id,
    cl.fecha,
    cl.tema,
    a.participante_id,
    u.nombre_completo,
    a.presente
FROM clases cl
JOIN asistencias a ON a.clase_id = cl.id
JOIN usuarios u ON u.id = a.participante_id;

-- Calificaciones asignadas en los cursos del tutor
CREATE VIEW vista_calificaciones_tutor AS
SELECT 
    cl.tutor_id,
    cal.participante_id,
    cal.curso_id,
    cu.nombre AS curso,
    cal.nota,
    cal.fecha_registro
FROM clases cl
JOIN calificaciones cal ON cal.curso_id = cl.curso_id
JOIN cursos cu ON cu.id = cl.curso_id;

--Permisos para las vistas
-- Participantes
GRANT SELECT ON vista_cursos_participante, vista_calificaciones_participante, vista_asistencia_participante TO rol_participante;

-- Tutores
GRANT SELECT ON vista_clases_tutor, vista_participantes_tutor, vista_asistencias_tutor, vista_calificaciones_tutor TO rol_tutor;

-- Administrativos
GRANT SELECT ON vista_usuarios, vista_inscripciones, vista_calificaciones_completas, vista_clases_y_asistencia TO rol_administrativo;
