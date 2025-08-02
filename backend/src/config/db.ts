import { Pool } from 'pg';
import dotenv from 'dotenv';
import { config } from './config';

export const pool = new Pool({
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    host: config.DB_HOST,
    database: config.DB_NAME
})