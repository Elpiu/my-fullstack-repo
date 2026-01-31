import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, timer, takeWhile, map } from 'rxjs';
import { generateDeck } from './game.utils';
import { GameState, GameStatus, CardState } from './game.api';

const INITIAL_STATE: GameState = {
  gridSize: 16, // 4x4
  cards: [],
  moves: 0,
  score: 0,
  timeElapsed: 0,
  matchesFound: 0,
  status: GameStatus.LOBBY,
  flippedIds: [],
  streakCount: 0,
  lastMatchTime: null,
  isLockBoard: false,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),

  withComputed(({ cards, matchesFound, gridSize, status }) => ({
    isVictory: computed(() => matchesFound() === gridSize() / 2),
    isGameActive: computed(() => status() === GameStatus.PLAYING),
    progress: computed(() => (matchesFound() / (gridSize() / 2)) * 100),
  })),

  withMethods((store) => {
    // Calcolatore punteggio interno
    const calculateScore = (isMatch: boolean): number => {
      if (!isMatch) return -5; // Penalità errore

      let points = 100;

      // Bonus Streak
      points += store.streakCount() * 20;

      // Bonus Tempo (se trovi un match entro 5 sec dal precedente)
      const now = Date.now();
      if (store.lastMatchTime()) {
        const diff = (now - store.lastMatchTime()!) / 1000;
        if (diff < 5) points += 50;
      }

      return points;
    };

    // Gestione Timer
    const startTimer = rxMethod<void>(
      pipe(
        switchMap(() =>
          timer(0, 1000).pipe(
            takeWhile(() => store.status() === GameStatus.PLAYING),
            tap(() => patchState(store, (state) => ({ timeElapsed: state.timeElapsed + 1 }))),
          ),
        ),
      ),
    );

    return {
      initGame(size: number = 16) {
        patchState(store, {
          ...INITIAL_STATE,
          gridSize: size,
          cards: generateDeck(size),
          status: GameStatus.PLAYING,
        });
        startTimer();
      },

      restartGame() {
        this.initGame(store.gridSize());
      },

      flipCard(cardId: string) {
        const state = store;

        // Guardie
        if (state.isLockBoard() || state.status() !== GameStatus.PLAYING) return;

        const cardIndex = state.cards().findIndex((c) => c.id === cardId);
        const card = state.cards()[cardIndex];

        // Ignora se già visibile o matchata
        if (card.state !== CardState.HIDDEN) return;

        // 1. Gira la carta
        const updatedCards = [...state.cards()];
        updatedCards[cardIndex] = { ...card, state: CardState.VISIBLE };

        const newFlippedIds = [...state.flippedIds(), cardId];

        patchState(store, {
          cards: updatedCards,
          flippedIds: newFlippedIds,
        });

        // 2. Controllo logica se 2 carte girate
        if (newFlippedIds.length === 2) {
          patchState(store, { isLockBoard: true, moves: state.moves() + 1 });
          this._checkMatch(newFlippedIds);
        }
      },

      _checkMatch: rxMethod<string[]>(
        pipe(
          // Ritardo per mostrare le carte all'utente
          switchMap((ids) => timer(800).pipe(map(() => ids))),
          tap((ids) => {
            const cards = store.cards();
            const card1 = cards.find((c) => c.id === ids[0])!;
            const card2 = cards.find((c) => c.id === ids[1])!;

            const isMatch = card1.value === card2.value;
            const currentScore = store.score();

            if (isMatch) {
              // MATCH
              const points = calculateScore(true);

              const newCards = cards.map((c) =>
                ids.includes(c.id) ? { ...c, state: CardState.MATCHED } : c,
              );

              patchState(store, {
                cards: newCards,
                matchesFound: store.matchesFound() + 1,
                score: Math.max(0, currentScore + points),
                streakCount: store.streakCount() + 1,
                lastMatchTime: Date.now(),
                flippedIds: [],
                isLockBoard: false,
              });

              // Check Vittoria
              if (store.matchesFound() === store.gridSize() / 2) {
                patchState(store, { status: GameStatus.VICTORY });
              }
            } else {
              // NO MATCH
              const points = calculateScore(false);

              const newCards = cards.map((c) =>
                ids.includes(c.id) ? { ...c, state: CardState.HIDDEN } : c,
              );

              patchState(store, {
                cards: newCards,
                score: Math.max(0, currentScore + points),
                streakCount: 0,
                flippedIds: [],
                isLockBoard: false,
              });
            }
          }),
        ),
      ),
    };
  }),
);
