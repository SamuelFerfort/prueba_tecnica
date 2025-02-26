import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import palabrasRoutes from "./routes/palabras";
import robotRoutes from "./routes/robot";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/api/palabras", palabrasRoutes);
app.route("/api/robot", robotRoutes);

app.get("/", (c) => {
  return c.json({
    mensaje: "API de juegos - Cadena de palabras y Robot explorador",
    rutas: ["/api/palabras", "/api/robot"],
  });
});

const port = parseInt(process.env.PORT || "3001");

console.log(`Servidor iniciado en http://localhost:${port}`);
export default {
  port,
  fetch: app.fetch,
};
