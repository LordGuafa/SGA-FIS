DO
$$
DECLARE
    tabla TEXT;
BEGIN
    FOR tabla IN
        SELECT quote_ident(schemaname) || '.' || quote_ident(tablename)
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || tabla || ' CASCADE';
    END LOOP;
END;
$$;
