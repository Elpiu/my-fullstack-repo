export type GameStatus = 'WAITING' | 'COUNTDOWN' | 'RACING' | 'FINISHED';

export interface Horse {
  id: string;
  name: string;
  color: string;
  position: number;
  stamina: number;
  isReady?: boolean;
  finished?: boolean;
}
