export enum CardState {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
  MATCHED = 'MATCHED',
}

export interface Card {
  id: string;
  value: string;
  state: CardState;
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  VICTORY = 'VICTORY',
}

export interface GameState {
  // --- Dati Strutturali ---
  gridSize: number; // es. 12, 16, 20 carte
  cards: Card[];

  // --- Dati di Progresso ---
  moves: number;
  score: number;
  timeElapsed: number; // in secondi
  matchesFound: number;

  // --- Logica di Turno ---
  status: GameStatus;
  flippedIds: string[]; // ID delle carte attualmente girate (max 2)

  // --- Calcolo Punteggio ---
  streakCount: number; // Match consecutivi
  lastMatchTime: number | null; // Timestamp ultimo match per bonus tempo

  // --- Flag di Controllo ---
  isLockBoard: boolean; // Blocca click durante le animazioni
}
