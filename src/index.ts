import express from "express";
import { createClient } from "redis";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
app.use(express.json());

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("Error en Redis:", err));
redisClient.connect();

app.locals.redisClient = redisClient;

app.use("/api", routes);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
