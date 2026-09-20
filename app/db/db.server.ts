import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

// Carga las variables de entorno desde .env.local para pruebas por consola
dotenv.config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
console.log('Database URL:', process.env.DATABASE_URL);
export const db = drizzle({ client: sql });