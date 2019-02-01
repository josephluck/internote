import { connectToDatabase } from "./dependencies/db";
import { startApp } from "./app";

connectToDatabase()
  .then(startApp)
  .then(async app => {
    await app.listen(process.env.API_PORT);
    console.log(`Api started on port ${process.env.API_PORT}`);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
