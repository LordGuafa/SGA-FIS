-- Vista de tutores con sus cursos asignados
CREATE OR REPLACE VIEW vista_tutores_cursos AS
SELECT
    p.id AS tutor_id,
    p.nombre AS tutor_nombre,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    atc.fecha_asignacion
FROM asignacion_tutor_curso atc
JOIN personal p ON p.id = atc.tutor_id
JOIN curso c ON c.id = atc.curso_id
WHERE p.rol_id = (SELECT id FROM catalogo_rol WHERE nombre = 'tutor')
ORDER BY p.nombre, c.nombre;

-- Vista para participantes: historial de notas y asistencias
CREATE OR REPLACE VIEW vista_participante AS
SELECT
    part.id AS participante_id,
    part.nombre AS participante_nombre,
    c.nombre AS curso,
    cm.nombre AS modalidad,
    cl.fecha AS fecha_clase,
    cl.tema,
    cal.nota,
    cal.observaciones,
    a.presente
FROM participante part
JOIN inscripcion i ON i.participante_id = part.id
JOIN curso c ON c.id = i.curso_id
JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
LEFT JOIN clase cl ON cl.curso_id = c.id
LEFT JOIN calificacion cal ON cal.clase_id = cl.id AND cal.participante_id = part.id
LEFT JOIN asistencia a ON a.clase_id = cl.id AND a.participante_id = part.id;

-- Vista para administradores: resumen de usuarios y cursos
CREATE OR REPLACE VIEW vista_admin_resumen AS
SELECT
    p.id,
    p.nombre,
    cr.nombre AS rol,
    p.email,
    p.contact1,
    p.contact2
FROM personal p
JOIN catalogo_rol cr ON cr.id = p.rol_id
UNION
SELECT
    pa.id,
    pa.nombre,
    cr.nombre AS rol,
    pa.email,
    pa.contact1,
    pa.contact2
FROM participante pa
JOIN catalogo_rol cr ON cr.id = pa.rol_id;
