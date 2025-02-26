import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import spanishWords from "an-array-of-spanish-words";
import englishWords from "an-array-of-english-words";

// Convertimos los arrays a Set para búsquedas más rápidas
const diccionarioEspanol = new Set(spanishWords);
const diccionarioIngles = new Set(englishWords);

const app = new Hono();

const validarPalabraSchema = z.object({
  palabraActual: z.string().min(1),
  palabrasUsadas: z.array(z.string()),
  ultimaLetra: z.string().optional(),
});

app.post("/validar", zValidator("json", validarPalabraSchema), async (c) => {
  const { palabraActual, palabrasUsadas, ultimaLetra } = c.req.valid("json");

  // Validación básica
  const palabraLimpia = palabraActual.trim().toLowerCase();

  // Verificar si contiene caracteres no permitidos (permitimos caracteres de ambos idiomas)
  const regexCombinado = /^[a-záéíóúñ]+$/i;
  if (!regexCombinado.test(palabraLimpia)) {
    return c.json({
      valida: false,
      motivo: "La palabra solo puede contener letras",
    });
  }

  // Verificar si la palabra ya se usó
  if (palabrasUsadas.includes(palabraLimpia)) {
    return c.json({
      valida: false,
      motivo: "La palabra ya ha sido usada",
    });
  }

  // Verificar si comienza con la última letra de la palabra anterior
  if (ultimaLetra && palabraLimpia.charAt(0) !== ultimaLetra) {
    return c.json({
      valida: false,
      motivo: `La palabra debe comenzar con la letra "${ultimaLetra}"`,
    });
  }

  // Verificar si la palabra existe en alguno de los diccionarios
  const existeEnEspanol = diccionarioEspanol.has(palabraLimpia);
  const existeEnIngles = diccionarioIngles.has(palabraLimpia);

  if (!existeEnEspanol && !existeEnIngles) {
    return c.json({
      valida: false,
      motivo: `La palabra ${palabraLimpia} no existe en el diccionario`,
    });
  }

  return c.json({
    valida: true,
    palabra: palabraLimpia,
    ultimaLetra: palabraLimpia.charAt(palabraLimpia.length - 1),
  });
});

export default app;
