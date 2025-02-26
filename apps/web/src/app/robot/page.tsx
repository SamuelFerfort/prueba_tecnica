"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowUp,
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Position, HistoryItem, Direction } from "@/lib/types";
import Link from "next/link";

export default function RobotExplorer() {
  const [commands, setCommands] = useState<string>("");
  const [position, setPosition] = useState<Position>({
    x: 1,
    y: 1,
    direccion: "NORTE",
  });
  const [finalPosition, setFinalPosition] = useState<Position>({
    x: 1,
    y: 1,
    direccion: "NORTE",
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommands(e.target.value.toUpperCase());
  };

  const resetRobot = () => {
    setPosition({ x: 1, y: 1, direccion: "NORTE" });
    setFinalPosition({ x: 1, y: 1, direccion: "NORTE" });
    setHistory([]);
    setAlerts([]);
    setIsAnimating(false);
    setCurrentStep(0);
    setCommands("");
    setAnimationCompleted(false);
  };

  const runCommands = async () => {
    try {
      setIsExecuting(true);
      // Detener cualquier animación en curso
      setIsAnimating(false);
      setAnimationCompleted(false);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/robot/mover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comandos: commands }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al comunicarse con el servidor");
      }

      const data = await response.json();
      setFinalPosition(data.posicionFinal); // Guardamos la posición final
      setPosition({ x: 1, y: 1, direccion: "NORTE" }); // Volvemos a la posición inicial para la animación
      setHistory(data.historial);
      setAlerts(data.alertas);

      // Iniciar animación solo si hay un historial
      if (data.historial.length > 0) {
        setIsAnimating(true);
        setCurrentStep(0);
      } else {
        // Si no hay historial, consideramos la animación como completada
        setAnimationCompleted(true);
        setPosition(data.posicionFinal);
      }
    } catch (error) {
      toast.error(
        "Error al procesar los comandos: " + (error as Error).message
      );
    } finally {
      setIsExecuting(false);
    }
  };

  // Efecto para la animación paso a paso
  useEffect(() => {
    if (isAnimating && history.length > 0) {
      const timer = setTimeout(() => {
        if (currentStep < history.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsAnimating(false);
          setAnimationCompleted(true);
          setPosition(finalPosition); // Al completar la animación, establecemos la posición final
        }
      }, 500); // 500ms entre cada paso

      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, history, finalPosition]);

  const currentPosition =
    isAnimating && history.length > 0 ? history[currentStep] : position;

  const getDirectionIcon = (dir: Direction) => {
    switch (dir) {
      case "NORTE":
        return "↑";
      case "ESTE":
        return "→";
      case "SUR":
        return "↓";
      case "OESTE":
        return "←";
      default:
        return "?";
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 w-full py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center max-w-3xl mx-auto mb-12">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Volver a juegos</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Robot Explorador
            </h1>
          </div>

          <div className="max-w-7xl mx-auto">
            <Card className="mb-8 border-2 border-gray-200">
              <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-gray-300" />
                  Instrucciones
                </CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Controla un robot en una cuadrícula 3x3 usando comandos de
                  texto
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <p className="text-lg text-gray-700">
                    El robot comienza en la posición (1,1) mirando al Norte.
                    Ingresa todos los comandos de una vez separados por
                    espacios.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <ArrowUp className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <strong className="text-lg">A</strong>
                        <p className="text-gray-600">Avanzar una casilla</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <RotateCcw className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <strong className="text-lg">I</strong>
                        <p className="text-gray-600">Girar a la izquierda</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <RotateCw className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <strong className="text-lg">D</strong>
                        <p className="text-gray-600">Girar a la derecha</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-600">
                      <strong>Ejemplo:</strong> &quot;A A D A&quot; - El robot
                      avanza dos casillas al norte, gira a la derecha (este) y
                      avanza una casilla más.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <Card className="border-2 border-gray-200">
                  <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Gamepad2 className="h-6 w-6 text-gray-300" />
                      Controles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={commands}
                          onChange={handleCommandChange}
                          placeholder="Ejemplo: A A D A"
                          className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-gray-300 focus:ring-gray-200 text-lg"
                          disabled={isExecuting || isAnimating}
                        />
                        <Button
                          onClick={runCommands}
                          disabled={
                            isExecuting || isAnimating || !commands.trim()
                          }
                          className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                        >
                          {isExecuting ? "Procesando..." : "Ejecutar"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetRobot}
                          title="Reiniciar robot"
                          className="p-3 border-2 border-gray-200 hover:bg-gray-50"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </Button>
                      </div>

                      {animationCompleted && (
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            Posición Final
                          </h3>
                          <div className="flex justify-center items-center gap-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl">
                              <span className="text-2xl font-mono font-medium">
                                {finalPosition.x},{finalPosition.y}
                              </span>
                            </div>
                            <span className="text-2xl text-gray-400">•</span>
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl">
                              <span className="text-2xl">
                                {getDirectionIcon(finalPosition.direccion)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-center">
                            El robot está en ({finalPosition.x},{" "}
                            {finalPosition.y}) mirando al{" "}
                            {finalPosition.direccion}
                          </p>
                        </div>
                      )}

                      {animationCompleted && alerts.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                          <h3 className="font-bold text-xl text-gray-900">
                            Alertas:
                          </h3>
                          <ul className="space-y-2">
                            {alerts.map((alert, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700"
                              >
                                <span className="text-gray-400">•</span>
                                {alert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isAnimating && history.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            Movimiento en progreso...
                          </h3>
                          <p className="text-gray-600">
                            Posición: ({history[currentStep].x},{" "}
                            {history[currentStep].y}) mirando al{" "}
                            {history[currentStep].direccion}
                          </p>
                        </div>
                      )}

                      {history.length > 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Animación
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (isAnimating) {
                                  setIsAnimating(false);
                                } else {
                                  setAnimationCompleted(false);
                                  setIsAnimating(true);
                                  setCurrentStep(0);
                                }
                              }}
                              className="px-4 py-2 border-2 border-gray-200 hover:bg-gray-50"
                            >
                              {isAnimating ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" /> Pausar
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" /> Reproducir
                                </>
                              )}
                            </Button>
                          </div>

                          {isAnimating && (
                            <div className="space-y-2">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gray-700 transition-all duration-300"
                                  style={{
                                    width: `${
                                      (currentStep / (history.length - 1)) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-center text-sm text-gray-500">
                                Paso {currentStep + 1} de {history.length}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <Card className="border-2 border-gray-200">
                  <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Layout className="h-6 w-6 text-gray-300" />
                      Cuadrícula 3x3
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative aspect-square w-full max-w-[400px] mx-auto">
                      <div className="grid grid-cols-3 grid-rows-3 h-full border-2 border-gray-200 rounded-xl overflow-hidden">
                        {Array.from({ length: 9 }).map((_, index) => {
                          const row = Math.floor(index / 3);
                          const col = index % 3;
                          const x = col + 1;
                          const y = 3 - row;

                          return (
                            <div
                              key={index}
                              className={`border border-gray-100 flex items-center justify-center ${
                                x === currentPosition.x &&
                                y === currentPosition.y
                                  ? "bg-gray-50"
                                  : "bg-white"
                              }`}
                            >
                              <span className="text-gray-400 text-sm font-mono">
                                ({x},{y})
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {currentPosition && (
                        <div
                          className="absolute w-[25%] h-[25%] transition-all duration-300 flex items-center justify-center"
                          style={{
                            left: `${(currentPosition.x - 1) * 33.33 + 4.165}%`,
                            top: `${(3 - currentPosition.y) * 33.33 + 4.165}%`,
                            transform: `rotate(${
                              currentPosition.direccion === "NORTE"
                                ? "0deg"
                                : currentPosition.direccion === "ESTE"
                                ? "90deg"
                                : currentPosition.direccion === "SUR"
                                ? "180deg"
                                : "270deg"
                            })`,
                          }}
                        >
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 bg-gray-900 rounded-full flex items-center justify-center z-10 shadow-lg">
                              <div className="w-1/2 h-1/2 bg-white rounded-full"></div>
                            </div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-white z-20"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
