import { supabase } from "../index";

export interface PartidaPalabras {
  palabras: string[];
  usuario?: string;
  puntuacion: number;
}

export const guardarPartidaPalabras = async (partida: PartidaPalabras) => {
  const { data, error } = await supabase
    .from("palabras_partidas")
    .insert(partida)
    .select();

  if (error) throw error;
  return data?.[0];
};

export const obtenerRankingPalabras = async (limite = 10) => {
  const { data, error } = await supabase
    .from("palabras_partidas")
    .select("*")
    .order("puntuacion", { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data;
};
