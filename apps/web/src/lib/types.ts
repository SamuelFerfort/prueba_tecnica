export type Direction = "NORTE" | "ESTE" | "SUR" | "OESTE";
export type Position = {
  x: number;
  y: number;
  direccion: Direction;
};
export type HistoryItem = Position;

export type Player = {
  id: number;
  name: string;
  active: boolean;
};
export type GameState = "waiting" | "playing" | "gameOver";
