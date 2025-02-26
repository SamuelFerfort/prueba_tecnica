import { supabase } from "../index";
import { type Json } from "./database.types";

export interface MovimientoRobot {
  comandos: string;
  historial: Json;
  usuario?: string;
}

export const guardarMovimientoRobot = async (movimiento: MovimientoRobot) => {
  const { data, error } = await supabase
    .from("robot_movimientos")
    .insert(movimiento)
    .select();

  if (error) throw error;
  return data?.[0];
};

export const obtenerHistorialRobot = async (limite = 10) => {
  const { data, error } = await supabase
    .from("robot_movimientos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data;
};
