import { createClient } from "@supabase/supabase-js";
import { type Database } from "./schemas/database.types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export * from "./schemas/database.types";
export * from "./schemas/palabras";
export * from "./schemas/robot";
