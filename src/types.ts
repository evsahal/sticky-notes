export interface Position {
  x: number;
  y: number;
}

export interface Note {
  id: string;
  text: string;
  position: Position;
  width: number;
  height: number;
  color: string;
  zIndex: number;
}