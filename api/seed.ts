import { Connection } from "typeorm/connection/Connection";
import * as Entities from "./domains/entities";
import * as faker from "faker";
import * as crypt from "bcryptjs";

export default async function seed(connection: Connection) {
  const users = await connection.manager.save([
    await makeUser(),
    await makeUser(),
    await makeUser()
  ]);
  console.log("Done seeding. You can log in with the following credentials: ");
  console.log("Username:", users[0].email, "  Password: 123");
}

async function makeUser() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  let user = new Entities.UserEntity();
  user.name = `${firstName} ${lastName}`;
  user.email = `${firstName.toLowerCase()}@${lastName.toLowerCase()}.co`;
  user.avatar = faker.image.avatar();
  user.password = await crypt.hash("123", 10);
  return user;
}
