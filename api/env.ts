import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? "../.env" : "../.env"
});
