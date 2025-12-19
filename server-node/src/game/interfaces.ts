export type GameStatus = 'WAITING' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

export interface Player {
  id: string;
  isHuman: boolean;
  isReady: boolean;
  color: string;
  name: string;

  // Parametri Fisici
  position: number;
  stamina: number;
  baseSpeed: number;
  isSprinting: boolean;
  finished: boolean;
}

export const CONSTANTS = {
  MAX_PLAYERS: 10,
  FINISH_LINE: 1000,
  TICK_RATE: 50,
  BOT_NAMES: [
    'Furia',
    'Lampo',
    'Tuono',
    'Saetta',
    'Vento',
    'Spirit',
    'Tornado',
    'Ombra',
    'Rex',
  ],
};
