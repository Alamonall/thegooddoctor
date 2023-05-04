import * as env from "env-var";

export const mongoseUrl = env
  .get("MONGODB_URL")
  .default("mongodb://admin:admin@localhost:27017")
  .required()
  .asUrlString();

export const apiPort = env.get("API_PORT").default("3001").required().asInt();
