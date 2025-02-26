import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Direcciones, Movimientos } from "../types";
const app = new Hono();

const robotSchema = z.object({
  comandos: z.string(),
});

const DIRECCIONES: Direcciones[] = ["NORTE", "ESTE", "SUR", "OESTE"];
const MOVIMIENTOS: Movimientos = {
  NORTE: { x: 0, y: 1 },
  ESTE: { x: 1, y: 0 },
  SUR: { x: 0, y: -1 },
  OESTE: { x: -1, y: 0 },
};

app.post("/mover", zValidator("json", robotSchema), async (c) => {
  const { comandos } = c.req.valid("json");

  let x = 1;
  let y = 1;
  let direccion = 0; // Empezamos por norte
  let historial = [{ x, y, direccion: DIRECCIONES[direccion] }];
  let alertas = [];

  // Procesar cada comando
  const comandosArray = comandos.toUpperCase().trim().split(/\s+/);

  for (let cmd of comandosArray) {
    if (cmd === "A") {
      // Avanzar
      const mov = MOVIMIENTOS[DIRECCIONES[direccion]];
      const nuevoX = x + mov.x;
      const nuevoY = y + mov.y;

      // Verificamos que no ha chocado con el limite
      if (nuevoX < 1 || nuevoX > 3 || nuevoY < 1 || nuevoY > 3) {
        alertas.push(
          `No puedes avanzar más allá del límite en dirección ${DIRECCIONES[direccion]}`
        );
      } else {
        x = nuevoX;
        y = nuevoY;
      }
    } else if (cmd === "I") {
      // Girar izquierda
      direccion = (direccion + 3) % 4;
    } else if (cmd === "D") {
      // Girar derecha
      direccion = (direccion + 1) % 4;
    } else {
      alertas.push(
        `Comando desconocido: ${cmd}.Ejemplo de uso correcto "D A I A"`
      );
      continue;
    }

    // Registrar movimiento en el historial
    historial.push({ x, y, direccion: DIRECCIONES[direccion] });
  }

  return c.json({
    posicionFinal: { x, y, direccion: DIRECCIONES[direccion] },
    historial,
    alertas,
    comandosProcesados: comandosArray.length,
  });
});

export default app;
