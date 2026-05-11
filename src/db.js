import mysql from "mysql2/promise";
import dotenv from "dotenv";


dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASE,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
});