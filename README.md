# 🎮 Juegos de Lógica

Aplicación web interactiva que incluye los juegos "Cadena de Palabras" y "Robot Explorador". Pon a prueba tu mente con estos divertidos puzzles.

## 🌐 [Demo en vivo](https://prueba-tecnica-web.vercel.app/)

## 🛠️ Tecnologías

### Frontend
- Next.js
- React
- TypeScript
- Desplegado en Vercel

### Backend
- Hono (alternativa moderna y más rápida a Express.js)
- TypeScript
- Desplegado en Fly.io

### Base de datos
- Supabase

## 🔍 Características

### Cadena de Palabras
- Juego donde cada palabra debe comenzar con la última letra de la palabra anterior
- No se pueden repetir palabras
- Ranking de jugadores
- Límite de tiempo para ingresar palabras

### Robot Explorador
- Control de un robot en una cuadrícula 3x3
- Comandos para avanzar y girar
- Animación del movimiento del robot
- Historial de movimientos

## ⚙️ Instalación y desarrollo

1. Clonar el repositorio:
```bash
git clone https://github.com/SamuelFerfort/prueba_tecnica
cd prueba_tecnica
```

2. Instalar dependencias:
```bash
bun install
```

3. Iniciar servidores de desarrollo:
```bash
# Desde la raíz ejecutará tanto el frontend como el backend
bun dev
```

## 📂 Estructura del proyecto
Monorepo que contiene tanto el frontend como el backend en un solo repositorio, facilitando el desarrollo y despliegue.