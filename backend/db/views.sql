--vistas tutores
CREATE OR REPLACE VIEW vista_tutor_cursos AS
SELECT
    t.id AS tutor_id,
    t.nombre AS tutor_nombre,
    t.email AS tutor_email,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    c.descripcion AS curso_descripcion
FROM asignacion_tutor_curso atc
JOIN personal t ON t.id = atc.tutor_id
JOIN curso c ON c.id = atc.curso_id
WHERE t.rol_id = (
    SELECT id FROM catalogo_rol WHERE nombre = 'tutor'
)
ORDER BY t.nombre, c.nombre;

CREATE OR REPLACE VIEW vista_asistencias_tutor AS
SELECT
    atc.tutor_id,
    per.nombre AS tutor_nombre,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    a.presente
FROM asignacion_tutor_curso atc
JOIN personal per ON per.id = atc.tutor_id
JOIN curso c ON c.id = atc.curso_id
JOIN clase cl ON cl.curso_id = c.id
JOIN asistencia a ON a.clase_id = cl.id
JOIN participante p ON p.id = a.participante_id
WHERE per.rol_id = (SELECT id FROM catalogo_rol WHERE nombre = 'tutor')
ORDER BY c.nombre, cl.fecha, p.nombre;

CREATE OR REPLACE VIEW vista_notas_tutor AS
SELECT
    atc.tutor_id,
    per.nombre AS tutor_nombre,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    cal.nota,
    cal.observaciones
FROM asignacion_tutor_curso atc
JOIN personal per ON per.id = atc.tutor_id
JOIN curso c ON c.id = atc.curso_id
JOIN clase cl ON cl.curso_id = c.id
JOIN calificacion cal ON cal.clase_id = cl.id
JOIN participante p ON p.id = cal.participante_id
WHERE per.rol_id = (SELECT id FROM catalogo_rol WHERE nombre = 'tutor')
ORDER BY c.nombre, cl.fecha, p.nombre;

--vistas participantes
CREATE OR REPLACE VIEW vista_calificaciones_sincronicas AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    cu.id AS curso_id,
    cu.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    cal.nota,
    cal.observaciones
FROM calificacion cal
JOIN clase cl ON cl.id = cal.clase_id
JOIN curso cu ON cu.id = cl.curso_id
JOIN participante p ON p.id = cal.participante_id
WHERE es_sincronico(p.id, cu.id);

CREATE OR REPLACE VIEW vista_participante_cursos AS
SELECT
    p.id AS participante_id,
    cu.nombre AS curso_nombre,
    cu.descripcion AS curso_descripcion,
    cm.nombre AS modalidad

FROM inscripcion i
JOIN participante p 
    ON p.id = i.participante_id
JOIN curso cu 
    ON cu.id = i.curso_id
JOIN catalogo_modalidad cm 
    ON cm.id = i.modalidad_id
ORDER BY i.fecha_inscripcion DESC;


CREATE OR REPLACE VIEW vista_asistencias_participante AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    cu.id AS curso_id,
    cu.nombre AS curso_nombre,
    cm.nombre AS modalidad,  -- ← Aquí agregamos la modalidad
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    a.presente
FROM asistencia a
JOIN clase cl ON cl.id = a.clase_id
JOIN curso cu ON cu.id = cl.curso_id
JOIN participante p ON p.id = a.participante_id
JOIN inscripcion i 
    ON i.participante_id = p.id 
    AND i.curso_id = cu.id
JOIN catalogo_modalidad cm 
    ON cm.id = i.modalidad_id;


CREATE OR REPLACE VIEW vista_notas_participante AS
SELECT
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    cal.nota,
    cal.observaciones
FROM participante p
JOIN inscripcion i ON i.participante_id = p.id
JOIN curso c ON c.id = i.curso_id
JOIN clase cl ON cl.curso_id = c.id
LEFT JOIN calificacion cal ON cal.clase_id = cl.id AND cal.participante_id = p.id
ORDER BY c.nombre, cl.fecha;

--vistas administrador
CREATE OR REPLACE VIEW vista_notas_admin AS
SELECT
    cal.id AS calificacion_id,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    per.id AS tutor_id,
    per.nombre AS tutor_nombre,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    p.email AS participante_email,
    cal.nota,
    cal.observaciones
FROM calificacion cal
JOIN clase cl ON cl.id = cal.clase_id
JOIN curso c ON c.id = cl.curso_id
JOIN personal per ON per.id = cl.tutor_id
JOIN participante p ON p.id = cal.participante_id
ORDER BY c.nombre, cl.fecha, p.nombre;

CREATE OR REPLACE VIEW vista_asistencias_admin AS
SELECT
    a.id AS asistencia_id,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cl.id AS clase_id,
    cl.fecha AS fecha_clase,
    cl.tema,
    per.id AS tutor_id,
    per.nombre AS tutor_nombre,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    p.email AS participante_email,
    a.presente
FROM asistencia a
JOIN clase cl ON cl.id = a.clase_id
JOIN curso c ON c.id = cl.curso_id
JOIN personal per ON per.id = cl.tutor_id
JOIN participante p ON p.id = a.participante_id
ORDER BY c.nombre, cl.fecha, p.nombre;

CREATE OR REPLACE VIEW vista_inscripciones_admin AS
SELECT
    i.id AS inscripcion_id,
    p.id AS participante_id,
    p.nombre AS participante_nombre,
    p.email AS participante_email,
    d.nombre AS departamento,
    c.id AS curso_id,
    c.nombre AS curso_nombre,
    cm.nombre AS modalidad,
    i.fecha_inscripcion
FROM inscripcion i
JOIN participante p ON p.id = i.participante_id
JOIN catalogo_departamento d ON d.id = p.departamento_id
JOIN curso c ON c.id = i.curso_id
JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
ORDER BY p.nombre, c.nombre;

CREATE OR REPLACE VIEW vista_tutores_admin AS
SELECT
    atc.tutor_id,
    per.nombre AS tutor_nombre,
    per.email AS tutor_email,
    c.id AS curso_id,
    c.nombre AS curso_nombre
FROM asignacion_tutor_curso atc
JOIN personal per ON per.id = atc.tutor_id
JOIN curso c ON c.id = atc.curso_id
ORDER BY per.nombre, c.nombre;

SELECT * FROM vista_asistencias_participante