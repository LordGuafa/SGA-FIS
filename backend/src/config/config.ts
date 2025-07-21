// src/config.ts
import dotenv from "dotenv";
dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`La variable de entorno ${name} no está definida`);
  }
  return value;
}

export const config = {
  PORT: parseInt(getEnvVar("PORT")),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  DB_HOST: getEnvVar("DB_HOST"),
  DB_PORT: parseInt(getEnvVar("DB_PORT")),
  DB_USER: getEnvVar("DB_USER"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME"),
  SALT_ROUNDS: parseInt(getEnvVar("SALT_ROUNDS")),
};
