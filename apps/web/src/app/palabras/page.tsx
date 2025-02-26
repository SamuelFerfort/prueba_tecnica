"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  AlertTriangle,
  Zap,
  BookOpen,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { Player, GameState } from "@/lib/types";
import Link from "next/link";

export default function CadenaPalabras() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Jugador 1", active: true },
    { id: 2, name: "Jugador 2", active: false },
  ]);

  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [lastLetter, setLastLetter] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [gameResult, setGameResult] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    setGameState("playing");
    setUsedWords([]);
    setLastLetter(null);
    setCurrentPlayer(0);
    setCurrentWord("");
    setGameResult("");
    setTimeLeft(10);
    setTimerActive(true);

    const newPlayers = players.map((player, index) => ({
      ...player,
      active: index === 0,
    }));
    setPlayers(newPlayers);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const validateWord = async () => {
    try {
      const word = currentWord.trim().toLowerCase();

      if (!word) {
        toast.error("Por favor, ingresa una palabra");
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        }/api/palabras/validar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            palabraActual: word,
            palabrasUsadas: usedWords,
            ultimaLetra: lastLetter || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al validar la palabra");
      }

      const data = await response.json();

      if (data.valida) {
        setUsedWords([...usedWords, word]);
        setLastLetter(data.ultimaLetra);
        setCurrentWord("");

        const nextPlayerIndex = (currentPlayer + 1) % players.length;
        setCurrentPlayer(nextPlayerIndex);

        const newPlayers = players.map((player, index) => ({
          ...player,
          active: index === nextPlayerIndex,
        }));
        setPlayers(newPlayers);

        setTimeLeft(10);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      } else {
        handleGameOver(`${players[currentPlayer].name} perdió: ${data.motivo}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al validar la palabra");
    }
  };

  const handleGameOver = (reason: string) => {
    setGameState("gameOver");
    setGameResult(reason);
    setTimerActive(false);

    const newPlayers = players.map((player) => ({
      ...player,
      active: false,
    }));
    setPlayers(newPlayers);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeout = () => {
    handleGameOver(`${players[currentPlayer].name} perdió: Se acabó el tiempo`);
  };

  useEffect(() => {
    if (timerActive && gameState === "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, gameState, currentPlayer]);

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWord(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && gameState === "playing") {
      validateWord();
    }
  };

  return (
    <div className=" flex flex-col">
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
              Cadena de Palabras
            </h1>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            <Card className="border-2 border-gray-200">
              <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-gray-300" />
                  <CardTitle className="text-2xl font-bold">
                    Instrucciones
                  </CardTitle>
                </div>
                <CardDescription className="text-base text-gray-300">
                  Un juego de palabras encadenadas por turnos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <p className="text-lg text-gray-700">
                    Cada jugador debe ingresar una palabra que comience con la
                    última letra de la palabra anterior.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      No se pueden repetir palabras.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      La palabra debe existir en el diccionario.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      Tienes 10 segundos para ingresar una palabra válida.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      El juego termina cuando un jugador no puede ingresar una
                      palabra válida.
                    </li>
                  </ul>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700">
                      <span className="font-medium">Ejemplo:</span>{" "}
                      <span className="font-mono">
                        &quot;perro&quot; → &quot;oso&quot; → &quot;oruga&quot;
                        → &quot;agua&quot;
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-gray-200">
                <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-gray-300" />
                    <CardTitle className="text-2xl font-bold">
                      Jugadores
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          player.active
                            ? "bg-gray-50 border-gray-300 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium text-lg ${
                              player.active ? "text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {player.name}
                          </span>
                          {player.active && gameState === "playing" && (
                            <span className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Turno actual
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {gameState === "waiting" && (
                      <Button
                        className="w-full py-6 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
                        onClick={startGame}
                      >
                        Comenzar juego
                      </Button>
                    )}
                    {gameState === "gameOver" && (
                      <Button
                        className="w-full py-6 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
                        onClick={startGame}
                      >
                        Jugar de nuevo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader className="space-y-2 border-b border-gray-200 bg-gray-800 text-white">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-gray-300" />
                    <CardTitle className="text-2xl font-bold ">
                      {gameState === "waiting"
                        ? "Listo para jugar"
                        : gameState === "gameOver"
                        ? "Juego terminado"
                        : "Ingresa una palabra"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {gameState === "playing" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Input
                          ref={inputRef}
                          type="text"
                          value={currentWord}
                          onChange={handleWordChange}
                          onKeyDown={handleKeyDown}
                          placeholder={
                            lastLetter
                              ? `Palabra que empiece con "${lastLetter}"`
                              : "Ingresa una palabra"
                          }
                          className="flex-1 px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-gray-300 focus:ring-gray-200 text-lg"
                          disabled={gameState !== "playing"}
                        />
                        <Button
                          onClick={validateWord}
                          disabled={
                            !currentWord.trim() || gameState !== "playing"
                          }
                          className="px-6 py-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg"
                        >
                          Enviar
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-6 w-6 text-gray-700" />
                            <span className="text-gray-900 font-medium text-lg">
                              Tiempo restante
                            </span>
                          </div>
                          <span
                            className={`font-mono font-bold text-3xl ${
                              timeLeft <= 3
                                ? "text-red-500 animate-pulse"
                                : "text-gray-900"
                            }`}
                          >
                            {timeLeft}s
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              timeLeft <= 3 ? "bg-red-500" : "bg-gray-900"
                            }`}
                            style={{ width: `${(timeLeft / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {gameState === "gameOver" && (
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-gray-700" />
                        <h3 className="font-bold text-xl text-gray-900">
                          Fin del juego
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700">{gameResult}</p>
                    </div>
                  )}

                  {usedWords.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Palabras usadas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {usedWords.map((word, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border-2 border-gray-200 px-3 py-2 rounded-lg text-base font-medium text-gray-700 transition-transform hover:scale-105 hover:border-gray-300"
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
