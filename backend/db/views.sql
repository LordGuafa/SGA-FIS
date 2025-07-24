CREATE OR REPLACE VIEW vista_participante_inscripciones AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    p.correo,
    cd.nombre AS departamento,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cm.nombre AS modalidad,
    i.fecha_inscripcion
FROM
    participante p
    JOIN catalogo_departamento cd ON p.departamento_id = cd.id
    JOIN inscripcion i ON i.participante_id = p.id
    JOIN curso c ON c.id = i.curso_id
    JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id;

CREATE OR REPLACE VIEW vista_participante_asistencias AS
SELECT
    a.participante_id,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    c.nombre AS curso,
    a.presente
FROM
    asistencia a
    JOIN clase cl ON cl.id = a.clase_id
    JOIN curso c ON c.id = cl.curso_id;

CREATE OR REPLACE VIEW vista_participante_calificaciones AS
SELECT cal.participante_id, cl.id AS clase_id, cl.tema, cl.fecha, c.nombre AS curso, cal.nota, cal.observaciones
FROM
    calificacion cal
    JOIN clase cl ON cl.id = cal.clase_id
    JOIN curso c ON c.id = cl.curso_id;

CREATE OR REPLACE VIEW vista_tutor_clases AS
SELECT
    cl.id AS clase_id,
    cl.fecha,
    cl.tema,
    c.id AS curso_id,
    c.nombre AS curso,
    t.id AS tutor_id,
    t.nombre AS tutor
FROM
    clase cl
    JOIN curso c ON c.id = cl.curso_id
    JOIN personal t ON t.id = cl.tutor_id;

CREATE OR REPLACE VIEW vista_tutor_asistencias AS
SELECT
    t.id AS tutor_id,
    cl.id AS clase_id,
    cl.tema,
    cl.fecha,
    p.id AS participante_id,
    p.nombre AS participante,
    a.presente
FROM
    clase cl
    JOIN personal t ON t.id = cl.tutor_id
    JOIN asistencia a ON a.clase_id = cl.id
    JOIN participante p ON p.id = a.participante_id;

CREATE OR REPLACE VIEW vista_tutor_calificaciones AS
SELECT
    t.id AS tutor_id,
    cl.id AS clase_id,
    cl.tema,
    cl.fecha,
    p.id AS participante_id,
    p.nombre AS participante,
    cal.nota,
    cal.observaciones
FROM
    clase cl
    JOIN personal t ON t.id = cl.tutor_id
    JOIN calificacion cal ON cal.clase_id = cl.id
    JOIN participante p ON p.id = cal.participante_id;

CREATE OR REPLACE VIEW vista_control_general AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante,
    cd.nombre AS departamento,
    c.nombre AS curso,
    cm.nombre AS modalidad,
    i.fecha_inscripcion,
    cl.fecha AS fecha_clase,
    cl.tema,
    a.presente,
    cal.nota
FROM
    participante p
    JOIN catalogo_departamento cd ON cd.id = p.departamento_id
    JOIN inscripcion i ON i.participante_id = p.id
    JOIN curso c ON c.id = i.curso_id
    JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
    LEFT JOIN asistencia a ON a.participante_id = p.id
    LEFT JOIN clase cl ON cl.id = a.clase_id
    LEFT JOIN calificacion cal ON cal.participante_id = p.id
    AND cal.clase_id = cl.id;

CREATE OR REPLACE VIEW vista_personal_detalle AS
SELECT per.id, per.nombre, per.correo, cr.nombre AS rol
FROM personal per
    JOIN catalogo_rol cr ON cr.id = per.rol_id;

CREATE OR REPLACE VIEW vista_participante_detalle AS
SELECT p.id, p.nombre, p.correo, cd.nombre AS departamento, cr.nombre AS rol
FROM
    participante p
    JOIN catalogo_departamento cd ON cd.id = p.departamento_id
    JOIN catalogo_rol cr ON cr.id = p.rol_id;