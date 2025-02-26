import Link from "next/link";
import { Languages, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className=" flex flex-col">
      <main className="flex-1 w-full">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container relative mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
                Juegos de Lógica
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Desafía tu mente con nuestros juegos interactivos. Selecciona
                uno para comenzar a jugar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="flex flex-col h-full bg-white shadow-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="space-y-4 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 rounded-xl">
                      <Languages className="h-7 w-7 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Cadena de Palabras
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    Un juego donde cada nueva palabra debe comenzar con la
                    última letra de la palabra anterior.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="font-medium mb-4 text-gray-900">Ejemplo:</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        perro
                      </span>
                      <span className="text-gray-400 flex items-center">→</span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        oso
                      </span>
                      <span className="text-gray-400 flex items-center">→</span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        oruga
                      </span>
                      <span className="text-gray-400 flex items-center">→</span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        agua
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    asChild
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-medium rounded-xl"
                  >
                    <Link href="/palabras">Jugar Ahora</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col h-full bg-white shadow-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="space-y-4 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 rounded-xl">
                      <BotIcon className="h-7 w-7 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Robot Explorador
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    Guía a un robot por una cuadrícula 3x3 usando comandos
                    simples: A (avanzar), I (girar izquierda), D (girar
                    derecha).
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="font-medium mb-4 text-gray-900">
                      Comandos:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        A
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        A
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        D
                      </span>
                      <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-medium">
                        A
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    asChild
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-medium rounded-xl"
                  >
                    <Link href="/robot">Jugar Ahora</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
