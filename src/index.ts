import express from "express";
import { createClient } from "redis";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
app.use(express.json());

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.on("error", (err) => console.error("Error en Redis:", err));
redisClient.connect();

app.locals.redisClient = redisClient;

app.use("/api", routes);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

export default app;
