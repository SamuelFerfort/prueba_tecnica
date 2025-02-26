# Juegos Monorepo

Este proyecto contiene dos juegos implementados con Next.js, Bun, Hono y Supabase:

1. **Cadena de Palabras**: Un juego donde cada nueva palabra debe comenzar con la última letra de la palabra anterior.
2. **Robot Explorador**: Una aplicación donde un robot se mueve en una cuadrícula 3x3 según instrucciones del usuario.

## Estructura del Proyecto

monorepo/
├── apps/
│ └── web/ (Frontend Next.js)
└── packages/
├── api/ (Backend Hono)
└── db/ (Configuración Supabase)

## Requisitos

- Bun 1.0 o superior
- Cuenta de Supabase

## Configuración

1. Clona el repositorio
2. Crea un archivo `.env.local` en la raíz con las variables:
   SUPABASE_URL=tu-url-de-supabase
   SUPABASE_KEY=tu-key-de-supabase
3. Instala las dependencias: `bun install`
4. Inicia los servicios: `bun dev`

## Despliegue

El proyecto está configurado para ser desplegado en Vercel para el frontend y servicios como Render o Railway para el backend.

9. Lanzar el proyecto
   Para iniciar el desarrollo, ejecuta:

```bash
# Instalar todas las dependencias
bun install
# Iniciar el desarrollo
bun dev
```

```

```
