-- Vista participante
CREATE OR REPLACE VIEW vista_participante AS
SELECT
    p.id AS participante_id,
    p.nombre,
    c.nombre AS curso,
    cm.nombre AS modalidad,
    cl.fecha AS fecha_clase,
    cl.tema,
    cal.nota,
    cal.observaciones,
    a.presente,
    aa.descripcion AS avance_autonomo,
    aa.fecha AS fecha_avance
FROM
    participante p
    LEFT JOIN inscripcion i ON i.participante_id = p.id
    LEFT JOIN catalogo_modalidad cm ON i.modalidad_id = cm.id
    LEFT JOIN curso c ON c.id = i.curso_id
    LEFT JOIN clase cl ON cl.curso_id = c.id
    LEFT JOIN calificacion cal ON cal.clase_id = cl.id
    AND cal.participante_id = p.id
    LEFT JOIN asistencia a ON a.clase_id = cl.id
    AND a.participante_id = p.id
    LEFT JOIN avance_autonomo aa ON aa.inscripcion_id = i.id;

-- Vista tutor
CREATE OR REPLACE VIEW vista_tutor AS
SELECT
    per.id AS tutor_id,
    per.nombre AS tutor,
    c.nombre AS curso,
    cl.fecha,
    cl.tema,
    part.nombre AS participante,
    cm.nombre AS modalidad,
    cal.nota,
    a.presente,
    aa.descripcion AS avance_autonomo
FROM
    personal per
    JOIN clase cl ON cl.tutor_id = per.id
    JOIN curso c ON c.id = cl.curso_id
    LEFT JOIN inscripcion i ON i.curso_id = c.id
    LEFT JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
    LEFT JOIN participante part ON part.id = i.participante_id
    LEFT JOIN calificacion cal ON cal.clase_id = cl.id
    AND cal.participante_id = part.id
    LEFT JOIN asistencia a ON a.clase_id = cl.id
    AND a.participante_id = part.id
    LEFT JOIN avance_autonomo aa ON aa.inscripcion_id = i.id;

-- Vista de información completa de participantes
CREATE OR REPLACE VIEW vista_administrativo_participantes AS
SELECT
    p.id AS participante_id,
    p.nombre AS nombre_participante,
    p.correo,
    p.contacto_1,
    p.contacto_2,
    d.nombre AS departamento,
    d.codigo_ocad,
    d.region_ocad,
    i.curso_id,
    c.nombre AS nombre_curso,
    cm.nombre AS modalidad,
    i.fecha_inscripcion
FROM
    participante p
    JOIN catalogo_departamento d ON p.departamento_id = d.id
    LEFT JOIN inscripcion i ON i.participante_id = p.id
    LEFT JOIN curso c ON c.id = i.curso_id
    LEFT JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id;

-- Vista de información completa del personal (tutores o administrativos)
CREATE OR REPLACE VIEW vista_administrativo_personal AS
SELECT per.id, per.nombre, per.correo, per.contacto_1, per.contacto_2, cr.nombre AS rol
FROM personal per
    JOIN catalogo_rol cr ON cr.id = per.rol_id;

-- Vista de notas y asistencias por clase
CREATE OR REPLACE VIEW vista_administrativo_control_academico AS
SELECT
    c.nombre AS curso,
    cl.id AS clase_id,
    cl.fecha,
    cl.tema,
    t.id AS tutor_id,
    t.nombre AS tutor_nombre,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    a.presente,
    cal.nota,
    cal.observaciones
FROM
    clase cl
    JOIN curso c ON c.id = cl.curso_id
    JOIN personal t ON cl.tutor_id = t.id
    LEFT JOIN asistencia a ON a.clase_id = cl.id
    LEFT JOIN calificacion cal ON cal.clase_id = cl.id
    AND cal.participante_id = a.participante_id
    LEFT JOIN participante p ON p.id = a.participante_id;

-- Vista de avances autónomos por curso
CREATE OR REPLACE VIEW vista_administrativo_avance_autonomo AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    c.nombre AS curso,
    aa.descripcion,
    aa.fecha
FROM
    avance_autonomo aa
    JOIN inscripcion i ON aa.inscripcion_id = i.id
    JOIN participante p ON p.id = i.participante_id
    JOIN curso c ON c.id = i.curso_id;