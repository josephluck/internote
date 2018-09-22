import { createConnection } from "typeorm";
import entities from "./domains/entities";

async function connect() {
  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: entities(),
    synchronize: true,
    logging: true
  });
}

export default async function createDatabase() {
  return await connect();
}
