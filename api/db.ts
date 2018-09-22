import { createConnection } from "typeorm";
import entities from "./domains/entities";
// import seed from './seed'

async function connect() {
  console.log(process.env);
  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: entities(),
    synchronize: true,
    logging: true
  });
}

export default async function createDatabase() {
  // const c = await connect()
  // await c.dropDatabase()
  // await c.close()
  const connection = await connect();
  // await seed(connection)
  return connection;
}
